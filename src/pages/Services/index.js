import React, { useState, useEffect } from "react";
import "../Services/Services.css";
import { useNavigate } from "react-router-dom";
import { getUserDetails, logoutFunc } from "../../utils/helperFunc";
import api from "../../utils/axioswrapper";

const Services = () => {
  const [services, setServices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const userId = getUserDetails();
      const response = await api.post("/services", { userId });

      const data = await response.data;
      setServices(data);
    } catch (error) {}
  };

  const handleSubscribe = async (e, serviceId) => {
    e.preventDefault();
    const userId = getUserDetails();
    const postData = { userId, serviceId };
    try {
      const response = await api.post("/subscribe", postData);

      const updatedService = await response?.data?.currentSubscription;

      // Update the 'services' state with the updated subscription status
      if (updatedService) {
        setServices((prevServices) =>
          prevServices.map((service) =>
            service._id === updatedService.service_id
              ? {
                  ...service,
                  isSubscribed:
                    updatedService.subscription_status === "subscribe"
                      ? true
                      : false,
                }
              : service
          )
        );
      }
    } catch (error) {}
  };

  const handleUnsubscribe = async (serviceId) => {
    const userId = getUserDetails();
    const postData = { userId, serviceId };
    try {
      const response = await api.post("/unsubscribe", postData);

      const updatedService = await response.data.updatedSubscription;
      // Update the 'services' state with the updated subscription status
      if (updatedService) {
        setServices((prevServices) =>
          prevServices.map((service) =>
            service._id === updatedService.service_id
              ? {
                  ...service,
                  isSubscribed:
                    updatedService.subscription_status === "subscribe"
                      ? true
                      : false,
                }
              : service
          )
        );
      }
    } catch (error) {}
  };

  const handleLogout = async () => {
    await logoutFunc();
    navigate("/login");
  };

  return (
    <div className="services-container">
      <h2>Services</h2>
      <button className="logoutBtn" onClick={handleLogout}>
        Logout
      </button>
      <div className="services-list">
        {services?.map((service) => (
          <div className="service-item card float" key={service._id}>
            <img className="image-item" alt="img"/>
            <div className="service-content">
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <div>
                {service.isSubscribed ? (
                  <button
                    className="subscribe-btn"
                    onClick={() => handleUnsubscribe(service._id)}
                  >
                    Unsubscribe
                  </button>
                ) : (
                  <button
                    className="subscribe-btn"
                    onClick={(e) => handleSubscribe(e, service._id)}
                  >
                    Subscribe
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Services;
