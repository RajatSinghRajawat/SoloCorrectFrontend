import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { State, City } from "country-state-city";
import "./AddEvents.css";

const AddEvents = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setuser] = useState();
  const [formData, setFormData] = useState({
    destination: "",
    travelBuddyAge: "",
    startDate: "",
    endDate: "",
    transport: "",
    interests: [],
    budget: "",
    travelAuthor: "",
    travelDescription: "",
    travelBuddyGender: "",
    state: null,
    city: null,
    creator: "",
    images: [],
  });

  useEffect(() => {
    const userInfo = localStorage.getItem("userData");
    const userData = userInfo ? JSON.parse(userInfo) : null;
    console.log(userData.name, "userData");

    if (userData && userData._id) {
      setFormData((prev) => ({
        ...prev,
        creator: userData._id,
        travelAuthor: userData.name,
      }));
    } else {
      toast.error("User not logged in. Please log in to create an event.");
      navigate("/login");
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

  const interestOptions = [
    { value: "Mountains", label: "Mountains" },
    { value: "Trekking", label: "Trekking" },
    { value: "Beaches", label: "Beaches" },
    { value: "Wildlife", label: "Wildlife" },
    { value: "City Tour", label: "City Tour" },
    { value: "Adventure Sports", label: "Adventure Sports" },
    { value: "Cultural", label: "Cultural" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleStateChange = (selectedState) => {
    setFormData({ ...formData, state: selectedState, city: null });
  };

  const handleCityChange = (selectedCity) => {
    setFormData({ ...formData, city: selectedCity });
  };

  const handleInterestsChange = (selectedInterests) => {
    setFormData({ ...formData, interests: selectedInterests });
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
      Object.keys(formData).forEach((key) => {
        if (key === "images") {
          formData.images.forEach((image) => formdata.append("img", image));
        } else if (key === "state") {
          formdata.append("States", formData.state?.label || "");
        } else if (key === "city") {
          formdata.append("City", formData.city?.label || "");
        } else if (key === "interests") {
          formdata.append(
            "interests",
            formData.interests.map((i) => i.value).join(",")
          );
        } else {
          formdata.append(key, formData[key]);
        }
      });

      const response = await fetch(
        "http://82.29.166.100:4000/api/auth/addEvents",
        {
          method: "POST",
          body: formdata,
        }
      );

      const result = await response.json();

      if (response.ok) {
        console.log("Event added successfully, showing toast");
        localStorage.setItem("eventId", JSON.stringify(result.data._id));
        if (result.user) {
          localStorage.setItem("userData", JSON.stringify(result.user));
        }

        setFormData({
          destination: "",
          travelBuddyAge: "",
          startDate: "",
          endDate: "",
          transport: "",
          interests: [],
          budget: "",
          travelAuthor: formData.travelAuthor,
          travelDescription: "",
          travelBuddyGender: "",
          state: null,
          city: null,
          creator: formData.creator,
          images: [],
        });
        toast.success("Event added successfully!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTimeout(() => {
          navigate("/events");
        }, 3500);
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
    <div className="container event-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <div className="d-flex justify-content-between">
        <div>
          <button className="back-button" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <h2 className="event-title">Add New Event</h2>
        </div>

        <div>
          <NavLink to="/allevents">
            <button className="submit-button">All Events</button>
          </NavLink>
        </div>
      </div>
      <div className="input-wrapper">
        <label className="input-label">Destination</label>
        <input
          type="text"
          name="destination"
          value={formData.destination}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">Travel Author</label>
        <input
          type="text"
          name="travelAuthor"
          value={formData.travelAuthor}
          onChange={handleChange}
          className="input-field"
          readOnly
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">Travel Description</label>
        <textarea
          name="travelDescription"
          value={formData.travelDescription}
          onChange={handleChange}
          className="textarea-field"
          required
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">Budget</label>
        <input
          type="number"
          name="budget"
          value={formData.budget}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">Start Date</label>
        <input
          type="date"
          name="startDate"
          value={formData.startDate}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">End Date</label>
        <input
          type="date"
          name="endDate"
          value={formData.endDate}
          onChange={handleChange}
          className="input-field"
          required
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">Travel Buddy Age</label>
        <select
          name="travelBuddyAge"
          value={formData.travelBuddyAge}
          onChange={handleChange}
          className="select-field"
        >
          <option value="">Select Age Range</option>
          {["10-15", "15-20", "20-25", "25-30", "30-35", "35-40"].map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>

      <div className="input-wrapper">
        <label className="input-label">Gender</label>
        <select
          name="travelBuddyGender"
          value={formData.travelBuddyGender}
          onChange={handleChange}
          className="select-field"
        >
          <option value="">Select Gender</option>
          {["Male", "Female", "Other"].map((gender) => (
            <option key={gender} value={gender}>
              {gender}
            </option>
          ))}
        </select>
      </div>

      <div className="input-wrapper">
        <label className="input-label">Transport</label>
        <select
          name="transport"
          value={formData.transport}
          onChange={handleChange}
          className="select-field"
        >
          <option value="">Select Transport</option>
          {["Car", "Bus", "Train", "Flight", "Bike", "Boat"].map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className="input-wrapper">
        <label className="input-label">Interest</label>
        <Select
          isMulti
          options={interestOptions}
          value={formData.interests}
          onChange={handleInterestsChange}
          placeholder="Select Interests"
          className="react-select-container"
          classNamePrefix="react-select"
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">State</label>
        <Select
          options={states}
          value={formData.state}
          onChange={handleStateChange}
          placeholder="Select State"
          className="react-select-container"
          classNamePrefix="react-select"
          required
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">City</label>
        <Select
          options={cities}
          value={formData.city}
          onChange={handleCityChange}
          placeholder="Select City"
          isDisabled={!formData.state}
          className="react-select-container"
          classNamePrefix="react-select"
          required
        />
      </div>

      <div className="input-wrapper">
        <label className="input-label">Upload Images</label>
        <input
          type="file"
          multiple
          onChange={handleImageChange}
          accept="image/*"
          className="file-input"
        />
      </div>

      <div className="button-wrapper">
        <button className="close-button" onClick={() => navigate(-1)}>
          Close
        </button>
        <button
          className="submit-button"
          onClick={addEvent}
          disabled={isLoading}
        >
          {isLoading ? "Submitting..." : "Submit Event"}
        </button>
      </div>
    </div>
  );
};

export default AddEvents;
