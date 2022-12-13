import "./info.scss";
import driveGif from "./drive.gif";

const Info = ({ setIsActive }) => {
  return (
    <div className="info">
      <div className="info__content">
        <button
          onClick={() => setIsActive(false)}
          className="info__close"
          title="Close"
        >
          &times;
        </button>
        <h3>MapU</h3>
        <p className="info__content--text">
          Did you ever wonder how many kilometers or miles you drove without
          knowing how much your road have cost? Now MapU comes with the rescue!
          On this site you can approximately calculate every road, beetwen any
          countries you want. The gasoline prices for each coutry are updated
          regurarly (last update was: 14.03.2022 ) Additionally to that you can
          get all important information about countries where you started and
          finished your journey. The profile site has also a feature that allows
          users to save any country they have ever been to on a map. In order to
          use all of the feautres MapU provides, you have to be logged in!
        </p>
        <div className="info__content--imgDiv">
          <img src={driveGif} alt="meme"/>
        </div>
        <div>
          <p>
            &#64;All Rights Reserved by
            <a href="https://github.com/kacperwitkowski" target="_blank" rel="noreferrer">
              {" "}
              Kacper Witkowski
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Info;
