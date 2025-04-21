import React, { useState, useEffect } from 'react';

export const AppointmentModal = ({
  showModal,
  modalData,
  onClose,
  onSend,
  updateAppointmentStatus
}) => {
  // local state to track user's radio selection
  const [approveVisit, setApproveVisit] = useState('');
  // Track the message content
  const [message, setMessage] = useState("");
  // Track if message is empty
  const [messageError, setMessageError] = useState(false);

  // Reset approval state and error state when modal data changes
  useEffect(() => {
    if (modalData && modalData.status) {
      if (modalData.status === 'CONFIRMED' || modalData.status === 'Confirmed') {
        setApproveVisit('yes');
      } else if (modalData.status === 'REJECTED' || modalData.status === 'Rejected') {
        setApproveVisit('no');
      } else {
        setApproveVisit('');
      }
    } else {
      setApproveVisit('');
    }
    setMessageError(false);
    setMessage("");
  }, [modalData]);

  if (!showModal || !modalData) return null;

  // Determine the current phase of the appointment process
  const isToReview = modalData.status === 'TO_REVIEW' || modalData.status === 'To Review';
  const isConfirmedOrRejected =
    modalData.status === 'CONFIRMED' || modalData.status === 'Confirmed' ||
    modalData.status === 'REJECTED' || modalData.status === 'Rejected';
  const isCompletedOrFailed =
    modalData.status === 'COMPLETED' || modalData.status === 'Completed' ||
    modalData.status === 'FAILED' || modalData.status === 'Failed';

  const handleSend = async () => {
    // Validate that message is not empty for the first phase only
    if (isToReview && !message.trim()) {
      setMessageError(true);
      return;
    }

    let newStatus = 'TO_REVIEW';
    if (approveVisit === 'yes') {
      newStatus = 'CONFIRMED';
    } else if (approveVisit === 'no') {
      newStatus = 'REJECTED';
    } else if (approveVisit === 'cancel') {
      newStatus = 'FAILED';
    } else if (approveVisit === 'arrive') {
      newStatus = 'COMPLETED';
    }

    try {
      await updateAppointmentStatus(modalData.appointmentId, newStatus);
      onSend && onSend();
    } catch (err) {
      console.error('Error while updating status:', err);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-md shadow-lg p-8 w-[700px] max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header with visitor name and date */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {modalData.fromFirstName} {modalData.fromLastName}
          </h2>
          <div className="text-right">
            {modalData.dateSent || "02-19-2024"}
          </div>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Two column layout for details */}
        <div className="grid grid-cols-2 gap-10">
          {/* Left column */}
          <div>
            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Email</div>
              <div className="text-blue-500 text-lg">{modalData.email}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Phone Number</div>
              <div className="text-blue-500 text-lg">{modalData.phone}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Address</div>
              <div className="text-blue-500 text-lg">{modalData.street}, {modalData.barangay}, {modalData.city_municipality}, {modalData.province}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Organization</div>
              <div className="text-blue-500 text-lg">{modalData.organization}</div>
            </div>
          </div>

          {/* Right column */}
          <div>
            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Purpose of Visit</div>
              <div className="text-blue-500 text-lg">{modalData.purpose}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Population Count</div>
              <div className="text-blue-500 text-lg">{modalData.populationCount}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Preferred Date</div>
              <div className="text-blue-500 text-lg">{modalData.preferredDate}</div>
            </div>

            <div className="mb-6">
              <div className="text-gray-600 text-sm mb-1">Preferred Time</div>
              <div className="text-blue-500 text-lg">{modalData.preferredTime}</div>
            </div>
          </div>
        </div>

        {/* Notes section */}
        <div className="mb-6">
          <div className="text-gray-600 text-sm mb-1">Notes</div>
          <div className="text-blue-500 text-lg">{modalData.notes}</div>
        </div>

        <hr className="border-gray-300 my-6" />

        {/* Response section - conditionally rendered based on appointment phase */}
        <div>
          <h3 className="text-xl font-bold mb-6">Respond</h3>

          {/* FIRST PHASE: TO_REVIEW - Show Yes/No approval options */}
          {isToReview && (
            <>
              <div className="mb-6">
                <div className="text-base mb-3">Approve Visit?</div>
                <div className="flex gap-4">
                  <button
                    className={`px-8 py-3 rounded-md text-lg ${approveVisit === 'yes' ?
                      'bg-[#6F3FFF] text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => setApproveVisit('yes')}
                  >
                    Yes
                  </button>
                  <button
                    className={`px-8 py-3 rounded-md text-lg ${approveVisit === 'no' ?
                      'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                    onClick={() => setApproveVisit('no')}
                  >
                    No
                  </button>
                </div>
              </div>

              {/* Message area - mandatory for first phase */}
              <div className="mb-6">
                <div className="text-base mb-3">Leave a message</div>
                <textarea
                  className={`w-full p-4 border ${messageError ? 'border-red-500' : 'border-gray-300'} 
                    rounded-md h-[120px] overflow-y-auto resize-none text-base`}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (e.target.value.trim()) {
                      setMessageError(false);
                    }
                  }}
                  placeholder="Enter message here (required)"
                />
                {messageError && (
                  <p className="text-sm text-red-500 mt-1">
                    Please enter a message for the visitor.
                  </p>
                )}
                <div className="text-sm text-gray-500 mt-2">
                  This will automatically send to {modalData.email}
                </div>
              </div>
            </>
          )}

          {/* SECOND PHASE: CONFIRMED or REJECTED - Show Cancel/Arrive options */}
          {isConfirmedOrRejected && (
            <div className="mb-6">
              <div className="text-base mb-3">Appointment Action</div>
              <div className="flex gap-4">
                <button
                  className={`px-8 py-3 rounded-md text-lg ${approveVisit === 'cancel' ?
                    'bg-red-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setApproveVisit('cancel')}
                >
                  Cancel
                </button>
                <button
                  className={`px-8 py-3 rounded-md text-lg ${approveVisit === 'arrive' ?
                    'bg-green-600 text-white' : 'bg-gray-200 text-gray-800'}`}
                  onClick={() => setApproveVisit('arrive')}
                >
                  Arrive
                </button>
              </div>
            </div>
          )}

          {/* THIRD PHASE: COMPLETED or FAILED - Just show view-only mode */}
          {isCompletedOrFailed && (
            <div className="mb-6 text-center text-xl">
              <div className="px-6 py-3 bg-gray-100 rounded-lg text-gray-700">
                This appointment is {modalData.status.toLowerCase()}. No further actions are available.
              </div>
            </div>
          )}

          {/* Done button - only shown when actions are possible */}
          {(isToReview || isConfirmedOrRejected) && (
            <div className="flex justify-end">
              <button
                className="bg-[#6F3FFF] text-white px-10 py-3 rounded-md hover:opacity-90 text-lg font-medium"
                onClick={handleSend}
              >
                Done
              </button>
            </div>
          )}

          {/* Close button - only shown in view-only mode */}
          {isCompletedOrFailed && (
            <div className="flex justify-end">
              <button
                className="bg-gray-500 text-white px-10 py-3 rounded-md hover:opacity-90 text-lg font-medium"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const AttendanceModal = ({
  show,
  popupPosition,
  attendanceData,
  onClose,
  onConfirm
}) => {
  // Use null as the initial state for "ongoing" attendance
  const [presentCount, setPresentCount] = useState(
    attendanceData?.present === null || attendanceData?.present === 'ongoing' ? '' : attendanceData?.present || ''
  );

  if (!show || !attendanceData) return null;

  const handleAllPresent = () => {
    setPresentCount(attendanceData.expectedVisitor);
  };

  const handleConfirm = () => {
    // If the input is empty, we'll pass null to match the database schema
    // where null represents "ongoing"
    const valueToSend = presentCount === '' ? null : parseInt(presentCount, 10);
    onConfirm(valueToSend);
  };

  return (
    <div className="fixed inset-0 z-50">
      {/* Semi-transparent background for closing popup */}
      <div
        className="fixed inset-0 bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Popup positioned near mouse click */}
      <div
        className="fixed bg-white rounded shadow-lg p-6 w-[25rem] border border-gray-300 z-[51]"
        style={{
          top: `${popupPosition.y}px`,
          left: `${popupPosition.x}px`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-2xl font-bold text-gray-600"
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4">Attendance Details</h2>
        <div className="mb-2 text-lg">
          <strong>Visitor:</strong> {attendanceData.visitorName}
        </div>
        <div className="mb-2 text-lg">
          <strong>Purpose:</strong> {attendanceData.purpose}
        </div>
        <div className="mb-2 text-lg">
          <strong>Expected:</strong> {attendanceData.expectedVisitor}
        </div>

        <label className="block mb-1 text-lg font-semibold">
          Present Count:
        </label>
        <input
          type="number"
          className="border p-2 w-full mb-4 text-xl"
          value={presentCount}
          onChange={(e) => setPresentCount(e.target.value)}
          placeholder="Leave empty for 'ongoing'"
        />

        {/* All Present button */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleAllPresent}
            className="bg-green-500 hover:bg-green-600 text-white rounded py-2 px-4 flex-1"
          >
            All Present
          </button>
        </div>

        <button
          onClick={handleConfirm}
          className="bg-blue-500 hover:bg-blue-600 text-white rounded py-2 px-4 w-full"
        >
          Confirm
        </button>
      </div>
    </div>
  );
};

// Default export for backward compatibility
export default {
  AppointmentModal,
  AttendanceModal
};
