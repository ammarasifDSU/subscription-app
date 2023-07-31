import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../Login/Login.css";
import Cookies from "js-cookie";
import api from "../../utils/axioswrapper";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const email = formData.email;
      const password = formData.password;
      const stringifyData = JSON.stringify({ email, password });
      const response = await api.post("/login", stringifyData);
      const { token, userObj } = response.data;

      // Save the token to cookies
      Cookies.set("auth_token", token, { expires: 1 }); // Set expiration time as needed
      localStorage.setItem("user", JSON.stringify(userObj));
      // Redirect to a protected route
      navigate("/services");
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Login failed. Please try again.");
      }
    }
  };

  return (
    <div className="text-center m-5-auto">
      <h2>Sign in to us</h2>
      <form onSubmit={handleSubmit}>
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
            Login
          </button>
        </p>
      </form>
      <footer>
        <p>
          First time? <Link to="/register">Create an account</Link>.
        </p>
      </footer>
    </div>
  );
};

export default Login;
