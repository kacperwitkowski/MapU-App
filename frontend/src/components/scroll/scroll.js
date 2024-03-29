import { useEffect, useState } from "react";
import "./scroll.css";

const Scroll = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toogleVisibility = () => {
    if (window.pageYOffset > 300) setIsVisible(true);
    else setIsVisible(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    window.addEventListener("scroll", toogleVisibility);

    return () => {
      window.removeEventListener("scroll", toogleVisibility);
    };
  }, []);

  return (
    <div className="scroll">
      <button
        type="button"
        className={isVisible ? "scroll__visible" : "scroll__notVisible"}
        onClick={scrollToTop}
      >
        <span>☝️</span>
      </button>
    </div>
  );
};

export default Scroll;
