import React, { useState } from "react";
import { Container, TextField, MenuItem, Grid, Button, Typography } from "@mui/material";
import Select from "react-select";
import { State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddEvents.css";

const AddEvents = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    destination: "",
    travelBuddyAge: "",
    startDate: "",
    endDate: "",
    transport: "",
    interests: "",
    budget: "",
    travelAuthor: "",
    travelDescription: "",
    travelBuddyGender: "",
    state: null,
    city: null,
    images: [],
  });

  const states = State.getStatesOfCountry("IN").map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));

  const cities = formData.state
    ? City.getCitiesOfState("IN", formData.state.value).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : [];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (selectedState) => {
    setFormData({ ...formData, state: selectedState, city: null });
  };

  const handleCityChange = (selectedCity) => {
    setFormData({ ...formData, city: selectedCity });
  };

  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFormData({ ...formData, images: selectedFiles });
  };

  const addEvent = async () => {
    try {
      const formdata = new FormData();

      // Append all fields
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((image) => formdata.append("img", image));
        } else if (key === "state") {
          formdata.append("States", formData.state?.label || "");
        } else if (key === "city") {
          formdata.append("City", formData.city?.label || "");
        } else {
          formdata.append(key, formData[key]);
        }
      });

      const response = await fetch("http://localhost:4000/api/auth/addEvents", {
        method: "POST",
        body: formdata,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Event added successfully!");
        navigate("/");
      } else {
        toast.error(result.message || "Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <Container className="event-container">
      <Typography variant="h4" align="center" className="event-title">
        Add New Event
      </Typography>
      <Grid container spacing={2}>
        {/* Text Inputs */}
        {[
          // { label: "Destination", name: "destination" },
          { label: "Travel Author", name: "travelAuthor" },
          { label: "Travel Description", name: "travelDescription" },
          { label: "Budget", name: "budget", type: "number" },
          { label: "Start Date", name: "startDate", type: "date" },
          { label: "End Date", name: "endDate", type: "date" },
        ].map((input, index) => (
          <Grid item xs={12} sm={6} key={index}>
            <TextField
              fullWidth
              label={input.label}
              name={input.name}
              type={input.type || "text"}
              value={formData[input.name]}
              onChange={handleChange}
              InputLabelProps={input.type === "date" ? { shrink: true } : {}}
              className="custom-input"
            />
          </Grid>
        ))}

        {/* Dropdowns */}
        <Grid item xs={12} sm={6}>
          <TextField
        
            select
            fullWidth
            label="Travel Buddy Age"
            name="travelBuddyAge"
            value={formData.travelBuddyAge}
            onChange={handleChange}
            className="custom-input text-light"
          >
            {["10-15", "15-20", "20-25", "25-30", "30-35", "35-40"].map((age) => (
              <MenuItem key={age} value={age}>
                {age}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Gender"
            name="travelBuddyGender"
            value={formData.travelBuddyGender}
            onChange={handleChange}
            className="custom-input"
          >
            {["Male", "Female", "Other"].map((gender) => (
              <MenuItem key={gender} value={gender}>
                {gender}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Transport"
            name="transport"
            value={formData.transport}
            onChange={handleChange}
            className="custom-input"
          >
            {["Car", "Bus", "Train", "Flight", "Bike", "Boat"].map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            select
            fullWidth
            label="Interest"
            name="interests"
            value={formData.interests}
            onChange={handleChange}
            className="custom-input"
          >
            {["Mountains", "Trekking", "Beaches", "Wildlife", "City Tour", "Adventure Sports", "Cultural"].map((int) => (
              <MenuItem key={int} value={int}>
                {int}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* State & City */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">State</Typography>
          <Select className="text-dark" options={states} value={formData.state} onChange={handleStateChange} placeholder="Select State" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">City</Typography>
          <Select className="text-dark" options={cities} value={formData.city} onChange={handleCityChange} placeholder="Select City" isDisabled={!formData.state} />
        </Grid>

        {/* Image Upload */}
        <Grid item xs={12}>
          <Typography variant="body1">Upload Images</Typography>
          <input type="file" multiple onChange={handleImageChange} accept="image/*" />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button variant="contained" fullWidth className="submit-button" onClick={addEvent}>
            Submit Event
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddEvents;
