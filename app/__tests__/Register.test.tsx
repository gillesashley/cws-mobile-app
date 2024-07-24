import { AuthProvider } from "@/components/AuthProvider";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import axios from "axios";
import React from "react";
import Register from "../register"; // Adjust the path if necessary

// Mock the axios module
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Register Component", () => {
  const setup = () => {
    const utils = render(
      <AuthProvider>
        <Register />
      </AuthProvider>
    );
    return { ...utils };
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test("should render the registration form", () => {
    const { getByPlaceholderText, getByText } = setup();

    expect(getByPlaceholderText("Enter your name")).toBeTruthy();
    expect(getByPlaceholderText("Enter your email")).toBeTruthy();
    expect(getByPlaceholderText("Enter your phone number")).toBeTruthy();
    expect(getByPlaceholderText("Enter your password")).toBeTruthy();
    expect(getByPlaceholderText("Confirm your password")).toBeTruthy();
    expect(getByText("Upload Ghana Card Image")).toBeTruthy();
    expect(getByText("Select Region")).toBeTruthy();
    expect(getByText("Select Constituency")).toBeTruthy();
  });

  test("should validate input fields", async () => {
    const { getByText, getByPlaceholderText } = setup();

    fireEvent.press(getByText("Register"));

    await waitFor(() => {
      expect(getByText("Please fill in all fields")).toBeTruthy();
    });

    fireEvent.changeText(getByPlaceholderText("Enter your name"), "John Doe");
    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "invalid-email"
    );
    fireEvent.press(getByText("Register"));

    await waitFor(() => {
      expect(getByText("Please enter a valid email address")).toBeTruthy();
    });
  });

  test("should handle successful registration", async () => {
    const mockResponse = { data: { success: true } };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(getByPlaceholderText("Enter your name"), "John Doe");
    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "john@example.com"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your phone number"),
      "1234567890"
    );
    fireEvent.changeText(
      getByPlaceholderText("Enter your password"),
      "password123"
    );
    fireEvent.changeText(
      getByPlaceholderText("Confirm your password"),
      "password123"
    );

    fireEvent.press(getByText("Register"));

    await waitFor(() => {
      expect(getByText("Registration successful")).toBeTruthy();
    });
  });

  test("should handle registration errors", async () => {
    const mockError = {
      response: {
        status: 422,
        data: {
          errors: {
            email: ["The email has already been taken."],
          },
        },
      },
    };
    mockedAxios.post.mockRejectedValueOnce(mockError);

    const { getByPlaceholderText, getByText } = setup();

    fireEvent.changeText(
      getByPlaceholderText("Enter your email"),
      "taken@example.com"
    );
    fireEvent.press(getByText("Register"));

    await waitFor(() => {
      expect(getByText("The email has already been taken.")).toBeTruthy();
    });
  });

  // Add more tests for other validation cases, edge cases, etc.
});
