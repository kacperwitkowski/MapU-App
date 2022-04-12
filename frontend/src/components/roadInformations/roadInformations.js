import React, { useState, useEffect } from "react";
import "./roadInformations.scss";
import { useSelector } from "react-redux";
import CountriesInfo from "../countriesInfo/countriesInfo";
import { BsArrowLeftShort } from "react-icons/bs";

const RoadInformations = ({ currentUser }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isGasolineVisible, setIsGasolineVisible] = useState(false);
  const [showSavePopup, setShowSavePopup] = useState(false);
  const [isPopupVisible, setPopupVisible] = useState(true);
  const [gasolineData, setGasolineData] = useState("");
  const [title, setTitle] = useState("");
  const [liters, setLiters] = useState("");
  const [calcFullPrice, setCalcFullPrice] = useState("");
  const [status, setStatus] = useState("");
  const [roads, setRoads] = useState([]);
  const [miles, setMiles] = useState(false);
  const [gasoline, setGasoline] = useState("");
  const [gasolineSummary, setGasolineSummary] = useState("");
  const {
    destination,
    origin,
    distance,
    gasolineD,
    gasolineO,
    roadInfo,
    items1,
    items2,
  } = useSelector((state) => state.directions);
  const [img1, setImg1] = useState(items1.img);
  const [img2, setImg2] = useState(items2.img);
  const current = new Date();

  useEffect(() => {
    let isCancelled = false;
    if (!isCancelled) {
      let gasolinePriceSummary = (gasolineD + gasolineO) / 2;
      let gasolineFullPrice = (
        ((distance / 100) * 7.7 * gasolinePriceSummary) /
        1000
      ).toFixed(1);

      setGasoline(gasolineFullPrice);
      setGasolineSummary(gasolinePriceSummary);
    }
    return () => {
      isCancelled = true;
    };
  }, [distance]);

  const calcMiles = (gasolineData) => {
    return gasolineData * 0.621371192;
  };

  const saveInpValue = (e) => {
    setGasolineData(e.target.value);
  };

  const saveFullPriceInput = (e) => {
    setLiters(e.target.value);

    const fullPriceOfGas = miles
      ? ((calcMiles(gasoline) / 7.7) * e.target.value).toFixed(1)
      : ((gasoline / 7.7) * e.target.value).toFixed(1);
    setCalcFullPrice(fullPriceOfGas);
  };

  const milesConverter = (type) => {
    if (type === "miles") {
      setMiles(true);
    } else {
      setMiles(false);
    }
  };

  const sumbitData = (e) => {
    e.preventDefault();

    const newRoad = {
      user: currentUser,
      title,
      countries:
        items2.name === items1.name
          ? [items1.name]
          : [items1.name, items2.name],
      img1: img1,
      img2: img2,
      gasoline: liters ? liters : 7.7,
      gasolinePrice: gasolineSummary ? gasolineSummary : "",
      origin: [...origin],
      destination: [...destination],
      kms: roadInfo.kms,
      duration: roadInfo.duration,
      fullPrice:
        calcFullPrice && miles
          ? (calcFullPrice * 1.609344).toFixed(1)
          : liters
          ? calcFullPrice
          : gasoline,
    };

    fetch("/createroad", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        ...newRoad,
      }),
    })
      .then((res) => {
        if (res.ok) {
          setRoads([...roads, res.road]);
          setStatus("");
          setShowSavePopup(false);
        } else {
          setStatus(res.status);
        }
      })
      .catch((err) => {
        throw err;
      });
  };

  useEffect(() => {
    setImg1(items1.img);
    setImg2(items2.img);
  }, [items1, items2]);

  return (
    <>
      {!isPopupVisible ? (
        <button
          title="Close"
          className="roadInfo--hide"
          onClick={() => setPopupVisible(true)}
        >
          Roll down
        </button>
      ) : (
        ""
      )}
      {items1.gasolinePrice && items2.gasolinePrice && roadInfo.kms ? (
        <div
          className="road"
          style={isPopupVisible ? { display: "flex" } : { display: "none" }}
        >
          <div
            className="road__content"
            style={
              isPopupVisible && !isGasolineVisible
                ? { display: "flex" }
                : { display: "none" }
            }
          >
            <select
              className="road__content--select"
              onChange={(e) => milesConverter(e.target.value)}
            >
              <option defaultValue value="kms">
                Km
              </option>
              <option value="miles">Mi</option>
            </select>
            <button
              onClick={() => setPopupVisible(false)}
              className="road__content--closePopup"
            >
              &times;
            </button>
            <p>Based on 7.7L/100{miles ? "mi" : "km"}</p>
            <p>{miles ? calcMiles(gasoline).toFixed(1) : gasoline}$</p>
            <button
              onClick={() => setIsGasolineVisible(true)}
              className="road__content--button"
            >
              Check your own gas
            </button>
            <button
              className="road__content--buttons"
              onClick={() => setIsVisible(true)}
            >
              See all the details about country(ies)
            </button>
            <button
              className="road__content--buttons"
              onClick={() => {
                setLiters(false);
                setShowSavePopup(true);
              }}
            >
              Save the road
            </button>
          </div>
          <div
            className="road__content"
            style={
              isGasolineVisible ? { display: "flex" } : { display: "none" }
            }
          >
            <BsArrowLeftShort
              onClick={() => setIsGasolineVisible(false)}
              className="road__content--closePopup"
            />
            <h3>Calculate with our liters</h3>
            <input
              type="number"
              step="0.01"
              min="0"
              maxLength="3"
              onChange={saveInpValue}
              placeholder={miles ? "Liters per miles" : "Liters per kms"}
            />
            <p>
              {miles
                ? ((calcMiles(gasoline) / 7.7) * gasolineData).toFixed(1)
                : ((gasoline / 7.7) * gasolineData).toFixed(1)}
              $
            </p>
          </div>
        </div>
      ) : (
        ""
      )}
      <div
        style={showSavePopup ? { display: "flex" } : { display: "none" }}
        className="roadInfo"
      >
        <div className="roadInfo__form">
          <button
            onClick={() => {
              setLiters(false);
              setShowSavePopup(false);
            }}
            className="roadInfo__close"
          >
            &times;
          </button>
          <div className="roadInfo__imgDiv">
            <img
              className="roadInfo__imgDiv--img"
              src={items1.img}
              alt="flag"
            />
            <img
              className="roadInfo__imgDiv--img"
              src={items2.img ? items2.img : ""}
              alt="flag"
            />
          </div>
          <div className="roadInfo__form--details">
            <p>
              {items2.name === items1.name
                ? `${items1.name}`
                : `${items1.name} - ${items2.name}`}
            </p>
            <p>
              Date: {current.getDate()}/{current.getMonth() + 1}/
              {current.getFullYear()}
            </p>
            <label>Title</label>

            <input
              required
              placeholder="Enter a title"
              onChange={(e) => setTitle(e.target.value)}
              maxLength={25}
            />

            <label>Liters</label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="99"
              placeholder={`Default 7.7L/${miles ? "mi" : "km"}`}
              onChange={saveFullPriceInput}
            />
            <p style={{ fontSize: "16px" }}>
              (Average fuel consumption (1L/
              {items1 && items2
                ? `${(
                    (items1.gasolinePrice + items2.gasolinePrice) /
                    2
                  ).toFixed(1)}$`
                : `${items1.gasolinePrice}$`}
              ))
            </p>
            <p>
              {liters
                ? calcFullPrice
                : miles
                ? calcMiles(gasoline).toFixed(1)
                : gasoline}
              $
            </p>
            <button
              className="roadInfo__form--button"
              onClick={(e) => sumbitData(e)}
              type="submit"
            >
              Save the Road
            </button>
            {status === 422 ? (
              <span style={{ color: "red" }}>
                You're passing the wrong value!
              </span>
            ) : (
              ""
            )}
            {status === 401 ? (
              <span style={{ color: "red" }}>You're not logged in!</span>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
      <CountriesInfo setIsActive={setIsVisible} isActive={isVisible} />
    </>
  );
};

export default RoadInformations;
