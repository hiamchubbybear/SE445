import React from "react";
import "./Register.css"; 


const Register = () => {
  return (
    <div className="Rergister-page-container">
      {/* Logo Section */}
      <div className="logo-container">
        <a href="/" className="logo-link">
          <img src="data:image/png;base64,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" alt="Logo" className="site-logo" />
        </a>
      </div>

      {/* Left Section (Form) */}
      <div className="Rergister-form-section">
        <h1 className="Rergister-title">Create an account</h1>
        <p className="Rergister-subtitle">Register and explore our courses.</p>

        <form>
          <input
            type="email"
            placeholder="Email"
            className="Rergister-input"
          />
          <input
            type="password"
            placeholder="Password"
            className="Rergister-input"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="Rergister-input"
          />
          <button className="Rergister-button">Create account</button>
        </form>

        <div className="Rergister-or">or</div>
        <div className="Rergister-social-buttons">         
          <button className="Rergister-social-button">
            <img
              src="https://img.icons8.com/color/48/google-logo.png"
              alt="Google"
              className="Rergister-social-icon"
            />
            Sign in with Google
          </button>
        </div>

        <p className="Rergister-footer">
          Already have an account?{" "}
          <a href="/login" className="Rergister-link">Login</a>
        </p>
        <p className="Register-footer">
          Need help with verify account?{" "}
          <a href="/help" className="Rergister-link">Click here</a>
        </p>
      </div>

      {/* Right Section (Banner) */}
      <div className="Rergister-banner-section">
        <img
          src="https://cdn.medoo.io/2024/11/04/banner_web_mobile_01_(1)_1730689900327.webp" // Đường dẫn tới banner
          alt="Banner"
          className="Rergister-banner"
        />
      </div>
    </div>
  );
};

export default Register;
