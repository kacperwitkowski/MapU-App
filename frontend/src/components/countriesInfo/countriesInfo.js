import React from "react";
import { useSelector } from "react-redux";
import "../roadInformations/roadInformations.scss";

const CountriesInfo = ({ isActive, setIsActive }) => {
  const { items1, items2 } = useSelector((state) => state.directions);

  const roadDetails = (items) => {
    return (
      <>
        <div className="roadInfo__content--div">
          <div className="roadInfo__content--details">
          <img src={items.img} alt="country img" />
            <h3>{items.name}</h3>
            <p>Capitol: {items.capitol}</p>
            <p>Gas price per 1L: {items.gasolinePrice}$</p>
            <p>Population: {items.population}</p>
            <h4>Top attractions to see:</h4>
            <div className="roadInfo__content--attr">
              {items.attractions?.map((att, i) => (
                <a
                  key={i}
                  target="_blank"
                  rel="noreferrer"
                  href={`https://www.google.com/search?tbm=isch&q=${att} ${items.name}`}
                >
                  {i + 1}) {att}
                </a>
              ))}
            </div>
          </div>
        </div>
      </>
    );
  };

  return (
    <>
      {items1.isoAlpha3 === items2.isoAlpha3 ? (
        <div
          className="roadInfo"
          style={isActive ? { display: "flex" } : { display: "none" }}
        >
          <div className="roadInfo__content roadInfo__content--single">
            <button
              onClick={() => setIsActive(false)}
              className="roadInfo__close"
            >
              &times;
            </button>
            {roadDetails(items1)}
          </div>
        </div>
      ) : (
        <div
          className="roadInfo"
          style={isActive ? { display: "flex" } : { display: "none" }}
        >
          <div className="roadInfo__content">
            <button
              onClick={() => setIsActive(false)}
              className="roadInfo__close"
            >
              &times;
            </button>
            {roadDetails(items1)}
            {roadDetails(items2)}
          </div>
        </div>
      )}
    </>
  );
};

export default CountriesInfo;
