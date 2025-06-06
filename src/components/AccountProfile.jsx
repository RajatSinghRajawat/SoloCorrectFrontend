/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import "./all.css";
import { toast, ToastContainer } from "react-toastify";
import Header from "./Header";
import { Country, City } from "country-state-city";
import logo from "../components/images/logo.png";
import { NavLink, useNavigate } from "react-router-dom";

const AccountProfile = () => {
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
  });
  const [file, setFile] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("My Blogs");
  const navigate = useNavigate();

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || (!userData.user?._id && !userData._id)) {
        throw new Error("User data not found in localStorage");
      }
      const userId = userData.user?._id || userData._id;
      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/user/${userId}`
      );
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
        });
      } else {
        toast.error("Failed to fetch user data");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("An error occurred while fetching user data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (formData.country) {
      const selectedCities = City.getCitiesOfCountry(formData.country) || [];
      setCities(selectedCities);
    } else {
      setCities([]);
    }
  }, [formData.country]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const UpdateProfile = async () => {
    try {
      setLoading(true);
      const formdata = new FormData();
      formdata.append("email", formData.email);
      formdata.append("name", formData.name);
      if (file) formdata.append("img", file);
      formdata.append("textarea", formData.textarea);
      formdata.append("committingName", formData.committingName);
      formdata.append("country", formData.country);
      formdata.append("city", formData.city);
      formdata.append("travelStyle", formData.travelStyle);
      formdata.append("budgetRange", formData.budgetRange);
      formdata.append("foodPreference", formData.foodPreference);
      formdata.append("hiking", formData.hiking);

      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData || (!userData.user?._id && !userData._id)) {
        throw new Error("User data not found in localStorage");
      }
      const userId = userData.user?._id || userData._id;

      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/update/${userId}`,
        {
          method: "PUT",
          body: formdata,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result?.message || "Profile updated successfully");
        localStorage.setItem("userData", JSON.stringify(result.user));
        await fetchUserData();
      } else {
        toast.error(result?.message || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          width: "100vw",
          backgroundColor: "#000",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <div style={{ position: "relative", width: "150px", height: "150px" }}>
          <div
            style={{
              border: "10px solid #f3f3f3",
              borderTop: "10px solid #3498db",
              borderRadius: "50%",
              width: "150px",
              height: "150px",
              animation: "spin 1s linear infinite",
            }}
          ></div>
          <img
            src={logo}
            alt="Loading"
            style={{
              width: "80px",
              height: "80px",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          />
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <Header className="text-dark" />
      <div className="profile-container">
        <h1 className="account-title">Your Account</h1>

        <div className="profile-card">
          <div className="profile-header">
            <img
              src="https://via.placeholder.com/80"
              alt="Profile"
              className="profile-image"
            />
            <div className="profile-info">
              <h2 className="profile-name">
                {formData.name || "Sarah Explorer"}
              </h2>
              <p className="profile-location">
                📍 {formData.city || "New York"}, {formData.country || "USA"}
              </p>
              <div className="profile-stats">
                <span>
                  <strong>{formData.blogs || "28"}</strong> Blogs
                </span>
                <span>
                  <strong>{formData.following || "142"}</strong> Following
                </span>
                <span>
                  <strong>{formData.followers || "256"}</strong> Followers
                </span>
              </div>
              <p className="profile-bio">
                {formData.textarea ||
                  "Adventure seeker, solo traveler, and content creator. Sharing my journey across the globe one trip at a time."}
              </p>
            </div>
            <button
              onClick={() => setActiveTab("My Settings")}
              className="edit-profile-btn"
            >
              Edit Profile
            </button>
          </div>
        </div>

        <div className="profile-tabs">
          <button
            className={`tab ${activeTab === "My Blogs" ? "active" : ""}`}
            onClick={() => setActiveTab("My Blogs")}
          >
            My Blogs
          </button>
          <button
            className={`tab ${activeTab === "My Events" ? "active" : ""}`}
            onClick={() => setActiveTab("My Events")}
          >
            My Events
          </button>
          <button
            className={`tab ${activeTab === "My Interests" ? "active" : ""}`}
            onClick={() => setActiveTab("My Interests")}
          >
            My Interests
          </button>
          <button
            className={`tab ${activeTab === "My Settings" ? "active" : ""}`}
            onClick={() => setActiveTab("My Settings")}
          >
            My Settings
          </button>
        </div>

        <div className="profile-content">
          {activeTab === "My Blogs" && (
            <>
              <h3>My Blogs</h3>
              <NavLink to="/add/blogs">
                <button className="create-blog-btn">+ Create New Blog</button>
              </NavLink>

              <div className="blog-preview">
                <img
                  src="https://via.placeholder.com/150"
                  alt="Blog Preview"
                  className="blog-image"
                />
                <img
                  src="https://via.placeholder.com/150"
                  alt="Blog Preview"
                  className="blog-image"
                />
              </div>
            </>
          )}

          {activeTab === "My Events" && (
            <>
              <h3>My Events</h3>
              <div className="events-preview">
                <p>No events available yet.</p>
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
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <h3>My Settings</h3>
                <button
                  className="forgot-password-btn"
                  onClick={() => navigate("/forgot-password/send-otp")}
                >
                  Forgot Password?
                </button>
              </div>
              <div className="settings-form">
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
                  >
                    <option value="" disabled>
                      Select Travel Style
                    </option>
                    <option>Solo</option>
                    <option>Group</option>
                    <option>Family</option>
                    <option>Couple</option>
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
                  >
                    <option value="" disabled>
                      Select Budget Range
                    </option>
                    <option>Low Range</option>
                    <option>Mid Range</option>
                    <option>High Range</option>
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
                  >
                    <option value="" disabled>
                      Select Food Preference
                    </option>
                    <option>Vegetarian</option>
                    <option>Vegan</option>
                    <option>Non-Vegetarian</option>
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
                  >
                    <option value="" disabled>
                      Select Activity
                    </option>
                    <option>Hiking</option>
                    <option>Beaches</option>
                    <option>Nightlife</option>
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
                  />
                </div>

                <Button
                  variant="primary"
                  onClick={UpdateProfile}
                  disabled={loading}
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
