// import React, { useState, useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import logo from "../components/images/logo.png";
// import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import "./header.css";
// import { FaUser } from "react-icons/fa";
// import { CiMenuFries } from "react-icons/ci";
// import { CgProfile } from "react-icons/cg";
// import { FaBlog } from "react-icons/fa";
// import { IoMdLogOut } from "react-icons/io";
// import Button from "react-bootstrap/Button";
// import Offcanvas from "react-bootstrap/Offcanvas";
// import { Modal, Form } from "react-bootstrap";
// // import { IoMdLogOut } from "react-icons/io";
// import Select from "react-select";
// import { State, City } from "country-state-city";
// const Header = () => {
//   const navigate = useNavigate();
//   const [show, setShow] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);

//   useEffect(() => {
//     const userData = localStorage.getItem("userData");
//     if (userData) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleLogout = () => {
//     const requestOptions = {
//       method: "POST",
//       redirect: "follow",
//     };

//     fetch("http://82.29.166.100:4000/api/auth/logout", requestOptions)
//       .then((response) => response.json())
//       .then((result) => {
//         console.log("Logout API Result:", result);
//         localStorage.removeItem("userData");
//         localStorage.removeItem("token");
//         toast.success("Logout Successful!", {
//           position: "top-right",
//           autoClose: 3000,
//         });
//         setIsLoggedIn(false);
//         setTimeout(() => {
//           navigate("/login");
//         }, 3000);
//       })
//       .catch((error) => {
//         console.error("Logout API Error:", error);
//         toast.error("Logout failed. Please try again.");
//       });
//   };

//   const [selectedState, setSelectedState] = useState(null);
//   const [selectedCity, setSelectedCity] = useState(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);

//   // Fetching all states of India dynamically
//   const states = State.getStatesOfCountry("IN").map((state) => ({
//     value: state.isoCode,
//     label: state.name,
//   }));

//   // Fetch cities based on selected state
//   const cities = selectedState
//     ? City.getCitiesOfState("IN", selectedState.value).map((city) => ({
//         value: city.name,
//         label: city.name,
//       }))
//     : [];

//   return (
//     <>
//       <ToastContainer />
//       <div className="mainNAv">
//         {/* Desktop View */}
//         <div className="desktopView">
//           <div className="user-actions">
//             {isLoggedIn ? (
//               <NavLink to="/profile">
//                 <button className="account">
//                   <FaUser className="text-light icon" /> ACCOUNT
//                 </button>
//               </NavLink>
//             ) : (
//               <NavLink to="/login">
//                 <button className="account">
//                   <FaUser color="#3cffd0" /> Sign In
//                 </button>
//               </NavLink>
//             )}
//           </div>

//           <div className="header_main">
//             <div className="header-left">
//               <img
//                 className="logo"
//                 onClick={() => navigate("/")}
//                 src={logo}
//                 alt="Logo"
//               />
//             </div>
//             <header className="header">
//               <nav
//                 style={{
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "20px",
//                 }}
//               >
//                 <NavLink to="/tech">
//                   <button
//                     className="btn border-0 text-light"
//                     onClick={() => setDropdownOpen(!dropdownOpen)}
//                     style={{
//                       padding: "10px 15px",
//                       fontSize: "16px",
//                       borderRadius: "8px",
//                       boxShadow: "2px 2px 8px rgba(0,0,0,0.2)",
//                       transition: "0.3s",
//                       cursor: "pointer",
//                     }}
//                   >
//                     Blog ▼ /
//                   </button>
//                   {dropdownOpen && (
//                     <div
//                       className="dropdown-content"
//                       style={{
//                         position: "absolute",
//                         backgroundColor: "#fff",
//                         minWidth: "250px",
//                         boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
//                         borderRadius: "8px",
//                         padding: "15px",
//                         zIndex: 1000,
//                         color: "black",
//                       }}
//                     >
//                       <NavLink to="/tech" className="dropdown-item">
//                         Blog Home
//                       </NavLink>

//                       {/* State Dropdown */}
//                       <Select
//                         options={states}
//                         value={selectedState}
//                         onChange={(state) => {
//                           setSelectedState(state);
//                           setSelectedCity(null); // Reset city when state changes
//                         }}
//                         placeholder="Select a state..."
//                         styles={{
//                           container: (base) => ({ ...base, marginTop: "10px" }),
//                         }}
//                       />

//                       {/* City Dropdown */}
//                       <Select
//                         options={cities}
//                         value={selectedCity}
//                         onChange={setSelectedCity}
//                         placeholder="Select a city..."
//                         isDisabled={!selectedState} // Disable until state is selected
//                         styles={{
//                           container: (base) => ({ ...base, marginTop: "10px" }),
//                         }}
//                       />

