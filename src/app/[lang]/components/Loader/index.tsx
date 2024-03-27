"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Logo from "../Nav/logo.svg";
import "./style.css";

interface LoaderProps {
  dictionary: { [key: string]: any };
}

export default function Loader(props: LoaderProps) {
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    setShowLoader(true);
    setTimeout(() => {
      setShowLoader(false);
    }, 1500);
  }, []);

  return showLoader ? (
    <div
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
          {/* @ts-ignore */}
          <Image width={280} src={Logo} />
        </div>
        Loading...
      </div>
    </div>
  ) : null;
}
