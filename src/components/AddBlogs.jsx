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
  const [facebook, setFacebook] = useState("");
  const [thread, setThread] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);

  const fileInputRef = useRef(null);
  const editor = useRef(null);
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

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  const CreateApi = async () => {
    try {
      if (!title || !shortDescription || !content) {
        toast.error("Please fill in all required fields!");
        return;
      }

      const formdata = new FormData();
      images.forEach((file) => formdata.append("img", file));
      formdata.append("title", title);
      formdata.append("shortdescription", shortDescription);
      formdata.append("fulldescription", content);
      formdata.append("facebook", facebook);
      formdata.append("threads", thread);
      formdata.append("States", selectedState?.label || "");
      formdata.append("City", selectedCity?.label || "");

      setLoading(true);
      const response = await fetch("http://82.29.166.100:4000/api/auth/addblogs", {
        method: "POST",
        body: formdata,
      });

      const result = await response.json();
      setLoading(false);

      if (result) {
        toast.success("Blog Created Successfully!");
        setTitle("");
        setShortDescription("");
        setContent("");
        setFacebook("");
        setThread("");
        setSelectedCity(null);
        setSelectedState(null);
        setImages([]);
        fileInputRef.current.value = "";

        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(result?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
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
              <div className="mb-4 d-flex justify-content-between">
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
                <label className="form-label">Facebook</label>
                <input
                  type="text"
                  value={facebook}
                  onChange={(e) => setFacebook(e.target.value)}
                  className="form-input"
                  placeholder="Enter Facebook Link"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Thread</label>
                <input
                  type="text"
                  value={thread}
                  onChange={(e) => setThread(e.target.value)}
                  className="form-input"
                  placeholder="Enter Thread Link"
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
                  onChange={(e) => setShortDescription(e.target.value)}
                  className="form-input"
                  placeholder="Write a brief description"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image Upload</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
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
                  onBlur={setContent}
                />
              </div>
              <div style={{ textAlign: "right" }}>
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
