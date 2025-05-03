import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Forgot.css";
import logo from "./images/logo.png";

const ForgotPasswordSendOtp = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputsRef = useRef([]);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const trimmed = email.trim();
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(trimmed);
  };

  const validatePassword = (password) => {
    const regex = /^[a-zA-Z0-9]{7,}$/;
    return regex.test(password);
  };

  const checkEmailExists = async (email) => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/checkemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Email check failed");
      }
      return result; // Expecting { success: true } if email exists
    } catch (error) {
      setError(error.message || "Error checking email.");
      return false;
    }
  };

  const sendOtp = async () => {
    try {
      const res = await fetch("http://localhost:4000/api/auth/sendemail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to send OTP");
      }
      return result; // Expecting { success: true } if OTP sent
    } catch (error) {
      setError(error.message || "Error sending OTP.");
      return false;
    }
  };

  const handleNext = async () => {
    setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!validateEmail(email)) {
      setError("Enter a valid email.");
      return;
    }

    setLoading(true);
    const exists = await checkEmailExists(email.trim());
    if (!exists) {
      setError("Email does not exist.");
      setLoading(false);
      return;
    }

    const otpSent = await sendOtp();
    if (otpSent) {
      setStep(2);
    } else {
      setError("Failed to send OTP.");
    }
    setLoading(false);
  };

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updatedOtp = [...otp];
    updatedOtp[index] = value;
    setOtp(updatedOtp);
    if (value && index < 5) inputsRef.current[index + 1].focus();
  };

  const handlePaste = (e) => {
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split("").slice(0, 6);
      setOtp(newOtp);
      inputsRef.current[5].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async () => {
    setError("");
    const fullOtp = otp.join("");
    if (fullOtp.length < 6) {
      setError("Enter complete 6-digit OTP.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/verifyotp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: fullOtp }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Invalid or expired OTP");
      }
      if (result) {
        setStep(3);
      } else {
        setError(result.message || "Invalid or expired OTP");
      }
    } catch (error) {
      setError(error.message || "Error verifying OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setError("");
    if (!password || !confirmPassword) {
      setError("Please fill all fields!");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (!validatePassword(password)) {
      setError(
        "Password must be at least 7 characters, containing only letters and numbers."
      );
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:4000/api/auth/forgotpassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to reset password");
      }
      if (result) {
        setError("Password reset successful!");
        setTimeout(() => {
          setStep(1);
          setEmail("");
          setOtp(["", "", "", "", "", ""]);
          setPassword("");
          setConfirmPassword("");
          navigate("/profile");
        }, 2000);
      } else {
        setError(result.message || "Failed to reset password.");
      }
    } catch (error) {
      setError(error.message || "Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setError("");
    if (step === 1) {
      navigate("/profile"); // Changed to /login instead of /profile
    } else if (step === 2) {
      setStep(1);
      setOtp(["", "", "", "", "", ""]);
    } else if (step === 3) {
      setStep(2);
      setPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <div
      className="container d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <div className="row forgot-wrapper w-100">
        <div className="col-md-6 forgot-left">
          <button
            className="forgot-back-button"
            onClick={handleBack}
            disabled={loading}
          >
            ←
          </button>
          <img
            src={logo}
            alt="Logo"
            style={{ height: "100px", width: "100px", objectFit: "contain" }}
          />
          <h1>
            {step === 1
              ? "Reset Password"
              : step === 2
              ? "Verify OTP"
              : "Set New Password"}
          </h1>
          <p>
            {step === 1
              ? "Enter your email to receive a verification code."
              : step === 2
              ? "Check your email and enter the OTP."
              : "Create a strong password you’ll remember."}
          </p>
        </div>

        <div className="col-md-6 forgot-right">
          <div className="forgot-form">
            {step === 1 ? (
              <>
                <h2>Send OTP</h2>
                <p>We’ll send a verification code to your email.</p>
                {error && (
                  <p
                    className={
                      error.includes("successful")
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {error}
                  </p>
                )}
                <div className="forgot-input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  className="forgot-button"
                  onClick={handleNext}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </>
            ) : step === 2 ? (
              <>
                <h2>Enter OTP</h2>
                <p>Enter the 6-digit code sent to your email.</p>
                {error && (
                  <p
                    className={
                      error.includes("successful")
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {error}
                  </p>
                )}
                <div className="forgot-otp-boxes">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength="1"
                      value={digit}
                      onChange={(e) => handleOtpChange(e.target.value, i)}
                      onKeyDown={(e) => handleKeyDown(e, i)}
                      onPaste={i === 0 ? handlePaste : null}
                      ref={(el) => (inputsRef.current[i] = el)}
                      className="forgot-otp-input"
                      disabled={loading}
                    />
                  ))}
                </div>
                <button
                  className="forgot-verify-button"
                  onClick={handleVerify}
                  disabled={loading}
                >
                  {loading ? "Verifying..." : "Verify"}
                </button>
                <button
                  className="forgot-resend-button"
                  onClick={sendOtp}
                  disabled={loading}
                >
                  {loading ? "Resending..." : "Resend OTP"}
                </button>
              </>
            ) : (
              <>
                <h2>New Password</h2>
                <p>Enter and confirm your new password.</p>
                {error && (
                  <p
                    className={
                      error.includes("successful")
                        ? "text-success"
                        : "text-danger"
                    }
                  >
                    {error}
                  </p>
                )}
                <div className="forgot-input-group">
                  <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <div className="forgot-input-group">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
                </div>
                <button
                  className="forgot-reset-button"
                  onClick={handlePasswordReset}
                  disabled={loading}
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordSendOtp;