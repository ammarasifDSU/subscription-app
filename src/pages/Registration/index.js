import React, { useState } from "react";
import "../Registration/Registration.css";
import { Link, useNavigate } from "react-router-dom";
import api from "../../utils/axioswrapper";

const Registration = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const password = formData.password;
    const email = formData.email;
    const username = formData.username;

    try {
      let stringifyData = JSON.stringify({ username, email, password });
      await api.post("/register", stringifyData);

      // Redirect to the login page after successful registration
      navigate("/login");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Registration failed. Please try again.");
      }
    }
  };

  return (
    <div className="text-center m-5-auto">
      <h2>Join us</h2>
      <h4>Create your personal account</h4>

      <form onSubmit={handleSubmit}>
        <p>
          <label>Username</label>
          <br />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </p>
        <p>
          <label>Email address</label>
          <br />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </p>
        <p>
          <label>Password</label>
          <br />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
          />
        </p>
        {error && <p className="errorMxg">{error}</p>}
        <p>
          <button id="sub_btn" type="submit">
            Register
          </button>
        </p>
      </form>
      <footer>
        <p>
          Already have an account?<Link to="/login"> Sign In</Link>.
        </p>
      </footer>
    </div>
  );
};

export default Registration;
