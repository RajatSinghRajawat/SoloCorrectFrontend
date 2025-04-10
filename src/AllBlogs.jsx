/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "./App.css";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header";
import JoditEditor from "jodit-react";

const AllBlogs = () => {
  const [content, setContent] = useState("");
  const [Blogs, setBlogs] = useState([]);
  // const [show, setShow] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);

  const handleShow = (id) => {
    const blog = Blogs.find((b) => b._id === id);
    setSelectedBlog(blog);
    setShowModal(true);
    setContent(blog.fulldescription);
  };
  const fileInputRef = useRef(null);
  const editor = useRef(null);
  const handleClose = () => {
    setShowModal(false);
    setSelectedBlog(null);
    setFile(null);
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
      } else {
        toast.error(result.message || "Failed to update blog!");
      }
      BlogsApi();
      handleClose();
    } catch (error) {
      console.error(error);
    }
  };

  const BlogsApi = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/auth/getblogs");
      const result = await response.json();
      console.log("API Response:", result);
      setBlogs(result?.blogs || []);
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  const DeleteApi = (id) => {
    try {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow",
      };

      fetch(`http://localhost:4000/api/auth/deleteblog/${id}`, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          if (result.status == 1) {
            toast(result?.message || "Blog deleted successfully!");

            setTimeout(() => {
              BlogsApi();
            }, 1000);
          }
        })
        .catch((error) => console.error(error));
    } catch (error) {
      console.error("API Error:", error);
    }
  };

  useEffect(() => {
    BlogsApi();
  }, []);

  return (
    <div>
      <ToastContainer />

      <div className="mt-4">
        <h1 className="text-white text-center my-5">All Blogs Here </h1>
        <div className="container-fluid w-100">
          <div className="row">
            <div className="col-lg-11 m-auto">
              <div className="card  " style={{ backgroundColor: "#000" }}>
                <div className="card-body px-0">
                  <div style={{ width: "100%", overflowX: "scroll" }}>
                    <table className="table bg-dark ">
                      <thead class="custom-table">
                        <tr>
                          <th>#</th>
                          <th>Title</th>
                          <th className="text-nowrap">Short Description</th>
                          <th>Image</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {Blogs?.map((res, index) => (
                          <tr key={res._id}>
                            <td>{index + 1}</td>
                            <td>{res?.title}</td>
                            <td>{res?.shortdescription}</td>
                            {/* <td> <div dangerouslySetInnerHTML={{ __html: res?.fulldescription }} /></td> */}
                            <td>
                              <img
                                src={`http://localhost:4000/${res.img}`}
                                alt={res.title}
                                style={{ width: "50px" }}
                              />
                            </td>
                            <td>
                              <div style={{ display: "flex" }}>
                                <button
                                  className="btn border border-warning mx-3 text-white"
                                  onClick={() => {
                                    handleShow(res._id);
                                  }}
                                >
                                  Edit
                                </button>
                                <button
                                  className="btn btn-danger"
                                  onClick={() => {
                                    DeleteApi(res?._id);
                                  }}
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

      <Modal show={showModal} onHide={handleClose} dialogClassName="modal-xl">
        <Modal.Body>
          <div className="form-group">
            <label>Enter Title</label>
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

          <div className="form-group">
            <label>Enter Short Description</label>
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

          <div className="form-group">
            <label className="form-label">Content</label>
            <JoditEditor
              ref={editor}
              value={content}
              // config={config}
              tabIndex={1} // tabIndex of textarea
              onBlur={(newContent) => setContent(newContent)} // preferred to use only this option to update the content for performance reasons
              onChange={(newContent) => setContent(newContent)}
            />
          </div>
          <div style={{ textAlign: "right" }}></div>

          <button className="btn btn-primary w-100" onClick={handleUpdate}>
            Save
          </button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AllBlogs;
