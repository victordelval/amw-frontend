"use client";
import "./style.css";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import Map, { Layer, Source, Popup } from "react-map-gl";
import { useMenu } from "../../menuContext";
import Overlay from "../Overlay";
import Area from "../Area";
import geojson from "../../data/amazon_basin.json";
import MiniMap from "../MiniMap";
import { convertBoundsToGeoJSON } from "./helpers";
import { CopyOutlined } from "@ant-design/icons";

const MainMap = () => {
  const [popupInfo, setPopupInfo] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useMenu();
  const router = useRouter();
  const [blurMap, setBlurMap] = useState(false);
  const [areaVisible, setAreaVisible] = useState(true);
  const [map, setMap] = useState();
  const [bounds, setBounds] = useState();

  useEffect(() => {
    if (window.location.hash) {
      const split = window.location.hash.split("/");
      const lng = split[1];
      const lat = split[2];
      const zoomRaw = split[0];
      const zoom = zoomRaw.split("#")[1];
      if (map) {
        /* @ts-ignore */
        map?.jumpTo({
          center: [lng, lat],
          zoom: zoom,
        });
      }
    }
  }, [map]);

  const updateURLHash = () => {
    /* @ts-ignore */
    const zoom = map.getZoom();
    /* @ts-ignore */
    const center = map.getCenter();
    const lng = center.lng;
    const lat = center.lat;
    router.replace(
      `${pathname}/#${zoom.toFixed(2)}/${lng.toFixed(2)}/${lat.toFixed(2)}`,
      undefined,
    );
  };

  return (
    <div
      className="main-map"
      style={{
        filter: blurMap ? "blur(80px)" : "none",
      }}
    >
      <Map
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        initialViewState={{
          longitude: -67.78320182377449,
          latitude: -5.871455584726869,
          zoom: 4,
        }}
        maxBounds={[
          [-92, -24],
          [-26, 18],
        ]}
        projection={{
          name: "naturalEarth",
          center: [183, 40],
          parallels: [30, 30],
        }}
        style={{
          width: "100hw",
          height: "100vh",
        }}
        mapStyle="mapbox://styles/dmccarey/clsz6tmx301eq01p4bz5k46rr"
        onMove={(e) => {
          if (map) {
            /* @ts-ignore */
            if (map.getZoom() > 4) {
              setAreaVisible(false);
            } else {
              setAreaVisible(true);
            }
            /* @ts-ignore */
            const currentBounds = convertBoundsToGeoJSON(map.getBounds());
            /* @ts-ignore */
            setBounds(currentBounds);
          }
        }}
        onMoveEnd={() => {
          updateURLHash();
        }}
        onZoomEnd={() => {
          updateURLHash();
        }}
        onLoad={(e) => {
          /* @ts-ignore */
          setMap(e.target);
        }}
        onClick={(e) => {
          const { lngLat } = e;
          console.log(e);
          setPopupInfo({
            /* @ts-ignore */
            latitude: lngLat.lat,
            /* @ts-ignore */
            longitude: lngLat.lng,
          });
        }}
      >
        <Source
          id={"mines-source"}
          type="geojson"
          tolerance={0.05}
          // @ts-ignore
          data={`https://raw.githubusercontent.com/earthrise-media/mining-detector/main/data/outputs/44px_v2.9/mining_amazon_all_unified_thresh_0.8_v44px_v2.6-2.9_2020-01-01_2021-02-01_period_4_method_median.geojson`}
        />

        {/* @ts-ignore */}
        <Layer
          id={"mines-layer"}
          source={"mines-source"}
          type="line"
          paint={{
            "line-color": "#ffb301",
            "line-opacity": 1.0,
            "line-width": 1,
          }}
        />
        {popupInfo && (
          <Popup
            longitude={popupInfo?.longitude}
            latitude={popupInfo?.latitude}
            closeButton={false}
            closeOnClick={false}
            onClose={() => setPopupInfo(null)}
          >
            <table>
              <tr>
                <td className="number-value">{ popupInfo.longitude.toFixed(3) }</td>
                <td className="number-value">{ popupInfo?.latitude.toFixed(3) }</td>
              </tr>
              <tr>
                <td>Longitude</td>
                <td>Latitude</td>
              </tr>
            </table>
            
           
            <a
              className="copy-url"
              onClick={(e) => {
                e.preventDefault();
              }}
              href="#copy"
            >
              <CopyOutlined style={{ fontSize: "16px" }} /> Copy URL
            </a>
          </Popup>
        )}
      </Map>
      {areaVisible && <Area />}
      {/* @ts-ignore */}
      {map && map.getZoom() > 5 && (
        /* @ts-ignore */
        <MiniMap bounds={bounds} />
      )}
    </div>
  );
};

export default MainMap;
