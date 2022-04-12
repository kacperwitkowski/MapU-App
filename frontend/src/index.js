import React from "react";
import ReactDOM from "react-dom";
import "./index.scss";
import MapboxGLMap from "./App";
import { store } from "./components/redux/store";
import { Provider } from "react-redux";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ResetPassword from "./components/resetPassword/resetPassword";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <MapboxGLMap />
      <BrowserRouter>
        <Routes>
          <Route path="/resetpassword/:token" element={<ResetPassword />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
