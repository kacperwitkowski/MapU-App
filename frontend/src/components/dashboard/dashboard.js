import "./dashboard.scss";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { ImBin2 } from "react-icons/im";
import {
  AiOutlineClose,
  AiOutlineEdit,
  AiOutlineArrowRight,
  AiOutlineArrowLeft,
} from "react-icons/ai";
import Scroll from "../scroll/scroll";

const Dashboard = ({ isActive, setIsActive }) => {
  const [roads, setRoads] = useState([]);
  const [sortType, setSortType] = useState("");
  const [sortCurr, setSortCurr] = useState("");
  const [showMiles, setShowMiles] = useState(false);
  const [currency, setCurrency] = useState([]);
  const [currentCurr, setCurrentCurr] = useState("");
  const [currentCurrName, setCurrentCurrName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [pageNumber, setPageNumber] = useState(0);
  const [pageTotal, setPageTotal] = useState(0);
  const [showEdit, setShowEdit] = useState(false);

  const updateData = (e, id) => {
    e.preventDefault();

    fetch(`/updateTour/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        _id: id,
        title: newTitle,
      }),
    });
    const editDiv = e.target.closest("form");
    editDiv.style.display = "none";
    editDiv.childNodes[0].value = "";
    setNewTitle("");
    setShowEdit(!showEdit);
  };

  useEffect(() => {
    const currencyRequest = async () => {
      const getCurr = await axios.get(
        "https://api.currencyapi.com/v3/latest?apikey=xHykqZcG5R2sZNin76xpuCoJVIstzx8tS1JXR1c8"
      );
      const { CAD, GBP, CNY, EUR, JPY, AUD } = getCurr.data.data;
      setCurrency([
        { name: "CAD", value: CAD.value },
        { name: "CNY", value: CNY.value },
        { name: "GBP", value: GBP.value },
        { name: "EUR", value: EUR.value },
        { name: "JPY", value: JPY.value },
        { name: "AUD", value: AUD.value },
        { name: "USD", value: 1 },
      ]);
    };
    currencyRequest();
  }, []);

  const goToPrevious = () => {
    setPageNumber(Math.max(0, pageNumber - 1));
  };
  const goToNext = () => {
    setPageNumber(Math.min(pageTotal - 1, pageNumber + 1));
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await axios.get(`/myroads?page=${pageNumber}`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("jwt"),
          },
        });
        setRoads(res.data.roads);
        setPageTotal(res.data.totalPages);
      } catch (err) {
        throw err;
      }
    };
    getData();
  }, [pageNumber, showEdit]);

  useEffect(() => {
    const sortAscending = (type) => {
      const types = {
        gasoline: "gasoline",
        kms: "kms",
        gasoline2: "gasoline2",
        kms2: "kms2",
        fullPrice: "fullPrice",
        fullPrice2: "fullPrice2",
      };
      const sortProperty = types[type];

      if (
        sortProperty === types.kms ||
        sortProperty === types.gasoline ||
        sortProperty === types.fullPrice
      ) {
        const sorted = [...roads].sort(
          (a, b) => b[sortProperty] - a[sortProperty]
        );
        setRoads(sorted);
      } else {
        const sorted = [...roads].sort(
          (a, b) => a[sortProperty.slice(0, -1)] - b[sortProperty.slice(0, -1)]
        );
        setRoads(sorted);
      }
    };

    sortAscending(sortType);
  }, [sortType]);

  const deleteRoad = async (postID) => {
    try {
      await axios.delete(`/deleteroad/${postID}`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
      });
    } catch (err) {
      throw err;
    }
  };

  const kmphTOmph = (type) => {
    if (type === "miles") setShowMiles(true);
    else setShowMiles(false);
  };

  useEffect(() => {
    const currencyCalc = (type) => {
      const types = {
        USD: "USD",
        EUR: "EUR",
        GBP: "GBP",
        CAD: "CAD",
        CNY: "CNY",
        JPY: "JPY",
        AUD: "AUD",
      };
      const sortProperty = types[type];

      const findCurrencyName = currency.find((el) => el.name === sortProperty);
      setCurrentCurr(findCurrencyName?.value);
      setCurrentCurrName(findCurrencyName?.name);
    };

    currencyCalc(sortCurr);
  }, [sortCurr]);

  return (
    <div className="dashboard">
      <button
        title="Close"
        className="dashboard__close"
        onClick={() => setIsActive(false)}
      >
        <AiOutlineClose />
      </button>
      <div className="dashboard__options">
        <button title="Previous Page" onClick={() => goToPrevious()}>
          {<AiOutlineArrowLeft />}
        </button>
        <select onChange={(e) => setSortType(e.target.value)}>
          <option disabled selected>
            {" "}
            -- select an option --{" "}
          </option>
          <option value="gasoline2">Lowest Liters Cons</option>
          <option value="gasoline">Highest Liters Cons</option>
          <option value="kms2">Shortest Road</option>
          <option value="kms">Longest Road</option>
          <option value="fullPrice2">Cheapest Roads</option>
          <option value="fullPrice">Expensive Roads</option>
        </select>
        <select onChange={(e) => kmphTOmph(e.target.value)}>
          <option defaultValue value="kms">
            Kilometers
          </option>
          <option value="miles">Miles</option>
        </select>
        <select onChange={(e) => setSortCurr(e.target.value)}>
          <option defaultValue value="USD">
            USD
          </option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
          <option value="CAD">CAD</option>
          <option value="AUD">AUD</option>
          <option value="JPY">JPY</option>
          <option value="CNY">CNY</option>
        </select>
        <button title="Next Page" onClick={() => goToNext()}>
          {<AiOutlineArrowRight />}
        </button>
      </div>
      <div className="dashboard__roadsContainer">
        {roads.length !== 0 ? (
          roads.map((el) => (
            <div key={el._id} className="dashboard__road">
              <div className="dashboard__road--imgDiv">
                <img
                  className="dashboard__road--img"
                  src={el.img1}
                  alt="flag"
                />
                <img
                  className="dashboard__road--img"
                  src={el.img2 ? el.img2 : ""}
                  alt="flag"
                />
              </div>
              <div className="dashboard__road--title">
                <p>{el.title}</p>
                <AiOutlineEdit
                  title="Edit"
                  style={{ fontSize: "20px", cursor: "pointer" }}
                  onClick={(e) => {
                    const editDiv = e.target.closest("div").nextSibling;
                    editDiv.style.display = "block";
                  }}
                />
              </div>
              <form className="dashboard__road--editTitleForm">
                <input
                  required
                  placeholder="Enter a title (min.3)"
                  min={3}
                  maxLength={25}
                  onChange={(e) => setNewTitle(e.target.value)}
                />
                <button
                  disabled={newTitle.length <= 2 ? true : false}
                  onClick={(e) => updateData(e, el._id)}
                >
                  Save
                </button>
              </form>
              <p>
                {el.countries.length === 2
                  ? `${el.countries[0]} - ${el.countries[1]}`
                  : el.countries[0]}
              </p>
              <p>
                It's{" "}
                {showMiles
                  ? `${((el.kms / 1000) * 0.6214).toFixed(1)}mi `
                  : `${(el.kms / 1000).toFixed(1)}km `}
                long
              </p>
              <p>
                Average fuel consumption was{" "}
                {showMiles
                  ? `${el.gasoline}L per 100mi`
                  : `${el.gasoline}L per 100km`}{" "}
              </p>
              <p>
                Average route price{" "}
                {showMiles
                  ? currentCurr
                    ? (el.fullPrice * 0.621371192 * currentCurr).toFixed(1)
                    : (el.fullPrice * 0.621371192).toFixed(1)
                  : currentCurr
                  ? (el.fullPrice * currentCurr).toFixed(1)
                  : el.fullPrice}
                {currentCurrName ? currentCurrName : "USD"}
              </p>
              <div className="dashboard__road--details">
                <p style={{ margin: "0px" }}>
                  Created at {el.createdAt.slice(0, 10)}
                </p>
                <button
                  title="Delete"
                  className="dashboard__road--delete"
                  onClick={() => {
                    const newData2 = roads.filter((el2) => {
                      return el2._id !== el._id;
                    });
                    setRoads(newData2);
                    setTimeout(() => {
                      deleteRoad(el._id);
                    }, 1000);
                  }}
                >
                  <ImBin2 />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ fontSize: "48px" }} className="dashboard__road--text">
            There is empty
          </p>
        )}
      </div>
      <Scroll />
    </div>
  );
};

export default Dashboard;
