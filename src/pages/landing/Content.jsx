import React from 'react';
import LandingNav from '../../components/navbar/LandingNav';
import { ScrollRestoration } from 'react-router-dom';
import { Link } from 'react-router-dom';

import backgroundImage from '../../../src/assets/Fernando-Amorsolo-Women-Bathing-and-Washing Clothes-7463.png'
import eventImage from '../../../src/assets/img_1.png';


const itemsData = {
  "items": [
    {
      "image": eventImage,
      "category": "Education",
      "name": "Event Name 1",
      "date": "Month dd, yyyy"
     
    },
    {
      "image": eventImage,
      "category": "Subtopic",
      "name": "Event Name 2",
      "date": "Month dd, yyyy"
    },
    {
      "image": eventImage,
      "category": "Content",
      "name": "Event Name 3",
      "date": "Month dd, yyyy"
    },
    {
      "image": eventImage,
      "category": "Workshop",
      "name": "Event Name 4",
      "date": "Month dd, yyyy"
    },
    {
      "image": eventImage,
      "category": "Seminar",
      "name": "Event Name 5",
      "date": "Month dd, yyyy"
    },
    {
      "image": eventImage,
      "category": "Conference",
      "name": "Event Name 6",
      "date": "Month dd, yyyy"
    },
    {
      "image": eventImage,
      "category": "Dance",
      "name": "Event Name 7",
      "date": "Month dd, yyyy"
    },
    {
      "image": eventImage,
      "category": "Exhibit",
      "name": "Event Name 8",
      "date": "Month dd, yyyy"
    },
    {
      "image": eventImage,
      "category": "Performance",
      "name": "Event Name 9",
      "date": "Month dd, yyyy"
    }
  ]
};

const municipalities = [
  "Basud", "Capalonga", "Daet", "Jose Panganiban", "Labo",
  "Mercedes", "Paracale", "San Lorenzo Ruiz", "San Vicente", "Santa Elena", "Talisay", "Vinzons"
];

const Content = () => {
  return (
    <>
      <ScrollRestoration />
      <div className="bg-[#1C1B19] flex flex-col gap-y-4 w-screen pt-7 h-fit min-h-fit">
        <LandingNav />

        {/* Background Image Section */}
        <div
          className="w-screen h-[40rem] bg-cover bg-center bg-no-repeat relative"
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          {/* Centered Search Bar Overlay */}
          <div className="absolute inset-0 flex justify-center items-center">
            {/* Outer container with bigger width/height, bigger text */}
            <div className="grid grid-cols-4 w-[90%] max-w-6xl h-15">

              {/* 1. Keyword Input */}
              <div className="flex items-center justify-center bg-white text-black border-r border-black">
                <input
                  type="text"
                  placeholder="Enter keyword"
                  className="w-full h-full px-4 text-4xl lg:text-5xl bg-transparent focus:outline-none"
                />
              </div>

              {/* 2. Category Dropdown */}
              <div className="relative flex items-center justify-center bg-white text-black border-r border-black">
                <select className="w-full h-full px-4 text-4xl lg:text-5xl bg-transparent appearance-none focus:outline-none">
                  <option>Category</option>
                  {/* More options here */}
                </select>
                {/* Dropdown icon */}
                <div className="pointer-events-none absolute right-2">
                  <svg
                    className="h-8 w-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              {/* 3. Municipality Dropdown */}
              <div className="relative flex items-center justify-center bg-white text-black border-r border-black">
                <select className="w-full h-full px-4 text-4xl lg:text-5xl bg-transparent appearance-none focus:outline-none">
                  <option>Municipality</option>
                  {municipalities.map((municipality) => (
                    <option key={municipality} value={municipality}>
                      {municipality}
                    </option>
                  ))}
                </select>
                {/* Dropdown icon */}
                <div className="pointer-events-none absolute right-2">
                  <svg
                    className="h-8 w-8 text-black"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>

              <button
                className="flex items-center justify-center
             text-4xl lg:text-5xl
             border-2 border-transparent
             bg-black text-white
             hover:bg-white hover:text-black
             hover:border-black
             transition-all duration-300
             cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#1C1B19] min-h-screen py-15">
        <div className="w-full px-4 mx-auto flex justify-around">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10 gap-x-20">
            {itemsData.items.map((item, index) => (
              <Link
                key={index}
                to={`/article/${index.slug}`} // Replace with actual ID or slug if available
                className="flex flex-col items-center text-center hover:opacity-90 transition duration-300"
              >
                <img
                  src={item.image}
                  alt={`Event ${index + 1}`}
                  className="w-[300px] h-auto"
                />
                <p className="text-[#F05454] text-base uppercase mt-2">
                  {item.category}
                </p>
                <h2 className="text-white text-2xl font-bold mt-1">
                  {item.name}
                </h2>
                <p className="text-gray-300 text-base mt-1">
                  {item.date}
                </p>
              </Link>
            ))}

          </div>
        </div>
      </div>
    </>
  );
};

export default Content;
