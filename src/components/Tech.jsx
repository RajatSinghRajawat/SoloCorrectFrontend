import React, { useContext, useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "../App.css";
import Header from "./Header";
import { myData } from "../App";
import Select from "react-select";
import { State, City } from "country-state-city";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShare } from "react-icons/fa";
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

const Tech = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [myState, setMyState] = useContext(myData);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState({});
  const [searchTitle, setSearchTitle] = useState("");
  // const [commentText, setCommentText] = useState({});

  // Fetch userId from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?._id || null;

  const fetchBlogs = async () => {
    try {
      // Encode query parameters to handle special characters
      const query = new URLSearchParams({
        page,
        limit: 9,
        States: myState.state || "",
        City: myState.city || "",
        search: searchTitle || "",
      }).toString();

      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/getblogs?${query}`
      );
      const result = await response.json();
      console.log("API Response:", result);

      if (response.ok && result.blogs) {
        setData(result.blogs);
        setTotalPages(result.totalPages || 1); // Ensure totalPages is set
        setCurrentImageIndex(
          result.blogs.reduce((acc, blog) => {
            if (!blog._id) {
              console.error("Missing _id in blog:", blog);
              return acc;
            }
            return { ...acc, [blog._id]: 0 };
          }, {})
        );
      } else {
        console.error("Failed to fetch blogs:", result.message);
        toast.error(result.message || "Failed to fetch blogs");
        setData([]);
        setTotalPages(1);
      }
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Error fetching blogs");
      setData([]);
      setTotalPages(1);
    }
  };

  const handleLike = async (blogId) => {
    if (!userId) {
      toast.error("Please log in to like a blog");
      return;
    }

    try {
      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/like/${blogId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success("Like updated successfully");
        fetchBlogs(); // Refresh blogs to update like count
      } else {
        toast.error(result.message || "Error updating like");
        console.error("API Error Response:", result);
      }
    } catch (error) {
      toast.error("Error updating like");
      console.error("Like API Error:", error);
    }
  };

  // const handleComment = async (blogId) => {
  //   if (!userId) {
  //     toast.error("Please log in to comment");
  //     return;
  //   }

  //   const text = commentText[blogId]?.trim();
  //   if (!text) {
  //     toast.error("Comment cannot be empty");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `http://82.29.166.100:4000/api/auth/comment/${blogId}`,
  //       {
  //         method: "POST",
  //         headers: { "Content-Type": "application/json" },
  //         body: JSON.stringify({ userId, text }),
  //       }
  //     );
  //     const result = await response.json();

  //     if (response.ok) {
  //       toast.success("Comment added successfully");
  //       setCommentText((prev) => ({ ...prev, [blogId]: "" }));
  //       fetchBlogs();
  //     } else {
  //       toast.error(result.message || "Error adding comment");
  //       console.error("API Error Response:", result);
  //     }
  //   } catch (error) {
  //     toast.error("Error adding comment");
  //     console.error("Comment API Error:", error);
  //   }
  // };

  // Reset page to 1 when search or filters change
  useEffect(() => {
    setPage(1); // Reset page when filters change
  }, [myState, searchTitle]);

  // Fetch blogs when page or filters change
  useEffect(() => {
    fetchBlogs();
  }, [page, myState, searchTitle]);

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
  const [showShareOptions, setShowShareOptions] = useState(false);

  const toggleShare = () => {
    setShowShareOptions((prev) => !prev);
  };
  return (
    <>
      <Header />
      <ToastContainer position="top-right" autoClose={3000} theme="dark" />

      <div className="container py-5">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <input
            type="text"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value)}
            placeholder="Search by title..."
            style={{
              width: "250px",
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #444",
              backgroundColor: "#1e1e1e",
              color: "#fff",
            }}
          />

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
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
                singleValue: (base) => ({ ...base, color: "#fff" }),
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
                singleValue: (base) => ({ ...base, color: "#fff" }),
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

            {/* <div style={{ marginBottom: "20px" }}>
              <select
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "recent") {
                    fetchBlogs(); // Adjust logic to fetch recent blogs
                  } else if (value === "liked") {
                    fetchBlogs(); // Adjust logic to fetch liked blogs
                  }
                }}
                style={{
                  padding: "7px",
                  borderRadius: "5px",
                  border: "1px solid #444",
                  backgroundColor: "#1e1e1e",
                  color: "grey",
                  cursor: "pointer",
                }}
              >
                <option value="recent">Sort By</option>
                <option value="recent">Recently Blogs</option>
                <option value="liked">More Liked Blogs</option>
              </select>
            </div> */}

            <NavLink to="/add/blogs">
              <button className="btn btn-warning">✍️ Create Blog</button>
            </NavLink>
          </div>
        </div>

        <div className="row g-4">
          {data.length > 0 ? (
            data.map((res) => {
              const shareUrl = `http://localhost:3000/blog/${res._id}`;
              return (
                <div key={res._id} className="col-lg-4 col-md-6 col-sm-12">
                  <div className="card blog-card shadow-lg border-0 rounded-4">
                    <div className="image-container position-relative">
                      <img
                        src={`http://82.29.166.100:4000/${
                          res.img[currentImageIndex[res._id] || 0]
                        }`}
                        alt={`Image ${currentImageIndex[res._id] + 1 || 1}`}
                        className="card-img-top rounded-top-4"
                        style={{ height: "250px", objectFit: "cover" }}
                      />
                      {res.img.length > 1 && (
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
                        <div className="d-flex align-items-center mb-2">
                          <button
                            onClick={() => handleLike(res._id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                            }}
                          >
                            {res.likes?.map(String).includes(userId) ? (
                              <FaHeart color="red" size={20} />
                            ) : (
                              <CiHeart size={20} />
                            )}
                          </button>
                          <span className="ms-2 text-muted">
                            {res.likes?.length || 0} Likes
                          </span>
                          <div
                          className="ms-2"
                            style={{
                              position: "relative",
                              display: "inline-block",
                            }}
                          >
                            {/* Clickable Share Icon */}
                            <FaShare
                              style={{ cursor: "pointer", fontSize: "20px" }}
                              onClick={toggleShare}
                            />

                            {/* Share Options (show on click) */}
                            {showShareOptions && (
                              <div
                                className="share-buttons"
                                style={{
                                  position: "absolute",
                                  top: "30px",
                                  left: 0,
                                  background: "#fff",
                                  border: "1px solid #ddd",
                                  padding: "10px",
                                  borderRadius: "8px",
                                  zIndex: 10,
                                  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.1)",
                                  display: "flex",
                                  flexDirection: "column",
                                  gap: "8px",
                                }}
                              >
                                <label style={{ fontWeight: "bold" }}>
                                  Share this blog:
                                </label>
                                <div style={{ display: "flex", gap: "10px" }}>
                                  <FacebookShareButton
                                    url={shareUrl}
                                    quote={"Check out this blog!"}
                                  >
                                    <FacebookIcon size={32} round />
                                  </FacebookShareButton>

                                  <TwitterShareButton
                                    url={shareUrl}
                                    title={"Check out this blog!"}
                                  >
                                    <TwitterIcon size={32} round />
                                  </TwitterShareButton>

                                  <WhatsappShareButton
                                    url={shareUrl}
                                    title={"Check out this blog!"}
                                  >
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
                        <h5 className="card-title fw-bold text-truncate">
                          {res.title}
                        </h5>
                        <p className="card-text text-muted text-truncate">
                          {res.shortdescription}
                        </p>
                        <div
                          className="d-flex text-muted"
                          style={{ textTransform: "capitalize" }}
                        >
                          <p className="me-2">{res.States},</p>
                          <p>{res.City}</p>
                        </div>
                        <div className="d-flex justify-content-between">
                          <div>
                            <p
                              className="text-muted text-end mt-2"
                              style={{ fontSize: "0.9rem" }}
                            >
                              By : {res.author || " !author"}
                            </p>
                          </div>
                          <div>
                            <p
                              className="text-muted text-end mt-2"
                              style={{ fontSize: "0.9rem" }}
                            >
                              Created:{" "}
                              {new Date(res.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        {/* <div className="d-flex align-items-center">
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={commentText[res._id] || ""}
                            onChange={(e) =>
                              setCommentText((prev) => ({
                                ...prev,
                                [res._id]: e.target.value,
                              }))
                            }
                            style={{
                              width: "100%",
                              padding: "8px 0",
                              border: "none",
                              borderBottom: "2px solid #000",
                              background: "transparent",
                              outline: "none",
                              color: "#333",
                              fontSize: "0.9rem",
                            }}
                            onKeyPress={(e) => {
                              if (e.key === "Enter") handleComment(res._id);
                            }}
                          />
                          <button
                            onClick={() => handleComment(res._id)}
                            style={{
                              background: "none",
                              border: "none",
                              cursor: "pointer",
                              marginLeft: "8px",
                            }}
                          >
                            <IoSend size={20} color="#ff9800" />
                          </button>
                        </div> */}
                      </div>

                      <button
                        className="btn btn-primary mt-3 w-100"
                        onClick={() => navigate(`/blogs/${res._id}`)}
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
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            ◀
          </button>
          <span className="text-light">
            Page {page} of {totalPages}
          </span>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
          >
            ▶
          </button>
        </div>
      </div>
    </>
  );
};

export default Tech;
