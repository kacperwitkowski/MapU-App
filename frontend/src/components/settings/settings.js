import "./settings.scss";
import { useState } from "react";

const Settings = ({ setIsActive }) => {
  const lstorage = window.localStorage;
  const [isTrue1, setIsTrue1] = useState(false);
  const [isTrue2, setIsTrue2] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordAgain, setNewPasswordAgain] = useState("");
  const [emailMessage, setEmailMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(lstorage.getItem("user"));

  const deleteAccount = () => {
    setIsTrue1(false);
    setIsTrue2(false);
    let askToDelete = window.confirm(
      "Are you sure you want to delete your account? \n(You cannot undo this decision)"
    );
    if (askToDelete) {
      fetch("/deleteMe", {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      }).catch((err) => {
        throw err;
      });
      lstorage.removeItem("user");
      lstorage.removeItem("jwt");
      setCurrentUser(null);
      window.location.reload(false);
    }
  };

  const updateUserInfo = (e) => {
    e.preventDefault();

    fetch("/updateMe", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        username: username ? username : currentUser.username,
        email: email ? email : currentUser.email,
      }),
    })
      .then(() => {
        const dataFromLS = JSON.parse(currentUser);
        lstorage.setItem(
          "user",
          JSON.stringify({
            _id: dataFromLS._id,
            pic: dataFromLS.pic,
            score: dataFromLS.score,
            email: email && emailValidation() ? email : dataFromLS.email,
            username: username ? username : dataFromLS.username,
          })
        );
        if (username !== "") {
          setIsActive(false);
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const changeUserPassword = (e) => {
    e.preventDefault();
    fetch("/updateMyPassword", {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        passwordCurrent: currentPassword ? currentPassword : "",
        password: newPassword ? newPassword : "",
        passwordConfirm: newPasswordAgain ? newPasswordAgain : "",
      }),
    })
      .then((res) => {
        if (res.ok) {
          setIsActive(false);
        } else {
          setPasswordMessage("One of the passwords is incorrect!");
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const emailValidation = () => {
    const regex =
      /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
    if (!email || regex.test(email) === false) {
      setEmailMessage("Email is not valid!");
    } else {
      setIsActive(false);
    }
  };

  return (
    <div className="settings">
      <div className="settings__content">
        <button
          onClick={() => setIsActive(false)}
          className="settings__close"
          title="Close"
        >
          &times;
        </button>
        <img src="./logo.png" />
        <div className="settings__content--divs">
          <div className="settings__content--buttons">
            <button
              className="settings__content--button"
              onClick={() => {
                setIsTrue1(true);
                setIsTrue2(false);
              }}
            >
              Change info
            </button>
            <button
              className="settings__content--button"
              onClick={() => {
                setIsTrue1(false);
                setIsTrue2(true);
              }}
            >
              Change password
            </button>
            <button
              className="settings__content--button"
              onClick={() => deleteAccount()}
            >
              Delete account
            </button>
          </div>
          <form
            className="settings__content--form1"
            style={
              isTrue1 && !isTrue2 ? { display: "flex" } : { display: "none" }
            }
          >
            <label>Username</label>
            <input onChange={(e) => setUsername(e.target.value)} type="text" />
            <label>Email</label>
            <input onChange={(e) => setEmail(e.target.value)} type="email" />
            {emailMessage}
            <p>*You don't have to change both*</p>
            <button onClick={(e) => updateUserInfo(e)}>Sumbit</button>
          </form>
          <form
            className="settings__content--form2"
            style={
              isTrue2 && !isTrue1 ? { display: "flex" } : { display: "none" }
            }
          >
            <label>Current Password</label>
            <input
              onChange={(e) => setCurrentPassword(e.target.value)}
              type="password"
            />
            <label>New Password</label>
            <input
              onChange={(e) => setNewPassword(e.target.value)}
              type="password"
            />
            <label>Type New Password Again</label>
            <input
              onChange={(e) => setNewPasswordAgain(e.target.value)}
              type="password"
            />
            {passwordMessage}
            <button onClick={(e) => changeUserPassword(e)}>Sumbit</button>
          </form>
        </div>
        <div className="settings__footer">
          <p className="settings__footer--text">
            &#64;All Rights Reserved by
            <a href="https://github.com/kacperwitkowski" target="_blank">
              {" "}
              Kacper Witkowski
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
