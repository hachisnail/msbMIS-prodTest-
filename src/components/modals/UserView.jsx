import axios from 'axios'
import React, { useState, useEffect } from 'react'

const UserView = ({ userId, onClose }) => {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState('')
  const [loginLogs, setLoginLogs] = useState([])
  const token = localStorage.getItem('token')

  const colorMap = {
    A: '#FF6666', B: '#FF9933', C: '#FFD700', D: '#66CC66', E: '#0099CC',
    F: '#9933CC', G: '#FF3399', H: '#6666FF', I: '#00CC99', J: '#FF6600',
    K: '#3399FF', L: '#FF3366', M: '#33CC33', N: '#FFCC00', O: '#336699',
    P: '#990000', Q: '#FF6699', R: '#666600', S: '#669900', T: '#009999',
    U: '#6600CC', V: '#CC3300', W: '#99CC00', X: '#9966FF', Y: '#FF0000',
    Z: '#33CCCC',
  }

  const fetchLogs = () => {
    axios
      .get(`http://localhost:5000/api/auth/login-logs/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setLoginLogs(res.data.logs || [])
      })
      .catch((err) => {
        console.error('Error fetching login logs:', err.response?.data || err.message)
      })
  }

  const fetchUsers = () => {
    axios
      .get(`http://localhost:5000/api/auth/fetchUser/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fetchedUser = res.data
        setUser(fetchedUser)
        setRole(fetchedUser?.Credential?.role || 'staff')
      })
      .catch((err) => {
        console.error('Error fetching user:', err.response?.data || err.message)
      })
  }

  useEffect(() => {
    fetchLogs()
    fetchUsers()
  }, [userId])

  // console.log(loginLogs);
  const formatLogs = () => {
    if (!loginLogs.length) return []
  
    const sorted = [...loginLogs].sort(
      (a, b) => new Date(a.start) - new Date(b.start)
    )
  
    return sorted.map((log) => {
      const loginTime = new Date(log.start)
      const logoutTime = log.end ? new Date(log.end) : null
  
      const dateOptions = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }
  
      const start = loginTime.toLocaleString('en-US', dateOptions)
      const end = logoutTime
        ? logoutTime.toLocaleString('en-US', dateOptions)
        : '—'
  
      let duration = '-'
      if (logoutTime) {
        const diff = logoutTime - loginTime
        const hours = Math.floor(diff / 1000 / 60 / 60)
        const minutes = Math.floor((diff / 1000 / 60) % 60)
        duration = `${hours} hour${hours !== 1 ? 's' : ''} and ${minutes} minute${
          minutes !== 1 ? 's' : ''
        }`
      }
  
      return {
        id: log.id,
        start,
        end,
        duration,
      }
    })
  }
  
  

  const firstInitial = user?.Credential?.first_name?.charAt(0).toUpperCase()
  const lastInitial = user?.Credential?.last_name?.charAt(0).toUpperCase()
  const bgColor = colorMap[firstInitial] || '#FFFFFF'

  if (!user) return null // loading or fallback

  return (
    <div className="w-screen h-screen fixed backdrop-blur-xs z-50 flex items-center justify-center select-none">
      <div className="w-[70rem] min-h-fit bg-[#1C1B19] border-1 border-[#3A3A3A] flex flex-col rounded-sm">
        {/* Header */}
        <div className="w-full min-h-15 bg-[#373737] flex justify-between">
          <div className="h-15 w-fit flex items-center px-5">
            <span className="text-2xl text-white font-semibold">View User</span>
          </div>
          <div className="w-15 h-15 flex items-center justify-center">
            <i className="fa-solid fa-user text-white text-3xl"></i>
          </div>
        </div>

        {/* User Info */}
        <div className="w-full h-full flex flex-col gap-y-2">
          <div className="w-full h-[10rem] flex gap-x-10">
            <div className="w-fit h-full pt-7 px-15 ml-10">
              <div className="h-[4.5rem] w-[4.5rem] flex items-center justify-center bg-white rounded-full">
                <div
                  className="w-[4rem] h-[4rem] rounded-full border-1 flex items-center justify-center"
                  style={{ backgroundColor: bgColor }}
                >
                  <span className="text-3xl font-semibold">
                    {firstInitial}
                    {lastInitial}
                  </span>
                </div>
              </div>
            </div>

            <div className="min-w-[30rem] h-full flex flex-col justify-center gap-y-2">
              <span className="w-fit text-xl text-[#949494]">
                {user?.Credential?.position}
              </span>
              <span className="text-3xl text-white font-semibold">
                {user?.Credential?.first_name} {user?.Credential?.last_name}
              </span>
              <span className="text-xl text-[#9C9C9C] font-semibold">
                <i className="fa-solid fa-envelope"></i> &nbsp;
                {user?.Credential?.email}
              </span>
            </div>

            <div className="w-full h-full flex flex-col gap-y-2 justify-end pb-5">
              <span className="text-xl text-white font-semibold">
                <i className="fa-solid fa-phone"></i> &nbsp;
                {user?.Credential?.contact_number}
              </span>
              <span className="text-xl text-white font-semibold w-[10rem] text-center py-2 rounded border bg-[#3A3A3A] border-[#A6A6A6]">
                {user?.Credential?.role.charAt(0).toUpperCase() +
                  user?.Credential?.role.slice(1)}
              </span>
            </div>
          </div>

          {/* Login Logs Table */}
          <div className="w-full sm:min-w-[70rem] h-full bg-[#151515] border border-[#373737] overflow-y-scroll">
            {/* Table Header */}
            <div className="grid grid-cols-4 px-6 py-4 text-white font-semibold text-sm border-b border-[#373737]">
              <div>*</div>
              <div>Start</div>
              <div>End</div>
              <div>Duration</div>
            </div>

            {/* Table Body */}
            <div className="w-full h-50 overflow-y-scroll">
              {formatLogs().map((log, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 px-6 py-4 text-[#E6E6E6] text-sm border-b border-[#373737] items-center"
                >
                  <div>{log.id}</div>
                  <div>{log.start}</div>
                  <div>{log.end}</div>
                  <div>
                    <span className=" py-1 rounded text-[#B7B7B7]">
                      {log.duration}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="w-full min-h-15 bg-[#373737] flex px-5 justify-end">
          <div className="w-fit h-15 flex items-center gap-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-30 h-8 bg-[#6F3FFF] border flex items-center justify-center border-white rounded-sm cursor-pointer"
            >
              <span className="text-white text-xl font-semibold">Close</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserView
