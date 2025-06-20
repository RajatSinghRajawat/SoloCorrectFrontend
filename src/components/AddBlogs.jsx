import React, { useRef, useState } from "react";
import "./AddBlogs.css";
import JoditEditor from "jodit-react";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { State, City } from "country-state-city";

const AddBlogs = () => {
  const [title, setTitle] = useState("");
  const [shortDescription, setShortDescription] = useState("");
  const [content, setContent] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [images, setImages] = useState([]);
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const fileInputRef = useRef(null);
  const editor = useRef(null);
  const navigate = useNavigate();

  // State and City options for India
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

  // Handle image uploads with validation
  const handleImageChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const validFiles = [];
    let hasInvalid = false;

    selectedFiles.forEach((file) => {
      if (allowedTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        hasInvalid = true;
      }
    });

    if (hasInvalid) {
      toast.error("Only .avif, .jpeg, .png, or .webp files are allowed.");
    }

    setImages(validFiles);
  };

  const allowedTypes = [
    "image/avif",
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  // API call to create a blog
  const CreateApi = async () => {
    try {
      const token = localStorage.getItem("token");
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Expires at:", new Date(payload.exp * 1000));
      console.log(
        localStorage.getItem("token"),
        "localStorage.getItem('00token)"
      );

      const myHeaders = new Headers();
      myHeaders.append("Authorization", `Bearer ${token}`); //
      if (!token || typeof token !== "string" || token.trim() === "") {
        toast.error("No valid authentication token found. Please log in.");

        return;
      }

      // Validate required fields
      if (!title || !shortDescription || !content) {
        toast.error("Please fill in all required fields!");
        return;
      }

      const formdata = new FormData();
      images.forEach((file) => formdata.append("img", file));
      formdata.append("title", title);
      formdata.append("shortdescription", shortDescription);
      formdata.append("fulldescription", content);
      formdata.append("facebook", socialLink);
      formdata.append("author", author);
      formdata.append("States", selectedState?.label || "");
      formdata.append("City", selectedCity?.label || "");

      // Debug: Log FormData entries
      for (let [key, value] of formdata.entries()) {
        console.log(`${key}: ${value}`);
      }

      setLoading(true);

      const response = await fetch("http://82.29.166.100:4000/api/auth/addblogs", {
        method: "POST",
        headers: myHeaders,
        body: formdata,
      });

      let result;
      try {
        result = await response.json();
        console.log("Response:", result); // Debug: Log response
      } catch (e) {
        console.error("Response is not JSON:", await response.text());
        toast.error("Invalid response from server!");
        setLoading(false);
        return;
      }

      setLoading(false);

      if (response.ok) {
        toast.success("Blog Created Successfully!");
        setTitle("");
        setShortDescription("");
        setContent("");
        setSocialLink("");
        setAuthor("");
        setSelectedCity(null);
        setSelectedState(null);
        setImages([]);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setTimeout(() => navigate("/"), 1000);
      } else {
        toast.error(result?.message || "Failed to create blog!");
      }
      console.log("Response:", result);
    } catch (error) {
      console.error("Fetch Error:", error.message);
      toast.error("Unexpected error occurred!");
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-10 m-auto">
            <div className="blog-form-card fade-in">
              <button
                className="submit-button"
                onClick={() => navigate(-1)}
                style={{
                  position: "absolute",
                  top: "2px",
                  left: "150px",
                  zIndex: 10,
                  padding: "8px 16px",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                  color: "#000",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                ← Back
              </button>

              <div className="mb-4 mt-5 d-flex justify-content-between">
                <h1>Create New Blog</h1>
                <NavLink to="/allblogs">
                  <button className="submit-button">All Blogs</button>
                </NavLink>
              </div>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="form-input"
                  placeholder="Enter blog title"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Social Media Link</label>
                <input
                  type="text"
                  value={socialLink}
                  onChange={(e) => setSocialLink(e.target.value)}
                  className="form-input"
                  placeholder="Enter social media link (e.g., Instagram)"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Author Name</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="form-input"
                  placeholder="Enter Author Name"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Select State</label>
                <Select
                  options={states}
                  value={selectedState}
                  onChange={setSelectedState}
                  placeholder="Select a state..."
                />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <Select
                  options={cities}
                  value={selectedCity}
                  onChange={setSelectedCity}
                  placeholder="Select a city..."
                  isDisabled={!selectedState}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Short Description</label>
                <textarea
                  value={shortDescription}
                  onChange={(e) => {
                    const text = e.target.value;
                    const words = text.trim().split(/\s+/).filter(Boolean);
                    if (words.length <= 200) {
                      setShortDescription(text);
                    } else {
                      toast.error("Short description cannot exceed 200 words!");
                    }
                  }}
                  className="form-input"
                  placeholder="Write a brief description (max 200 words)"
                />
                <small style={{ color: "gray" }}>
                  Word count:{" "}
                  {shortDescription.trim().split(/\s+/).filter(Boolean).length}
                  /200
                </small>
              </div>
              <div className="form-group">
                <label className="form-label">Image Upload</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept=".avif,.jpeg,.jpg,.png,.webp"
                  multiple
                  onChange={handleImageChange}
                  style={{
                    display: "block",
                    padding: "10px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    borderRadius: "8px",
                    border: "2px dashed #ccc",
                    backgroundColor: "#f8f9fa",
                    cursor: "pointer",
                    width: "100%",
                    textAlign: "center",
                    transition: "0.3s",
                  }}
                  onMouseOver={(e) => (e.target.style.borderColor = "#007bff")}
                  onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                />
                <div className="image-preview-container d-flex justify-content-between">
                  {images.map((file, index) => (
                    <img
                      style={{ width: "100px" }}
                      key={index}
                      src={URL.createObjectURL(file)}
                      alt="Uploaded"
                      className="w-32 h-32 object-cover rounded-md"
                    />
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Content</label>
                <JoditEditor
                  ref={editor}
                  value={content}
                  tabIndex={1}
                  onChange={(newContent) => setContent(newContent)}
                />
              </div>
              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  className="submit-button"
                  style={{ backgroundColor: "#6c757d" }}
                  onClick={() => navigate(-1)}
                >
                  Close
                </button>
                <button
                  type="submit"
                  className="submit-button"
                  onClick={CreateApi}
                  disabled={loading}
                >
                  {loading ? "Publishing..." : "Publish Blog"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddBlogs;
