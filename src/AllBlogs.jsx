/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import JoditEditor from "jodit-react";

const AllBlogs = () => {
  const [content, setContent] = useState("");
  const [blogs, setBlogs] = useState([]);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);
  const editor = useRef(null);

  const handleShowEdit = (id) => {
    const blog = blogs.find((b) => b._id === id);
    setSelectedBlog(blog);
    setShowEditModal(true);
    setContent(blog.fulldescription);
  };

  const handleCloseEdit = () => {
    setShowEditModal(false);
    setSelectedBlog(null);
    setFile(null);
  };

  const handleShowDelete = (id) => {
    setBlogToDelete(id);
    setShowDeleteModal(true);
  };

  const handleCloseDelete = () => {
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    if (!selectedBlog) return;

    const formData = new FormData();
    formData.append("title", selectedBlog.title);
    formData.append("shortdescription", selectedBlog.shortdescription);
    formData.append("fulldescription", content);
    if (file) {
      formData.append("img", file);
      formData.append("img_name", file.name);
    }

    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/updateBlog/${selectedBlog._id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Blog updated successfully!");
        await blogsApi();
        handleCloseEdit();
      } else {
        toast.error(result.message || "Failed to update blog!");
      }
    } catch (error) {
      console.error("Update Error:", error);
      toast.error("An error occurred while updating the blog!");
    }
  };

  const blogsApi = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/getblogs");
      const result = await response.json();
      setBlogs(result?.blogs || []);
    } catch (error) {
      console.error("API Error:", error);
      toast.error("Failed to fetch blogs!");
    }
  };

  const handleDelete = async () => {
    if (!blogToDelete) return;

    try {
      const response = await fetch(
        `http://localhost:4000/api/auth/deleteblog/${blogToDelete}`,
        {
          method: "DELETE",
          redirect: "follow",
        }
      );

      const result = await response.json();
      if (result) {
        toast.success(result?.message || "Blog deleted successfully!");
        await blogsApi();
        handleCloseDelete();
      } else {
        toast.error(result?.message || "Failed to delete blog!");
      }
    } catch (error) {
      console.error("Delete Error:", error);
      toast.error("An error occurred while deleting the blog!");
    }
  };

  useEffect(() => {
    blogsApi();
  }, []);

  return (
    <div>
      <ToastContainer />

      <div className="mt-4">
        <h1 className="text-white text-center my-5">All Blogs Here</h1>
        <div className="container-fluid w-100">
          <div className="row">
            <div className="col-lg-11 m-auto">
              <div className="card" style={{ backgroundColor: "#000" }}>
                <div className="card-body px-0">
                  <div style={{ width: "100%", overflowX: "scroll" }}>
                    <table className="table bg-dark">
                      <thead className="custom-table">
                        <tr>
                          <th>#</th>
                          <th>Title</th>
                          <th className="text-nowrap">Short Description</th>
                          <th>Image</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {blogs?.map((blog, index) => (
                          <tr key={blog._id}>
                            <td>{index + 1}</td>
                            <td>{blog?.title}</td>
                            <td>{blog?.shortdescription}</td>
                            <td>
                              <img
                                src={`http://localhost:4000/${
                                  Array.isArray(blog.img) ? blog.img[0] : blog.img
                                }`}
                                alt={blog.title}
                                style={{ width: "50px", objectFit: "cover" }}
                                onError={(e) => {
                                  e.target.src = "/fallback-image.jpg"; // Fallback image
                                }}
                              />
                            </td>
                            <td>
                              <div className="d-flex gap-2">
                                <button
                                  className="btn border border-warning text-white"
                                  onClick={() => handleShowEdit(blog._id)}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => handleShowDelete(blog._id)}
                                >
                                  Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEdit} dialogClassName="modal-xl">
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              value={selectedBlog?.title || ""}
              onChange={(e) =>
                setSelectedBlog({ ...selectedBlog, title: e.target.value })
              }
              placeholder="Enter title"
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Short Description</label>
            <input
              type="text"
              className="form-control"
              value={selectedBlog?.shortdescription || ""}
              onChange={(e) =>
                setSelectedBlog({
                  ...selectedBlog,
                  shortdescription: e.target.value,
                })
              }
              placeholder="Enter Short Description"
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Content</label>
            <JoditEditor
              ref={editor}
              value={content}
              tabIndex={1}
              onBlur={(newContent) => setContent(newContent)}
              onChange={(newContent) => setContent(newContent)}
            />
          </div>

          <div className="form-group mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEdit}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDelete} centered>
        <Modal.Header closeButton className="border-0">
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">Are you sure you want to delete this blog? This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer className="border-0">
          <Button variant="outline-secondary" onClick={handleCloseDelete}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AllBlogs;