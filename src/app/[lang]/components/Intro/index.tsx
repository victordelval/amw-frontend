"use client";
import React, { useState, useEffect } from "react";
import Overlay from "../Overlay";
import Cookie from "js-cookie";
import "./style.css";

interface IntroProps {
  dictionary: { [key: string]: any };
}

const Intro: React.FC<IntroProps> = ({ dictionary }) => {
  const [showIntro, setShowIntro] = useState(true);

  /*
  useEffect(() => {
    const introViewed = Cookie.get("introViewed") === "true";
    if (introViewed) {
      setShowIntro(false);
    }
  }, []);
  */

  useEffect(() => {
    const hash = window.location.hash.substring(1); // Get the hash without the '#'
    if (hash) {
      setShowIntro(false)
    } else {
      setShowIntro(true)
    }
  })

  if (!showIntro) {
    return null;
  }

  return (
    <Overlay opacity={1}>
      <div className="intro">
        <h1>{dictionary.intro.title}</h1>
        <p>{dictionary.intro.text}</p>
        <a
          href="#close"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            setShowIntro(false);
            Cookie.set("introViewed", "true", { expires: 30 });
          }}
        >
          {dictionary.intro.explore}
        </a>
      </div>
    </Overlay>
  );
};

export default Intro;
