import React, { useState } from "react";
import Select from "react-select";
import { State, City } from "country-state-city";

const CityStates = () => {
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetching all states of India dynamically
  const states = State.getStatesOfCountry("IN").map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));

  // Fetch cities based on selected state
  const cities = selectedState
    ? City.getCitiesOfState("IN", selectedState.value).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : [];

  return (
    <div>
      <div style={{ width: "300px", margin: "20px auto" }}>
        <h3>Select State & City</h3>

        {/* State Dropdown */}
        <Select
          options={states}
          value={selectedState}
          onChange={(state) => {
            setSelectedState(state);
            setSelectedCity(null); // Reset city when state changes
          }}
          placeholder="Select a state..."
        />

        {/* City Dropdown */}
        <Select
          className="mt-5"
          options={cities}
          value={selectedCity}
          onChange={setSelectedCity}
          placeholder="Select a city..."
          isDisabled={!selectedState} // Disable until state is selected
        />

        {/* Show selected state & city */}
        {selectedState && <h4>Selected State: {selectedState.label}</h4>}
        {selectedCity && <h4>Selected City: {selectedCity.label}</h4>}
      </div>
    </div>
  );
};

export default CityStates;
