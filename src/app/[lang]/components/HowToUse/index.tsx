"use client";
import React, { useState, useEffect } from "react";
import { Carousel, Button } from 'antd';
import { CloseOutlined } from "@ant-design/icons";
import "./style.css";

interface HowToUseParams {
  onClose: () => void
}

export default function HowToUse(params: HowToUseParams) {
    const { onClose } = params;

  // from https://react-slick.neostack.com/docs/example/custom-arrows
const SampleNextArrow = (props: any) => {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        onClick={onClick}
      />
    )
  }
  
  const SamplePrevArrow = (props: any) => {
    const { className, style, onClick } = props
    return (
      <div
        className={className}
        onClick={onClick}
      />
    )
  }
  
  const settings = {
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  }

return(
    <div className="how-to-use">
        <a 
         onClick={ (e) => {
            e.preventDefault()
            onClose()
         }}
         className="close-btn" 
         href="#close">
            <CloseOutlined />
        </a>
        <h2>How to use</h2>
        <p>Detected mines are delineated by the yellow stroke. Here are some characteristic examples of mines from the map:</p>
        <Carousel dots={false} arrows {...settings}>
            <div>
              <div className="content">
                <img src="/images/how-to-use-1.jpg" />
              </div>
            </div>
            <div>
            <div className="content">
                <img src="/images/how-to-use-2.jpg" />
                </div>
            </div>
            <div>
            <div className="content">
                <img src="/images/how-to-use-3.jpg" />
                </div>
            </div>
            <div>
            <div className="content">
                <img src="/images/how-to-use-4.jpg" />
            </div>
            </div>
        </Carousel>
    </div>
 )
}
