import "./login.scss";
import { useState } from "react";
import axios from "axios";

const Login = ({ setShowLogin, setCurrentUser }) => {
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [failure, setFailure] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [emailChangeValue, setEmailChangeValue] = useState("");
  const [message, setMessage] = useState("");

  const sumbitEmail = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/forgotpassword", {
        email: emailChangeValue,
      });
      if (res) {
        setMessage("Email sent!");
      }
    } catch (err) {
      setMessage(err.response.data.message);
    }
  };

  const handleSumbit = async (e) => {
    e.preventDefault();
    const user = {
      email: email,
      password: password,
    };

    try {
      const { data } = await axios.post("/signin", user);
      localStorage.setItem("jwt", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      setCurrentUser(data.user.username);
      setShowLogin(false);
    } catch (err) {
      setFailure(true);
    }
  };

  return (
    <div className="login">
      <div className="login__content">
        <button
          title="Close"
          onClick={() => setShowLogin(false)}
          className="login__close"
        >
          &times;
        </button>
        <div className="login__logo">
          <img src="./logo.png" alt="logo" />
        </div>
        <form className="login__formSumbit" onSubmit={(e) => handleSumbit(e)}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            disabled={!password || !email}
            className="login__formSumbit--button"
            data-testid="loginButton"
          >
            Login
          </button>
        </form>
        {failure && (
          <span style={{ color: "red", textAlign: "center" }}>
            You entered the wrong value or the user with this email doesn't
            exist!
          </span>
        )}
        <button
          className="login__forgotPassBtn"
          onClick={() => setEmailVisible(true)}
        >
          Forgot the password?
        </button>
        {emailVisible && (
          <>
            <form className="login__forgotPassDiv">
              <input
                type="email"
                value={emailChangeValue}
                placeholder="Type your email"
                onChange={(e) => setEmailChangeValue(e.target.value)}
              />
              <button
                className="login__forgotPassDiv--emailBtn"
                onClick={(e) => sumbitEmail(e)}
              >
                Send
              </button>
            </form>
            {message && <span style={{ textAlign: "center" }}>{message}</span>}
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
