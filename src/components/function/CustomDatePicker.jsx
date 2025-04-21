import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ResponsiveDatePicker = (props) => {
  const [isMobile, setIsMobile] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);
  const [yearRange, setYearRange] = useState(() => {
    const currentYear = new Date().getFullYear();
    return { start: currentYear - 5, end: currentYear + 6 };
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const renderCustomHeader = ({
    date,
    changeYear,
    changeMonth,
    decreaseMonth,
    increaseMonth,
    prevMonthButtonDisabled,
    nextMonthButtonDisabled,
  }) => {
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();
    const years = Array.from(
      { length: yearRange.end - yearRange.start + 1 },
      (_, i) => yearRange.start + i
    );

    return (
      <div className={`custom-header ${isMobile ? 'mobile' : 'desktop'}`}>
        <div className="header-navigation">
          <button
            className="nav-button prev"
            onClick={decreaseMonth}
            disabled={prevMonthButtonDisabled}
            aria-label="Previous month"
          >
            &lt;
          </button>

          <div className="month-year-display">
            <button
              className={`month-button ${showMonthPicker ? 'active' : ''}`}
              onClick={() => {
                setShowMonthPicker(!showMonthPicker);
                setShowYearPicker(false);
              }}
              aria-label="Select month"
            >
              {months[currentMonth]}
            </button>
            <button
              className={`year-button ${showYearPicker ? 'active' : ''}`}
              onClick={() => {
                setShowYearPicker(!showYearPicker);
                setShowMonthPicker(false);
              }}
              aria-label="Select year"
            >
              {currentYear}
            </button>
          </div>

          <button
            className="nav-button next"
            onClick={increaseMonth}
            disabled={nextMonthButtonDisabled}
            aria-label="Next month"
          >
            &gt;
          </button>
        </div>

        {showMonthPicker && (
          <div className="month-picker">
            <div className="month-grid">
              {months.map((month, index) => (
                <button
                  key={month}
                  className={`month-option ${index === currentMonth ? 'selected' : ''}`}
                  onClick={() => {
                    changeMonth(index);
                    setShowMonthPicker(false);
                  }}
                  aria-label={`Select ${month}`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        )}

        {showYearPicker && (
          <div className="year-picker">
            <div className="year-range-controls">
              <button
                className="range-nav"
                onClick={() => setYearRange(prev => ({
                  start: prev.start - 12,
                  end: prev.end - 12
                }))}
                aria-label="Previous years"
              >
                &lt;&lt;
              </button>
              <span className="range-display">
                {yearRange.start} - {yearRange.end}
              </span>
              <button
                className="range-nav"
                onClick={() => setYearRange(prev => ({
                  start: prev.start + 12,
                  end: prev.end + 12
                }))}
                aria-label="Next years"
              >
                &gt;&gt;
              </button>
            </div>
            <div className="year-grid">
              {years.map(year => (
                <button
                  key={year}
                  className={`year-option ${year === currentYear ? 'selected' : ''}`}
                  onClick={() => {
                    changeYear(year);
                    setShowYearPicker(false);
                  }}
                  aria-label={`Select year ${year}`}
                >
                  {year}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="responsive-datepicker">
      <style>{`
        :root {
          --primary-color: #524433;
          --hover-color: #f0f0f0;
          --active-color: #e0e0e0;
          --selected-color: #524433;
          --text-color: #3e3428;
          --border-color: #ddd;
          --mobile-scale: 0.85;
        }
        
        .responsive-datepicker {
          width: 100%;
          max-width: 100%;
        }
        
        .react-datepicker {
          font-family: 'HindKochi', sans-serif;
          border: 1px solid var(--border-color);
          border-radius: 12px;
          padding: ${isMobile ? '8px' : '12px'};
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
          width: 100%;
          font-size: ${isMobile ? '14px' : '16px'};
        }
        
        .custom-header {
          position: relative;
          margin-bottom: ${isMobile ? '5px' : '10px'};
        }
        
        .header-navigation {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 ${isMobile ? '4px' : '8px'};
        }
        
        .nav-button {
          background: none;
          border: none;
          font-size: ${isMobile ? '1rem' : '1.2rem'};
          color: var(--primary-color);
          cursor: pointer;
          padding: ${isMobile ? '3px 6px' : '5px 10px'};
          border-radius: 6px;
          min-width: ${isMobile ? '28px' : '36px'};
        }
        
        .month-year-display {
          display: flex;
          gap: ${isMobile ? '4px' : '8px'};
        }
        
        .month-button, .year-button {
          background: none;
          border: none;
          font-size: ${isMobile ? '0.95rem' : '1.1rem'};
          font-weight: 600;
          color: var(--primary-color);
          cursor: pointer;
          padding: ${isMobile ? '3px 8px' : '5px 12px'};
          border-radius: 6px;
          transition: all 0.2s;
          min-width: ${isMobile ? '50px' : '60px'};
        }
        
        .month-picker, .year-picker {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: ${isMobile ? '8px' : '12px'};
          margin-top: ${isMobile ? '4px' : '8px'};
          z-index: 10;
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .month-grid {
          display: grid;
          grid-template-columns: repeat(${isMobile ? '3' : '4'}, 1fr);
          gap: ${isMobile ? '4px' : '8px'};
        }
        
        .month-option, .year-option {
          background: none;
          border: none;
          padding: ${isMobile ? '6px 4px' : '8px'};
          border-radius: 6px;
          cursor: pointer;
          font-size: ${isMobile ? '0.8rem' : '0.9rem'};
          transition: all 0.2s;
          text-align: center;
        }
        
        .year-picker {
          display: flex;
          flex-direction: column;
          gap: ${isMobile ? '8px' : '12px'};
        }
        
        .year-range-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: ${isMobile ? '0.85rem' : '1rem'};
        }
        
        .range-nav {
          background: none;
          border: none;
          font-size: ${isMobile ? '0.9rem' : '1rem'};
          cursor: pointer;
          padding: ${isMobile ? '3px 6px' : '5px 10px'};
          border-radius: 6px;
          min-width: ${isMobile ? '28px' : '36px'};
        }
        
        .year-grid {
          display: grid;
          grid-template-columns: repeat(${isMobile ? '3' : '4'}, 1fr);
          gap: ${isMobile ? '4px' : '8px'};
        }
        
        /* Day styling */
        .react-datepicker__day {
          width: ${isMobile ? '1.8rem' : '2.2rem'};
          line-height: ${isMobile ? '1.8rem' : '2.2rem'};
          margin: ${isMobile ? '0.1rem' : '0.15rem'};
          font-size: ${isMobile ? '0.85rem' : '1rem'};
        }
        
        .react-datepicker__day-name {
          width: ${isMobile ? '1.8rem' : '2.2rem'};
          line-height: ${isMobile ? '1.8rem' : '2.2rem'};
          margin: ${isMobile ? '0.1rem' : '0.15rem'};
          font-size: ${isMobile ? '0.85rem' : '1rem'};
        }
        
        /* Responsive touch targets */
        @media (max-width: 480px) {
          .month-button, .year-button {
            padding: 8px;
            min-width: 54px;
          }
          
          .month-option, .year-option {
            padding: 10px 4px;
          }
          
          .react-datepicker__day {
            width: 2rem;
            line-height: 2rem;
          }
          
          .react-datepicker__day-name {
            width: 2rem;
            line-height: 2rem;
          }
        }
      `}</style>

      <DatePicker
        {...props}
        renderCustomHeader={renderCustomHeader}
        calendarClassName={isMobile ? 'mobile-calendar' : 'desktop-calendar'}
      />
    </div>
  );
};

export default ResponsiveDatePicker;
