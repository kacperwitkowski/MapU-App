import "./App.scss";
import mapboxgl from "mapbox-gl";
import MapboxDirections from "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions";
import { iso1A3Code } from "@ideditor/country-coder";
import "@mapbox/mapbox-gl-directions/dist/mapbox-gl-directions.css";
import React, { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import Dashboard from "./components/dashboard/dashboard";
import Register from "./components/register/register";
import Login from "./components/login/login";
import Profile from "./components/profile/profile";
import axios from "axios";
import Info from "./components/info/info";
import Quiz from "./components/quiz/quiz";
import RoadInformations from "./components/roadInformations/roadInformations";
import { useDispatch } from "react-redux";
import {
  setDestinationCor,
  setOriginCor,
  setGasolineD,
  setGasolineO,
  setRoadInfos,
  setItems1,
  setItems2,
  setDistance,
} from "./components/redux/reduxIndex";

const styles = {
  width: "100vw",
  height: "100vh",
  maxHeight: "100vh",
  position: "absolute",
  zIndex: "-1",
  overflow: "hidden",
};

const MapboxGLMap = () => {
  const [map, setMap] = useState(null);
  let questions = require("./components/quiz/quiz.json");
  const [dashboardVisible, setDashboardVisible] = useState(false);
  const [profileVisible, setProfileVisible] = useState(false);
  const [quizVisible, setQuizVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(localStorage.getItem("user"));
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const mapContainer = useRef(null);
  const dispatch = useDispatch();
  localStorage.setItem("questions", JSON.stringify(questions));
  mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;

  useEffect(() => {
    const initializeMap = async ({ setMap, mapContainer }) => {
      const getGasolineData = await axios.get(
        "https://faithful-tick-top-coat.cyclic.app/countries"
      );

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11?optimize=true",
        center: [-0.118092, 51.509865],
        zoom: 11,
        noWrap: true
      });

      const directions = new MapboxDirections({
        accessToken: mapboxgl.accessToken,
        unit: "metric",
        profile: "mapbox/driving",
      });

      directions.on("origin", function (e) {
        try {
          const originCoords = e.feature.geometry.coordinates;
          const [longitude, latitude] = [...originCoords];
          dispatch(setOriginCor([longitude, latitude]));

          const cordsIso3 = iso1A3Code([longitude, latitude]);
          const items2 = getGasolineData.data.filter(
            (item) => item.isoAlpha3 === cordsIso3
          );
          const respond = Object.assign(...items2);

          dispatch(setItems1(respond));
          dispatch(setGasolineO(respond.gasolinePrice));
        } catch (err) {
          throw err;
        }
      });
      directions.on("destination", function (e) {
        try {
          const originCoords = e.feature.geometry.coordinates;
          const [longitude2, latitude2] = [...originCoords];
          dispatch(setDestinationCor([longitude2, latitude2]));
          const cordsIso3 = iso1A3Code([longitude2, latitude2]);

          const items2 = getGasolineData.data.filter(
            (item) => item.isoAlpha3 === cordsIso3
          );

          const respond = Object.assign(...items2);
          dispatch(setItems2(respond));
          dispatch(setGasolineD(respond.gasolinePrice));
        } catch (err) {
          throw err;
        }
      });

      directions.on("route", (e) => {
        if (e.route.length === 0) {
          dispatch(setItems1(""));
          dispatch(setItems2(""));
        } else {
          const route = {
            kms: e.route[0].distance,
            duration: e.route[0].duration,
          };
          dispatch(setRoadInfos(route));
          const objAssign = Object.assign(...e.route);
          dispatch(setDistance(objAssign.distance));
        }
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
      const nav = new mapboxgl.NavigationControl();
      map.addControl(nav);
      map.addControl(directions, "top-left");
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return (
    <>
      <div ref={(el) => (mapContainer.current = el)} style={styles} />
      <RoadInformations currentUser={currentUser} />
      {currentUser ? (
        <>
          <div className="menu">
            <button
              className="menu__button"
              onClick={() => setProfileVisible(true)}
            >
              Profile
            </button>
            <button
              className="menu__button"
              onClick={() => setQuizVisible(true)}
            >
              Quiz
            </button>
            <button
              className="menu__button"
              onClick={() => setDashboardVisible(true)}
            >
              Dashboard
            </button>
          </div>
        </>
      ) : (
        <div className="menu">
          <button
            className="menu__button"
            onClick={() => setShowRegister(true)}
          >
            <span className="front">Register</span>
          </button>
          <button className="menu__button" onClick={() => setShowLogin(true)}>
            <span className="front">Log in</span>
          </button>
          <button className="menu__button" onClick={() => setShowInfo(true)}>
            <span className="front">Info</span>
          </button>
        </div>
      )}
      {showRegister && <Register setShowRegister={setShowRegister} />}
      {showLogin && (
        <Login setShowLogin={setShowLogin} setCurrentUser={setCurrentUser} />
      )}
      {dashboardVisible && (
        <Dashboard
          isActive={dashboardVisible}
          setIsActive={setDashboardVisible}
        />
      )}
      {profileVisible && (
        <Profile isActive={profileVisible} setIsActive={setProfileVisible} />
      )}
      {showInfo && <Info setIsActive={setShowInfo} />}
      {quizVisible && (
        <Quiz isActive={quizVisible} setIsActive={setQuizVisible} />
      )}
    </>
  );
};

export default MapboxGLMap;
