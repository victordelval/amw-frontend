"use client";
import "./style.css";
import React, { useRef, useEffect } from "react";
import Map, { ScaleControl } from "react-map-gl";
import geojson from "../../data/amazon_basin.json";

interface MiniMapProps {
  zoom: number
}

const ScaleBar: React.FC<MiniMapProps> = ({ zoom }) => {
  return (
    <div className="scale-bar">
      <Map
       zoom={zoom}
      >
        <ScaleControl />
      </Map>
    </div>
  );
};

export default ScaleBar;
