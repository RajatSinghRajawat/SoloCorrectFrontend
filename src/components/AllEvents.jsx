import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Pagination, Alert } from "react-bootstrap";
import "./Eventsbyid.css";
import Header from "./Header";

const AllEvents = () => {
  const [plans, setPlans] = useState([]);
  const [totalItems, setTotalItems] = useState(0); // Total items from API
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(9); // Match API limit
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const API_BASE_URL = "http://82.29.166.100:4000";

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/auth/getEvents`
      );
      if (!res.ok) throw new Error("Failed to fetch plans");
      const data = await res.json();
    
      setPlans(data.travel || []);
      // setTotalItems(data.total || data.travel.length); // Use API's total or fallback
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, [currentPage]);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/auth/deleteTravelPlan/${selectedPlan._id}`,
        { method: "DELETE" }
      );
      if (!res.ok) throw new Error("Failed to delete plan");
      setShowDeleteModal(false);
      setSelectedPlan(null);
      fetchPlans();
      if (plans.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = async () => {
    setLoading(true);
    setError(null);
    const formdata = new FormData();
    Object.entries(selectedPlan).forEach(([key, value]) => {
      if (key === "interests" && Array.isArray(value)) {
        formdata.append(key, value.join(","));
      } else if (value !== null && value !== undefined) {
        formdata.append(key, value);
      }
    });

    try {
      const res = await fetch(
        `${API_BASE_URL}/api/auth/updateTravelPlan/${selectedPlan._id}`,
        { method: "PUT", body: formdata }
      );
      if (!res.ok) throw new Error("Failed to update plan");
      setShowEditModal(false);
      setSelectedPlan(null);
      fetchPlans();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <>
      <Header />
      <div className="allevents-container">
        <h2 className="text-center mb-4">Travel Plans</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        {loading && <div className="text-center">Loading...</div>}
        {!loading && plans.length === 0 && <div className="text-center">No plans available.</div>}
        {!loading && plans.length > 0 && (
          <div className="table-responsive">
            <table className="table table-bordered table-hover allevents-table">
              <thead className="table-dark">
                <tr>
                  <th>Image</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {plans.map((plan) => (
                  <tr key={plan._id}>
                    <td>
                      {plan.img?.[0] ? (
                        <img
                          src={`${API_BASE_URL}/${plan.img[0]}`}
                          alt={plan.City || "Travel"}
                          className="allevents-image"
                        />
                      ) : (
                        <span>No image</span>
                      )}
                    </td>
                    <td>{plan.City || "N/A"}</td>
                    <td>{plan.States || "N/A"}</td>
                    <td className="allevents-description">{plan.travelDescription || "N/A"}</td>
                    <td>
                      <Button
                        variant="warning"
                        size="sm"
                        className="me-2"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowEditModal(true);
                        }}
                        aria-label={`Edit plan for ${plan.City}`}
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setShowDeleteModal(true);
                        }}
                        aria-label={`Delete plan for ${plan.City}`}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="d-flex justify-content-center mt-4">
            <Pagination>
              <Pagination.Prev
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1 || loading}
              />
              {[...Array(totalPages).keys()].map((page) => (
                <Pagination.Item
                  key={page + 1}
                  active={page + 1 === currentPage}
                  onClick={() => setCurrentPage(page + 1)}
                  disabled={loading}
                >
                  {page + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
              />
            </Pagination>
          </div>
        )}

        {/* Delete Modal */}
        <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete the travel plan for {selectedPlan?.City}?
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowDeleteModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} disabled={loading}>
              {loading ? "Deleting..." : "Delete"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Edit Travel Plan</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedPlan && (
              <Form>
                {[
                  "destination",
                  "City",
                  "States",
                  "startDate",
                  "endDate",
                  "transport",
                  "travelBuddyGender",
                  "travelBuddyAge",
                  "budget",
                  "travelAuthor",
                  "travelDescription",
                ].map((field) => (
                  <Form.Group key={field} className="mb-3">
                    <Form.Label>{field.replace(/([A-Z])/g, " $1").trim()}</Form.Label>
                    <Form.Control
                      type={field.includes("Date") ? "date" : "text"}
                      value={selectedPlan[field] || ""}
                      onChange={(e) =>
                        setSelectedPlan({
                          ...selectedPlan,
                          [field]: e.target.value,
                        })
                      }
                    />
                  </Form.Group>
                ))}
                <Form.Group className="mb-3">
                  <Form.Label>Interests (comma separated)</Form.Label>
                  <Form.Control
                    type="text"
                    value={selectedPlan.interests?.join(",") || ""}
                    onChange={(e) =>
                      setSelectedPlan({
                        ...selectedPlan,
                        interests: e.target.value.split(",").map((item) => item.trim()),
                      })
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)} disabled={loading}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleEdit} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AllEvents;