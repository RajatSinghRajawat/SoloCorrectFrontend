import React, { useState, useEffect, useCallback } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Country, City } from "country-state-city";
import { FaHeart, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import {
  FacebookShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  LinkedinShareButton,
  FacebookIcon,
  TwitterIcon,
  WhatsappIcon,
  LinkedinIcon,
} from "react-share";
import Header from "./Header";
import logo from "../components/images/logo.png";
import "./all.css";

// Base URL for API
const API_BASE_URL = "http://82.29.166.100:4000";

const AccountProfile = () => {
  // State variables
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    committingName: "",
    textarea: "",
    country: "",
    city: "",
    travelStyle: "",
    budgetRange: "",
    foodPreference: "",
    hiking: "",
    profileImage: "",
    following: 0,
    followers: 0,
  });
  const [file, setFile] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("My Blogs");
  const [blogs, setBlogs] = useState([]);
  const [events, setEvents] = useState([]);
  const [interestedUsers, setInterestedUsers] = useState({}); // New state for interested users
  const [totalPages, setTotalPages] = useState({ blogs: 1, events: 1 });
  const [page, setPage] = useState({ blogs: 1, events: 1 });
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [showShareOptions, setShowShareOptions] = useState(null);
  const navigate = useNavigate();

  // User data from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userid = userData?.user?._id || userData?._id || null;
  const token = userData?.token; // Assuming token is stored in userData

  // File input handler
  const handleFileChange = (e) => setFile(e.target.files[0]);

  // Fetch user data from API
  const fetchUserData = useCallback(async () => {
    if (!userid) {
      toast.error("Please log in to view profile");
      navigate("/login");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/user/${userid}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      if (result.user) {
        setFormData({
          name: result.user.name || "",
          email: result.user.email || "",
          committingName: result.user.committingName || "",
          textarea: result.user.textarea || "",
          country: result.user.country || "",
          city: result.user.city || "",
          travelStyle: result.user.travelStyle || "",
          budgetRange: result.user.budgetRange || "",
          foodPreference: result.user.foodPreference || "",
          hiking: result.user.hiking || "",
          img: result.user.img || "",
          following: result.user.following || 0,
          followers: result.user.followers || 0,
        });
      } else {
        toast.error(result.message || "Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error.message);
      toast.error(`Error fetching user data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  }, [userid, navigate, token]);

  // Fetch user blogs with pagination
  const fetchBlogs = useCallback(async () => {
    if (!userid) {
      toast.error("Please log in to view blogs");
      return;
    }
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.blogs,
        limit: 9,
        userid,
      }).toString();
      const response = await fetch(`${API_BASE_URL}/api/auth/getblogs?${query}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      if (result.blogs && Array.isArray(result.blogs)) {
        setBlogs(result.blogs);
        setTotalPages((prev) => ({ ...prev, blogs: result.totalPages || 1 }));
      } else {
        toast.error(result.message || "Failed to fetch blogs");
        setBlogs([]);
        setTotalPages((prev) => ({ ...prev, blogs: 1 }));
      }
    } catch (error) {
      console.error("Fetch Blogs Error:", error.message);
      toast.error(`Error fetching blogs: ${error.message}`);
      setBlogs([]);
      setTotalPages((prev) => ({ ...prev, blogs: 1 }));
    } finally {
      setLoading(false);
    }
  }, [userid, page.blogs, token]);

  // Fetch user events with pagination
  const fetchEvents = useCallback(async () => {
    if (!userid) {
      toast.error("Please log in to view events");
      return;
    }
    setLoading(true);
    try {
      const query = new URLSearchParams({
        page: page.events,
        limit: 9,
        userid,
      }).toString();
      const response = await fetch(`${API_BASE_URL}/api/auth/getEvents?${query}`, {
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      if (result.travel && Array.isArray(result.travel)) {
        setEvents(result.travel);
        setTotalPages((prev) => ({ ...prev, events: result.totalPages || 1 }));
        // Fetch interested users for each event
        result.travel.forEach((event) => {
          fetchInterestedUsers(event._id);
        });
      } else {
        toast.error(result.message || "Failed to fetch events");
        setEvents([]);
        setTotalPages((prev) => ({ ...prev, events: 1 }));
      }
    } catch (error) {
      console.error("Fetch Events Error:", error.message);
      toast.error(`Error fetching events: ${error.message}`);
      setEvents([]);
      setTotalPages((prev) => ({ ...prev, events: 1 }));
    } finally {
      setLoading(false);
    }
  }, [userid, page.events, token]);

  // Fetch interested users for a specific event
  const fetchInterestedUsers = useCallback(
    async (eventId) => {
      if (!token) {
        toast.error("Please log in to view interested users");
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/interested-users/${eventId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const result = await response.json();
        if (result.interestedUsers && Array.isArray(result.interestedUsers)) {
          setInterestedUsers((prev) => ({
            ...prev,
            [eventId]: result.interestedUsers,
          }));
        } else {
          setInterestedUsers((prev) => ({
            ...prev,
            [eventId]: [],
          }));
          toast.error(result.message || "No interested users found");
        }
      } catch (error) {
        console.error("Fetch Interested Users Error:", error.message);
        toast.error(`Error fetching interested users: ${error.message}`);
        setInterestedUsers((prev) => ({
          ...prev,
          [eventId]: [],
        }));
      }
    },
    [token]
  );

  // Handle like/unlike blog
  const handleLike = async (blogId) => {
    if (!userid) {
      toast.error("Please log in to like a blog");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/like/${blogId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ userid }),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      toast.success("Like updated successfully");
      fetchBlogs();
    } catch (error) {
      console.error("Like API Error:", error.message);
      toast.error(`Error updating like: ${error.message}`);
    }
  };

  // Image navigation functions
  const nextImage = (id, images) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: (prev[id] + 1) % (images?.length || 1),
    }));
  };

  const prevImage = (id, images) => {
    setCurrentImageIndex((prev) => ({
      ...prev,
      [id]: (prev[id] - 1 + (images?.length || 1)) % (images?.length || 1),
    }));
  };

  // Toggle share options
  const toggleShare = (itemId) => {
    setShowShareOptions((prev) => (prev === itemId ? null : itemId));
  };

  // Update cities based on selected country
  useEffect(() => {
    if (formData.country) {
      const selectedCities = City.getCitiesOfCountry(formData.country) || [];
      setCities(selectedCities);
    } else {
      setCities([]);
    }
  }, [formData.country]);

  // Fetch user data on component mount
  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  // Fetch blogs or events when tab or page changes
  useEffect(() => {
    if (activeTab === "My Blogs") {
      fetchBlogs();
    } else if (activeTab === "My Events") {
      fetchEvents();
    }
  }, [activeTab, fetchBlogs, fetchEvents]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Update profile with API
  const updateProfile = async () => {
    if (!userid) {
      toast.error("Please log in to update profile");
      return;
    }
    setLoading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("email", formData.email);
      formDataToSend.append("name", formData.name);
      if (file) formDataToSend.append("img", file);
      formDataToSend.append("textarea", formData.textarea);
      formDataToSend.append("committingName", formData.committingName);
      formDataToSend.append("country", formData.country);
      formDataToSend.append("city", formData.city);
      formDataToSend.append("travelStyle", formData.travelStyle);
      formDataToSend.append("budgetRange", formData.budgetRange);
      formDataToSend.append("foodPreference", formData.foodPreference);
      formDataToSend.append("hiking", formData.hiking);

      const response = await fetch(`${API_BASE_URL}/api/auth/update/${userid}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formDataToSend,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result?.message || "Profile updated successfully");
        localStorage.setItem("userData", JSON.stringify(result.user));
        await fetchUserData();
        setFile(null);
      } else {
        toast.error(result?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      toast.error(`Error updating profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Loading spinner
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
          <img src={logo} alt="Loading" className="spinner-logo" />
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar
        theme="dark"
        closeOnClick
        pauseOnHover
      />
      <Header />
      <div className="profile-container">
        <h1 className="account-title">Your Account</h1>

        <div className="profile-card">
          <div className="profile-header">
            <img
              src={
                formData.img
                  ? `${API_BASE_URL}/${formData.img}`
                  : "https://via.placeholder.com/80?text=Avatar"
              }
              alt="Profile"
              className="profile-image"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/80?text=Avatar";
              }}
            />
            <div className="profile-info">
              <h2 className="profile-name">{formData.name || "Guest User"}</h2>
              <p className="profile-location">
                📍 {formData.city || "Unknown"}, {formData.country || "Unknown"}
              </p>
              <div className="profile-stats">
                <span>
                  <strong>{blogs.length}</strong> Blogs
                </span>
                <span>
                  <strong>{formData.following}</strong> Following
                </span>
                <span>
                  <strong>{formData.followers}</strong> Followers
                </span>
              </div>
              <p className="profile-bio">{formData.textarea || "No bio available."}</p>
            </div>
            <button
              onClick={() => setActiveTab("My Settings")}
              className="edit-profile-btn"
              aria-label="Edit profile"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "My Blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("My Blogs")}
            aria-label="View my blogs"
          >
            My Blogs
          </button>
          <button
            className={`tab ${activeTab === "My Events" ? "active" : ""}`}
            onClick={() => setActiveTab("My Events")}
            aria-label="View my events"
          >
            My Events
          </button>
          <button
            className={`tab ${activeTab === "My Interests" ? "active" : ""}`}
            onClick={() => setActiveTab("My Interests")}
            aria-label="View my interests"
          >
            My Interests
          </button>
          <button
            className={`tab ${activeTab === "My Settings" ? "active" : ""}`}
            onClick={() => setActiveTab("My Settings")}
            aria-label="View my settings"
          >
            My Settings
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "My Blogs" && (
            <>
              <h3>My Blogs</h3>
              <NavLink to="/add/blogs">
                <button className="create-blog-btn" aria-label="Create new blog">
                  + Create New Blog
                </button>
              </NavLink>

              <div className="row g-4">
                {blogs.length > 0 ? (
                  blogs.map((blog) => {
                    const shareUrl = `${API_BASE_URL}/blog/${blog._id}`;
                    return (
                      <div key={blog._id} className="col-lg-6 col-md-12 col-sm-12">
                        <div className="bg-white shadow-lg border-0 rounded-4">
                          <div className="image-container position-relative">
                            <img
                              src={`${API_BASE_URL}/${blog.img?.[currentImageIndex[blog._id] || 0] || ""}`}
                              alt={`Image ${currentImageIndex[blog._id] + 1 || 1}`}
                              className="card-img-top rounded-top-4"
                              style={{ height: "250px", objectFit: "cover" }}
                              onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                            />
                            {blog.img?.length > 1 && (
                              <>
                                <button
                                  className="prev-btn"
                                  onClick={() => prevImage(blog._id, blog.img)}
                                  aria-label="Previous image"
                                >
                                  ◀
                                </button>
                                <button
                                  className="next-btn"
                                  onClick={() => nextImage(blog._id, blog.img)}
                                  aria-label="Next image"
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
                              <div className="d-flex align-items-center mb-2">
                                <button
                                  onClick={() => handleLike(blog._id)}
                                  className="btn p-0"
                                  aria-label={blog.likes?.includes(userid) ? "Unlike blog" : "Like blog"}
                                >
                                  {blog.likes?.includes(userid) ? (
                                    <FaHeart color="red" size={20} />
                                  ) : (
                                    <CiHeart size={20} />
                                  )}
                                </button>
                                <span className="ms-2 text-muted">{blog.likes?.length || 0} Likes</span>
                                <div className="ms-2 position-relative">
                                  <FaShare
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() => toggleShare(blog._id)}
                                    aria-label="Share blog"
                                  />
                                  {showShareOptions === blog._id && (
                                    <div className="share-buttons">
                                      <label style={{ fontWeight: "bold" }}>Share this blog:</label>
                                      <a
                                        href={shareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          color: "#007bff",
                                          textDecoration: "underline",
                                          wordBreak: "break-all",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {shareUrl}
                                      </a>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(shareUrl);
                                          toast.success("Link copied to clipboard!");
                                        }}
                                        className="copy-link-btn"
                                        aria-label="Copy share link"
                                      >
                                        Copy Link
                                      </button>
                                      <div className="share-icons">
                                        <FacebookShareButton url={shareUrl} quote="Check out this blog!">
                                          <FacebookIcon size={32} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton url={shareUrl} title="Check out this blog!">
                                          <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                        <WhatsappShareButton url={shareUrl} title="Check out this blog!">
                                          <WhatsappIcon size={32} round />
                                        </WhatsappShareButton>
                                        <LinkedinShareButton url={shareUrl}>
                                          <LinkedinIcon size={32} round />
                                        </LinkedinShareButton>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <h5 className="card-title fw-bold text-truncate">{blog.title || "Untitled"}</h5>
                              <p className="card-text text-muted text-truncate">
                                {blog.shortdescription || "No description available"}
                              </p>
                              <div className="d-flex text-muted" style={{ textTransform: "capitalize" }}>
                                <p className="me-2">{blog.States || "N/A"},</p>
                                <p>{blog.City || "N/A"}</p>
                              </div>
                              <div className="d-flex justify-content-between">
                                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                  By: {blog.author || "Unknown"}
                                </p>
                                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                  Created: {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "N/A"}
                                </p>
                              </div>
                            </div>
                            <button
                              className="btn btn-primary mt-3 w-100"
                              onClick={() => navigate(`/blogs/${blog._id}`)}
                              aria-label={`Read more about ${blog.title || "this blog"}`}
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h4 className="text-white mt-5 pt-5 text-center">No blogs found</h4>
                )}
              </div>

              <div className="pagination-controls d-flex justify-content-center mt-4">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setPage((prev) => ({ ...prev, blogs: Math.max(prev.blogs - 1, 1) }))}
                  disabled={page.blogs === 1}
                  aria-label="Previous page"
                >
                  ◀
                </button>
                <span className="text-light align-self-center">
                  Page {page.blogs} of {totalPages.blogs}
                </span>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => setPage((prev) => ({ ...prev, blogs: Math.min(prev.blogs + 1, totalPages.blogs) }))}
                  disabled={page.blogs === totalPages.blogs}
                  aria-label="Next page"
                >
                  ▶
                </button>
              </div>
            </>
          )}

          {activeTab === "My Events" && (
            <>
              <h3>My Events</h3>
              <NavLink to="/add/events">
                <button className="create-blog-btn" aria-label="Create new event">
                  + Create New Event
                </button>
              </NavLink>

              <div className="row g-4">
                {events.length > 0 ? (
                  events.map((event) => {
                    const shareUrl = `${API_BASE_URL}/event/${event._id}`;
                    const users = interestedUsers[event._id] || [];
                    return (
                      <div key={event._id} className="col-lg-6 col-md-12 col-sm-12">
                        <div className="bg-white shadow-lg border-0 rounded-4">
                          <div className="image-container position-relative">
                            <img
                              src={`${API_BASE_URL}/${event.img?.[currentImageIndex[event._id] || 0] || ""}`}
                              alt={`Image ${currentImageIndex[event._id] + 1 || 1}`}
                              className="card-img-top rounded-top-4"
                              style={{ height: "250px", objectFit: "cover" }}
                              onError={(e) => (e.target.src = "/placeholder-image.jpg")}
                            />
                            {event.img?.length > 1 && (
                              <>
                                <button
                                  className="prev-btn"
                                  onClick={() => prevImage(event._id, event.img)}
                                  aria-label="Previous image"
                                >
                                  ◀
                                </button>
                                <button
                                  className="next-btn"
                                  onClick={() => nextImage(event._id, event.img)}
                                  aria-label="Next image"
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
                              <div className="d-flex align-items-center mb-2">
                                <div className="ms-2 position-relative">
                                  <FaShare
                                    style={{ cursor: "pointer", fontSize: "20px" }}
                                    onClick={() => toggleShare(event._id)}
                                    aria-label="Share event"
                                  />
                                  {showShareOptions === event._id && (
                                    <div className="share-buttons">
                                      <label style={{ fontWeight: "bold" }}>Share this event:</label>
                                      <a
                                        href={shareUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                          color: "#007bff",
                                          textDecoration: "underline",
                                          wordBreak: "break-all",
                                          fontSize: "14px",
                                        }}
                                      >
                                        {shareUrl}
                                      </a>
                                      <button
                                        onClick={() => {
                                          navigator.clipboard.writeText(shareUrl);
                                          toast.success("Link copied to clipboard!");
                                        }}
                                        className="copy-link-btn"
                                        aria-label="Copy share link"
                                      >
                                        Copy Link
                                      </button>
                                      <div className="share-icons">
                                        <FacebookShareButton url={shareUrl} quote="Check out this event!">
                                          <FacebookIcon size={32} round />
                                        </FacebookShareButton>
                                        <TwitterShareButton url={shareUrl} title="Check out this event!">
                                          <TwitterIcon size={32} round />
                                        </TwitterShareButton>
                                        <WhatsappShareButton url={shareUrl} title="Check out this event!">
                                          <WhatsappIcon size={32} round />
                                        </WhatsappShareButton>
                                        <LinkedinShareButton url={shareUrl}>
                                          <LinkedinIcon size={32} round />
                                        </LinkedinShareButton>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <h5 style={{ textTransform: "capitalize" }} className="card-title fw-bold text-truncate">
                                {event.City || "Untitled"}
                              </h5>
                              <div className="d-flex text-muted" style={{ textTransform: "capitalize" }}>
                                <p className="me-2">{event.States || "N/A"},</p>
                                <p>{event.City || "N/A"}</p>
                              </div>
                              <p className="card-text text-muted text-truncate">
                                {event.travelDescription || "No description available"}
                              </p>
                              <div className="d-flex justify-content-between">
                                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                  By: {event.travelAuthor || "Unknown"}
                                </p>
                                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                  Date: {event.startDate ? new Date(event.startDate).toLocaleDateString() : "N/A"}
                                </p>
                              </div>
                              {/* Display interested users */}
                              <div className="mt-2">
                                <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                                  Interested Users: {users.length > 0 ? users.map((user) => user.name).join(", ") : "None"}
                                </p>
                              </div>
                            </div>
                            <button
                              className="btn btn-primary mt-3 w-100"
                              onClick={() => navigate(`/events/${event._id}`)}
                              aria-label={`Read more about ${event.City || "this event"}`}
                            >
                              Read More
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <h4 className="text-white mt-5 pt-5 text-center">No events found</h4>
                )}
              </div>

              <div className="pagination-controls d-flex justify-content-center mt-4">
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => setPage((prev) => ({ ...prev, events: Math.max(prev.events - 1, 1) }))}
                  disabled={page.events === 1}
                  aria-label="Previous page"
                >
                  ◀
                </button>
                <span className="text-light align-self-center">
                  Page {page.events} of {totalPages.events}
                </span>
                <button
                  className="btn btn-secondary ms-2"
                  onClick={() => setPage((prev) => ({ ...prev, events: Math.min(prev.events + 1, totalPages.events) }))}
                  disabled={page.events === totalPages.events}
                  aria-label="Next page"
                >
                  ▶
                </button>
              </div>
            </>
          )}

          {activeTab === "My Interests" && (
            <>
              <h3>My Interests</h3>
              <div className="interests-preview">
                <p>No interests added yet.</p>
              </div>
            </>
          )}

          {activeTab === "My Settings" && (
            <>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h3>My Settings</h3>
                <button
                  className="forgot-password-btn"
                  onClick={() => navigate("/forgot-password/send-otp")}
                  aria-label="Reset password"
                >
                  Forgot Password?
                </button>
              </div>
              <div className="settings-form">
                <div className="input-group">
                  <label htmlFor="profileImage">Profile Image</label>
                  <input
                    type="file"
                    className="input-field p-2"
                    id="profileImage"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    className="input-field p-2"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    name="name"
                    placeholder="Enter your name"
                    aria-label="Name"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    className="input-field p-2"
                    id="email"
                    value={formData.email}
                    readOnly
                    aria-label="Email (read-only)"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="committingName">Commenting Name</label>
                  <input
                    type="text"
                    className="input-field p-2"
                    id="committingName"
                    value={formData.committingName}
                    onChange={handleChange}
                    name="committingName"
                    placeholder="Enter your commenting name"
                    aria-label="Commenting name"
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="country">Country</label>
                  <select
                    className="custom-select"
                    id="country"
                    value={formData.country}
                    onChange={handleChange}
                    name="country"
                    aria-label="Select country"
                  >
                    <option value="" disabled>
                      Select Country
                    </option>
                    {Country.getAllCountries().map((country) => (
                      <option key={country.isoCode} value={country.isoCode}>
                        {country.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="city">City</label>
                  <select
                    className="custom-select"
                    id="city"
                    value={formData.city}
                    onChange={handleChange}
                    name="city"
                    disabled={!formData.country}
                    aria-label="Select city"
                  >
                    <option value="" disabled>
                      Select City
                    </option>
                    {cities.map((city) => (
                      <option key={city.name} value={city.name}>
                        {city.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="travelStyle">Travel Style</label>
                  <select
                    className="custom-select"
                    id="travelStyle"
                    value={formData.travelStyle}
                    onChange={handleChange}
                    name="travelStyle"
                    aria-label="Select travel style"
                  >
                    <option value="" disabled>
                      Select Travel Style
                    </option>
                    <option value="Solo">Solo</option>
                    <option value="Group">Group</option>
                    <option value="Family">Family</option>
                    <option value="Couple">Couple</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="budgetRange">Budget Range</label>
                  <select
                    className="custom-select"
                    id="budgetRange"
                    value={formData.budgetRange}
                    onChange={handleChange}
                    name="budgetRange"
                    aria-label="Select budget range"
                  >
                    <option value="" disabled>
                      Select Budget Range
                    </option>
                    <option value="Low Range">Low Range</option>
                    <option value="Mid Range">Mid Range</option>
                    <option value="High Range">High Range</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="foodPreference">Food Preference</label>
                  <select
                    className="custom-select"
                    id="foodPreference"
                    value={formData.foodPreference}
                    onChange={handleChange}
                    name="foodPreference"
                    aria-label="Select food preference"
                  >
                    <option value="" disabled>
                      Select Food Preference
                    </option>
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="hiking">Activity Interests</label>
                  <select
                    className="custom-select"
                    id="hiking"
                    value={formData.hiking}
                    onChange={handleChange}
                    name="hiking"
                    aria-label="Select activity interest"
                  >
                    <option value="" disabled>
                      Select Activity
                    </option>
                    <option value="Hiking">Hiking</option>
                    <option value="Beaches">Beaches</option>
                    <option value="Nightlife">Nightlife</option>
                  </select>
                </div>
                <div className="input-group">
                  <label htmlFor="textarea">Bio</label>
                  <textarea
                    className="input-field"
                    id="textarea"
                    value={formData.textarea}
                    onChange={handleChange}
                    name="textarea"
                    placeholder="Tell us about yourself"
                    rows={4}
                    aria-label="Bio"
                  />
                </div>
                <Button
                  variant="primary"
                  onClick={updateProfile}
                  disabled={loading}
                  aria-label={loading ? "Updating profile" : "Update profile"}
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AccountProfile;