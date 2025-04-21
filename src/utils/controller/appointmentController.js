// controllers/appointmentController.js

import Visitor from '../models/Visitors.js';
import Appointment from '../models/Appointment.js';
import { Op } from 'sequelize';

import AppointmentStatus from '../models/AppointmentStatus.js';

/**
 * Create a new appointment, reusing or creating the visitor.
 */
export const createAppointment = async (req, res, next) => {
  try {
    const {
      first_name,
      last_name,
      email,
      phone,
      organization,
      province,
      barangay,
      city_municipality,
      street,
      purpose_of_visit,
      population_count,
      preferred_date,
      preferred_time,
      additional_notes
    } = req.body;

    // Basic checks
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'Missing required visitor fields.' });
    }
    if (!purpose_of_visit || !population_count || !preferred_date) {
      return res.status(400).json({ message: 'Missing required appointment info.' });
    }

    // Enforce time only for certain purposes
    const timesRequired = ['School Field Trip', 'Workshops or Classes'];
    if (timesRequired.includes(purpose_of_visit) && !preferred_time) {
      return res.status(400).json({
        message: `Missing preferred_time for purpose: ${purpose_of_visit}`
      });
    }

    // Reuse or create the Visitor record
    let visitor = await Visitor.findOne({
      where: { first_name, last_name, email }
    });
    if (visitor) {
      await visitor.update({
        phone: phone || visitor.phone,
        organization: organization || visitor.organization,
        province: province || visitor.province,
        barangay: barangay || visitor.barangay,
        city_municipality: city_municipality || visitor.city_municipality,
        street: street || visitor.street
      });
    } else {
      visitor = await Visitor.create({
        first_name,
        last_name,
        email,
        phone,
        organization,
        province,
        barangay,
        city_municipality,
        street
      });
    }

    // Insert new appointment
    const appointment = await Appointment.create({
      visitor_id: visitor.visitor_id,
      purpose_of_visit,
      population_count,
      preferred_date,
      preferred_time: preferred_time || 'Flexible',
      additional_notes
    });

    // (Optional) Insert an initial status row here if you want:
    // await AppointmentStatus.create({
    //   appointment_id: appointment.appointment_id,
    //   status: 'TO_REVIEW'
    // });

    req.logDetails = {
      new: appointment.dataValues,
      message: `a visitor has successfully created an appoinment.`,
    };
    res.locals.newRecordId = appointment.appointment_id;

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment_id: appointment.appointment_id
    });

    return next();

  } catch (error) {
    console.error('Error creating appointment:', error);
    return res.status(500).json({
      message: 'Server error creating appointment.',
      error: error.message
    });
  }
};

/**
 * Fetch all appointments, eagerly loading Visitor data.
 */
export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      include: [Visitor,AppointmentStatus]
    });
    return res.json(appointments);
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return res.status(500).json({ message: 'Server error retrieving appointments.' });
  }
};

/**
 * Update an appointment's status in the appointment_status table.
 * Expects body: { status: "CONFIRMED" }
 */
export const updateAppointmentStatus = async (req, res) => {
  try {
    const { id } = req.params
    const { status, present_count } = req.body

    // Confirm the appointment exists
    const appointment = await Appointment.findByPk(id)
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' })
    }

    // Find or create the linked status record
    let appointmentStatus = await AppointmentStatus.findOne({
      where: { appointment_id: id },
    })
    if (!appointmentStatus) {
      appointmentStatus = await AppointmentStatus.create({
        appointment_id: id,
        status: status || 'TO_REVieW',
        present_count,
      })
    } else {
      if (status !== undefined) {
        appointmentStatus.status = status
      }
      if (present_count !== undefined) {
        appointmentStatus.present_count = present_count
      }
      appointmentStatus.updated_at = new Date() // Update timestamp when status changes
      await appointmentStatus.save()
    }

    return res.status(200).json({
      message: 'Appointment status updated successfully',
      data: appointmentStatus,
    })
  } catch (error) {
    console.error('Error updating appointment status:', error)
    return res.status(500).json({
      message: 'Server error updating appointment status.',
      error: error.message,
    })
  }
}

