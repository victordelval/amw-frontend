"use client";
import "./style.css";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { message, Button, Radio } from 'antd';
import Map, { Layer, Source, Popup  } from "react-map-gl";
import { useMenu } from "../../menuContext";
import Overlay from "../Overlay";
import Area from "../Area";
import MiniMap from "../MiniMap";
import { convertBoundsToGeoJSON } from "./helpers";
import { CopyOutlined } from "@ant-design/icons";

const MainMap = () => {
  const [popupInfo, setPopupInfo] = useState<{
    latitude: number;
    longitude: number;
    zoom: number;
  } | null>(null);
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useMenu();
  const router = useRouter();
  const [blurMap, setBlurMap] = useState(false);
  const [areaVisible, setAreaVisible] = useState(true);
  const [map, setMap] = useState();
  const [bounds, setBounds] = useState();
  const [mapStyle, setMapStyle] = useState('mapbox://styles/dmccarey/cltnbtpom022h01qec2tvce30')


  const options = [
    {
      label: 'Latest',
      value: 'https://api.maptiler.com/maps/satellite/style.json?key=1G4rD08o8hiFjgNmxNJg',
    },
    {
      label: 'Hi-res',
      value: 'mapbox://styles/dmccarey/cltnbtpom022h01qec2tvce30',
    }
  ]

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

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard');
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  }

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
        mapStyle={mapStyle}
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
          const map = e.target;
          setPopupInfo({
            /* @ts-ignore */
            latitude: lngLat.lat,
            /* @ts-ignore */
            longitude: lngLat.lng,
            zoom: map.getZoom()
          });
        }}
      >

        <Source
          id={"hole-source"}
          type="vector"
          url="mapbox://dmccarey.3pur462h"
        />

        <Layer 
          id={"hole-layer"}
          source={"hole-source"}
          source-layer={'amazon-hole-0asofs'}
          type="fill"
          paint={{
            "fill-color": "#ffffff",
            "fill-opacity": 0.8
          }}
        />
              
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
              onClick={async(e) => {
                e.preventDefault();
                copyToClipboard(`${process.env.NEXT_PUBLIC_DOMAIN}/#${popupInfo.zoom.toFixed(2)}/${popupInfo.longitude.toFixed(3)}/${ popupInfo?.latitude.toFixed(3)}`)
                .then(() => {
                  message.success('URL copied')
                });
              }}
              href="#copy"
            >
              <CopyOutlined style={{ fontSize: "16px" }} /> Copy URL
            </a>
          </Popup>
        )}
      </Map>

      <div className="imagery-pills">
      <Radio.Group 
        size="small"
        options={options} 
        value={mapStyle}
        onChange={({ target: { value } }) => {
          setMapStyle(value);
        }}
        optionType="button" 
        buttonStyle="solid"
      />
      </div>

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
