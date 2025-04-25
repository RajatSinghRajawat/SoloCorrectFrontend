import React, { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../components/images/logo.png";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./header.css";
import { FaUser } from "react-icons/fa";
import { CiMenuFries } from "react-icons/ci";
import { IoMdLogOut } from "react-icons/io";
import { FaSignInAlt } from "react-icons/fa"; // Added for login icon
import Offcanvas from "react-bootstrap/Offcanvas";

const Header = () => {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("ACCOUNT");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Check if user is logged in and set username
  useEffect(() => {
    const userData = localStorage.getItem("userData");
    const token = localStorage.getItem("token");

    if (userData && token) {
      setIsLoggedIn(true);
      try {
        const parsedData = JSON.parse(userData);
        const userEmail = parsedData?.email;
        if (userEmail) {
          const namePart = userEmail.split("@")[0];
          setUsername(namePart.charAt(0).toUpperCase() + namePart.slice(1));
        }
      } catch (error) {
        console.error("Error parsing userData from localStorage:", error);
      }
    } else {
      setIsLoggedIn(false);
      setUsername("ACCOUNT");
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("userData");
    localStorage.removeItem("token");
    toast.success("Logout Successful!", {
      position: "top-right",
      autoClose: 3000,
    });
    setIsLoggedIn(false);
    setUsername("ACCOUNT");
    navigate("/login");
  };

  return (
    <>
      <ToastContainer />
      <div className="mainNAv">
        {/* Desktop View */}
        <div className="desktopView">
          <div className="user-actions">
            {isLoggedIn ? (
              <NavLink to="/profile">
                <button style={{ textTransform: "capitalize" }} className="account">
                  <FaUser className="text-light icon" />
                  Hello {username}
                </button>
              </NavLink>
            ) : (
              <NavLink to="/login">
                <button className="account">
                  <FaUser color="#3cffd0" /> Sign In
                </button>
              </NavLink>
            )}
          </div>

          <div className="header_main">
            <div className="header-left">
              <img
                className="logo"
                onClick={() => navigate("/")}
                src={logo}
                alt="Logo"
              />
            </div>
            <header className="header">
              <nav
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <NavLink to="/blogs">
                  <button
                    className="btn border-0 text-light"
                    style={{
                      padding: "10px 15px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                  >
                    Blog /
                  </button>
                </NavLink>
                <NavLink to="/events">Find Your Travel Buddy /</NavLink>
                <NavLink to="/events">Events /</NavLink>
                <NavLink to="/entertainment">Plan Your Trip /</NavLink>
                <NavDropdown title="More" id="basic-nav-dropdown">
                  {isLoggedIn ? (
                    <NavDropdown.Item className="text-danger" onClick={handleLogout}>
                      <IoMdLogOut className="me-2" />
                      Logout
                    </NavDropdown.Item>
                  ) : (
                    <NavDropdown.Item onClick={() => navigate("/login")}>
                      <FaSignInAlt className="me-2" />
                      Please Log In
                    </NavDropdown.Item>
                  )}
                </NavDropdown>
              </nav>
            </header>
          </div>
        </div>

        {/* Mobile View */}
        <div className="mobileView">
          <div
            className="p-3"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            <CiMenuFries
              style={{
                color: "#fff",
                fontSize: "40px",
                cursor: "pointer",
                fontWeight: "600",
              }}
              onClick={handleShow}
            />
            {isLoggedIn ? (
              <NavLink to="/profile">
                <button style={{ textTransform: "capitalize" }} className="account">
                  <FaUser className="text-light icon" />
                  Hello {username}
                </button>
              </NavLink>
            ) : (
              <NavLink to="/login">
                <button className="account">
                  <span>
                    <FaUser color="#3cffd0" />
                  </span>{" "}
                  Sign In
                </button>
              </NavLink>
            )}
          </div>

          <Offcanvas
            show={show}
            onHide={handleClose}
            style={{
              backgroundColor: "#000",
              color: "#fff",
              width: "80%",
              boxShadow: "0px 0px 57px -19px",
            }}
          >
            <Offcanvas.Header closeButton style={{ filter: "invert(1)" }}>
              <Offcanvas.Title>
                <img
                  className="logo1"
                  onClick={() => navigate("/")}
                  src={logo}
                  alt="Logo"
                />
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <ul
                className="mt-4 px-0"
                style={{ textDecoration: "none", listStyle: "none" }}
              >
                <NavLink to="/blogs">
                  <button
                    className="btn border-0 text-light"
                    style={{
                      padding: "10px 15px",
                      fontSize: "16px",
                      borderRadius: "8px",
                      boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
                      transition: "0.3s",
                      cursor: "pointer",
                    }}
                  >
                    Blog /
                  </button>
                </NavLink>
                <hr />
                <NavLink to="/events" className="text-dark">
                  <li className="text-white ps-4"> Find Your Travel Buddy </li>
                </NavLink>
                <hr />
                <NavLink className="text-dark">
                  <li className="text-white ps-4"> Events </li>
                </NavLink>
                <hr />
                <NavLink className="text-dark">
                  <li className="text-white ps-4"> Plan Your Trip </li>
                </NavLink>
                <hr />
                <NavDropdown title="More" id="basic-nav-dropdown" className="ps-4">
                  {isLoggedIn ? (
                    <NavDropdown.Item className="text-danger" onClick={handleLogout}>
                      Logout
                    </NavDropdown.Item>
                  ) : (
                    <NavDropdown.Item onClick={() => navigate("/login")}>
                      <FaSignInAlt className="me-2" />
                      Please Log In
                    </NavDropdown.Item>
                  )}
                </NavDropdown>
                <hr />
              </ul>
            </Offcanvas.Body>
          </Offcanvas>
        </div>
      </div>
    </>
  );
};

export default Header;