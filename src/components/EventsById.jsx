import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./Header";
import { IoSend } from "react-icons/io5";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash, FaShare } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { FaHeart } from "react-icons/fa";

const EventsById = () => {
  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editCommentText, setEditCommentText] = useState("");
  const { id } = useParams();

  // Fetch userId from localStorage
  const userData = JSON.parse(localStorage.getItem("userData") || "{}");
  const userId = userData?._id || null;

  // Use environment variable for API base URL
  const API_BASE_URL = "http://82.29.166.100:4000";

  // Fetch event by ID
  const fetchEventById = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/getevents/${encodeURIComponent(id)}`,
        {
          method: "GET",
          redirect: "follow",
        }
      );
      const result = await response.json();
      if (response.ok && result.data) {
        setData(result.data);
      } else {
        toast.error(result.message || "Failed to fetch event");
      }
    } catch (error) {
      console.error("Event API Error:", error);
      toast.error("Failed to fetch event");
    }
  };

  // Fetch comments for the event
  const fetchComments = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/commentsevent/${encodeURIComponent(id)}`
      );
      const result = await response.json();
      if (response.ok && Array.isArray(result.comments)) {
        setComments(result.comments);
      } else {
        toast.error(result.message || "Failed to fetch comments");
      }
    } catch (error) {
      console.error("Comments API Error:", error);
      toast.error("Failed to fetch comments");
    }
  };

  // Handle liking/unliking the event
  const handleLike = async () => {
    if (!userId) {
      toast.error("Please log in to like a blog");
      return;
    }
    if (!data?._id) {
      toast.error("Event data not loaded");
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/likes/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const result = await response.json();

      if (response.ok) {
        toast.success("Like updated successfully");
        fetchEventById();
      } else {
        toast.error(result.message || "Error updating like");
        console.error("API Error Response:", result);
      }
    } catch (error) {
      toast.error("Error updating like");
      console.error("Like API Error:", error);
    }
  };

  // Handle adding a new comment
  const handleComment = async () => {
    if (!userId) {
      toast.error("Please log in to comment");
      return;
    }

    const trimmedComment = commentText.trim();
    if (!trimmedComment) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/commentevent/${encodeURIComponent(id)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, text: trimmedComment }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success("Comment added successfully");
        setCommentText("");
        fetchComments();
      } else {
        toast.error(result.message || "Error adding comment");
      }
    } catch (error) {
      console.error("Comment API Error:", error);
      toast.error("Error adding comment");
    }
  };

  // Handle editing a comment
  const handleEditComment = async (commentId, eventId) => {
    if (!userId) {
      toast.error("Please log in to edit a comment");
      return;
    }

    const text = editCommentText.trim();
    if (!text) {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/editeventscomments/${encodeURIComponent(
          commentId
        )}/${encodeURIComponent(eventId)}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, text }),
        }
      );
      const result = await response.json();

      if (response.ok) {
        toast.success("Comment updated successfully");
        setEditingComment(null);
        setEditCommentText("");
        fetchComments(); // Refresh comments after edit
      } else {
        toast.error(result.message || "Error updating comment");
        console.error("Edit Comment API Error Response:", result);
      }
    } catch (error) {
      toast.error("Error updating comment");
      console.error("Edit Comment API Error:", error);
    }
  };

  // Handle deleting a comment
  const handleDeleteComment = async (commentId, eventId) => {
    console.log(eventId, "eventIdeventIdeventId");

    if (!userId) {
      toast.error("Please log in to delete a comment");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/api/auth/deleteeventscomments/${encodeURIComponent(
          commentId
        )}/${encodeURIComponent(eventId)}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const result = await response.json();

      if (response) {
        toast.success("Comment deleted successfully");
        fetchComments(); // Refresh comments
      } else {
        toast.error(result.message || "Error deleting comment");
        console.error("Delete Comment API Error Response:", result);
      }
    } catch (error) {
      toast.error("Error deleting comment");
      console.error("Delete Comment API Error:", error);
    }
  };

  // Fetch event and comments on mount or when ID changes
  useEffect(() => {
    if (id) {
      fetchEventById();
      fetchComments();
    }
  }, [id]);

  // Loading state
  if (!data) {
    return (
      <div>
        <Header />
        <ToastContainer />
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <Header />
      <ToastContainer />
      <div className=" container blog-container">
        <div className="image-gallery">
          {Array.isArray(data?.img) && data.img.length > 0 ? (
            <>
              <div className="large-image">
                <img
                  src={`${API_BASE_URL}/${data.img[0]}`}
                  className="blog-image"
                  alt={data.City || "Event image"}
                  onError={() => toast.error("Failed to load main image")}
                />
              </div>
              <div className="right-images">
                {data.img.slice(1, 3).map((image, index) => (
                  <div key={index} className="small-image">
                    <img
                      src={`${API_BASE_URL}/${image}`}
                      className="blog-image"
                      alt={`Event thumbnail ${index + 1}`}
                      onError={() =>
                        toast.error(`Failed to load thumbnail ${index + 1}`)
                      }
                    />
                  </div>
                ))}
              </div>
              {data.img.slice(3, 5).map((image, index) => (
                <div key={index} className="small-image">
                  <img
                    src={`${API_BASE_URL}/${image}`}
                    className="small-image-extra"
                    alt={`Event thumbnail ${index + 3}`}
                    onError={() =>
                      toast.error(`Failed to load thumbnail ${index + 3}`)
                    }
                  />
                </div>
              ))}
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>
        <div className="d-flex align-items-center">
      by{" "}
                 <span className="author-name ps-2 pe-1">{data.travelAuthor || "!Author"}</span>{" "}
          <button
            onClick={handleLike}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "white",
            }}
            aria-label={
              data?.likes?.includes(userId) ? "Unlike event" : "Like event"
            }
            disabled={!data?._id}
          >
            {data?.likes?.includes(userId) ? (
              <FaHeart color="red" size={20} />
            ) : (
              <CiHeart size={20} />
            )}
          </button>
          <span className="ms-2 text-muted">
            {data?.likes?.length || 0} Likes
          </span>
          <div className="ms-2">
            <FaShare aria-label="Share event" />
          </div>
        </div>
        <div className="event-content">
          <div className="py-4">
            <h5 className="card-title text-light fw-bold">
              {data?.City || "Unknown City"} <br />{data?.States || "No description available"}
            </h5>
          </div>
          <p className="event-description">
            
          </p>
          <hr className="divider" />
        </div>
        <div className="event-content">
          <div className="py-4">
            <p className="card-title text-light fw-bold">
              {data?.travelDescription || "No travel description available"}
            </p>
          </div>
          <p className="event-description">
            {data?.interests || "No interests available"}
          </p>
          <hr className="divider" />
          <p className="event-description">
            By {data?.transport || "No transport details available"}
          </p>
          
        </div>
      </div>
      <div
        className="comment-input-container"
        style={{
          display: "flex",
          alignItems: "center",
          padding: "10px",
          borderRadius: "8px",
          marginTop: "10px",
        }}
      >
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          aria-label="Add a comment"
          onKeyPress={(e) => {
            if (e.key === "Enter") handleComment();
          }}
          style={{
            width: "100%",
            padding: "8px 0",
            border: "none",
            borderBottom: "2px solid grey",
            background: "transparent",
            outline: "none",
            color: "white",
            fontSize: "0.9rem",
          }}
        />
        <button
          onClick={handleComment}
          aria-label="Submit comment"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
          }}
        >
          <IoSend size={20} color="#ff9800" />
        </button>
      </div>
      <div className="comments-section mt-4">
        <h3>Comments</h3>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              {editingComment === comment._id ? (
                <div className="d-flex align-items-center comment-input-container">
                  <input
                    type="text"
                    value={editCommentText}
                    onChange={(e) => setEditCommentText(e.target.value)}
                    aria-label="Edit comment"
                    style={{
                      width: "100%",
                      padding: "8px 0",
                      border: "none",
                      borderBottom: "2px solid grey",
                      background: "transparent",
                      outline: "none",
                      color: "white",
                      fontSize: "0.9rem",
                    }}
                  />
                  <button
                    onClick={() => handleEditComment(comment._id, id)}
                    aria-label="Submit edited comment"
                    style={{
                      background: "transparent",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    <IoSend size={20} color="#ff9800" />
                  </button>
                  <button
                    onClick={() => setEditingComment(null)}
                    aria-label="Cancel editing comment"
                    style={{
                      background: "transparent",
                      border: "none",
                      color: "#ffffff",
                      cursor: "pointer",
                    }}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <p>
                    <strong>{comment.user?.name || "Unknown User"}: </strong>
                    {comment.text || "No comment text"}
                  </p>
                  <small>
                    {comment.createdAt
                      ? new Date(comment.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })
                      : "Unknown date"}
                  </small>
                  {comment.user?._id === userId && (
                    <div className="d-flex gap-2">
                      <button
                        onClick={() => {
                          setEditingComment(comment._id);
                          setEditCommentText(comment.text);
                        }}
                        aria-label="Edit comment"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <FaEdit size={16} color="#ff9800" />
                      </button>
                      <button
                        onClick={() => handleDeleteComment(comment._id, id)}
                        aria-label="Delete comment"
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                        }}
                      >
                        <FaTrash size={16} color="#ff0000" />
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))
        ) : (
          <p>No comments yet.</p>
        )}
      </div>
    </div>
  );
};

export default EventsById;
