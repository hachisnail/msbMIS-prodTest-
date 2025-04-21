
import { ScrollRestoration } from 'react-router-dom';
import LandingNav from '../../components/navbar/LandingNav'
import React, { useState, useEffect, useRef } from 'react';
import useAddressLogic from '../../components/function/AddressHook';

function TypedDropdown({
  placeholder,
  options,
  selectedItem,
  onChange,
  disabled = false
}) {
  const [inputText, setInputText] = useState(selectedItem?.name || '');
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  // Update inputText if selectedItem changes from outside
  useEffect(() => {
    setInputText(selectedItem?.name || '');
  }, [selectedItem]);

  // Close dropdown if user clicks outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item) => {
    onChange(item);
    setShowDropdown(false);
  };

  const handleClear = () => {
    onChange(null);
    setInputText('');
    setShowDropdown(false);
  };

  // Filter options based on typed input
  const filteredOptions = options.filter((o) =>
    o.name.toLowerCase().includes(inputText.toLowerCase())
  );

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div
        className={`flex border-2 border-black rounded-2xl px-4 py-3 
          ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      >
        <input
          className="outline-none flex-grow placeholder-gray-500 text-base md:text-lg disabled:cursor-not-allowed"
          placeholder={placeholder}
          value={inputText}
          disabled={disabled}
          onChange={(e) => {
            setInputText(e.target.value);
            if (!disabled) {
              setShowDropdown(true);
            }
          }}
          onFocus={() => !disabled && setShowDropdown(true)}
        />
        {selectedItem && !disabled && (
          <button
            type="button"
            className="ml-2 text-black font-bold"
            onClick={handleClear}
          >
            X
          </button>
        )}
      </div>

      {showDropdown && !disabled && (
        <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-auto bg-white border border-gray-400 shadow-md rounded-md">
          {filteredOptions.length ? (
            filteredOptions.map((o) => (
              <li
                key={o.code}
                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelect(o)}
              >
                {o.name}
              </li>
            ))
          ) : (
            <li className="px-3 py-2 text-gray-500">No results</li>
          )}
        </ul>
      )}
    </div>
  );
}
  
const Form = () => {
  const [formType, setFormType] = useState("donation"); // Default to Donation Form


  // Using the custom hook for addresses
  const {
    provinces,
    cities,
    barangays,
    selectedProvince,
    setSelectedProvince,
    selectedCity,
    setSelectedCity,
    selectedBarangay,
    setSelectedBarangay
  } = useAddressLogic();


  return (
    <>
      <ScrollRestoration />

      <div className=' flex flex-col gap-y-4 min-h-fit h-fit w-screen pt-7' >
        <div className='min-h-[10%] w-screen'>
          <LandingNav/>
        </div>

        <div className='h-auto min-h-[79rem] w-screen'>
       

        {/* Header */}
        <div className='w-full bg-white py-6 font-medium font-[HinaMincho] shadow-lg my-2 px-20'>
          <span className='text-5xl'>Contribution Form</span>
        </div>

        {/* Info Section */}
        <div className='w-auto h-auto mx-20 py-4 px-12'>
          <span className='text-xl font-[HinaMincho]'>
            In addition to preserving your historic objects, it is important to remember to preserve the history or story
            that goes with them. For example, the uniform worn by your great-grandfather is just a uniform if the story 
            is lost. Take the time to write down the story that goes with your objects; include any background details 
            that would help our team understand the significance of the item.
          </span>

          {/* Dropdown Selection */}
          <div className='mt-8'>
            <span className='text-2xl font-semibold mr-7'>What Type of Form?</span>
            <select
              className='ml-3 p-2 border rounded-md cursor-pointer'
              value={formType}
              onChange={(e) => setFormType(e.target.value)}
            >
              <option value="donation">Donation Form</option>
              <option value="lending">Lending Form</option>
            </select>
          </div>

          {/* Form Sections */}
          <div>
            <div className="px-6 p-3 bg-white rounded-md shadow-lg mt-3 mb-5 " >
                <span className='text-4xl'>Tell Us About Yourself.</span>
                    <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                        <label className="md:col-span-3 text-lg md:text-xl font-bold">
                        Name <span className="text-red-500">*</span>
                        </label>
                        <input
                        type="text"
                        placeholder="First Name"
                        required
                        className="md:col-span-4 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                        />
                        <input
                        type="text"
                        placeholder="Last Name"
                        required
                        className="md:col-span-4 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                        />
                </div>
                {/* Age and Gender Section */}
                <div className="grid grid-cols-12 items-center gap-4 mt-6 ">
                    {/* Age Input */}
                    <label htmlFor="age" className="col-span-2 md:col-span-3 text-xl font-bold">
                        Age <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="text" 
                        id="age" 
                        name="age" 
                        placeholder="Age" 
                        pattern="\d*" 
                        inputmode="numeric"
                        required
                        className="col-span-3 md:col-span-2 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                    />


                    {/* Gender Selection */}
                    <label className="col-span-2 text-xl font-bold text-center">Sex</label>
                    <div className="col-span-5 flex gap-6">
                        <label className="inline-flex items-center">
                            <input type="radio" name="sex" id="male" value="male" className="form-radio" />
                            <span className="ml-2">Male</span>
                        </label>
                        <label className="inline-flex items-center">
                            <input type="radio" name="sex" id="female" value="female" className="form-radio" />
                            <span className="ml-2">Female</span>
                        </label>
                        
                    </div>
                </div>

                {/* Contact Information Section */}
                <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-6">
                <label className="md:col-span-3 text-xl md:text-xl font-bold">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  placeholder="example@gmail.com"
                  required
                  className="md:col-span-4 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
                <label className="md:col-span-2 text-lg md:text-xl font-bold">Phone</label>
                <input
                  type="tel"
                  placeholder="+6309123456789"
                  className="md:col-span-3 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

                 {/* Organization */}
              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-6">
                <label className="md:col-span-3 text-lg md:text-xl font-bold">Organization</label>
                <input
                  type="text"
                  placeholder="School/Institution/etc"
                  className="md:col-span-9 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-6">
                {/* Province */}
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Province <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-4">
                  <TypedDropdown
                    placeholder="Type or choose Province"
                    options={provinces}
                    selectedItem={selectedProvince}
                    onChange={setSelectedProvince}
                  />
                </div>

                {/* City */}
                <label className="md:col-span-2 text-lg md:text-xl font-bold">
                  City/Municipality <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-3">
                  <TypedDropdown
                    placeholder="Type or choose City"
                    options={cities}
                    selectedItem={selectedCity}
                    onChange={setSelectedCity}
                    disabled={!selectedProvince} // disable if no province selected
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 items-center gap-4 mt-6">
                {/* Barangay */}
                <label className="md:col-span-3 text-lg md:text-xl font-bold">
                  Barangay <span className="text-red-500">*</span>
                </label>
                <div className="md:col-span-4">
                  <TypedDropdown
                    placeholder="Type or choose Barangay"
                    options={barangays}
                    selectedItem={selectedBarangay}
                    onChange={setSelectedBarangay}
                    disabled={!selectedCity} // disable if no city selected
                  />
                </div>

                {/* Street */}
                <label className="md:col-span-2 text-lg md:text-xl font-bold">Street</label>
                <input
                  type="text"
                  placeholder="Street"
                  className="md:col-span-3 px-4 py-3 border-2 border-black rounded-2xl placeholder-gray-500 text-base md:text-lg"
                />
              </div>

                
            </div>

            {/* Extra div for Lending Form */}
                {formType === "lending" && (
                    <div className="p-3 bg-white rounded-md shadow-lg">
                        <span className="text-3xl font-semibold mb-8">Lending Details</span>
                        <div>
                            <div className="grid md:grid-cols-12 items-center gap-4 mt-6">
                                <label htmlFor="loanDuration" className="col-span-3 text-xl font-bold">
                                    Proposed duration of the loan? <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-9">
                                    <input 
                                        type="text" 
                                        id="loanDuration" 
                                        name="loanDuration" 
                                        placeholder="Enter duration" 
                                        required
                                        className="w-full px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                                    />
                                    <p className="text-gray-500 text-sm mt-2">
                                        Specific duration (e.g., 5 years), Month yyyy - Month dd, yyyy
                                    </p>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-12 items-center gap-4 mt-6">
                                <label htmlFor="loanDuration" className="col-span-3 text-xl font-bold">
                                Specific conditions or requirements for the display or handling of the artifact? <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-9">
                                    <input 
                                        type="text" 
                                        id="loanDuration" 
                                        name="loanDuration" 
                                        placeholder="Enter Specific Conditions" 
                                        required
                                        className="w-full px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                                    />
                                
                                </div>
                            </div>

                            <div className="grid md:grid-cols-12 items-center gap-4 mt-6">
                                <label htmlFor="loanDuration" className="col-span-3 text-xl font-bold">
                                Specific liability concerns or requirements you have regarding the artifact? <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-9">
                                    <input 
                                        type="text" 
                                        id="loanDuration" 
                                        name="loanDuration" 
                                        placeholder="Enter Liability Concerns" 
                                        required
                                        className="w-full px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                                    />
                                
                                </div>
                            </div>

                            <div className="grid md:grid-cols-12 items-center gap-4 mt-6">
                                <label htmlFor="loanDuration" className="col-span-3 text-xl font-bold">
                                Reason for lending. <span className="text-red-500">*</span>
                                </label>
                                <div className="col-span-9">
                                    <input 
                                        type="text" 
                                        id="loanDuration" 
                                        name="loanDuration" 
                                        placeholder="Reason" 
                                        required
                                        className="w-full px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
                                    />
                                
                                </div>
                            </div>
                        </div>
                    </div>
                )}


            <div className="p-3 bg-white rounded-md shadow-lg mt-3">
                
        {/* Section Title */}
        <h3 className="text-3xl font-semibold mb-8">About the Artifact</h3>

        {/* Title/Name Section */}
        <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
            <label htmlFor="artifactTitle" className="col-span-3 text-xl font-bold">
                Title/Name of the Artifact <span className="text-red-500">*</span>
            </label>
            <input 
                type="text" 
                id="artifactTitle" 
                name="artifactTitle" 
                placeholder="Title/Name of the Artifact" 
                required
                className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm"
            />
        </div>

        {/* Artifact Description */}
        <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
            <label htmlFor="artifactDescription" className="col-span-3 text-xl font-bold">
                Artifact Description <span className="text-red-500">*</span>
            </label>
            <textarea 
                id="artifactDescription" 
                name="artifactDescription" 
                placeholder="Artifact Description" 
                required
                className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm h-32 resize-none"
            />
        </div>

        {/* Acquisition Details */}
        <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
            <label htmlFor="artifactDescription" className="col-span-3 text-xl font-bold">
               How and where did you acquire the artifact? <span className="text-red-500">*</span>
            </label>
            <textarea 
                id="artifactDescription" 
                name="artifactDescription" 
                placeholder="Acquisition Details" 
                required
                className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm h-32 resize-none"
            />
        </div>

        {/* Additional Information */}
        <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
            <label htmlFor="additionalInfo" className="col-span-3 text-xl font-bold">
                Additional Information
            </label>
            <textarea 
                id="additionalInfo" 
                name="additionalInfo" 
                placeholder="Is there any other information about the artifact that the museum should know?"
                className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm h-32 resize-none"
            />
        </div>

        {/* Narrative or Story */}
        <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
            <label htmlFor="narrative" className="col-span-3 text-xl font-bold">
                Brief Narrative or Story
            </label>
            <textarea 
                id="narrative" 
                name="narrative" 
                placeholder="Would you like to provide a brief narrative or story related to the artifact?"
                className="col-span-9 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm h-32 resize-none"
            />
        </div>

        {/* Images of the Artifact */}
        <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
            <label htmlFor="artifact_img" className="col-span-5 text-xl font-bold md:col-span-3">
                Images of the Artifact <span className="text-red-500">*</span>
            </label>
            <input 
                type="file" 
                id="artifact_img" 
                name="artifact_img" 
                multiple
                className="col-span-7 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm md:col-span-9"
            />
        </div>

        {/* Relevant Documentation */}
        <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
            <label htmlFor="documentation" className="col-span-5 text-xl font-bold md:col-span-3 ">
                Relevant Documentation
            </label>
            <input 
                type="file" 
                id="documentation" 
                name="documentation" 
                multiple
                className="col-span-7 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm md:col-span-9"
            />
        </div>

        {/* Related Images */}
        <div className="grid md:grid-cols-12 items-center gap-4 mb-6">
            <label htmlFor="related_img" className="col-span-5 text-xl font-bold md:col-span-3">
                Any Related Images
            </label>
            <input 
                type="file" 
                id="related_img" 
                name="related_img" 
                multiple
                className="col-span-7 px-4 py-2 border-2 border-black rounded-2xl placeholder-gray-500 text-sm md:col-span-9"
            />
        </div>

        {/* Submit Button */}
        <div className="flex justify-end mt-8">
            <button 
                type="submit" 
                className="bg-[#E8D2B7] text-white px-10 py-2 rounded-lg hover:bg-[#524433] transition"
            >
                Submit
            </button>
        </div>
                
            </div>

           
          </div>
        </div>
      
        </div>

        </div>
     
    </>
  )
}

export default Form
