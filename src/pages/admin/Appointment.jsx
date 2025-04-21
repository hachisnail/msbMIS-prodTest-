import React, { useState, useEffect } from 'react'
import axios from 'axios'
import AdminNav from '../../components/navbar/AdminNav'
import CustomDatePicker from '../../components/function/CustomDatePicker'
import { connectWebSocket, closeWebSocket } from '../../utils/websocket'
import { AppointmentModal, AttendanceModal } from '../../components/modals/AppointmentModal'

const Appointment = () => {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointments, setAppointments] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalData, setModalData] = useState(null)
  const [approveVisit] = useState('yes')
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Statuses')
  const [columnFilter, setColumnFilter] = useState('')
  const [filteredData, setFilteredData] = useState({
    appointments: [],
    attendanceData: [],
    visitorRecords: []
  })

  // Stats from backend
  const [stats, setStats] = useState({
    approved: 0,
    rejected: 0,
    expectedVisitors: 0,
    present: 0
  })

  // Track the currently active tab
  const [activeTab, setActiveTab] = useState('forms')

  // Track which visitor record row is expanded
  const [expandedRecordId, setExpandedRecordId] = useState(null)

  // State for visitor records and attendance data
  const [visitorRecords, setVisitorRecords] = useState([])
  const [attendanceData, setAttendanceData] = useState([])

  // State for attendance popup
  const [showAttendancePopup, setShowAttendancePopup] = useState(false)
  const [attendancePopupData, setAttendancePopupData] = useState(null)
  const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 })

  // Toast message
  const [showToast, setShowToast] = useState(false)
  const [toastMessage, setToastMessage] = useState('')

  const token = localStorage.getItem('token')

  /**
   * Standardize status naming - convert any status to the consistent format
   * e.g., "TO_REVIEW" or "to_review" -> "To Review"
   */
  const standardizeStatus = (status) => {
    if (!status) return "To Review"

    // Convert to lowercase and remove underscores
    const formatted = status.toLowerCase().replace(/_/g, ' ')

    // Capitalize first letter of each word
    return formatted
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  /**
   * Get styled status label with unique colors for each status
   */
  const getStatusLabel = (status) => {
    const standardStatus = standardizeStatus(status)
    let bgColor = 'bg-gray-200'
    let textColor = 'text-gray-800'

    switch (standardStatus.toLowerCase()) {
      case 'confirmed':
        bgColor = 'bg-green-500'
        textColor = 'text-white'
        break
      case 'rejected':
        bgColor = 'bg-red-600'
        textColor = 'text-white'
        break
      case 'failed':
        bgColor = 'bg-orange-600'
        textColor = 'text-white'
        break
      case 'to review':
        bgColor = 'bg-purple-200'
        textColor = 'text-black'
        break
      case 'completed':
        bgColor = 'bg-blue-600'
        textColor = 'text-white'
        break
    }

    return (
      <span className={`${bgColor} ${textColor} px-2 py-1 rounded`}>
        {standardStatus}
      </span>
    )
  }

  /**
   * Toggle visitor record row expansion
   */
  const toggleRecordExpansion = (id) => {
    if (expandedRecordId === id) {
      setExpandedRecordId(null) // collapse if already expanded
    } else {
      setExpandedRecordId(id) // expand this row
    }
  }

  /**
   * Fetch visitor records from the backend
   */
  const fetchVisitorRecords = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/auth/visitor-records',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setVisitorRecords(response.data)
    } catch (error) {
      console.error('Error fetching visitor records:', error)
    }
  }

  /**
   * Fetch appointments from the backend
   */
  const fetchAppointments = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/auth/appointment',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setAppointments(response.data)
    } catch (error) {
      console.error('Error fetching appointments:', error)
    }
  }

  /**
   * Fetch attendance data
   */
  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/auth/attendance',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setAttendanceData(response.data)
    } catch (error) {
      console.error('Error fetching attendance data:', error)
    }
  }

  /**
   * Fetch stats from the backend (approved, rejected, expectedVisitors, present)
   */
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/auth/appointment/stats',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      setStats(response.data)
    } catch (error) {
      console.error('Error fetching stats:', error)
    }
  }

  /**
   * Update appointment status in the backend
   */
  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/auth/appointment/${appointmentId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(`Appointment ${appointmentId} updated to: ${newStatus}`)
      fetchAppointments()
      fetchStats()
    } catch (error) {
      console.error('Error updating appointment status:', error)
    }
  }

  /**
   * Update present count for an appointment
   */
  const updatePresentCount = async (appointmentId, presentCount) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/auth/appointment/${appointmentId}/status`,
        { present_count: presentCount },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      console.log(`Present count for appointment ${appointmentId} updated to: ${presentCount}`)
      // Refresh data
      fetchAttendanceData()
      fetchStats()

      // Show success toast
      setToastMessage(`Present count updated successfully!`)
      setShowToast(true)

      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false)
      }, 3000)

    } catch (error) {
      console.error('Error updating present count:', error)

      // Show error toast
      setToastMessage('Error updating present count')
      setShowToast(true)

      // Auto-hide toast after 3 seconds
      setTimeout(() => {
        setShowToast(false)
      }, 3000)
    }
  }

  /**
   * useEffect: Initial data + websocket
   */
  useEffect(() => {
    fetchAppointments()
    fetchStats()
    fetchAttendanceData()
    fetchVisitorRecords()

    const handleDataChange = () => {
      console.log('WebSocket: Data changed, refreshing...')
      fetchAppointments()
      fetchStats()
      fetchAttendanceData()
      fetchVisitorRecords()
    }

    const handleRefresh = () => {
      console.log('WebSocket: Refresh command received, refreshing...')
      fetchAppointments()
      fetchStats()
      fetchAttendanceData()
      fetchVisitorRecords()
    }

    connectWebSocket(handleDataChange, handleRefresh)
    return () => {
      closeWebSocket()
    }
  }, [])

  /**
   * useEffect: Fetch data based on active tab
   */
  useEffect(() => {
    if (activeTab === 'forms') {
      fetchAppointments()
      fetchStats()
    } else if (activeTab === 'attendance') {
      fetchAttendanceData()
      fetchStats()
    } else if (activeTab === 'visitorRecords') {
      fetchVisitorRecords()
    }
  }, [activeTab])

  /**
   * useEffect: Apply filters when filter conditions or data change
   */
  useEffect(() => {
    if (activeTab === 'forms') {
      let filtered = [...appointments];

      if (searchQuery) {
        filtered = filtered.filter(appt =>
          (appt.Visitor?.first_name + ' ' + appt.Visitor?.last_name).toLowerCase().includes(searchQuery.toLowerCase()) ||
          appt.purpose_of_visit?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (statusFilter !== 'All Statuses') {
        filtered = filtered.filter(appt => {
          const currentStatus = standardizeStatus(appt.AppointmentStatus?.status || 'To Review');
          return currentStatus.toLowerCase() === statusFilter.toLowerCase();
        });
      }

      if (columnFilter) {
        switch (columnFilter) {
          case 'creation_date':
            filtered = filtered.sort((a, b) => new Date(a.creation_date) - new Date(b.creation_date));
            break;
          case 'visitor_name':
            filtered = filtered.sort((a, b) =>
              `${a.Visitor?.last_name} ${a.Visitor?.first_name}`.localeCompare(`${b.Visitor?.last_name} ${b.Visitor?.first_name}`)
            );
            break;
          case 'visitor_count':
            filtered = filtered.sort((a, b) => (a.population_count || 0) - (b.population_count || 0));
            break;
        }
      }

      setFilteredData(prev => ({ ...prev, appointments: filtered }));
    } else if (activeTab === 'attendance') {
      let filtered = [...attendanceData];

      if (searchQuery) {
        filtered = filtered.filter(att =>
          att.visitorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          att.purpose.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (columnFilter) {
        switch (columnFilter) {
          case 'date':
            filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
          case 'visitor_name':
            filtered = filtered.sort((a, b) => a.visitorName.localeCompare(b.visitorName));
            break;
        }
      }

      setFilteredData(prev => ({ ...prev, attendanceData: filtered }));
    } else if (activeTab === 'visitorRecords') {
      let filtered = [...visitorRecords];

      if (searchQuery) {
        filtered = filtered.filter(record =>
          record.visitorName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      if (columnFilter) {
        switch (columnFilter) {
          case 'date':
            filtered = filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
            break;
          case 'visit_counts':
            filtered = filtered.sort((a, b) => (a.visitCount || 0) - (b.visitCount || 0));
            break;
        }
      }

      setFilteredData(prev => ({ ...prev, visitorRecords: filtered }));
    }
  }, [searchQuery, statusFilter, columnFilter, activeTab, appointments, attendanceData, visitorRecords]);

  /**
   * Show the modal when a row is clicked
   */
  const handleRowClick = (appt) => {
    if (!appt || !appt.Visitor) return

    setModalData({
      appointmentId: appt.appointment_id,
      dateSent: appt.creation_date
        ? new Date(appt.creation_date).toLocaleString()
        : 'N/A',

      fromFirstName: appt.Visitor.first_name || 'N/A',
      fromLastName: appt.Visitor.last_name || 'N/A',
      email: appt.Visitor.email || 'N/A',
      phone: appt.Visitor.phone || 'N/A',

      purpose: appt.purpose_of_visit || 'N/A',
      populationCount: appt.population_count || 0,
      preferredDate: appt.preferred_date || 'N/A',
      preferredTime: appt.preferred_time || 'N/A',
      notes: appt.additional_notes || 'N/A',
      organization: appt.Visitor.organization || 'N/A',
      street: appt.Visitor.street || '',
      barangay: appt.Visitor.barangay || '',
      city_municipality: appt.Visitor.city_municipality || '',
      province: appt.Visitor.province || '',

      status: standardizeStatus(appt.AppointmentStatus?.status || 'To Review'),
      updatedAt: appt.AppointmentStatus?.updated_at
        ? new Date(appt.AppointmentStatus.updated_at).toLocaleString()
        : 'N/A'
    })
    setShowModal(true)
  }

  /**
   * Show attendance popup when attendance row is clicked
   */
  const handleAttendanceRowClick = (row, e) => {
    // Get click position
    const x = e.clientX;
    const y = e.clientY;

    // Calculate popup position based on where the click happened
    // to ensure it stays visible on screen
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    const popupHeight = 380; // Approximate popup height
    const popupWidth = 400; // Approximate popup width

    // Adjust y position if popup would go off the bottom of screen
    let adjustedY = y;
    if (y + popupHeight / 2 > viewportHeight) {
      adjustedY = viewportHeight - popupHeight / 2 - 20;
    }
    if (y - popupHeight / 2 < 0) {
      adjustedY = popupHeight / 2 + 20;
    }

    // Adjust x position if popup would go off sides of screen
    let adjustedX = x;
    if (x + popupWidth / 2 > viewportWidth) {
      adjustedX = viewportWidth - popupWidth / 2 - 20;
    }
    if (x - popupWidth / 2 < 0) {
      adjustedX = popupWidth / 2 + 20;
    }

    setPopupPosition({ x: adjustedX, y: adjustedY });

    setAttendancePopupData({
      appointment_id: row.appointment_id,
      visitorName: row.visitorName,
      purpose: row.purpose,
      expectedVisitor: row.expectedVisitor,
      present: row.present === 'ongoing' ? '' : row.present
    })
    setShowAttendancePopup(true)
  }

  /**
   * Confirm attendance update
   */
  const handleConfirmAttendance = () => {
    if (!attendancePopupData?.appointment_id) return

    const presentCount = parseInt(attendancePopupData.present, 10) || 0
    updatePresentCount(attendancePopupData.appointment_id, presentCount)
    setShowAttendancePopup(false)
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setModalData(null)
  }

  const handleSend = () => {
    alert('Message sent to ' + (modalData?.email || 'visitor'))
    setShowModal(false)
  }

  /**
   * Format date for display (MM-DD-YYYY)
   */
  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    const date = new Date(dateStr);
    return `${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}-${date.getFullYear()}`;
  }

  /**
   * Button helper for styling
   */
  const tabButtonStyle = (tabName) => {
    return tabName === activeTab
      ? 'bg-black text-white border-black'
      : 'border-gray-500 text-black'
  }

  return (
    <>
      <div className="w-screen h-screen bg-[#F0F0F0] select-none flex pt-[7rem] overflow-hidden">
        {/* Left Nav */}
        <div className="bg-[#1C1B19] w-auto h-full min-w-[6rem] sm:min-w-auto">
          <AdminNav />
        </div>

        {/* Main content */}
        <div className="w-full h-full flex flex-col gap-y-10 px-7 pb-7 pt-[4rem] overflow-hidden">
          <span className="text-5xl font-semibold">Appointments</span>

          <div className="w-full h-[calc(100%-9rem)] flex flex-col xl:flex-row gap-y-5 xl:gap-y-0 xl:gap-x-5">
            {/* Left panel: Stats + Buttons */}
            <div className="min-w-[34rem] h-full flex flex-col gap-y-7">
              {/* Tab Buttons */}
              <div className="w-full max-w-[35rem] text-gray-500 min-h-[5rem] flex py-2 gap-x-2">
                <button
                  onClick={() => setActiveTab('forms')}
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${tabButtonStyle('forms')}`}
                >
                  <span className="text-2xl font-semibold">Forms</span>
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${tabButtonStyle('attendance')}`}
                >
                  <span className="text-2xl font-semibold">Attendance</span>
                </button>
                <button
                  onClick={() => setActiveTab('visitorRecords')}
                  className={`px-4 h-full border-1 rounded-lg cursor-pointer ${tabButtonStyle('visitorRecords')}`}
                >
                  <span className="text-2xl font-semibold">Visitor Records</span>
                </button>
              </div>

              {/* Stats */}
              <div className="w-full h-full flex flex-col gap-y-[5rem] overflow-y-auto">
                {/* Total appointments */}
                <div className="bg-[#161616] px-4 h-[5rem] flex justify-between items-center rounded-sm">
                  <span className="text-2xl text-white font-semibold">Total Appointments</span>
                  <div className="w-[6rem] h-[3rem] bg-[#D4DBFF] flex items-center justify-center rounded-md">
                    <span className="text-2xl text-black font-semibold">
                      {appointments.length}
                    </span>
                  </div>
                </div>

                {/* More stats */}
                <div className="w-full h-auto flex flex-col gap-y-7">
                  <span className="text-2xl font-semibold text-[#727272]">
                    January 8, 2025
                  </span>
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Approved</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.approved}</span>
                    </div>
                  </div>
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Rejected</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.rejected}</span>
                    </div>
                  </div>
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Expected Visitors</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.expectedVisitors}</span>
                    </div>
                  </div>
                  <div className="w-full h-fit flex justify-between items-center">
                    <span className="text-2xl font-semibold">Present</span>
                    <div className="w-[5rem] h-[2rem] flex items-center bg-[#D4DBFF] rounded-md justify-center">
                      <span className="text-2xl font-semibold">{stats.present}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: Tables */}
            <div className="w-full h-full flex flex-col gap-y-7 overflow-x-auto overflow-y-hidden">
              {/* Common controls above table */}
              <div className="min-w-[94rem] min-h-[5rem] py-2 flex items-center gap-x-2">
                <div className="flex-shrink-0">
                  <CustomDatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    popperPlacement="bottom-start"
                    popperClassName="z-50"
                    customInput={
                      <button className="px-3 h-16 rounded-lg border-1 border-gray-500 cursor-pointer">
                        <i className="text-gray-500 fa-regular fa-calendar text-4xl"></i>
                      </button>
                    }
                  />
                </div>
                <div className="relative h-full min-w-[20rem]">
                  <i className="text-2xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"></i>
                  <input
                    type="text"
                    placeholder="Search History"
                    className="h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="relative h-full min-w-48">
                  <select
                    className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setColumnFilter(e.target.value)}
                  >
                    <option value="">Sort By...</option>
                    <option value="creation_date">Creation Date</option>
                    <option value="visitor_name">Visitor Name</option>
                    <option value="visitor_count">Visitor Count</option>
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>
                <div className="relative h-full min-w-48">
                  <select
                    className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All Statuses</option>
                    <option>Confirmed</option>
                    <option>Rejected</option>
                    <option>Failed</option>
                    <option>To Review</option>
                    <option>Completed</option>
                  </select>
                  <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
                </div>
              </div>

              {/* FORMS (Appointments) TABLE */}
              {activeTab === 'forms' && (
                <div className="flex flex-col min-w-[94rem] h-[calc(100%-7rem)]">
                  {/* Table Header - Fixed */}
                  <div className="bg-[#F0F0F0] min-w-[94rem] w-full font-semibold grid grid-cols-6 justify-between mb-7">
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Creation Date
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Visitor Name
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Preferred Time
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Status
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Visitor Count
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Last Updated
                    </div>
                  </div>

                  {/* Table Data - Scrollable */}
                  <div className="w-full min-w-[94rem] overflow-y-auto h-full border-t-1 border-t-gray-400">
                    {(filteredData.appointments.length > 0 ? filteredData.appointments : appointments).map((appt) => {
                      const status = standardizeStatus(appt.AppointmentStatus?.status || 'To Review')
                      const updatedAt = appt.AppointmentStatus?.updated_at
                        ? new Date(appt.AppointmentStatus.updated_at).toLocaleString()
                        : 'N/A'

                      return (
                        <div
                          key={appt.appointment_id}
                          className="min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-6 cursor-pointer hover:bg-gray-300"
                          onClick={() => handleRowClick(appt)}
                        >
                          <div className="px-4 py-3 border-b-1 border-gray-400">
                            {appt.creation_date
                              ? new Date(appt.creation_date).toLocaleString()
                              : 'N/A'}
                          </div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">
                            {appt.Visitor?.first_name} {appt.Visitor?.last_name}
                          </div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">
                            {appt.preferred_time}
                          </div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">
                            {getStatusLabel(status)}
                          </div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">
                            {appt.population_count}
                          </div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">
                            {updatedAt}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* ATTENDANCE TABLE */}
              {activeTab === 'attendance' && (
                <div className="flex flex-col min-w-[94rem] h-[calc(100%-7rem)]">
                  {/* Table Header - Fixed */}
                  <div className="bg-[#F0F0F0] min-w-[94rem] w-full font-semibold grid grid-cols-6 justify-between mb-7">
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Date
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Visitor Name
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Purpose of Visit
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Preferred Date
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Expected Visitor
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Present
                    </div>
                  </div>

                  {/* Table Data - Scrollable */}
                  <div className="w-full min-w-[94rem] overflow-y-auto h-full border-t-1 border-t-gray-400">
                    {(filteredData.attendanceData.length > 0 ? filteredData.attendanceData : attendanceData).map((row, i) => {
                      const presentValue = row.present ?? 'ongoing'
                      return (
                        <div
                          key={i}
                          className="min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-6 hover:bg-gray-300 cursor-pointer"
                          onClick={(e) => handleAttendanceRowClick(row, e)}
                        >
                          <div className="px-4 py-3 border-b-1 border-gray-400">{row.date}</div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">{row.visitorName}</div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">{row.purpose}</div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">{row.preferredDate}</div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">{row.expectedVisitor}</div>
                          <div className="px-4 py-3 border-b-1 border-gray-400">{presentValue}</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* VISITOR RECORDS TABLE */}
              {activeTab === 'visitorRecords' && (
                <div className="flex flex-col min-w-[94rem] h-[calc(100%-7rem)]">
                  {/* Table Header - Fixed */}
                  <div className="bg-[#F0F0F0] min-w-[94rem] w-full font-semibold grid grid-cols-3 justify-between mb-7">
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      Date
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2 w-[480px]">
                      Visitors
                    </div>
                    <div className="text-[#727272] text-2xl border-l-1 px-3 py-2">
                      visit counts
                    </div>
                  </div>

                  {/* Table Data - Scrollable */}
                  <div className="w-full min-w-[94rem] overflow-y-auto h-full border-t-1 border-t-gray-400">
                    {(filteredData.visitorRecords.length > 0 ? filteredData.visitorRecords : visitorRecords).map((record) => (
                      <React.Fragment key={record.id}>
                        {/* Main Row */}
                        <div
                          className="min-w-[94rem] text-xl h-fit font-semibold grid grid-cols-3 cursor-pointer hover:bg-gray-300 border-b-1 border-gray-200"
                          onClick={() => toggleRecordExpansion(record.id)}
                        >
                          <div className="px-4 py-4">{formatDate(record.date)}</div>
                          <div className="px-4 py-4">{record.visitorName}</div>
                          <div className="px-4 py-4 flex justify-between items-center">
                            <span>{record.visitCount}</span>
                            <i className={`fas fa-chevron-${expandedRecordId === record.id ? 'up' : 'down'} mr-4 text-gray-500`}></i>
                          </div>
                        </div>

                        {/* Expanded Row with Details */}
                        {expandedRecordId === record.id && (
                          <div className="min-w-[94rem] flex justify-end">
                            <div className="w-[45%] my-4 mr-4 rounded-lg overflow-hidden shadow-sm">
                              <table className="w-full border-collapse bg-white">
                                <thead>
                                  <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Purpose of visit</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Visitor Count</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Present</th>
                                    <th className="text-center py-3 px-4 font-semibold text-gray-700">Date</th>
                                    <th className="w-10 py-3 px-2 text-right">
                                    </th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {record.details.map((detail, idx) => (
                                    <tr key={idx} className={idx !== record.details.length - 1 ? "border-b border-gray-200" : ""}>
                                      <td className="py-3 px-4 text-gray-800">{detail.purpose}</td>
                                      <td className="py-3 px-4 text-center text-gray-800">{detail.visitorCount}</td>
                                      <td className="py-3 px-4 text-center text-gray-800">{detail.present}</td>
                                      <td className="py-3 px-4 text-center text-gray-800">{formatDate(detail.date)}</td>
                                      <td className="py-3 px-4"></td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        )}

                      </React.Fragment>
                    ))}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AppointmentModal
        showModal={showModal}
        modalData={modalData}
        onClose={handleCloseModal}
        onSend={handleSend}
        updateAppointmentStatus={updateAppointmentStatus}
      />

      <AttendanceModal
        show={showAttendancePopup}
        popupPosition={popupPosition}
        attendanceData={attendancePopupData}
        onClose={() => setShowAttendancePopup(false)}
        onConfirm={(presentCount) => {
          if (attendancePopupData?.appointment_id) {
            updatePresentCount(attendancePopupData.appointment_id, parseInt(presentCount, 10) || 0);
            setShowAttendancePopup(false);
          }
        }}
      />

      {/* Toast Message */}
      {showToast && (
        <div className="fixed top-5 right-5 bg-black text-white py-2 px-4 rounded shadow-md z-50">
          {toastMessage}
        </div>
      )}
    </>
  )
}

export default Appointment
