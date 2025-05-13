/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Header from "./Header";
import "./blogs.css"; // Importing CSS
import { CiLink } from "react-icons/ci";
import { FaFacebookF, FaThreads } from "react-icons/fa6";
import { useNavigate, useParams } from "react-router-dom";
import { FaInstagram, FaFacebook, FaTwitter } from "react-icons/fa"; // Import icons
import Demo from "./images/4.png";
import ABC from "./images/4.png";
import David from "./images/avtar.jpeg";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";
import { IoSend } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaShare } from "react-icons/fa";
const Blogs = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [data, setData] = useState({});
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState({});

  // Fetch userId from localStorage
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?._id || null;
  // Fetch single blog by ID
  const GetSoloblog = async () => {
    try {
      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/getblog/${encodeURIComponent(id)}`
      );
      const result = await response.json();
      console.log("API Response:", result);
      if (result.blog) {
        setData(result.blog);
      }
    } catch (error) {
      console.error("API Error:", error.message);
    }
  };

  useEffect(() => {
    if (id) {
      GetSoloblog();
    }
  }, [id]);

  const [data2, setData2] = useState([]);

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
        GetBlogs(); // Refresh blogs to update like count
      } else {
        toast.error(result.message || "Error updating like");
        console.error("API Error Response:", result);
      }
    } catch (error) {
      toast.error("Error updating like");
      console.error("Like API Error:", error);
    }
  };

  const handleComment = async (blogId) => {
    if (!userId) {
      toast.error("Please log in to comment");
      return;
    }

    const text = commentText[blogId]?.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/comment/${blogId}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, text }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success("Comment added successfully");
        setCommentText((prev) => ({ ...prev, [blogId]: "" }));
        GetBlogs();
      } else {
        toast.error(result.message || "Error adding comment");
        console.error("API Error Response:", result);
      }
    } catch (error) {
      toast.error("Error adding comment");
      console.error("Comment API Error:", error);
    }
  };

  const GetBlogs = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        "http://82.29.166.100:4000/api/auth/getblogs",
        requestOptions
      );
      const result = await response.json();

      if (result?.blogs) {
        setData2(result.blogs); // ✅ Correct condition
        console.log(result?.blogs.img);
      } else {
        console.error("Failed to fetch blogs:", result?.message);
      }
    } catch (error) {
      console.error("API Error:", error);
    }
  };
  const GetComments = async () => {
    try {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      const response = await fetch(
        `http://82.29.166.100:4000/api/auth/comments/${encodeURIComponent(id)}`,
        requestOptions
      );
      const result = await response.json();
      console.log("Comments Response:", result);
      if (result) {
        setComments(result.comments);
      }
    } catch (error) {
      console.error("Comments API Error:", error);
    }
  };

  useEffect(() => {
    GetBlogs();
    GetComments();
  }, []);

  return (
    <div>
      <Header />

      <div className="blog-container">
        <div className="image-gallery">
          {Array.isArray(data?.img) && data?.img.length > 0 ? (
            <>
              <div className="large-image">
                <img
                  src={`http://82.29.166.100:4000/${data.img[0]}`}
                  className="blog-image"
                  alt="Main Blog Image"
                />
              </div>

              <div className="right-images">
                {data.img.slice(1, 3).map((image, index) => (
                  <div key={index} className="small-image">
                    <img
                      src={`http://82.29.166.100:4000/${image}`}
                      className="blog-image"
                      alt={`Thumbnail ${index + 1}`}
                    />
                  </div>
                ))}
              </div>
              {data.img.slice(3, 5).map((image, index) => (
                <div key={index} className="small-image">
                  <img
                    src={`http://82.29.166.100:4000/${image}`}
                    className=""
                    style={{ height: "20rem", objectFit: "cover" }}
                    alt={`Thumbnail ${index + 1}`}
                  />
                </div>
              ))}
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>
        {/* Blog Content */}
        <div className="blog-content">
          <div
            className="py-4"
            style={{ padding: "10px 0", textAlign: "start" }}
          >
            <h5 className="card-title text-light fw-bold">{data.title}</h5>
          </div>{" "}
          <p className="blog-description">{data?.shortdescription}</p>
          <hr className="divider" />
        </div>
        <div className="container mt-4">
          <div className="row">
            <div className="col-lg-7">
              <div style={{ display: "flex", alignContent: "center" }}>
                {/* <img
                  src={David}
                  style={{
                    width: "50px",
                    height: "50px",
                    borderRadius: "10px",
                  }}
                /> */}
                <p className="text-white ms-3 mt-2">
                  {" "}
                  <div
                    dangerouslySetInnerHTML={{ __html: data?.fulldescription }}
                  />
                </p>
              </div>
              <p className="blog-author d-flex align-items-center gap-2">
                by{" "}
                <span className="author-name">{data.author || "!Author"}</span>{" "}
                <div className="d-flex align-items-center">
                  <button
                    onClick={() => handleLike(data._id)}
                    style={{
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      color: "white",
                    }}
                  >
                    {data.likes?.map(String).includes(userId) ? (
                      <FaHeart color="red" size={20} />
                    ) : (
                      <CiHeart size={20} />
                    )}
                  </button>
                  <span className="ms-2 text-muted">
                    {data.likes?.length || 0} Likes
                  </span>
                  <div className="ms-2">
                    <FaShare />
                  </div>
                </div>{" "}
              </p>
              <p className="blog-author">
                {new Date(data?.createdAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}{" "}
                GMT+5:30
              </p>
              {/* Social Media & Comments Section */}
              <div className="social-icons">
                <CiLink className="icon" />
                <FaFacebookF className="icon" />
                <FaThreads className="icon" />
              </div>
              {/* <div className="comment-section">
            <div className="comment-count">81</div>
            <span>Comments (81 New)</span>
          </div> */}
              <div className="d-flex align-items-center">
                <input
                  className="mt-3"
                  type="text"
                  placeholder="Add a comment..."
                  value={commentText[data._id] || ""}
                  onChange={(e) =>
                    setCommentText((prev) => ({
                      ...prev,
                      [data._id]: e.target.value,
                    }))
                  }
                  style={{
                    width: "100%",
                    padding: "8px 0",
                    border: "none",
                    borderBottom: "2px solid grey",
                    background: "transparent",
                    outline: "none",
                    color: "#333",
                    fontSize: "0.9rem",
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") handleComment(data._id);
                  }}
                />
                <button
                  onClick={() => handleComment(data._id)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    marginLeft: "8px",
                  }}
                >
                  <IoSend size={20} color="#ff9800" />
                </button>
              </div>
              <div className="comments-section mt-4">
                <h3>Comments</h3>
                {comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index} className="comment">
                      <p>
                        <strong>{comment.user?.name || "Unknown User"} </strong>
                        : {comment.text}
                      </p>
                      <small>
                        {new Date(comment.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </small>
                    </div>
                  ))
                ) : (
                  <p>No comments yet.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blogs;
