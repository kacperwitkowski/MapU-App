import "react-svg-map/lib/index.css";
import { useEffect, useState } from "react";
import React from "react";
import World from "@svg-maps/world";
import { SVGMap } from "react-svg-map";
import "react-svg-map/lib/index.css";
import axios from "axios";
import "./vectorMap.scss";
import { setCountriesOnVecMap } from "../redux/reduxIndex";
import { useDispatch } from "react-redux";

const VectorMapFn = () => {
  const [stateName, setStateName] = useState([]);
  const [countryCode, setCountryCode] = useState([]);
  const [ID, setID] = useState("");
  const [clickedOne, setClickedOne] = useState("");
  const [isloaded, setIsloaded] = useState(false);
  const [isMoreThenOne, setIsMoreThenOne] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/mycountries`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        });
        setID(res.data.length === 0 ? "" : res.data[0]._id);

        if (stateName) {
          setCountryCode(res.data.length === 0 ? "" : res.data[0].countryCode);
          setStateName(res.data.length === 0 ? "" : res.data[0].countriesList);
        }
        setIsloaded(true);
      } catch (err) {
        throw err;
      }
    };
    getData();
  }, []);

  useEffect(() => {
    if (countryCode) {
      countryCode.forEach((el) => {
        document.querySelector(`[id=${el}]`).style.fill = "#a1d99b";
      });
    }
  }, [isloaded]);

  useEffect(() => {
    dispatch(setCountriesOnVecMap(stateName));
  }, [stateName]);

  const countriesList = {
    countriesList: stateName,
    countryCode: countryCode,
  };

  function onLocationClick(event) {
    let countryName = event.target.getAttribute("name");
    let countryID = event.target.getAttribute("id");

    setClickedOne(countryName);
    if (
      stateName?.indexOf(countryName) === -1 &&
      countryCode.indexOf(countryID) === -1
    ) {
      setStateName([...stateName, countryName]);
      setCountryCode([...countryCode, countryID]);
      event.target.style.fill = "#a1d99b";
    } else {
      let findEl =
        stateName.length !== 0 && stateName.filter((el) => el !== countryName);
      let findEl2 =
        countryCode.length !== 0 &&
        countryCode.filter((el) => el !== countryID);

      setStateName([...findEl]);
      setCountryCode([...findEl2]);
      event.target.style.fill = "#ddd";
    }
    dispatch(setCountriesOnVecMap(stateName));
    setIsMoreThenOne(true);
  }

  const sumbitData = () => {
    fetch("/createcountries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        ...countriesList,
      }),
    }).catch((err) => {
      throw err;
    });
  };

  const updateData = () => {
    fetch(`/createcountries/${ID}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        ...countriesList,
      }),
    }).catch((err) => {
      throw err;
    });
  };

  return (
    <div className="vectorMap">
      <SVGMap map={World} onLocationClick={onLocationClick} />

      <div className="vectorMap__container">
        <h4>Select the countries you've been to!</h4>
        <p>
          Last one clicked:{" "}
          {clickedOne ? clickedOne : stateName[stateName?.length - 1]}
        </p>
        {stateName.countriesList?.length !== 0 && !ID ? (
          <button onClick={() => sumbitData()}>Save</button>
        ) : (
          ""
        )}
        {stateName.countriesList?.length !== 0 && ID && isMoreThenOne ? (
          <button onClick={() => updateData()}>Update</button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default VectorMapFn;
