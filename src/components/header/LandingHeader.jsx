import { useState, useEffect } from 'react';
import { NavLink, useLocation  } from 'react-router-dom';


const LandingHeader = () => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const isSpecialRoute = location.pathname === '/form' || location.pathname === '/about' || location.pathname === '/appointment' || location.pathname === '/support' ||  /^\/article\/[^/]+$/.test(location.pathname);
  const isLogin = location.pathname === '/login';

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    setIsScrolled(currentScrollY > 50);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []); 

  

  return   (
      <>
      
      <header className={`w-full fixed z-50 transition-all duration-300 ${isScrolled ? 'bg-[#1C1B19] shadow-lg' : 'bg-transparent shadow-none'}`}>
      <div className="flex w-auto h-7 justify-between px-5">
        <span className="text-white text-[0.65rem]  sm:text-xs md:text-md lg:text-md xl:text-md h-fit w-fit my-auto">
          Open Daily 9:00am-5:00pm, Monday-Friday, Closed During Holidays
        </span>
        <div className="w-auto flex items-center">
          {isScrolled && (
            <div className="inline-block animate-slide-in-right">
              <NavLink to="/" className="mx-2">
                <span className="text-white text-xs my-auto cursor-pointer">Home</span>
              </NavLink>
              <NavLink to="/content" className="mx-2">
                <span className="text-white text-xs my-auto cursor-pointer">News & Events</span>
              </NavLink>
              <NavLink to="/about" className="mx-2">
                <span className="text-white text-xs my-auto cursor-pointer">About</span>
              </NavLink>
            </div>
          )}
          <NavLink to="/login" className="mx-2 my-auto drop-shadow-[1px_1px_1px_black]">
            <span className={` ${location.pathname === '/login' ? 'hidden' : ''}  ${isScrolled ? 'text-white' : isSpecialRoute ? 'text-black' : 'text-white'} text-xs my-auto cursor-pointer`}>
              Login
            </span>
          </NavLink>
        </div>
      </div>
    </header>
    </>
    
  )
}

export default LandingHeader
