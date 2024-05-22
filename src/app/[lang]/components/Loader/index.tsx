"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Logo from "../Nav/logo.svg";
import gsap from "gsap";
import "./style.css";

interface LoaderProps {
  dictionary: { [key: string]: any };
}

export default function Loader(props: LoaderProps) {
  const { dictionary } = props;
  const [showLoader, setShowLoader] = useState(true);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 1500);
  }, []);

  useEffect(() => {
    if (loaderRef.current) {
      const dots = loaderRef.current.querySelectorAll(".js-loader-dot");
      if (dots.length > 0) {
        gsap
          .timeline({ repeat: -1 })
          .to(dots, {
            y: -5,
            stagger: 0.1,
            duration: 0.3,
            ease: "linear",
          })
          .to(dots, {
            y: 0,
            stagger: 0.1,
            duration: 0.3,
            ease: "linear",
          });
      }
    }
  }, []);

  return showLoader ? (
    <div
      ref={loaderRef}
      className="loader"
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        background: "#003e36",
        width: "100%",
        height: "100%",
        zIndex: 100000,
      }}
    >
      <div className="content">
        <div>
          <Image width={280} src={Logo} alt="Logo" />
        </div>
        {dictionary?.map_ui.loading}&nbsp;
        <div className="loader-dots">
          <span className="js-loader-dot"></span>
          <span className="js-loader-dot"></span>
          <span className="js-loader-dot"></span>
        </div>
      </div>
    </div>
  ) : null;
}
