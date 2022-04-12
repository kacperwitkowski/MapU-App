import { useState } from "react";
import "./resetPassword.scss";
import axios from "axios";
import logo from "./logo.png";
import { FaLock } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
  let navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const sumbitData = async (e) => {
    e.preventDefault();
    const pathname = window.location.pathname;
    const token = pathname.slice(15);

    const userPassword = {
      password: password,
      passwordConfirm: passwordConfirm,
    };

    try {
      const res = await axios.patch(`/resetpassword/${token}`, userPassword);
      if (res.status === 200) {
        navigate("/");
      }
    } catch (err) {
      setStatus(err.response.status);
    }
  };

  return (
    <div className="resetPassword">
      <ul class="circles">
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
      <div className="resetPassword__menu">
        <img src={logo} alt="mapu logo"/>
        <h1>Reset your password</h1>
      </div>
      <form className="resetPassword__form">
        <FaLock />
        <h4>Enter your new password here</h4>
        <input
          type="password"
          placeholder="Type new password"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
        <input
          type="password"
          placeholder="Type new password again"
          onChange={(e) => setPasswordConfirm(e.target.value)}
          value={passwordConfirm}
        />
        {status === 400 ? (
          <span style={{ color: "red" }}>Token is invalid or has expired</span>
        ) : (
          ""
        )}
        {status === 500 ? (
          <span style={{ color: "red" }}>One of the passwords is wrong!</span>
        ) : (
          ""
        )}
        <button onClick={(e) => sumbitData(e)}>Sumbit</button>
      </form>
    </div>
  );
};

export default ResetPassword;
