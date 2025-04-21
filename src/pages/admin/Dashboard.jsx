import React, { useState } from 'react';
import AdminNav from '../../components/navbar/AdminNav';

// 1) Import chart components and register needed chart.js modules:
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const Dashboard = () => {
  const [search, setSearch] = useState("");

  // 2) Define data/options for the Donut Chart (Expected Visitors)
  const donutData = {
    labels: ['Present Visitors', 'Others'],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ['#3E2D1C', '#CFC3B5'],
        borderWidth: 0,
      },
    ],
  };
  const donutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  // 3) Define data/options for the Bar Chart (Appointment Rate)
  const barData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Appointments',
        data: [25, 18, 15, 40, 28, 38, 35, 30, 20, 5, 15, 28],
        backgroundColor: '#3E2D1C',
      },
    ],
  };
  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
      },
      x: {
        ticks: {
          color: '#333',
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <>
      <div className='w-screen min-h-[79.8rem] h-screen bg-[#F0F0F0] select-none flex pt-[7rem]'>
        {/* Sidebar */}
        <div className='bg-[#1C1B19] w-auto min-h-full h-full min-w-[6rem] sm:min-w-auto'>
          <AdminNav />
        </div>

        {/* Main Content */}
        <div className='w-full min-h-full h-full p-7 overflow-scroll'>

          {/* TOP ROW */}
          <div className='w-full flex flex-col xl:flex-row h-1/2 '>

            {/* -- Expected Visitors + (present/absent boxes) -- */}
            <div className="xl:w-1/2 w-full flex gap-x-2 p-2 sm:h-full h-1/2">
              <div className="shadow-lg shadow-gray-600 h-full min-w-[16rem] sm:min-w-[20rem] md:min-w-[25rem] lg:min-w-[30rem] xl:min-w-[35rem] rounded-lg bg-white flex flex-col p-4 gap-2 sm:gap-3 md:gap-4">
                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-6xl font-semibold text-center">
                  Expected Visitors
                </span>
                <span className="text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-5xl text-center">
                  1603
                </span>
                <div className="flex-1 flex flex-col justify-center items-center">
                  {/* Donut Chart container */}
                  <div className="relative sm:w-full sm:h-full w-[80%] h-[80%]">
                    <Doughnut data={donutData} options={donutOptions} />
                    {/* Centered Text in Donut */}
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                      <span className="text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-widest">
                        80%
                      </span>
                      <span className="text-xs sm:text-lg md:text-xl lg:text-2xl xl:text-2xl mt-2">
                        Present Visitors
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Present, Absent, etc. */}
              <div className='w-full flex-col px-2 gap-y-4 flex h-full'>
                <div className='shadow-lg shadow-gray-600 flex flex-col w-full h-full px-2 xl:px-5 py-2 xl:py-8 rounded-lg bg-black'>
                  <span className='text-xm xl:text-4xl text-white font-bold'>Present</span>
                  <div className='w-full h-full flex items-center justify-center'>
                    <div className='w-fit h-fit flex gap-x-2 items-end'>
                      <span className='text-xl xl:text-6xl text-white font-bold'>1520</span>
                      <span className='text-[#D5FFCB] text-xs xl:text-2xl'>3.2% <i className="fa-solid fa-arrow-up"></i></span>
                    </div>
                  </div>
                  <span className='text-sm xl:text-2xl text-[#EAC39C]'>Compared to last month (1486)</span>
                </div>

                <div className='shadow-lg shadow-gray-600 flex flex-col w-full h-full px-2 xl:px-5 py-2 xl:py-8 rounded-lg bg-black'>
                  <span className='text-xm xl:text-4xl text-white font-bold'>Absent</span>
                  <div className='w-full h-full flex items-center justify-center'>
                    <div className='w-fit h-fit flex gap-x-2 items-end'>
                      <span className='text-xl xl:text-6xl text-white font-bold'>83</span>
                      <span className='text-[#D5FFCB] text-xs xl:text-2xl'>1.5% <i className="fa-solid fa-arrow-down"></i></span>
                    </div>
                  </div>
                  <span className='text-sm xl:text-2xl text-[#EAC39C]'>Compared to last month (95)</span>
                </div>
              </div>
            </div>

            {/* -- Appointment Rate -- */}
            <div className="xl:w-1/2 w-full p-2 sm:h-full h-1/2">
              <div className='shadow-lg shadow-gray-600  w-full h-full rounded-lg bg-[#1C1B19] flex flex-col p-5 gap-3 md:gap-6 md:p-10'>
                <span className='text-3xl font-bold text-white md:text-5xl'>Appointment Rate</span>
                <div className='bg-white h-full w-full rounded-xl p-3 md:p-6'>
                  {/* Bar chart here */}
                  <div className='w-full sm:h-full h-[8rem]'>
                    <Bar data={barData} options={barOptions} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* BOTTOM ROW (unchanged content) */}
          <div className='w-full flex flex-col xl:flex-row h-1/2 '>
            <div className="xl:w-1/2 w-ful gap-x-2 flex p-2 sm:h-full h-1/2">
              <div className='w-full flex  h-full'>
                {/* Approved Visits boxes */}
                <div className='min-w-[8rem] lg:min-w-[16rem] flex flex-col p-2 gap-y-2 h-full'>
                  <div className='shadow-lg shadow-gray-600 flex flex-col h-1/2 w-full rounded-lg bg-[#1C1B19] p-2 xl:p-4'>
                    <span className='text-white font-bold text-[8px] xl:text-2xl'>Approved Visits</span>
                    <div className='w-full h-full flex items-center justify-center'>
                      <span className='font-bold text-white text-3xl xl:text-8xl'>593</span>
                    </div>
                  </div>
                  <div className='shadow-lg shadow-gray-600 flex flex-col h-1/2 w-full rounded-lg bg-[#1C1B19] p-2 xl:p-4'>
                    <span className='text-white font-bold text-[8px] xl:text-2xl'>Pending Visits</span>
                    <div className='w-full h-full flex items-center justify-center'>
                      <span className='font-bold text-white text-3xl xl:text-8xl'>42</span>
                    </div>
                  </div>
                </div>
                {/* Quota boxes */}
                <div className='w-full flex flex-col p-2 gap-y-2 h-full'>
                  <div className='h-1/2 pt-4 pr-4 w-full'>
                    <div className='shadow-lg shadow-gray-600 flex p-2 xl:p-4 w-full h-full rounded-lg bg-[#EFEEDE]'>
                      <div className="min-w-[4rem] sm:min-w-[9rem] flex-col flex h-full p-2">
                        <span className='text-lg xl:text-4xl font-bold'>Today</span>
                        <div className='w-full h-full flex items-center justify-center overflow-clip'>
                          <span className='text-2xl xl:text-8xl font-semibold'>7</span>
                        </div>
                      </div>
                      <div className='w-full h-full pt-4 xl:pt-10'>
                        <div className="w-full h-full flex flex-col bg-black rounded-lg p-2">
                          <span className='text-[#EAC39C] text-xs xl:text-xl font-semibold'>This Month</span>
                          <div className='w-full h-full flex items-center justify-center'>
                            <span className='text-[#EAC39C] text-lg xl:text-8xl font-semibold'>59</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='h-1/2 pt-4 pr-4 w-full '>
                    <div className='shadow-lg shadow-gray-600 flex p-2 xl:p-4 w-full h-full rounded-lg bg-[#EFEEDE]'>
                      <div className="min-w-[4rem] sm:min-w-[9rem] flex-col flex h-full p-2">
                        <span className='text-lg xl:text-4xl font-bold'>Today</span>
                        <div className='w-full h-full flex items-center justify-center overflow-clip'>
                          <span className='text-2xl xl:text-8xl font-semibold'>7</span>
                        </div>
                      </div>
                      <div className='w-full h-full pt-4 xl:pt-10'>
                        <div className="w-full h-full flex flex-col bg-black rounded-lg p-2">
                          <span className='text-[#EAC39C] text-xs xl:text-xl font-semibold'>This Month</span>
                          <div className='w-full h-full flex items-center justify-center'>
                            <span className='text-[#EAC39C] text-lg xl:text-8xl font-semibold'>59</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quota animation */}
              <div className='min-w-[12rem] md:min-w-[20rem] lg:min-w-[23rem] px-2 h-full'>
                <div className='w-full h-full rounded-lg bg-black shadow-lg shadow-gray-600 flex flex-col gap-y-6 p-6'>
                  <div className='w-full flex justify-between h-auto'>
                    <span className='text-white text-xl sm:text-2xl font-semibold'>Qouta</span>
                    <span className='text-[#EAC39C] text-xl sm:text-2xl font-semibold'>68%</span>
                  </div>
                  <div className="relative w-full h-full bg-white rounded-lg flex flex-col justify-start items-start overflow-hidden">
                    <div className="w-full h-[32%] p-2 z-10">
                      <span>1000</span>
                    </div>
                    <div className="relative w-full h-[68%] text-white flex items-center justify-center z-10 font-bold text-3xl">
                      <span className="absolute">680</span>
                      <svg
                        className="absolute top-0 left-0 w-full h-full"
                        viewBox="0 0 500 150"
                        preserveAspectRatio="none"
                      >
                        <path
                          fill="#0066FF"
                          d="M0,30 C150,0 350,60 500,30 L500,150 L0,150 Z"
                        >
                          <animate
                            attributeName="d"
                            dur="4s"
                            repeatCount="indefinite"
                            values="
                              M0,30 C150,0 350,60 500,30 L500,150 L0,150 Z;
                              M0,20 C150,40 350,-20 500,20 L500,150 L0,150 Z;
                              M0,30 C150,0 350,60 500,30 L500,150 L0,150 Z
                            "
                          />
                        </path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom-right elements (Pending Queries, Walk-Ins, etc.) */}
            <div className="xl:w-1/2 w-full gap-x-6 flex p-5 sm:h-full h-1/2">
              <div className='w-1/2 h-full'>
                <div className='w-full shadow-lg shadow-gray-600 p-4 flex-col flex h-full '>
                  <div className='w-full px-2 flex justify-between items-center py-2 h-auto border-b-2'>
                    <span className='text-lg sm:text-3xl font-semibold'>Pending Queries</span>
                    <i className="fa-solid fa-arrow-down text-sm sm:text-4xl cursor-pointer"></i>
                  </div>
                </div>
              </div>

              <div className='w-1/2 flex flex-col justify-around h-full p-2'>
                <span className='text-2xl sm:text-6xl font-semibold'>Walk-Ins</span>
                <div className='w-full h-fit gap-y-4 flex flex-col'>
                  <button className='cursor-pointer shadow-lg shadow-gray-600 w-full flex items-center justify-between px-5 sm:px-10 border-3 rounded-lg h-[4rem] sm:h-[8rem]'>
                    <span className='sm:text-4xl text-2xl font-semibold'>Appointment</span>
                    <i className="fa-regular fa-square-plus text-2xl sm:text-5xl"></i>
                  </button>
                  <button className='cursor-pointer shadow-lg shadow-gray-600 w-full flex items-center justify-between px-5 sm:px-10 border-3 rounded-lg h-[4rem] sm:h-[8rem]'>
                    <span className='sm:text-4xl text-2xl font-semibold'>Donation</span>
                    <i className="fa-regular fa-square-plus text-2xl sm:text-5xl"></i>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;