import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./sign.css";
import Header from "./Header";
import logo from "../components/images/logo.png";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [ChekEmailEx, setChekEmailEx] = useState();
  const [OtpVaidate, setOtpVaidate] = useState(false);
  const [OtpSend, setOtpSend] = useState(false);
  const [otp, setotp] = useState("");
  const [ValidatePassword, setValidatePassword] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) {
      toast.error("Please enter both email and password!");
      return;
    }
    try {
      const response = await fetch("http://82.29.166.100:4000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Login successful!");
        localStorage.setItem("userData", JSON.stringify(result.user));
        localStorage.setItem("token", JSON.stringify(result.token));
        
        navigate("/");
        console.log(result.token, "resss");
      } else {
        toast.error(result.message || "Login failed. Please try again.");
      }
    } catch (error) {
      toast.error("Network error! Please try again later.");
      console.error(error);
    }
  };

  const ChekExitEmail = async (e, email) => {
    e.preventDefault();
    try {
      const response = await fetch("http://82.29.166.100:4000/api/auth/checkemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      setChekEmailEx(result);
      if (result.status === 0) {
        setOtpVaidate(true);
        setValidatePassword(true);
      } else {
        setOtpVaidate(false);
        setValidatePassword(false);
      }
    } catch (error) {
      toast.error("Network error! Please try again later.");
      console.error(error);
    }
  };

  const Rgister = async () => {
    try {
      const formData = new FormData();
      formData.append("email", email);
      formData.append("password", password);
      const response = await fetch("http://82.29.166.100:4000/api/auth/register", {
        method: "POST",
        body: formData,
      });
      const result = await response.json();
      if (response.ok) {
        toast.success("Registration successful!");
        localStorage.setItem("userData", JSON.stringify(result.user));
        localStorage.setItem("token", JSON.stringify(result.token));
        console.log("User saved to localStorage:", result.user);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(result.message || "Registration failed!");
      }
    } catch (error) {
      toast.error("Network error! Please try again later.");
      console.error(error);
    }
  };

  const SendOtp = async () => {
    try {
      const response = await fetch("http://82.29.166.100:4000/api/auth/sendemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await response.json();
      console.log(result);
      toast.success("Otp Sent Successfully!");
      setOtpSend(true);
    } catch (error) {
      toast.error("Network error! Please try again later.");
      console.error(error);
    }
  };

  const ValidateOtp = async () => {
    try {
      const response = await fetch("http://82.29.166.100:4000/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const result = await response.json();
      console.log(result);
      if (result.status === 1) {
        setOtpVaidate(true);
        toast.success("OTP Validated Successfully!");
      } else {
        setOtpVaidate(false);
        toast.error("Invalid OTP!");
      }
    } catch (error) {
      toast.error("Network error! Please try again later.");
      console.error(error);
    }
  };

  const ValidateOtps = () => {
    if (otp.length === 6) {
      ValidateOtp();
    }
  };

  useEffect(() => {
    setValidatePassword(password.length >= 6);
  }, [password]);

  useEffect(() => {
    if (otp.length === 6) {
      ValidateOtps();
    }
  }, [otp]);

  return (
    <>
      <div className="main">
        <div onClick={()=>{navigate("/")}} className="mx-auto pt-2" style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <img width={"120px"} src={logo} alt="" />
        </div>
        <div className="container-fluid mt-3">
          <div className="row">
            <div className="col-lg-4 m-auto">
              <ToastContainer position="top-right" autoClose={3000} />
              <div className="w-100 login-box1">
                <h4 className="text-dark" style={{ fontWeight: "900", textAlign: "center" }}>
                  <span>Register in to Solotrip</span> <br /> create an account
                </h4>
                <p style={{ textAlign: "center" }}>
                  This email will be used to sign into Vox Media sites. By submitting your email, you agree to our Terms and Privacy Policy to receive email correspondence from us.
                </p>
                <form className="mt-2" autoComplete="off">
                  <div className="mb-2">
                    <div>
                      <span className="inl" id="inl"> Email: </span>
                      <input
                        autoComplete="off"
                        type="text"
                        placeholder="Email"
                        className="input-field ps-2 py-2"
                        style={{ width: "100%" }}
                        readOnly={OtpVaidate === 1}
                        value={email}
                        onChange={(e) => {
                          ChekExitEmail(e, e.target.value);
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    {ChekEmailEx?.status === 1 && (
                      <div style={{ width: "100%" }}>
                        <button
                          type="button"
                          disabled={OtpVaidate === 1}
                          onClick={SendOtp}
                          className="btn btn-primary input-field mt-4"
                        >
                          Send OTP
                        </button>
                      </div>
                    )}
                  </div>

                  {OtpSend && (
                    <div className="input-group">
                      <input
                        autoComplete="off"
                        type="text"
                        placeholder="Enter OTP"
                        className="input-field ps-2 py-2"
                        readOnly={OtpVaidate}
                        style={{ width: "100%" }}
                        value={otp}
                        onChange={(e) => setotp(e.target.value)}
                      />
                    </div>
                  )}

                  {OtpVaidate && (
                    <div className="input-group">
                      <input
                        autoComplete="off"
                        type="password"
                        placeholder="Password"
                        className="input-field ps-2 py-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                     <p  onClick={() => navigate("/forgot-password/send-otp")} style={{ color: "blue", cursor: "pointer", }}>Forgot Password</p>
                    </div>
                  )}

                  {ValidatePassword && (
                    <button
                      type="button"
                      style={{ textTransform: "uppercase" }}
                      onClick={() => {
                        ChekEmailEx?.passwordStaus === true ? handleLogin() : Rgister();
                      }}
                      className="login-button"
                    >
                      Continue with email
                    </button>
                  )}
                  <p className="para">
                    This email will be used to sign into Vox Media sites. By submitting your email, you agree to our Terms and Privacy Policy to receive email correspondence from us.
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
