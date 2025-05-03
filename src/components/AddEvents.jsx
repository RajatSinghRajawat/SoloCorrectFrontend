import React, { useState, useEffect } from "react";
import {
  Container,
  TextField,
  MenuItem,
  Grid,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import Select from "react-select";
import { State, City } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AddEvents.css";

const AddEvents = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

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
    creator: "",
    images: [],
  });

  // Retrieve userId from localStorage on component mount
  useEffect(() => {
    const userInfo = localStorage.getItem("userData");
    const userData = userInfo ? JSON.parse(userInfo) : null;
    if (userData && userData._id) {
      setFormData((prev) => ({ ...prev, creator: userData._id }));
    } else {
      toast.error("User not logged in. Please log in to create an event.");
      navigate("/login"); // Redirect to login if user is not authenticated
    }
  }, [navigate]);

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
    const validImages = selectedFiles.filter((file) => {
      const isImage = file.type.startsWith("image/");
      const isUnderSizeLimit = file.size <= 5 * 1024 * 1024; // 5MB limit
      if (!isImage) toast.error(`${file.name} is not an image.`);
      if (!isUnderSizeLimit) toast.error(`${file.name} exceeds 5MB.`);
      return isImage && isUnderSizeLimit;
    });
    setFormData({ ...formData, images: validImages });
  };

  const validateForm = () => {
    if (
      !formData.destination ||
      !formData.travelAuthor ||
      !formData.travelDescription ||
      !formData.budget ||
      !formData.startDate ||
      !formData.endDate ||
      !formData.state ||
      !formData.city ||
      !formData.creator
    ) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("End date must be after start date.");
      return false;
    }
    return true;
  };

  const addEvent = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

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
        localStorage.setItem("eventId", JSON.stringify(result.data._id));
        if (result.user) {
          localStorage.setItem("userData", JSON.stringify(result.user));
        }
        // Reset form
        setFormData({
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
          creator: formData.creator, // Retain creator
          images: [],
        });
        toast.success("Event added successfully!");
        navigate("/");
      } else {
        toast.error(result.message || "Failed to add event.");
      }
    } catch (error) {
      console.error("Error adding event:", error);
      toast.error(error.message || "Failed to connect to the server.");
    } finally {
      setIsLoading(false);
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
          { label: "Destination", name: "destination" },
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
              aria-label={input.label}
              required
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
            className="custom-input"
            aria-label="Travel Buddy Age"
          >
            {["10-15", "15-20", "20-25", "25-30", "30-35", "35-40"].map(
              (age) => (
                <MenuItem key={age} value={age}>
                  {age}
                </MenuItem>
              )
            )}
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
            aria-label="Travel Buddy Gender"
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
            aria-label="Transport"
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
            aria-label="Interest"
          >
            {[
              "Mountains",
              "Trekking",
              "Beaches",
              "Wildlife",
              "City Tour",
              "Adventure Sports",
              "Cultural",
            ].map((int) => (
              <MenuItem key={int} value={int}>
                {int}
              </MenuItem>
            ))}
          </TextField>
        </Grid>

        {/* State & City */}
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">State</Typography>
          <Select
            className="text-dark"
            options={states}
            value={formData.state}
            onChange={handleStateChange}
            placeholder="Select State"
            aria-label="Select State"
            required
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography variant="body1">City</Typography>
          <Select
            className="text-dark"
            options={cities}
            value={formData.city}
            onChange={handleCityChange}
            placeholder="Select City"
            isDisabled={!formData.state}
            aria-label="Select City"
            required
          />
        </Grid>

        {/* Image Upload */}
        <Grid item xs={12}>
          <Typography variant="body1">Upload Images</Typography>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            accept="image/*"
            aria-label="Upload Images"
          />
        </Grid>

        {/* Submit Button */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            fullWidth
            className="submit-button"
            onClick={addEvent}
            disabled={isLoading}
            aria-label="Submit Event"
          >
            {isLoading ? (
              <>
                <CircularProgress size={24} style={{ marginRight: 8 }} />
                Submitting...
              </>
            ) : (
              "Submit Event"
            )}
          </Button>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AddEvents;