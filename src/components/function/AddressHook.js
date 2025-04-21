import { useState, useEffect } from 'react';
import axios from 'axios';

/**
 * A custom hook for Province → City → Barangay logic.
 * 
 * Features:
 * 1. Loads the list of provinces from psgc.cloud on mount.
 * 2. When you select a Province:
 *    - Loads all the cities/municipalities for that province.
 *    - Resets (empties) any previously selected City and Barangay.
 * 3. When you select a City:
 *    - Loads all the barangays for that city.
 *    - Resets (empties) any previously selected Barangay.
 * 4. If the province or city is cleared (set to null), it likewise clears the dependent states.
 * 
 * This file only handles the data and the logic, not the layout/JSX. 
 * You can build your own UI (with dropdowns, search boxes, etc.) that 
 * reads from and writes to the states returned by this hook.
 * 
 * Usage Example:
 * 
 *   const {
 *     provinces,       // array of all provinces
 *     cities,          // array of cities for the selected province
 *     barangays,       // array of barangays for the selected city
 *     selectedProvince,
 *     setSelectedProvince,
 *     selectedCity,
 *     setSelectedCity,
 *     selectedBarangay,
 *     setSelectedBarangay
 *   } = useAddressLogic();
 * 
 *   // Then in your component:
 *   // - Render a dropdown (or other UI) for the user to pick from `provinces`.
 *   // - If user picks a province, call setSelectedProvince(provinceObj).
 *   // - That triggers loading of cities and resets city/barangay automatically.
 *   // - Similarly for city and barangay.
 */

export default function useAddressLogic() {
  // Data arrays for each level
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [barangays, setBarangays] = useState([]);

  // The user's current selections
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedBarangay, setSelectedBarangay] = useState(null);

  // Load provinces on mount
  useEffect(() => {
    axios
      .get('https://psgc.cloud/api/provinces')
      .then((res) => {
        setProvinces(res.data);
      })
      .catch((err) => {
        console.error('Error fetching provinces:', err);
      });
  }, []);

  // Whenever selectedProvince changes, fetch its cities & reset city+barangay
  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(`https://psgc.cloud/api/provinces/${selectedProvince.code}/cities-municipalities`)
        .then((res) => {
          setCities(res.data);
        })
        .catch((err) => {
          console.error('Error fetching cities:', err);
        });
      // Reset city & barangay since the user changed province
      setSelectedCity(null);
      setBarangays([]);
      setSelectedBarangay(null);
    } else {
      // If province is cleared, also clear out cities/barangays
      setCities([]);
      setSelectedCity(null);
      setBarangays([]);
      setSelectedBarangay(null);
    }
  }, [selectedProvince]);

  // Whenever selectedCity changes, fetch its barangays & reset barangay
  useEffect(() => {
    if (selectedCity) {
      axios
        .get(`https://psgc.cloud/api/cities-municipalities/${selectedCity.code}/barangays`)
        .then((res) => {
          setBarangays(res.data);
        })
        .catch((err) => {
          console.error('Error fetching barangays:', err);
        });
      // Reset barangay since the user changed city
      setSelectedBarangay(null);
    } else {
      // If city is cleared, also clear out barangays
      setBarangays([]);
      setSelectedBarangay(null);
    }
  }, [selectedCity]);

  return {
    provinces, // full list of provinces
    cities,    // filtered list of cities for selectedProvince
    barangays, // filtered list of barangays for selectedCity

    selectedProvince,
    setSelectedProvince,

    selectedCity,
    setSelectedCity,

    selectedBarangay,
    setSelectedBarangay,
  };
}
