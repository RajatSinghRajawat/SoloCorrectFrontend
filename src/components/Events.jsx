import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaRegHeart, FaCalendarAlt } from "react-icons/fa";
import "./Listings.css";
import Header from "./Header";
import Select from "react-select";
import { State, City } from "country-state-city";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const states = State.getStatesOfCountry("IN").map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));

  const cities = selectedState
    ? City.getCitiesOfState("IN", selectedState.value).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : [];

  useEffect(() => {
    fetchEvents();
  }, [page, selectedState, selectedCity]);

  const fetchEvents = async () => {
    setLoading(true);
    const stateParam = selectedState ? `&States=${selectedState.label}` : "";
    const cityParam = selectedCity ? `&City=${selectedCity.value}` : "";

    try {
      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/getEvents?page=${page}&limit=${limit}${stateParam}${cityParam}`
      );
      const result = await response.json();

      if (Array.isArray(result.travel)) {
        setListings(result.travel);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  return (
    <>
      <Header />
      <div className="container-fluid1">
        <div className="header-container">
          <header>
            <h1>Upcoming Travel Events</h1>
            <p>Discover amazing travel experiences across India</p>
          </header>

          <div className="filters d-flex gap-3 flex-wrap">
            <Select
              className="mt-3 state-select"
              options={states}
              value={selectedState}
              onChange={(state) => {
                setSelectedState(state);
                setSelectedCity(null);
                setPage(1);
              }}
              placeholder="Select a state..."
              styles={{
                container: (base) => ({
                  ...base,
                  width: "250px",
                  borderRadius: "8px",
                }),
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#1e1e1e",
                  border: state.isFocused
                    ? "2px solid #ff9800"
                    : "1px solid #444",
                  boxShadow: state.isFocused
                    ? "0 0 5px rgba(255,152,0,0.5)"
                    : "none",
                  "&:hover": { border: "2px solid #ff9800" },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#fff",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#2a2a2a",
                  borderRadius: "6px",
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected
                    ? "#ff9800"
                    : isFocused
                    ? "#333"
                    : "#2a2a2a",
                  color: isSelected ? "#000" : "#fff",
                  cursor: "pointer",
                }),
              }}
            />

            <Select
              className="mt-3 city-select text-black"
              options={cities}
              value={selectedCity}
              onChange={(city) => {
                setSelectedCity(city);
                setPage(1);
              }}
              isDisabled={!selectedState}
              placeholder="Select a city..."
              
              styles={{
                container: (base) => ({
                  ...base,
                  width: "250px",
                  borderRadius: "8px",
                  opacity: !selectedState ? 0.6 : 1, // Disabled effect
                  cursor: !selectedState ? "not-allowed" : "pointer",
                }),
                control: (base, state) => ({
                  ...base,
                  backgroundColor: "#1e1e1e",
                  border: state.isFocused
                    ? "2px solid #ff9800"
                    : "1px solid #444",
                  boxShadow: state.isFocused
                    ? "0 0 5px rgba(255,152,0,0.5)"
                    : "none",
                  "&:hover": { border: "2px solid #ff9800" },
                }),
                singleValue: (base) => ({
                  ...base,
                  color: "#fff",
                }),
                menu: (base) => ({
                  ...base,
                  backgroundColor: "#2a2a2a",
                  borderRadius: "6px",
                }),
                option: (base, { isFocused, isSelected }) => ({
                  ...base,
                  backgroundColor: isSelected
                    ? "#ff9800"
                    : isFocused
                    ? "#333"
                    : "#2a2a2a",
                  color: isSelected ? "#000" : "#fff",
                  cursor: "pointer",
                }),
              }}
            />

            <NavLink to="/add/Events" className="mt-3">
              <button className="btn btn-primary create-blog-btn">
                ✍️ Create Events
              </button>
            </NavLink>
          </div>
        </div>

        <div className="listings-container">
          {loading ? (
            <p>Loading events...</p>
          ) : listings.length > 0 ? (
            listings.map((listing, index) => (
              <ListingCard key={index} listing={listing} />
            ))
          ) : (
            <p>No events found.</p>
          )}
        </div>

        <div className="pagination">
          <button disabled={page === 1} onClick={handlePrevious}>
            ◀
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={handleNext}>
            ▶
          </button>
        </div>
      </div>
    </>
  );
};

const ListingCard = ({ listing }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.img.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.img.length - 1 : prevIndex - 1
    );
  };

  return (
    <div className="event-card">
      <div className="image-container">
        {listing.img && listing.img.length > 0 ? (
          <>
            <img
              src={`http://82.29.166.100:4000/${listing.img[currentImageIndex]}`}
              alt="Event"
            />
            {listing.img.length > 1 && (
              <>
                <button className="prev-btn" onClick={prevImage}>
                  ◀
                </button>
                <button className="next-btn" onClick={nextImage}>
                  ▶
                </button>
              </>
            )}
          </>
        ) : (
          <p>No image available</p>
        )}
      </div>

      <div className="event-date">
        <FaCalendarAlt /> {new Date(listing.startDate).toLocaleDateString()} -{" "}
        {new Date(listing.endDate).toLocaleDateString()}
      </div>

      <h3>{listing.City}</h3>

      <div className="event-location">
        <span className="state-name">🏙️ {listing.States}</span> |{" "}
        <span className="city-name">India</span>
      </div>

      <p className="event-description">{listing.travelDescription}</p>

      <div className="event-footer">
        <div className="event-host">By {listing.travelAuthor || "Unknown"}</div>
        <div className="event-actions">
          {/* <FaRegHeart /> {listing.likes || 0} */}
          <button className="join-btn">Join</button>
        </div>
      </div>
    </div>
  );
};

export default Listings;
