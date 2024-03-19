"use client";
import "./style.css";
import React, { ReactNode, useState, useEffect, useRef } from "react";
import { usePathname, useRouter } from "next/navigation";
import { message, Button, Radio, Slider } from 'antd';
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
  const [popupVisible, setPopupVisible] = useState(false);
  const pathname = usePathname();
  const { menuOpen, setMenuOpen } = useMenu();
  const router = useRouter();
  const [blurMap, setBlurMap] = useState(false);
  const [areaVisible, setAreaVisible] = useState(true);
  const [map, setMap] = useState();
  const [bounds, setBounds] = useState();
  const [mapStyle, setMapStyle] = useState('mapbox://styles/dmccarey/cltnbtpom022h01qec2tvce30');
  const [activeLayer, setActiveLayer] = useState('mines-layer-2023');

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

  const isVisible = (layerId: string) => {
    /*
    if (layerId === activeLayer) {
      return 'visible';
    }
    */
    return 'visible';
  }

  const getOpacity = (layerId: string) => {
    if (layerId === activeLayer) {
      return 1;
    }
    return 0;
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
          const map = e.target;
          popupVisible ? setPopupVisible(false) : setPopupVisible(true);
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
          id={"mines-2023"}
          type="geojson"
          tolerance={0.05}
          // @ts-ignore
          data={`https://raw.githubusercontent.com/earthrise-media/mining-detector/main/data/outputs/48px_v3.2-3.7ensemble/amazon_basin_48px_v3.2-3.7ensemble_0.50_2023-01-01_2023-12-31-dissolved-0.6.geojson`}
        />

        <Source
          id={"mines-2022"}
          type="geojson"
          tolerance={0.05}
          // @ts-ignore
          data={`https://raw.githubusercontent.com/earthrise-media/mining-detector/main/data/outputs/48px_v3.2-3.7ensemble/amazon_basin_48px_v3.2-3.7ensemble_0.50_2022-01-01_2022-12-31-dissolved-0.6.geojson`}
        />

        <Source
          id={"mines-2021"}
          type="geojson"
          tolerance={0.05}
          // @ts-ignore
          data={`https://raw.githubusercontent.com/earthrise-media/mining-detector/main/data/outputs/48px_v3.2-3.7ensemble/amazon_basin_48px_v3.2-3.7ensemble_0.50_2021-01-01_2021-12-31-dissolved-0.6.geojson`}
        />

        <Source
          id={"mines-2020"}
          type="geojson"
          tolerance={0.05}
          // @ts-ignore
          data={`https://raw.githubusercontent.com/earthrise-media/mining-detector/main/data/outputs/48px_v3.2-3.7ensemble/amazon_basin_48px_v3.2-3.7ensemble_0.50_2020-01-01_2020-12-31-dissolved-0.6.geojson`}
        />

        <Source
          id={"mines-2019"}
          type="geojson"
          tolerance={0.05}
          // @ts-ignore
          data={`https://raw.githubusercontent.com/earthrise-media/mining-detector/main/data/outputs/48px_v3.2-3.7ensemble/amazon_basin_48px_v3.2-3.7ensemble_0.50_2019-01-01_2019-12-31-dissolved-0.6.geojson`}
        />

        <Source
          id={"mines-2018"}
          type="geojson"
          tolerance={0.05}
          // @ts-ignore
          data={`https://raw.githubusercontent.com/earthrise-media/mining-detector/main/data/outputs/48px_v3.2-3.7ensemble/amazon_basin_48px_v3.2-3.7ensemble_0.50_2018-01-01_2018-12-31-dissolved-0.6.geojson`}
        />  `   `   


        {/* @ts-ignore */}
        <Layer
          id={"mines-layer-2023"}
          source={"mines-2023"}
          type="line"
          layout={{
           // visibility: isVisible('mines-layer-2023')
          }}
          paint={{
            "line-color": "#ffb301",
            "line-opacity": getOpacity('mines-layer-2023'),
            "line-width": 1,
          }}
        />

        {/* @ts-ignore */}
        <Layer
          id={"mines-layer-2022"}
          source={"mines-2022"}
          type="line"
          layout={{
           // visibility: isVisible('mines-layer-2022')
          }}
          paint={{
            "line-color": "#ffb301",
            "line-opacity": getOpacity('mines-layer-2022'),
            "line-width": 1,
          }}
        />

        {/* @ts-ignore */}
        <Layer
          id={"mines-layer-2021"}
          source={"mines-2021"}
          type="line"
          layout={{
           // visibility: isVisible('mines-layer-2021')
          }}
          paint={{
            "line-color": "#ffb301",
            "line-opacity": getOpacity('mines-layer-2021'),
            "line-width": 1,
          }}
        />


        {/* @ts-ignore */}
        <Layer
          id={"mines-layer-2020"}
          source={"mines-2020"}
          type="line"
          layout={{
          //  visibility: isVisible('mines-layer-2020')
          }}
          paint={{
            "line-color": "#ffb301",
            "line-opacity": getOpacity('mines-layer-2020'),
            "line-width": 1,
          }}
        />

         {/* @ts-ignore */}
         <Layer
          id={"mines-layer-2019"}
          source={"mines-2019"}
          type="line"
          layout={{
          //  visibility: isVisible('mines-layer-2019')
          }}
          paint={{
            "line-color": "#ffb301",
            "line-opacity": getOpacity('mines-layer-2019'),
            "line-width": 1,
          }}
        />


         {/* @ts-ignore */}
         <Layer
          id={"mines-layer-2018"}
          source={"mines-2018"}
          type="line"
          layout={{
          //  visibility: isVisible('mines-layer-2018')
          }}
          paint={{
            "line-color": "#ffb301",
            "line-opacity": getOpacity('mines-layer-2018'),
            "line-width": 1,
          }}
        />

        {popupVisible && popupInfo && (
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

      <div className="year-pills">
        
   
      <Radio.Group 
   
        options={[
          {
            label: '2023',
            value: 'mines-layer-2023',
          },
          {
            label: '2022',
            value: 'mines-layer-2022',
          },
          {
            label: '2021',
            value: 'mines-layer-2021',
          },
          {
            label: '2020',
            value: 'mines-layer-2020',
          },
          {
            label: '2019',
            value: 'mines-layer-2019',
          },
          {
            label: '2018',
            value: 'mines-layer-2018',
          }
        ]} 
        value={activeLayer}
        onChange={({ target: { value } }) => {
          setActiveLayer(value);
        }}
        optionType="button" 
        buttonStyle="solid"
      />
    
      </div>

      <div className="imagery-pills">
      <Radio.Group 
        size="small"
        options={[
          {
            label: 'Latest',
            value: 'https://api.maptiler.com/maps/satellite/style.json?key=1G4rD08o8hiFjgNmxNJg',
          },
          {
            label: 'Hi-res',
            value: 'mapbox://styles/dmccarey/cltnbtpom022h01qec2tvce30',
          }
        ]} 
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