//                       {/* Selected Values */}
//                       {selectedState && (
//                         <p style={{ marginTop: "10px" }}>
//                           State: {selectedState.label}
//                         </p>
//                       )}
//                       {selectedCity && <p>City: {selectedCity.label}</p>}
//                     </div>
//                   )}
//                 </NavLink>
//                 <NavLink to="/events">Find Your Travel Buddy /</NavLink>
//                 <NavLink to="/events">Events /</NavLink>
//                 <NavLink to="/entertainment">Plan Your Trip /</NavLink>
//                 <NavDropdown title="More" id="basic-nav-dropdown">
//                   <NavDropdown.Item className="text-dark">
//                     {/* <NavLink to="/add/blogs" style={{ color: "#000" }}>
//                       <FaBlog className="fs-6 me-2" />
//                       Create Blog
//                     </NavLink> */}
//                     <NavDropdown.Divider />
//                     <NavDropdown.Item className="text-dark">
//                       <NavLink to="/add/Events" style={{ color: "#000" }}>
//                         <IoMdLogOut /> Create Events
//                       </NavLink>
//                     </NavDropdown.Item>
//                   </NavDropdown.Item>
//                   <NavDropdown.Divider />
//                   <NavDropdown.Item
//                     className="text-danger"
//                     onClick={handleLogout}
//                   >
//                     <IoMdLogOut className="me-2" />
//                     Logout
//                   </NavDropdown.Item>
//                 </NavDropdown>
//               </nav>
//             </header>
//           </div>
//         </div>

//         {/* Mobile View */}
//         <div className="mobileView">
//           <div
//             className="p-3"
//             style={{ display: "flex", justifyContent: "space-between" }}
//           >
//             <CiMenuFries
//               style={{
//                 color: "#fff",
//                 fontSize: "40px",
//                 cursor: "pointer",
//                 fontWeight: "600",
//               }}
//               onClick={handleShow}
//             />
//             {isLoggedIn ? (
//               <NavLink to="/profile">
//                 <button className="account">
//                   <FaUser className="text-light icon" /> ACCOUNT
//                 </button>
//               </NavLink>
//             ) : (
//               <NavLink to="/login">
//                 <button className="account">
//                   <span>
//                     <FaUser color="#3cffd0" />
//                   </span>{" "}
//                   Sign In
//                 </button>
//               </NavLink>
//             )}
//           </div>

//           <Offcanvas
//             show={show}
//             onHide={handleClose}
//             style={{
//               backgroundColor: "#000",
//               color: "#fff",
//               width: "80%",
//               boxShadow: "0px 0px 57px -19px",
//             }}
//           >
//             <Offcanvas.Header closeButton style={{ filter: "invert(1)" }}>
//               <Offcanvas.Title>
//                 <img
//                   className="logo"
//                   onClick={() => navigate("/")}
//                   src={logo}
//                   alt="Logo"
//                 />
//               </Offcanvas.Title>
//             </Offcanvas.Header>
//             <Offcanvas.Body>
//               <ul
//                 className="mt-4 px-0"
//                 style={{ textDecoration: "none", listStyle: "none" }}
//               >
//                 <NavLink to="/tech" className="text-dark">
//                   <li className="text-white ps-4"> Blog </li>
//                 </NavLink>
//                 <hr />
//                 <NavLink to="/events" className="text-dark">
//                   <li className="text-white ps-4"> Find Your Travel Buddy </li>
//                 </NavLink>
//                 <hr />
//                 <NavLink className="text-dark">
//                   <li className="text-white ps-4"> Events </li>
//                 </NavLink>
//                 <hr />
//                 <NavLink className="text-dark">
//                   <li className="text-white ps-4"> Plan Your Trip </li>
//                 </NavLink>
//                 <hr />
//                 <NavDropdown
//                   title="More"
//                   id="basic-nav-dropdown"
//                   className="ps-4"
//                 >
//                   <NavDropdown.Item className="text-dark">
//                     <NavLink to="/add/blogs" style={{ color: "#000" }}>
//                       Create Blog
//                     </NavLink>
//                   </NavDropdown.Item>
//                   <NavDropdown.Divider />
//                   <NavDropdown.Item
//                     className="text-danger"
//                     onClick={handleLogout}
//                   >
//                     Logout
//                   </NavDropdown.Item>
//                 </NavDropdown>
//                 <hr />
//               </ul>
//             </Offcanvas.Body>
//           </Offcanvas>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Header;





