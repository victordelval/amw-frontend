"use client";
import React, { useState, useEffect } from "react";
import { Carousel, Button } from 'antd';
import { CloseOutlined, CaretUpFilled } from "@ant-design/icons";
import "./style.css";

interface HowToUseParams {
  dictionary?: any,
  onClose: () => void
}

export default function HowToUse(params: HowToUseParams) {
    const { onClose, dictionary } = params;

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
        <CaretUpFilled className="caret"/>
        <a 
         onClick={ (e) => {
            e.preventDefault()
            onClose()
         }}
         className="close-btn" 
         href="#close">
            <CloseOutlined />
        </a>
        <h2>{ dictionary.how_to_use.title }</h2>
        <p>{ dictionary.how_to_use.description }</p>
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
