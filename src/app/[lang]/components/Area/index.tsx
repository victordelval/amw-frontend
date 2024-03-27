"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "../Nav/logo.svg";
import { Tween } from "react-gsap";
import "./style.css";

interface AreaProps {
  dictionary: { [key: string]: any };
}

const Area: React.FC<AreaProps> = ({ dictionary }) => {
  const [showArea, setShowArea] = useState(true);

  return showArea ? (
    <Tween
      from={{ y: 100, opacity: 0 }}
      to={{ y: 0, opacity: 1 }}
      stagger={0.1}
      ease={"sine.out"}
      delay={2}
    >
      <div className="area">
        <div className="area-title">
          {dictionary.coverage.area_affected_in} 2020
        </div>
        <div className="area-km">6,858 sq km</div>
        <div className="area-or">
          <span className="area-line-left"></span>
          {dictionary.coverage.or}
          <span className="area-line-right"></span>
        </div>
        <div className="area-acres">
          1.7 {dictionary.coverage.million_acres}
        </div>
      </div>
    </Tween>
  ) : null;
};

export default Area;