export const getAppointmentStats = async (req, res) => {
  try {
    // Count how many appointments are "confirmed", "rejected", or "completed"
    const approvedCount = await AppointmentStatus.count({
      where: { status: 'CONFIRMED' }
    });
    const rejectedCount = await AppointmentStatus.count({
      where: { status: 'REJECTED' }
    });
    const completedCount = await AppointmentStatus.count({
      where: { status: 'COMPLETED' }
    });

    // Sum population counts from Appointment
    const expectedVisitors = await Appointment.sum('population_count');

    // Sum present_count from AppointmentStatus
    // This correctly uses the present_count field from your model
    const presentCount = await AppointmentStatus.sum('present_count', {
      where: {
        present_count: {
          [Op.not]: null  // Only include non-null values
        }
      }
    });

    return res.json({
      approved: approvedCount || 0,
      rejected: rejectedCount || 0,
      completed: completedCount || 0,
      expectedVisitors: expectedVisitors || 0,
      present: presentCount || 0  // This will now be the sum of all present_count values
    });
  } catch (error) {
    console.error('Error retrieving appointment stats:', error);
    return res.status(500).json({
      message: 'Server error retrieving appointment stats.',
      error: error.message
    });
  }
};


export const getAttendanceData = async (req, res) => {
  try {
    const data = await Appointment.findAll({
      attributes: [
        'appointment_id',
        'purpose_of_visit',
        'preferred_date',
        'population_count',
        'creation_date'
      ],
      include: [
        {
          model: Visitor,
          attributes: ['first_name', 'last_name']
        },
        {
          model: AppointmentStatus,
          attributes: ['status', 'present_count', 'updated_at']
        }
      ]
    })

    // Transform for your front-end: rename fields, etc.
    const transformedData = data.map((appt) => ({
      appointment_id: appt.appointment_id,
      date: appt.creation_date ? new Date(appt.creation_date).toLocaleString() : 'N/A',
      visitorName: `${appt.Visitor?.first_name || 'N/A'} ${appt.Visitor?.last_name || ''}`,
      purpose: appt.purpose_of_visit,
      preferredDate: appt.preferred_date || 'N/A',
      expectedVisitor: appt.population_count,
      // If present_count is null, it's "ongoing" on the front-end
      present: appt.AppointmentStatus?.present_count ?? 'ongoing',
      status: appt.AppointmentStatus?.status || 'TO_REVIEW'
    }))

    return res.json(transformedData)
  } catch (error) {
    console.error('Error fetching attendance data:', error)
    return res.status(500).json({
      message: 'Server error retrieving attendance data.',
      error: error.message
    })
  }
}

export const getVisitorRecords = async (req, res) => {
  try {
    // Load all visitors with their associated appointments and statuses
    const visitors = await Visitor.findAll({
      include: [
        {
          model: Appointment,
          include: [AppointmentStatus],
        },
      ],
      order: [['visitor_id', 'ASC']], // or any sorting you prefer
    });

    // Transform data for the frontend
    const records = visitors.map((visitor) => {
      // Gather all appointments
      const details = visitor.Appointments.map((appt) => ({
        purpose: appt.purpose_of_visit,
        visitorCount: appt.population_count,
        present: appt.AppointmentStatus?.present_count || 0,
        date: appt.preferred_date,         // e.g. '2024-02-19'
        status: appt.AppointmentStatus?.status || 'TO_REVIEW'
      }));

      return {
        id: visitor.visitor_id,
        date: details.length > 0 ? details[0].date : null, // or get the first appointment date
        visitorName: `${visitor.first_name} ${visitor.last_name}`,
        visitCount: details.length,
        details,
      };
    });

    return res.json(records);
  } catch (error) {
    console.error('Error fetching visitor records:', error);
    return res.status(500).json({
      message: 'Server error retrieving visitor records.',
      error: error.message,
    });
  }
};
