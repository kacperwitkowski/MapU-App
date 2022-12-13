import "./profile.scss";
import {
  AiOutlineClose,
  AiOutlineCloudUpload,
  AiFillSound,
  AiOutlineSound,
  AiOutlineSetting,
} from "react-icons/ai";
import { FaPause, FaPlay } from "react-icons/fa";
import VectorMapFn from "../vectorMap/vectormap";
import { useEffect, useRef, useState } from "react";
import VideoPlayer from "../videoPlayer/videoPlayer";
import { useSelector } from "react-redux";
import Settings from "../settings/settings";

const Profile = ({ setIsActive }) => {
  const [image, setImage] = useState("");
  const [settingsVisible, setSettingsVisible] = useState(false);
  const [countriesListVisible, setCountriesListVisible] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

  const videoEl = useRef(null);
  const {
    playerState,
    togglePlay,
    handleOnTimeUpdate,
    handleVideoProgress,
    handleVideoSpeed,
    toggleMute,
  } = VideoPlayer(videoEl);

  const { visitedCountries } = useSelector((state) => state.directions);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("jwt");
    setUser(null);
    window.location.reload(false);
  };

  const photoRender = () => {
    if (user.score === 101 || !user) return "./qm.png";
    if (user.score >= 0 && user.score < 40) return "./sandybrown.png";
    if (user.score >= 40 && user.score < 90) return "./silver.png";
    if (user.score >= 90 && user.score <= 100) return "./gold.png";
    else return "./qm.png";
  };

  useEffect(() => {
    if (image) {
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
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, pic: result.url })
          );

          setUser({ ...user, pic: result.url });

          fetch("/updatepic", {
            method: "PUT",
            headers: {
              "Content-type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              pic: result.url,
            }),
          });
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [image]);

  const updatePhoto = (file) => {
    setImage(file);
  };

  return (
    <div
      className="profile"
      style={settingsVisible ? { minHeight: "auto", maxHeight: "100vh" } : {}}
    >
      <button
        title="Close"
        className="profile__close"
        onClick={() => setIsActive(false)}
      >
        <AiOutlineClose />
      </button>
      <button className="profile__settings">
        <AiOutlineSetting
          onClick={() => {
            setSettingsVisible(true);
          }}
          title="Settings"
        />
      </button>
      <button onClick={handleLogout} className="profile__logout" title="Logout">
        <span>Logout</span>
      </button>
      <div className="profile__userPage">
        <div className="profile__userImageDiv">
          <p>{user?.username}</p>
          <img
            className="profile__userImageDiv--img"
            src={user?.pic}
            alt="user pic"
          />
          <label className="custom-file-upload">
            <AiOutlineCloudUpload />
            <i>Update photo</i>
            <input
              type="file"
              onChange={(e) => updatePhoto(e.target.files[0])}
            />
          </label>
        </div>
        <div className="video">
          <video
            className="video__content"
            src="https://res.cloudinary.com/dx7vsnkjj/video/upload/v1670966876/starwarstheme_qjxwlk.mp4"
            ref={videoEl}
            onTimeUpdate={handleOnTimeUpdate}
          />
          <div className="video__controls">
            <div className="video__controls--playToggle">
              <button onClick={togglePlay}>
                {!playerState.playing ? (
                  <FaPlay color="white" />
                ) : (
                  <FaPause color="white" />
                )}
              </button>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={playerState.progress}
              onChange={(e) => handleVideoProgress(e)}
            />
            <select
              className="video__controls--velocity"
              value={playerState.speed}
              onChange={(e) => handleVideoSpeed(e)}
            >
              <option value="0.50">0.50x</option>
              <option value="1">1x</option>
              <option value="1.25">1.25x</option>
              <option value="2">2x</option>
            </select>
            <button className="video__controls--muteBtn" onClick={toggleMute}>
              {!playerState.muted ? <AiOutlineSound /> : <AiFillSound />}
            </button>
          </div>
        </div>
        <div
          className="profile__stats"
          style={{ color: photoRender().slice(0, -4).slice(2) }}
        >
          <p>Medal/stats</p>
          <div className="profile__statsDiv">
            <div
              className="profile__statsDiv--medal"
              title="Medal from quiz"
              style={{ borderColor: photoRender().slice(0, -4).slice(2) }}
            >
              <img
                src={photoRender()}
                alt="medal"
                className="profile__statsDiv--img"
              />
            </div>
            <div>
              <p>{visitedCountries.length}/200</p>
              <p>{((visitedCountries.length / 200) * 100).toFixed(1)}%</p>
            </div>
          </div>
          {visitedCountries.length !== 0 && (
            <button
              style={{
                color: photoRender().slice(0, -4).slice(2),
                borderColor: photoRender().slice(0, -4).slice(2),
              }}
              onClick={() => setCountriesListVisible(true)}
            >
              See list of visited countries
            </button>
          )}
        </div>
      </div>
      {countriesListVisible && (
        <div className="profile__countries">
          <div className="profile__countries--content">
            <button
              onClick={() => setCountriesListVisible(false)}
              className="profile__countries--close"
              title="Close"
            >
              &times;
            </button>
            <ul>
              {visitedCountries.map((el, i) => (
                <li key={i}>{el}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
      <VectorMapFn />
      {settingsVisible && (
        <Settings isActive={settingsVisible} setIsActive={setSettingsVisible} />
      )}
    </div>
  );
};

export default Profile;
