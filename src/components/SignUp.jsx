/* eslint-disable no-unused-vars */
import React, { useState, useRef } from "react";
import { FaUser, FaLock, FaPlus } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import "react-toastify/dist/ReactToastify.css";
import "./sign.css";
import Header from "./Header";
import logo from '../components/images/logo.png'

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [textarea, setTextarea] = useState("");
  const [image, setImage] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Handle Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Click the file input when "+" button is clicked
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Handle User Registration
  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      toast.error("Please fill all fields including profile image!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("textarea", textarea);

      const response = await fetch("http://localhost:4000/api/auth/register", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        toast.success("Registration successful!");

        // Save user data in localStorage
        localStorage.setItem("user", JSON.stringify(result.user));

        console.log("User saved to localStorage:", result.user);

        // Navigate to Home Page after 1.5 seconds
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(result.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("Network error! Please try again later.");
      console.error(error);
    }
  };

  return (
    <div>
      <div className="main">
        {/* <Header /> */}
        <div className="container-fluid">
          <ToastContainer position="top-right" autoClose={3000} />
          <div className="login-box">
            {/* Avatar with Clickable "+" Button */}
            <div style={{display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div className="mb-5">
                  <img width={"120px"} src={logo} alt="" />
                </div>
               </div>
           

            {/* Form Section */}
            <form onSubmit={handleSignUp}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="Name"
                  className="input-field"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type="email"
                  placeholder="Email"
                  className="input-field"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group">
                <input
                  type="password"
                  placeholder="Password"
                  className="input-field"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div class="form-floating">
  <textarea      value={textarea}
                  onChange={(e) => setTextarea(e.target.value)} class="form-control"  id="floatingTextarea"></textarea>
  <label for="floatingTextarea">Bio</label>
</div>
              <div className="mt-3">
              <button type="submit" className="login-button">
                SIGN UP
              </button>
              </div>
             
              <p className="para">This email will be used to sign into Vox Media sites. By submitting your email, you agree to our Terms and Privacy Policy to receive email correspondence from us.</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
