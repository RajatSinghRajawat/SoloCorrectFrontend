import React, { useEffect, useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "./Eventsbyid.css";
import Header from "./Header";

const AllEvents = () => {
  const [plans, setPlans] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);

  const fetchPlans = async () => {
    try {
      const res = await fetch("http://82.29.166.100:4000/api/auth/getEvents");
      const data = await res.json();
      setPlans(data.travel);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const handleDelete = async () => {
    try {
      await fetch(
        `http://82.29.166.100:4000/api/auth/deleteTravelPlan/${selectedPlan._id}`,
        {
          method: "DELETE",
        }
      );
      setShowDeleteModal(false);
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = async () => {
    const formdata = new FormData();
    Object.entries(selectedPlan).forEach(([key, value]) => {
      formdata.append(key, Array.isArray(value) ? value.join(",") : value);
    });

    try {
      await fetch(
        `http://82.29.166.100:4000/api/auth/updateTravelPlan/${selectedPlan._id}`,
        {
          method: "PUT",
          body: formdata,
        }
      );
      setShowEditModal(false);
      fetchPlans();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
    <Header/>
      <div className="allevents-container">
        <h2 className="text-center mb-4">Travel Plans</h2>
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
                    <img
                      src={`http://82.29.166.100:4000/${plan.img?.[0]}`}
                      alt="travel"
                      className="allevents-image"
                    />
                  </td>
                  <td>{plan.City}</td>
                  <td>{plan.States}</td>
                  <td className="allevents-description">
                    {plan.travelDescription}
                  </td>
                  <td>
                    <Button
                      variant="warning"
                      size="sm"
                      className="me-2"
                      onClick={() => {
                        setSelectedPlan(plan);
                        setShowEditModal(true);
                      }}
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
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Delete Modal */}
        <Modal
          show={showDeleteModal}
          onHide={() => setShowDeleteModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Confirm Deletion</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            Are you sure you want to delete this travel plan?
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Edit Modal */}
        <Modal
          show={showEditModal}
          onHide={() => setShowEditModal(false)}
          centered
          size="lg"
        >
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
                    <Form.Label>{field}</Form.Label>
                    <Form.Control
                      type="text"
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
                        interests: e.target.value.split(","),
                      })
                    }
                  />
                </Form.Group>
              </Form>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button variant="success" onClick={handleEdit}>
              Save Changes
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
};

export default AllEvents;
