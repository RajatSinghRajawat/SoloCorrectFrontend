import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./Wanderlist.css";
import Header from "./Header";
import { myData } from "../App";
import Select from "react-select";
import { State, City } from "country-state-city";
import "../App.css";

const Wonderlust = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [myState, setMyState] = useContext(myData); // Assuming myData includes user role
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [admin, Setadmin] = useState("");
  const [checkState, setState] = useState();
  const fetchBlogs = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/getblogs?page=${page}&limit=6&States=${myState.state}&City=${myState.city}`
      );
      const result = await response.json();

      if (result.blogs) {
        setData(result.blogs);
        setTotalPages(result.totalPages);
        setCurrentImageIndex(
          result.blogs.reduce((acc, blog) => ({ ...acc, [blog._id]: 0 }), {})
        );
      } else {
        console.error("Failed to fetch blogs:", result.message);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const cheack = () => {
    const a = JSON.parse(localStorage.getItem("userData"));
    const getEmail = a.email;
    const adminEmail = admin.admin[0].email;
    setState(getEmail == adminEmail);
    if (checkState) {
      navigate("/add/blogs");
    } else {
      alert("you are not admin");
    }
  };

  const getadmin = () => {
    try {
      const requestOptions = {
        method: "POST",
        redirect: "follow", 
      };

      fetch("http://localhost:4000/api/auth/adminget", requestOptions)
        .then((response) => response.json())
        .then((result) => {
          Setadmin(result);
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.log(error);
    }
  };

  console.log(admin, "admin");

  useEffect(() => {
    fetchBlogs();
    getadmin();
  }, [myState, page]);

  const nextImage = (id, images) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] + 1 < images.length ? prev[id] + 1 : 0,
    }));
  };

  const prevImage = (id, images) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: prev[id] - 1 >= 0 ? prev[id] - 1 : images.length - 1,
    }));
  };

  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  // Fetching all states of India dynamically
  const states = State.getStatesOfCountry("IN").map((state) => ({
    value: state.isoCode,
    label: state.name,
  }));

  // Fetch cities based on selected state
  const cities = Array.isArray(
    City.getCitiesOfState("IN", selectedState?.value)
  )
    ? City.getCitiesOfState("IN", selectedState?.value).map((city) => ({
        value: city.name,
        label: city.name,
      }))
    : [];

  return (
    <div>
      <Header />
      <div className="wander-container">
        {/* Header Section */}
        <header className="wander-header">
          <div className="wander-logo">
            <span className="wander-icon">🌍</span> WANDERLIST
          </div>
          {/* <button className="wander-add-place-btn">+ Add Place</button>
          <div className="wander-profile-pic"></div> */}
        </header>

        {/* Main Content Section */}
        <main className="wander-main-content">
          <h1>Your Lifetime Travel Bucket List</h1>
          <p>
            Discover the most breathtaking places on Earth that you must visit
            at least once in your lifetime. Save your favorites and track your
            travel dreams.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="wander-buttons">
              {/* <button className="wander-explore-btn">Explore</button> */}
              <button className="wander-my-list-btn">Explore My List</button>
            </div>
            <div className="wander-filter-row">
              <Select
                options={states}
                value={selectedState}
                onChange={(state) => {
                  setSelectedState(state);
                  setMyState((prev) => ({
                    ...prev,
                    state: state.label,
                    city: "",
                  }));
                  setSelectedCity(null);
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
                options={cities}
                value={selectedCity}
                onChange={(city) => {
                  setSelectedCity(city);
                  setMyState((prev) => ({ ...prev, city: city.label }));
                }}
                placeholder="Select a city..."
                isDisabled={!selectedState}
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

              {/* Conditionally render the Create Blog button for admins */}
              {/* {myState?.role === "admin" && (
                <NavLink to="/add/blogs">
                  <button className="btn btn-warning">✍️ Create Blog</button>
                </NavLink>
              )} */}

              <NavLink to="/add/blogs">
                <button onClick={cheack} className="wander-filter-btn">
                  ✍️ Create Blog
                </button>
              </NavLink>
            </div>
          </div>
        </main>

        {/* Filter Section */}
      </div>
      <div className="container py-5">
        <div className="row g-4">
          {data.length > 0 ? (
            data.map((res) => (
              <div key={res?._id} className="col-lg-4 col-md-6 col-sm-12">
                <div className="card blog-card shadow-lg border-0 rounded-4">
                  <div className="image-container position-relative">
                    <img
                      src={`http://localhost:4000/${
                        res?.img[currentImageIndex[res?._id] || 0]
                      }`}
                      alt={`Image ${currentImageIndex[res?._id] + 1 || 1}`}
                      className="card-img-top rounded-top-4"
                      style={{ height: "250px", objectFit: "cover" }}
                    />
                    {res?.img.length > 1 && (
                      <>
                        <button
                          className="prev-btn"
                          onClick={() => prevImage(res._id, res.img)}
                        >
                          ◀
                        </button>
                        <button
                          className="next-btn"
                          onClick={() => nextImage(res._id, res.img)}
                        >
                          ▶
                        </button>
                      </>
                    )}
                  </div>

                  <div
                    className="card-body p-4 d-flex flex-column justify-content-between"
                    style={{ minHeight: "250px" }}
                  >
                    <div>
                      <span className={`badge bg-${res?.categoryColor} mb-2`}>
                        {res?.category}
                      </span>
                      <h5 className="card-title fw-bold text-truncate">
                        {res?.title}
                      </h5>
                      <p className="card-text text-muted text-truncate">
                        {res?.shortdescription}
                      </p>
                      <div
                        className="d-flex text-muted"
                        style={{ textTransform: "capitalize" }}
                      >
                        <p className="me-2">{res?.States},</p>
                        <p>{res?.City}</p>
                      </div>
                    </div>

                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={() => navigate(`/blogs/${res?._id}`)}
                    >
                      Read More
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h4 className="text-white mt-5 pt-5 text-center">NO blogs found</h4>
          )}
        </div>

        {totalPages > 1 && (
          <div className="pagination-controls d-flex justify-content-center mt-4">
            <button
              className="btn btn-secondary me-2"
              onClick={() => setPage(page - 1)}
              disabled={page === 1}
            >
              ◀
            </button>
            <span className="text-light">
              Page {page} of {totalPages}
            </span>
            <button
              className="btn btn-secondary ms-2"
              onClick={() => setPage(page + 1)}
              disabled={page === totalPages}
            >
              ▶
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wonderlust;
