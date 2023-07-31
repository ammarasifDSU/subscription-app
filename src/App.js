import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Registration from "./pages/Registration";
import Services from "./pages/Services";
import Statistics from "./pages/Statistics";
import PrivateRoute from "./components/PrivateRoute";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Routes>
        {/* Unauthenticated Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/statistics" element={<Statistics />} />

        {/* Authenticated Routes */}
        <Route
          path="/services"
          element={
            <PrivateRoute redirectTo="/login">
              <Services />
            </PrivateRoute>
          }
        />

        {/* Default Redirect */}
        <Route path="/" element={<Login />} />
        <Route path="*" element={<Login />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
