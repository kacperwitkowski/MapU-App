import { useEffect, useState } from "react";

const Timer = ({ setStop, qNumber }) => {
  const [timer, setTimer] = useState(20);

  useEffect(() => {
    if (timer === 0) return setStop(true);
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [setStop, timer]);

  useEffect(() => {
    setTimer(20);
  }, [qNumber]);

  return timer;
};

export default Timer;
