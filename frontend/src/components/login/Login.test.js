import { fireEvent, render, screen } from "@testing-library/react";
import Login from "./login";
import "@testing-library/jest-dom";

// jest.mock("mapbox-gl/dist/mapbox-gl", () => ({
//   GeolocateControl: jest.fn(),
//   Map: jest.fn(() => ({
//     addControl: jest.fn(),
//     on: jest.fn(),
//     remove: jest.fn(),
//   })),
//   NavigationControl: jest.fn(),
// }));

test("email input should be rendered", () => {
  render(<Login />);
  const inputEL = screen.getByPlaceholderText(/Email/i);
  expect(inputEL).toBeInTheDocument();
});

test("password input should be rendered", () => {
  render(<Login />);
  const inputEL = screen.getByPlaceholderText(/Password/i);
  expect(inputEL).toBeInTheDocument();
});

test("email input should change", () => {
  render(<Login />);
  const inputEL = screen.getByPlaceholderText(/Email/i);
  const testValue = "test";
  fireEvent.change(inputEL, { target: { value: testValue } });
  expect(inputEL.value).toBe(testValue);
});

test("password input should change", () => {
  render(<Login />);
  const inputEL = screen.getByPlaceholderText(/Password/i);
  const testValue = "test";
  fireEvent.change(inputEL, { target: { value: testValue } });
  expect(inputEL.value).toBe(testValue);
});

test("button should not be disabled when inputs value is not empty", () => {
  render(<Login />);
  const inputPassword = screen.getByPlaceholderText(/Password/i);
  const inputEmail = screen.getByPlaceholderText(/Email/i);
  const loginBtn = screen.getByTestId("loginButton");

  const testValue = "test";
  fireEvent.change(inputPassword, { target: { value: testValue } });
  fireEvent.change(inputEmail, { target: { value: testValue } });
  expect(loginBtn).not.toBeDisabled();
});

test("user should be rendered after fetching", async () => {
  render(<Login />);
  const inputPassword = screen.getByPlaceholderText(/Password/i);
  const inputEmail = screen.getByPlaceholderText(/Email/i);
  const loginBtn = screen.getByTestId("loginButton");

  const testValue = "test";

  fireEvent.change(inputPassword, { target: { value: testValue } });
  fireEvent.change(inputEmail, { target: { value: testValue } });
  fireEvent.click(loginBtn);

  const userItem = await screen.findByText("John");

  expect(userItem).toBeInTheDocument();
});
