"use client";
import React, { useState, useEffect } from "react";
import Overlay from "../Overlay";
import Cookie from "js-cookie";
import "./style.css";

export default function Area() {
  const [showIntro, setShowIntro] = useState(true);

  useEffect(() => {
    const introViewed = Cookie.get("introViewed") === "true";
    if (introViewed) {
      setShowIntro(false);
    }
  }, []);

  if (!showIntro) {
    return null;
  }

  return (
    <Overlay
     opacity={1}
    >
      <div className="intro">
        <h1>Track Mining in the Rainforest</h1>
        <p>
          Amazon Mining Watch uses machine learning to map the scars of mining
          activities in the Amazonian countries. By constantly analyzing
          high-resolution and historical satellite images, this tool aims at
          identifying the fast-paced growth of open-pit mining in the largest
          rainforest in the world. This database is here to help journalists,
          activists, and researchers better understand the causes and impacts of
          the mining industry.
        </p>
        <a
          href="#close"
          className="btn"
          onClick={(e) => {
            e.preventDefault();
            setShowIntro(false);
            Cookie.set("introViewed", "true", { expires: 30 });
          }}
        >
          Explore Map
        </a>
      </div>
    </Overlay>
  );
}
