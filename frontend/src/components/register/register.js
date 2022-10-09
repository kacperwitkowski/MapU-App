import "./register.scss";
import { useState, useEffect } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";

const Register = ({ setShowRegister }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [email, setEmail] = useState("");
  const [failure, setFailure] = useState("");
  const [success, setSuccess] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const [image, setImage] = useState("");
  const [url, setUrl] = useState("");

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "mapU-app");
    data.append("cloud_name", "dx7vsnkjj");
    fetch("https://api.cloudinary.com/v1_1/dx7vsnkjj/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        setUrl(result.url);
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadFields = () => {
    if (
      !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
        email
      )
    ) {
      console.log("invalid email");
    }

    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        password,
        passwordConfirm: password2,
        email,
        pic: url
          ? url
          : "https://res.cloudinary.com/dx7vsnkjj/image/upload/v1641343261/dobry_klbahr.png",
      }),
    })
      .then((res) => {
        if (res.ok) {
          setSuccess(true);
          setFailure("");
          setIsClicked(false);
        } else {
          setIsClicked(true);
          setFailure(res.status);
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  const postData = (e) => {
    e.preventDefault();
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="register">
      <div className="register__content">
        <button
          onClick={() => setShowRegister(false)}
          className="register__close"
          title="Close"
        >
          &times;
        </button>
        <div className="register__content--logo">
          <img src="./logo.png" alt="logo" />
        </div>
        <form className="register__content--formSumbit">
          <input
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            required
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="Repeat password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
          />
          <label className="custom-file-upload">
            <AiOutlineCloudUpload />
            <i>Upload photo</i>
            <input type="file" onChange={(e) => setImage(e.target.files[0])} />
          </label>



          <button
            onClick={(e) => postData(e)}
            className="register__content--button"
          >
            Register
          </button>






        </form>
        {failure === 500 ? (
          <span style={{ color: "red", textAlign: "center" }}>
            You entered the wrong value or the user with this email/username
            already exists!
          </span>
        ) : (
          ""
        )}
        {isClicked ? (
          !email || !password || !password2 || !username ? (
            <span style={{ color: "red" }}>Please fill in all fields!</span>
          ) : (
            ""
          )
        ) : (
          ""
        )}
        {success ? (
          <span style={{ color: "green" }}>Saved successfully!</span>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default Register;
