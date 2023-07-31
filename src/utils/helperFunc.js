import Cookies from "js-cookie";
import api from "./axioswrapper";

export const getUserDetails = () => {
  const userDetails = localStorage.getItem("user");
  const { userId } = JSON.parse(userDetails);
  return userId;
};

export const logoutFunc = async () => {
  const userId = getUserDetails();
  await api.post("/logout", { userId });
  Cookies.remove("auth_token");
  localStorage.clear();
};
