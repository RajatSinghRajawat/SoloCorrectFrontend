import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaRegHeart, FaCalendarAlt } from "react-icons/fa";
import Select from "react-select";
import { State, City } from "country-state-city";
import Header from "./Header";
import "./Listings.css";

const Events = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 9;
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedListing, setSelectedListing] = useState(null);
  const [sortOption, setSortOption] = useState(null);
  const navigate = useNavigate();

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

  const sortOptions = [
    { value: "mostLiked", label: "Most Liked" },
    { value: "lessLiked", label: "Less Liked" },
  ];

  const fetchEvents = async () => {
    setLoading(true);
    const stateParam = selectedState ? `&States=${selectedState.label}` : "";
    const cityParam = selectedCity ? `&City=${selectedCity.value}` : "";
    const sortParam = sortOption
      ? sortOption.value === "mostLiked"
        ? "&sort=likes:desc,createdAt:desc"
        : "&sort=likes:asc,createdAt:desc"
      : "&sort=createdAt:desc";
    const mostLikedParam =
      sortOption?.value === "mostLiked" ? "&mostLiked=true" : "";

    try {
      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/getEvents?page=${page}&limit=${limit}${stateParam}${cityParam}${mostLikedParam}${sortParam}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result = await response.json();
      console.log("API Response:", result);
      if (Array.isArray(result.travel)) {
        setListings(result.travel);
        setTotalPages(result.pagination?.totalPages || 1);
      } else {
        console.warn("No travel array in response:", result);
        setListings([]);
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      alert("Failed to load events. Please try again.");
      setListings([]);
    } finally {
      setLoading(false);
    }
  };

  const sendmessagetocreator = async (eventId, userId) => {
    console.log(eventId, "***************** eventId");
    console.log(userId, "***************** userId");
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
        "http://82.29.166.100:4000/api/auth/sendUserDetailsToEventCreator",
        requestOptions
      );
      const result = await response.json();
      if (response.ok) {
        alert("Successfully joined the event! Creator has been notified.");
        setSelectedListing(null);
        document.getElementById("eventModal")?.classList?.remove("show");
        document.body?.classList.remove("modal-open");
        document.querySelector(".modal-backdrop")?.remove();
      } else {
        throw new Error(result.message || "Failed to join event");
      }
    } catch (error) {
      console.error("Error sending message to creator:", error);
      alert("Failed to join the event. Please try again.");
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
  }, [page, selectedState, selectedCity, sortOption]);

  // Define ListingCard component within Events
  const ListingCard = ({ listing }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [joining, setJoining] = useState(false);

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

    const handleCityClick = () => {
      setSelectedListing(listing);
      const modal = new window.bootstrap.Modal(
        document.getElementById("eventModal")
      );
      modal.show();
    };

    const handleJoin = () => {
      const userId = JSON.parse(localStorage.getItem("userData"));
      if (!userId?._id) {
        alert("Please log in to join the event.");
        return;
      }
      setJoining(true);
      sendmessagetocreator(listing._id, userId._id).finally(() =>
        setJoining(false)
      );
    };

    return (
      <div className="container my-4">
        <div className="row">
          <div className="col-md-6 col-lg-4 event-card  ">
            <div
              className=""
              style={{ cursor: "default"  }}
              key={listing._id}
            >
              <div className="image-container position-relative">
                {listing.img && listing.img.length > 0 ? (
                  <>
                    <img
                      src={`http://82.29.166.100:4000/${listing.img[currentImageIndex]}`}
                      alt="Event"
                      className="card-img-top"
                    />
                    {listing.img.length > 1 && (
                      <>
                        <button
                          className="btn btn-sm btn-light position-absolute top-50 start-0 translate-middle-y"
                          onClick={prevImage}
                        >
                          ◀
                        </button>
                        <button
                          className="btn btn-sm btn-light position-absolute top-50 end-0 translate-middle-y"
                          onClick={nextImage}
                        >
                          ▶
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <p className="text-center">No image available</p>
                )}
              </div>

              <div className="card-body">
                <div className="event-date mb-2">
                  <FaCalendarAlt />{" "}
                  {new Date(listing.startDate).toLocaleDateString()} -{" "}
                  {new Date(listing.endDate).toLocaleDateString()}
                </div>

                <h5
                  className="card-title"
                  style={{ cursor: "pointer" }}
                  onClick={handleCityClick}
                >
                  {listing.City}
                </h5>

                <div className="event-location mb-2">
                  <span className="state-name">🏙️ {listing.States}</span> |{" "}
                  <span className="city-name">India</span>
                </div>

                <p
                  className="card-text text-truncate"
                  style={{
                    width: "100%",
                    maxWidth: "100%",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {listing.travelDescription}
                </p>

                <div className="event-footer d-flex justify-content-between align-items-center mt-3">
                  <div className="event-host">
                    By {listing.travelAuthor || "Unknown"}
                  </div>
                  <button
                    className="btn btn-success"
                    onClick={handleJoin}
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
                      "Join"
                    )}
                  </button>
                </div>

                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={() => navigate(`/events/${listing._id}`)}
                >
                  Read More
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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

            <Select
              className="mt-3 sort-select"
              options={sortOptions}
              value={sortOption}
              onChange={(option) => {
                setSortOption(option);
                setPage(1);
              }}
              placeholder="Sort by..."
              isClearable
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

            <NavLink to="/add/Events" className="mt-3">
              <button className="btn btn-primary create-blog-btn">
                ✍️ Create Events
              </button>
            </NavLink>
          </div>
        </div>

        <div className="container my-4">
          <div className="row">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading events...</p>
              </div>
            ) : listings.length > 0 ? (
              listings.map((listing) => (
                <div
                  className="col-12 col-md-6 col-lg-4 mb-4"
                  key={listing._id}
                >
                  <ListingCard listing={listing} />
                </div>
              ))
            ) : (
              <div className="col-12 text-center">
                <p>
                  No events found. Try adjusting your filters or creating a new
                  event.
                </p>
              </div>
            )}
          </div>
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
                              src={`http://82.29.166.100:4000/${img}`}
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
                      const userId = JSON.parse(
                        localStorage.getItem("userData")
                      );
                      if (!userId?._id) {
                        alert("Please log in to join the event.");
                        return;
                      }
                      sendmessagetocreator(selectedListing._id, userId._id);
                    }}
                  >
                    Join
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

export default Events;
