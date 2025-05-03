import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FaRegHeart, FaCalendarAlt } from "react-icons/fa";
import Select from "react-select";
import { State, City } from "country-state-city";
import Header from "./Header";
import "./Listings.css";

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false); // New: For Join button loading state
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);

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

  const fetchEvents = async () => {
    setLoading(true);
    const stateParam = selectedState ? `&States=${selectedState.label}` : "";
    const cityParam = selectedCity ? `&City=${selectedCity.value}` : "";

    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/getEvents?page=${page}&limit=${limit}${stateParam}${cityParam}`
      );
      const result = await response.json();
      if (Array.isArray(result.travel)) {
        setListings(result.travel);
        console.log(listings)
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        setListings([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to load events. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendmessagetocreator = async (eventId, userId) => {
    console.log(eventId,"***************** eventId")
    console.log(userId,"***************** userId")
    setJoining(true);
    try {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const raw = JSON.stringify({
        eventId,
        userId,
      });

      const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      const response = await fetch(
        "http://localhost:4000/api/auth/sendUserDetailsToEventCreator",
        requestOptions
      );
      const result = await response.json();
      if (response.ok) {
        alert("Successfully joined the event! Creator has been notified.");
        setSelectedListing(null); // Close modal on success
        document.getElementById("eventModal")?.classList?.remove("show");
        document.body?.classList.remove("modal-open");
        document.querySelector(".modal-backdrop")?.remove();
      } else {
        throw new Error(result.message || "Failed to join event");
      }
    } catch (error) {
      console.error("Error sending message to creator:", error);
      alert("Failed to join the event. Please try again.");
    } finally {
      setJoining(false);
    }
  };

  const handlePrevious = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage(page + 1);
  };

  useEffect(() => {
    fetchEvents();
  }, [page, selectedState, selectedCity]);

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
              className="mt-3 city-select"
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
                  opacity: !selectedState ? 0.6 : 1,
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
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p>Loading events...</p>
            </div>
          ) : listings.length > 0 ? (
            listings.map((listing, index) =>{
              // console.log(listing,"***** listing")
              return  (
                <ListingCard
                  key={index}
                  myId={listing._id}
                  listing={listing}
                  setSelectedListing={setSelectedListing}
                  sendmessagetocreator={sendmessagetocreator}
                  joining={joining}
                />
              )
            })
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

        {selectedListing && (
          <div
            className="modal fade"
            id="eventModal"
            tabIndex="-1"
            aria-labelledby="eventModalLabel"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-lg">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="eventModalLabel">
                    {selectedListing.City} - Event Details
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => setSelectedListing(null)}
                  ></button>
                </div>
                <div className="modal-body">
                  {selectedListing.img && selectedListing.img.length > 0 ? (
                    <div
                      id="eventCarousel"
                      className="carousel slide mb-3"
                      data-bs-ride="carousel"
                    >
                      <div className="carousel-inner">
                        {selectedListing.img.map((img, index) => (
                          <div
                            className={`carousel-item ${
                              index === 0 ? "active" : ""
                            }`}
                            key={index}
                          >
                            <img
                              src={`http://localhost:4000/${img}`}
                              className="d-block w-100"
                              alt={`Event ${index}`}
                              style={{ height: "300px", objectFit: "cover" }}
                            />
                          </div>
                        ))}
                      </div>
                      {selectedListing.img.length > 1 && (
                        <>
                          <button
                            className="carousel-control-prev"
                            type="button"
                            data-bs-target="#eventCarousel"
                            data-bs-slide="prev"
                          >
                            <span
                              className="carousel-control-prev-icon"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Previous</span>
                          </button>
                          <button
                            className="carousel-control-next"
                            type="button"
                            data-bs-target="#eventCarousel"
                            data-bs-slide="next"
                          >
                            <span
                              className="carousel-control-next-icon"
                              aria-hidden="true"
                            ></span>
                            <span className="visually-hidden">Next</span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <p>No images available</p>
                  )}

                  <h5>{selectedListing.City}</h5>
                  <p>
                    <FaCalendarAlt className="me-2" />
                    {new Date(
                      selectedListing.startDate
                    ).toLocaleDateString()} -{" "}
                    {new Date(selectedListing.endDate).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Location:</strong> {selectedListing.City},{" "}
                    {selectedListing.States}, India
                  </p>
                  <p>
                    <strong>Description:</strong>{" "}
                    {selectedListing.travelDescription}
                  </p>
                  <p>
                    <strong>Hosted By:</strong> {selectedListing.travelAuthor}
                  </p>
                  <p>
                    <strong>Travel Buddy Age:</strong>{" "}
                    {selectedListing.travelBuddyAge}
                  </p>
                  <p>
                    <strong>Travel Buddy Gender:</strong>{" "}
                    {selectedListing.travelBuddyGender}
                  </p>
                  <p>
                    <strong>Travel Buddy Interest:</strong>{" "}
                    {selectedListing.interests}
                  </p>
                  <p>
                    <strong>Travel Buddy Transport:</strong>{" "}
                    {selectedListing.transport}
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    data-bs-dismiss="modal"
                    onClick={() => setSelectedListing(null)}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      const userId = localStorage.getItem("userData");
                      console.log(userId._id,"***************** userId")
                      // if (!userId._id) {
                      //   alert("Please log in to join the event.");
                      //   return;
                      // }
                      sendmessagetocreator(selectedListing._id, userId._id);
                    }}
                    disabled={joining}
                  >
                    {joining ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Joining...
                      </>
                    ) : (
                      "Join Event"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

const ListingCard = ({myId, listing, setSelectedListing, sendmessagetocreator, joining }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  console.log(myId,"********** myId")

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === listing.img.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? listing.img.length - 1 : prevIndex - 1
    );
  };

  const handleCityClick = (e) => {
    e.stopPropagation();
    setSelectedListing(listing);
    const modal = new window.bootstrap.Modal(
      document.getElementById("eventModal")
    );
    modal.show();
  };

  const handleJoin = () => {
    const userId = JSON.parse(localStorage.getItem("userData"));
    console.log(userId,"******* myuserId");
    console.log(myId,"******************** myId");
    // if (!userId._id) {
    //   alert("Please log in to join the event.");
    //   return;
    // }
    sendmessagetocreator(myId, userId._id);
  };

  return (
    <div className="event-card" style={{ cursor: "default" }}>
      <div className="image-container">
        {listing.img && listing.img.length > 0 ? (
          <>
            <img
              src={`http://localhost:4000/${listing.img[currentImageIndex]}`}
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

      <h3
        style={{ cursor: "pointer" }}
        onClick={handleCityClick}
        data-bs-toggle="modal"
        data-bs-target="#eventModal"
      >
        {listing.City}
      </h3>

      <div className="event-location">
        <span className="state-name">🏙️ {listing.States}</span> |{" "}
        <span className="city-name">India</span>
      </div>

      <p
        className="event-description text-truncate"
        style={{
          width: "100%",
          maxWidth: "28rem",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {listing.travelDescription}
      </p>

      <div className="event-footer">
        <div className="event-host">By {listing.travelAuthor || "Unknown"}</div>
        <div className="event-actions">
          <button
            className="join-btn"
            onClick={handleJoin}
            disabled={joining}
          >
            {/* {joining ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Joining...
              </>
            ) : (
              "Join"
            )} */}
            join
          </button>
        </div>
      </div>
    </div>
  );
};

export default Listings;