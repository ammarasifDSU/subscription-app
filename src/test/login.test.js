import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import Login from "../pages/Login";
import api from "../utils/axioswrapper.js";

jest.mock("../utils/axioswrapper.js");
const mockPost = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => jest.fn(),
}));

describe("Login component", () => {
  beforeEach(() => {
    mockPost.mockClear();
    api.post.mockImplementation(mockPost);
  });

  it("renders the login form", () => {
    const { getByLabelText, getByText } = render(<Login />);
    expect(getByLabelText("Email address")).toBeInTheDocument();
    expect(getByLabelText("Password")).toBeInTheDocument();
    expect(getByText("Login")).toBeInTheDocument();
    expect(getByText("First time? Create an account.")).toBeInTheDocument();
  });

  it("handles form submission successfully", async () => {
    const mockToken = "mockAuthToken";
    const mockUserObj = { id: 1, name: "John Doe", email: "john@example.com" };
    mockPost.mockResolvedValueOnce({
      data: { token: mockToken, userObj: mockUserObj },
    });

    const { getByLabelText, getByText } = render(<Login />);
    const emailInput = getByLabelText("Email address");
    const passwordInput = getByLabelText("Password");
    const submitButton = getByText("Login");

    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    fireEvent.click(submitButton);

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));

    expect(mockPost).toHaveBeenCalledWith(
      "/login",
      JSON.stringify({ email: "test@example.com", password: "password123" })
    );
    expect(document.cookie).toContain("auth_token=mockAuthToken");
    expect(localStorage.getItem("user")).toEqual(JSON.stringify(mockUserObj));
    expect(navigate).toHaveBeenCalledWith("/services");
  });

  it("handles form submission failure", async () => {
    const errorMessage = "Invalid credentials";
    mockPost.mockRejectedValueOnce({
      response: { data: { error: errorMessage } },
    });

    const { getByText, queryByText } = render(<Login />);
    const submitButton = getByText("Login");

    fireEvent.click(submitButton);

    await waitFor(() => expect(mockPost).toHaveBeenCalledTimes(1));

    expect(queryByText(errorMessage)).toBeInTheDocument();
    expect(document.cookie).not.toContain("auth_token=");
    expect(localStorage.getItem("user")).toBeNull();
    expect(navigate).not.toHaveBeenCalled();
  });
});
