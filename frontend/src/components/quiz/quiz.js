import "./quiz.scss";
import { useEffect, useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import Timer from "./timer";
import Scroll from "../scroll/scroll";

const Quiz = ({ setIsActive }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));
  const [showScore, setShowScore] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [score, setScore] = useState(0);
  const [questions, setQuestions] = useState(
    JSON.parse(localStorage.getItem("questions"))
  );
  const [incQuestion, setIncQuestion] = useState(0);
  const [currentQNumber, setCurrentQNumber] = useState(
    Math.floor(Math.random() * questions.length)
  );

  useEffect(() => {
    if (showScore) {
      let finalScore = (score / 10) * 100;
      fetch("/updatescore", {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          score: finalScore,
        }),
      })
        .then(() => {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...user, score: finalScore })
          );
        })
        .catch((err) => {
          throw err;
        });
    }
  }, [showScore]);

  useEffect(() => {
    questions.splice(currentQNumber, 1);
    setCurrentQNumber(Math.floor(Math.random() * questions.length));
    setIncQuestion(incQuestion + 1);
  }, []);

  const handleResetButton = () => {
    setQuestions(JSON.parse(localStorage.getItem("questions")));
    setIncQuestion(1);
    setCurrentQNumber(Math.floor(Math.random() * questions.length));
    setShowScore(false);
    setScore(0);
  };

  const nextQuestion = (isCorrect) => {
    if (isCorrect) {
      setScore(score + 1);
    }
    setIncQuestion(incQuestion + 1);
    questions.splice(currentQNumber, 1);

    setCurrentQNumber(Math.floor(Math.random() * questions.length));

    if (incQuestion === 10) {
      setShowScore(true);
    }
  };

  const closePage = () => {
    if (!showScore && !showIntro) {
      let askToClose = window.confirm(
        "You want to close that page? Result will be not saved until you finish the game!"
      );

      if (askToClose) {
        setIsActive(false);
        handleResetButton();
      }
    } else {
      setIsActive(false);
      handleResetButton();
    }
  };

  return (
    <div
      className="quiz"
      style={
        !showIntro ? { justifyContent: "center" } : { justifyContent: "unset" }
      }
    >
      <button
        className="quiz__close"
        title="Close"
        onClick={() => {
          closePage();
        }}
      >
        <AiOutlineClose />
      </button>
      {showIntro ? (
        <div className="quiz__content--introduction">
          <h3>Welcome to the Geography Quiz!</h3>
          <p>
            In this quiz you may check your geography knowledge answering on 10
            random questions! In each game questions are drawn randomly, but
            there is no chance you will have the same questions in one game.
            Questions are sorted from places through flags, capitals or even
            population numbers! Ofcourse you are not playing for nothinf, aside
            testing your knowledge you can get medal which will be assigned to
            your account!
          </p>
          <p>Good Luck!</p>
          <div className="quiz__content--medals">
            <div>
              <img src="./sandybrown.png" alt="brown medal" />
              <p>Bronze medal: 1-30%</p>
            </div>
            <div>
              <img src="./silver.png" alt="silver medal" />
              <p>Silver medal: 31-80%</p>
            </div>
            <div>
              <img src="./gold.png" alt="gold medal" />
              <p>Gold medal: 81-100%</p>
            </div>
          </div>
          <p>
            PS. If you're interested in playing in Movie Quiz with crazy
            helpers,sounds and even more features, check out my{" "}
            <a target="_blank" href="https://movie-quiz-app.cyclic.app/" rel="noreferrer">
              Movie Quiz!
            </a>
          </p>
          <button
            className="settings__content--button"
            onClick={() => setShowIntro(false)}
            style={{ color: "white" }}
          >
            Start the game
          </button>
        </div>
      ) : (
        ""
      )}
      {!showIntro && !showScore && (
        <div className="quiz__content">
          <h2>Geography Quiz</h2>
          <div className="quiz__content--number">
            <h4>Question {incQuestion}/10</h4>
            <p>
              <Timer setStop={setShowScore} qNumber={incQuestion} />
            </p>
          </div>
          <div className="quiz__game">
            <div className="quiz__game--question">
              <p>{questions[currentQNumber].question}</p>
            </div>
            <div className="quiz__game--buttons">
              {questions[currentQNumber].answers.map((ans, i) => (
                <button
                  className="quiz__game--singleButton"
                  onClick={() => nextQuestion(ans.isCorrect)}
                  key={i}
                >
                  {ans.answerText}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showScore && (
        <div className="quiz__game--endInfo">
          <p>You reached the end of the game, your score is {score}/10</p>
          <button
            style={{ color: "white" }}
            className="settings__content--button"
            onClick={() => handleResetButton()}
          >
            Play Again
          </button>
        </div>
      )}
      {showIntro && <Scroll />}
    </div>
  );
};

export default Quiz;
