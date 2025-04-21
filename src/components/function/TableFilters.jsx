import React, { useState, useEffect } from 'react';

const TableFilters = ({ activeTab, onSearch, onDateChange, onStatusFilter, onCustomFilter }) => {
  // State for search input across all tabs
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for date
  const [selectedDate, setSelectedDate] = useState(null);
  
  // State for status filter (only for forms tab)
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  
  // State for custom filter based on table headers
  const [customFilter, setCustomFilter] = useState('');
  
  // Get placeholder text based on active tab
  const getSearchPlaceholder = () => {
    switch(activeTab) {
      case 'forms': 
        return 'Search visitor names or purpose...';
      case 'attendance':
        return 'Search attendees...';
      case 'visitorRecords':
        return 'Search visitor records...';
      default:
        return 'Search...';
    }
  };
  
  // Reset filters when tab changes
  useEffect(() => {
    setSearchTerm('');
    setCustomFilter('');
    // Only reset status when switching away from forms tab
    if (activeTab !== 'forms') {
      setStatusFilter('All Statuses');
    }
  }, [activeTab]);
  
  // Handle search input changes
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };
  
  // Handle date selection
  const handleDateChange = (date) => {
    setSelectedDate(date);
    onDateChange(date);
  };
  
  // Handle status filter change (only for forms tab)
  const handleStatusFilterChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    onStatusFilter(value);
  };
  
  // Handle custom filter change
  const handleCustomFilterChange = (e) => {
    const value = e.target.value;
    setCustomFilter(value);
    onCustomFilter(value);
  };
  
  // Get column filter options based on active tab
  const getCustomFilterOptions = () => {
    switch(activeTab) {
      case 'forms':
        return [
          { value: '', label: 'Filter by...' },
          { value: 'creation_date', label: 'Creation Date' },
          { value: 'visitor_name', label: 'Visitor Name' },
          { value: 'preferred_time', label: 'Preferred Time' },
          { value: 'visitor_count', label: 'Visitor Count' }
        ];
      case 'attendance':
        return [
          { value: '', label: 'Filter by...' },
          { value: 'date', label: 'Date' },
          { value: 'visitor_name', label: 'Visitor Name' },
          { value: 'purpose', label: 'Purpose' },
          { value: 'expected_visitor', label: 'Expected Visitor' },
          { value: 'present', label: 'Present' }
        ];
      case 'visitorRecords':
        return [
          { value: '', label: 'Filter by...' },
          { value: 'date', label: 'Date' },
          { value: 'visitors', label: 'Visitors' },
          { value: 'visit_counts', label: 'Visit Counts' }
        ];
      default:
        return [{ value: '', label: 'Filter by...' }];
    }
  };

  return (
    <div className="min-w-[94rem] min-h-[5rem] py-2 flex items-center gap-x-2">
      {/* Calendar Picker */}
      <div className="flex-shrink-0">
        <button 
          onClick={() => document.getElementById('date-picker').click()}
          className="px-3 h-16 rounded-lg border-1 border-gray-500 cursor-pointer"
        >
          <i className="text-gray-500 fa-regular fa-calendar text-4xl"></i>
        </button>
        <input 
          type="date" 
          id="date-picker"
          className="hidden"
          onChange={(e) => handleDateChange(e.target.value ? new Date(e.target.value) : null)}
        />
      </div>
      
      {/* Search Bar */}
      <div className="relative h-full min-w-[20rem]">
        <i className="text-2xl fa-solid fa-magnifying-glass absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer"></i>
        <input
          type="text"
          placeholder={getSearchPlaceholder()}
          value={searchTerm}
          onChange={handleSearchChange}
          className="h-full pl-10 pr-3 py-2 border-1 border-gray-500 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      {/* Custom Filter */}
      <div className="relative h-full min-w-48">
        <select 
          value={customFilter}
          onChange={handleCustomFilterChange}
          className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {getCustomFilterOptions().map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
      </div>
      
      {/* Status Filter (only for forms tab) */}
      {activeTab === 'forms' && (
        <div className="relative h-full min-w-48">
          <select 
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="appearance-none border-1 border-gray-500 h-full text-2xl rounded-lg text-gray-500 w-full py-2 pl-4 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="All Statuses">All Statuses</option>
            <option value="confirmed">Confirmed</option>
            <option value="rejected">Rejected</option>
            <option value="to review">To Review</option>
          </select>
          <i className="text-2xl fas fa-caret-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-600"></i>
        </div>
      )}
    </div>
  );
};

export default TableFilters;
