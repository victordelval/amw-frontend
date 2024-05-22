"use client";
import "./style.css";
import React, { useRef, useEffect } from "react";
import Map, { ScaleControl } from "react-map-gl";
import geojson from "../../data/amazon_basin.json";

interface MiniMapProps {
  zoom: number;
}

const ScaleBar: React.FC<MiniMapProps> = ({ zoom }) => {
  return (
    <div className="scale-bar">
      <Map zoom={zoom}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      >
        <div className="scale">
          <div className="scale-left"></div>
          <div className="scale-right"></div>
        </div>
        <ScaleControl />
      </Map>
    </div>
  );
};

export default ScaleBar;
