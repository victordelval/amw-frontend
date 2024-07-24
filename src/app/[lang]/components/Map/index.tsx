'use client';
import './style.css';
import React, {
  ReactNode,
  useState,
  useEffect,
  useRef,
  useCallback,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { message, Button, Radio, Slider, Select, ConfigProvider } from 'antd';
import Map, { Layer, Source, Popup, ScaleControl } from 'react-map-gl';
import { useMenu } from '../../menuContext';
import Overlay from '../Overlay';
import Area from '../Area';
import Footer from '../Footer';
import MiniMap from '../MiniMap';
import { convertBoundsToGeoJSON } from './helpers';
import { CopyOutlined } from '@ant-design/icons';
const { Option } = Select;

const dataLayer = {
  id: 'data-2023',
  type: 'fill',
  paint: {
    'fill-color': '#ff0000',
    'fill-opacity': 0.8,
  },
};

const dataLayerSelection = {
  id: 'selection',
  type: 'line',
  paint: {
    'line-color': '#00FFFF',
    'line-width': 10,
  },
};

const dataLayerNoSelection = {
  id: 'no-selection',
  type: 'fill',
  paint: {
    'fill-color': '#ff0000',
    'fill-opacity': 0.3,
  },
};

interface MainMapProps {
  dictionary: { [key: string]: any };
}

const MainMap: React.FC<MainMapProps> = ({ dictionary }) => {
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
  const [yearly, setYearly] = useState(true);
  const [activeLayer, setActiveLayer] = useState('2023');

  // feedback from user
  const [feedbackMode, setFeedbackMode] = useState(false);
  const [allData, setAllData] = useState(null);
  const [hoverInfo, setHoverInfo] = useState(null);
  const [selected, setSelected] = useState(null);
  /*  
  mapbox://styles/earthrise/ckxht1jfm2h9k15m7wrv5wz5w
  */
  const [mapStyle, setMapStyle] = useState(
    'mapbox://styles/earthrise/clvwchqxi06gh01pe1huv70id'
  );

  useEffect(() => {
    /* global fetch */
    fetch(
      `${process.env.NEXT_PUBLIC_MINES_URL}/amazon_basin_48px_v3.2-3.7ensemble_0.50_2023-01-01_2023-12-31-dissolved-0.6.geojson`
      // 'https://raw.githubusercontent.com/uber/react-map-gl/master/examples/.data/us-income.geojson'
    )
      .then((resp) => resp.json())
      .then((json) => {
        // console.log('Data: ', json);
        const dataWithId = {
          ...json,
          features: json.features.map((d, index) => ({
            ...d,
            id: index,
            properties: { id: index },
          })),
        };
        // console.log('Data with ID: ', dataWithId);
        setAllData(dataWithId);
      })
      .catch((err) => console.error('Could not load data', err)); // eslint-disable-line
  }, []);

  useEffect(() => {
    if (window.location.hash) {
      const split = window.location.hash.split('/');
      const lng = split[1];
      const lat = split[2];
      const zoomRaw = split[0];
      const zoom = zoomRaw.split('#')[1];
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
    const zoom = map?.getZoom();
    /* @ts-ignore */
    const center = map?.getCenter();
    const lng = center?.lng;
    const lat = center?.lat;
    router.replace(
      `${pathname}/#${zoom.toFixed(2)}/${lng.toFixed(2)}/${lat.toFixed(2)}`,
      undefined
    );
  };

  const copyToClipboard = async (text: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const getOpacity = (layerId: string) => {
    if (layerId === `mines-layer-${activeLayer}`) {
      return 1;
    }
    return 0;
  };

  const getSatelliteOpacity = (layerId: string) => {
    if (yearly && layerId === `sentinel-layer-${activeLayer}`) {
      return 1;
    }
    return 0;
  };

  const onHover = useCallback((event) => {
    const {
      features,
      point: { x, y },
    } = event;
    const hoveredFeature = features && features[0];
    // console.log('Hovered feature: ', hoveredFeature);

    // prettier-ignore
    setHoverInfo(hoveredFeature && {feature: hoveredFeature, x, y});
  }, []);

  const onClick = useCallback(
    (event) => {
      const {
        features,
        point: { x, y },
      } = event;
      const clickedFeature = features && features[0];
      const clickedObject = allData?.features.find(
        (f) => f.id === clickedFeature?.id
      );
      setSelected(clickedObject ? clickedObject : null);
    },
    [allData]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setFeedbackMode(!feedbackMode)}
        style={{
          position: 'absolute',
          zIndex: 1000,
          top: 0,
          left: 0,
          cursor: 'pointer',
        }}
      >
        Feedback Mode {feedbackMode ? 'OFF' : 'ON'}
      </button>
      {feedbackMode && (
        <div
          style={{
            position: 'absolute',
            zIndex: 100,
            display: 'flex',
            top: 300,
            right: 10,
            padding: '10px',
            borderRadius: '10px',
            width: '20vw',
            height: '40vh',
            background: 'rgba(34, 181, 115, 0.6)',
            color: 'white',
          }}
        >
          <h1>Polygon: {selected?.id}</h1>
        </div>
      )}
      <div
        className="main-map"
        style={{
          filter: blurMap ? 'blur(80px)' : 'none',
        }}
      >
        <Map
          mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
          interactiveLayerIds={['data-2023', 'selection', 'no-selection']}
          initialViewState={{
            longitude: -67.78320182377449,
            latitude: -5.871455584726869,
            zoom: 3.7,
          }}
          minZoom={3.5}
          projection={{
            name: 'naturalEarth',
            center: [183, 40],
            parallels: [30, 30],
          }}
          style={{
            width: '100hw',
            height: '100vh',
          }}
          mapStyle={mapStyle}
          onMove={() => {
            if (map) {
              /* @ts-ignore */
              if (map?.getZoom() > 4) {
                setAreaVisible(false);
              } else {
                setAreaVisible(true);
              }

              /* @ts-ignore */
              const currentBounds = convertBoundsToGeoJSON(map?.getBounds());
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
            if (feedbackMode) {
              onClick(e);
              return;
            }
            const { lngLat } = e;
            const map = e.target;
            const features = map.queryRenderedFeatures(e.point);
            const clickedOnExcludedLayer = features.some(
              (feature) => feature.layer.id === 'hole-layer'
            );
            if (!clickedOnExcludedLayer) {
              popupVisible ? setPopupVisible(false) : setPopupVisible(true);
              setPopupInfo({
                /* @ts-ignore */
                latitude: lngLat.lat,
                /* @ts-ignore */
                longitude: lngLat.lng,
                zoom: map?.getZoom(),
              });
            }
          }}
        >
          {feedbackMode && !selected && (
            <Source type="geojson" data={allData}>
              <Layer {...dataLayer} />
            </Source>
          )}
          {feedbackMode && selected && (
            <>
              <Source type="geojson" data={selected}>
                <Layer {...dataLayerSelection} />
              </Source>
              <Source
                type="geojson"
                data={{
                  ...allData,
                  features: allData?.features.filter(
                    (shape) => shape.id !== selected.id
                  ),
                }}
              >
                <Layer {...dataLayerNoSelection} />
              </Source>
            </>
          )}
          {hoverInfo && (
            <div
              className="absolute tooltip"
              style={{ left: hoverInfo.x, top: hoverInfo.y }}
            >
              <div>Polygon: {hoverInfo.feature.properties.id}</div>
            </div>
          )}
          {/* ================== SENTINEL2 SOURCES =================== */}
          <Source
            id="sentinel-2018"
            type="raster"
            tiles={[
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_1}/2018-01-01/2019-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_2}/2018-01-01/2019-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_3}/2018-01-01/2019-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_4}/2018-01-01/2019-01-01/rgb/{z}/{x}/{y}.webp`,
            ]}
            tileSize={256}
            bounds={[-80.0, -20.0, -50.0, 20.0]}
          />
          <Source
            id="sentinel-2019"
            type="raster"
            tiles={[
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_1}/2019-01-01/2020-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_2}/2019-01-01/2020-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_3}/2019-01-01/2020-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_4}/2019-01-01/2020-01-01/rgb/{z}/{x}/{y}.webp`,
            ]}
            tileSize={256}
            bounds={[-80.0, -20.0, -50.0, 20.0]}
          />
          <Source
            id="sentinel-2020"
            type="raster"
            tiles={[
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_1}/2020-01-01/2021-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_2}/2020-01-01/2021-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_3}/2020-01-01/2021-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_4}/2020-01-01/2021-01-01/rgb/{z}/{x}/{y}.webp`,
            ]}
            tileSize={256}
            bounds={[-80.0, -20.0, -50.0, 20.0]}
          />
          <Source
            id="sentinel-2021"
            type="raster"
            tiles={[
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_1}/2021-01-01/2022-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_2}/2021-01-01/2022-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_3}/2021-01-01/2022-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_4}/2021-01-01/2022-01-01/rgb/{z}/{x}/{y}.webp`,
            ]}
            tileSize={256}
            bounds={[-80.0, -20.0, -50.0, 20.0]}
          />
          <Source
            id="sentinel-2022"
            type="raster"
            tiles={[
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_1}/2022-01-01/2023-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_2}/2022-01-01/2023-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_3}/2022-01-01/2023-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_4}/2022-01-01/2023-01-01/rgb/{z}/{x}/{y}.webp`,
            ]}
            tileSize={256}
            bounds={[-80.0, -20.0, -50.0, 20.0]}
          />
          <Source
            id="sentinel-2023"
            type="raster"
            tiles={[
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_1}/2023-01-01/2024-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_2}/2023-01-01/2024-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_3}/2023-01-01/2024-01-01/rgb/{z}/{x}/{y}.webp`,
              `${process.env.NEXT_PUBLIC_SENTINEL2_URL_4}/2023-01-01/2024-01-01/rgb/{z}/{x}/{y}.webp`,
            ]}
            tileSize={256}
            bounds={[-80.0, -20.0, -50.0, 20.0]}
          />

          {/* ================== SENTINEL2 LAYERS =================== */}
          <Layer
            id="sentinel-layer-2018"
            type="raster"
            source={`sentinel-2018`}
            paint={{
              'raster-opacity': getSatelliteOpacity(`sentinel-layer-2018`),
            }}
          />
          <Layer
            id="sentinel-layer-2019"
            type="raster"
            source={`sentinel-2019`}
            paint={{
              'raster-opacity': getSatelliteOpacity(`sentinel-layer-2019`),
            }}
          />
          <Layer
            id="sentinel-layer-2020"
            type="raster"
            source={`sentinel-2020`}
            paint={{
              'raster-opacity': getSatelliteOpacity(`sentinel-layer-2020`),
            }}
          />
          <Layer
            id="sentinel-layer-2021"
            type="raster"
            source={`sentinel-2021`}
            paint={{
              'raster-opacity': getSatelliteOpacity(`sentinel-layer-2021`),
            }}
          />
          <Layer
            id="sentinel-layer-2022"
            type="raster"
            source={`sentinel-2022`}
            paint={{
              'raster-opacity': getSatelliteOpacity(`sentinel-layer-2022`),
            }}
          />
          <Layer
            id="sentinel-layer-2023"
            type="raster"
            source={`sentinel-2023`}
            paint={{
              'raster-opacity': getSatelliteOpacity(`sentinel-layer-2023`),
            }}
          />

          {/* ================== MASK =================== */}
          <Source
            id={'hole-source'}
            type="vector"
            url="mapbox://dmccarey.3pur462h"
          />
          <Layer
            id={'hole-layer'}
            source={'hole-source'}
            source-layer={'amazon-hole-0asofs'}
            type="fill"
            paint={{
              'fill-color': yearly ? '#dddddd' : '#ffffff',
              'fill-opacity': yearly ? 1 : 0.6,
            }}
          />

          {/* ================== BORDERS =================== */}
          <Source
            id="boundaries"
            type="vector"
            url="mapbox://mapbox.country-boundaries-v1"
          />
          <Layer
            id="boundary-layer"
            source="boundaries"
            type="line"
            source-layer="country_boundaries"
            paint={{
              'line-color': '#777',
              'line-width': 0.5,
            }}
          />

          {/* ================== MINE SOURCES =================== */}
          <Source
            id={'mines-2023'}
            type="geojson"
            tolerance={0.05}
            // @ts-ignore
            data={`${process.env.NEXT_PUBLIC_MINES_URL}/amazon_basin_48px_v3.2-3.7ensemble_0.50_2023-01-01_2023-12-31-dissolved-0.6.geojson`}
          />
          <Source
            id={'mines-2022'}
            type="geojson"
            tolerance={0.05}
            // @ts-ignore
            data={`${process.env.NEXT_PUBLIC_MINES_URL}/amazon_basin_48px_v3.2-3.7ensemble_0.50_2022-01-01_2022-12-31-dissolved-0.6.geojson`}
          />
          <Source
            id={'mines-2021'}
            type="geojson"
            tolerance={0.05}
            // @ts-ignore
            data={`${process.env.NEXT_PUBLIC_MINES_URL}/amazon_basin_48px_v3.2-3.7ensemble_0.50_2021-01-01_2021-12-31-dissolved-0.6.geojson`}
          />
          <Source
            id={'mines-2020'}
            type="geojson"
            tolerance={0.05}
            // @ts-ignore
            data={`${process.env.NEXT_PUBLIC_MINES_URL}/amazon_basin_48px_v3.2-3.7ensemble_0.50_2020-01-01_2020-12-31-dissolved-0.6.geojson`}
          />
          <Source
            id={'mines-2019'}
            type="geojson"
            tolerance={0.05}
            // @ts-ignore
            data={`${process.env.NEXT_PUBLIC_MINES_URL}/amazon_basin_48px_v3.2-3.7ensemble_0.50_2019-01-01_2019-12-31-dissolved-0.6.geojson`}
          />
          <Source
            id={'mines-2018'}
            type="geojson"
            tolerance={0.05}
            // @ts-ignore
            data={`${process.env.NEXT_PUBLIC_MINES_URL}/amazon_basin_48px_v3.2-3.7ensemble_0.50_2018-01-01_2018-12-31-dissolved-0.6.geojson`}
          />

          {/* ================== MINE LAYERS =================== */}
          <Layer
            id={'mines-layer-2023'}
            source={'mines-2023'}
            type="line"
            paint={{
              'line-color': '#ffb301',
              'line-opacity': getOpacity(`mines-layer-2023`),
              'line-width': 1,
            }}
          />
          <Layer
            id={'mines-layer-2022'}
            source={'mines-2022'}
            type="line"
            paint={{
              'line-color': '#ffb301',
              'line-opacity': getOpacity(`mines-layer-2022`),
              'line-width': 1,
            }}
          />
          <Layer
            id={'mines-layer-2021'}
            source={'mines-2021'}
            type="line"
            paint={{
              'line-color': '#ffb301',
              'line-opacity': getOpacity(`mines-layer-2021`),
              'line-width': 1,
            }}
          />
          <Layer
            id={'mines-layer-2020'}
            source={'mines-2020'}
            type="line"
            paint={{
              'line-color': '#ffb301',
              'line-opacity': getOpacity(`mines-layer-2020`),
              'line-width': 1,
            }}
          />
          <Layer
            id={'mines-layer-2019'}
            source={'mines-2019'}
            type="line"
            paint={{
              'line-color': '#ffb301',
              'line-opacity': getOpacity(`mines-layer-2019`),
              'line-width': 1,
            }}
          />
          <Layer
            id={'mines-layer-2018'}
            source={'mines-2018'}
            type="line"
            paint={{
              'line-color': '#ffb301',
              'line-opacity': getOpacity(`mines-layer-2018`),
              'line-width': 1,
            }}
          />

          {/* ================== LABELS =================== */}
          <Layer
            id="country-labels"
            type="symbol"
            source="amazon-cover-water"
            source-layer="place_label"
            filter={[
              'all',
              [
                '<=',
                ['string', ['get', 'class']],
                'settlement, settlement_subdivision',
              ],
            ]}
            minzoom={6}
            layout={{
              'text-field': ['coalesce', ['get', 'name_en'], ['get', 'name']],
            }}
            paint={{
              'text-color': '#ffffff',
            }}
          />

          {/* ================== POPUP =================== */}
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
                  <td className="number-value">
                    {popupInfo.longitude.toFixed(3)}
                  </td>
                  <td className="number-value">
                    {popupInfo?.latitude.toFixed(3)}
                  </td>
                </tr>
                <tr>
                  <td>Longitude</td>
                  <td>Latitude</td>
                </tr>
              </table>

              <a
                className="copy-url"
                onClick={async (e) => {
                  e.preventDefault();
                  copyToClipboard(
                    `${
                      process.env.NEXT_PUBLIC_DOMAIN
                    }/#${popupInfo.zoom.toFixed(
                      2
                    )}/${popupInfo.longitude.toFixed(
                      3
                    )}/${popupInfo?.latitude.toFixed(3)}`
                  ).then(() => {
                    message.success('URL copied');
                  });
                }}
                href="#copy"
              >
                <CopyOutlined style={{ fontSize: '16px' }} /> Copy URL
              </a>
            </Popup>
          )}

          <div className="map-scale-control"></div>
        </Map>

        <div className="year-pills">
          <Radio.Group
            options={[
              {
                label: '2018',
                value: '2018',
              },
              {
                label: '2019',
                value: '2019',
              },
              {
                label: '2020',
                value: '2020',
              },
              {
                label: '2021',
                value: '2021',
              },
              {
                label: '2022',
                value: '2022',
              },
              {
                label: '2023',
                value: '2023',
              },
            ]}
            value={activeLayer}
            onChange={({ target: { value } }) => {
              setActiveLayer(value);
            }}
            optionType="button"
            buttonStyle="solid"
          />
        </div>

        <div className="year-dropdown">
          <ConfigProvider
            theme={{
              components: {
                Select: {
                  selectorBg: 'rgb(11, 95, 58)',
                  optionSelectedColor: 'rgba(242, 236, 236, 0.88)',
                  colorIconHover: 'rgba(250, 246, 246, 0.88)',
                  colorBgContainer: 'rgb(11, 95, 58)',
                  colorBgElevated: 'rgb(11, 95, 58)',
                  colorPrimary: 'rgb(242, 237, 237)',
                  colorIcon: 'rgb(255,255,255)',
                  colorBorder: 'rgb(6, 89, 36)',
                  optionSelectedBg: 'rgb(76, 97, 77)',
                  colorText: 'rgba(250, 249, 249, 0.88)',
                  colorFillTertiary: 'rgba(242, 234, 234, 0.04)',
                  colorFillSecondary: 'rgba(241, 228, 228, 0.06)',
                  colorTextQuaternary: 'rgba(249, 249, 249, 0.25)',
                  colorTextTertiary: 'rgba(244, 236, 236, 0.9)',
                  colorTextDescription: 'rgba(255, 253, 253, 0.45)',
                  colorTextDisabled: 'rgba(239, 233, 233, 0.25)',
                  colorTextPlaceholder: 'rgba(255, 255, 255, 0.9)',
                },
              },
            }}
          >
            <Select
              style={{ width: '100px' }}
              value={activeLayer}
              onChange={(value) => {
                setActiveLayer(value);
              }}
            >
              <Option value={2023}>2023</Option>
              <Option value={2022}>2022</Option>
              <Option value={2021}>2021</Option>
              <Option value={2020}>2020</Option>
              <Option value={2019}>2019</Option>
              <Option value={2018}>2018</Option>
            </Select>
          </ConfigProvider>
        </div>

        <div className="imagery-pills">
          <Radio.Group
            size="small"
            options={[
              {
                label: dictionary?.map_ui.latest,
                value: true,
              },
              {
                label: dictionary?.map_ui.hi_res,
                value: false,
              },
            ]}
            value={yearly}
            onChange={({ target: { value } }) => {
              setYearly(value);
              if (value === false) {
                setMapStyle(
                  `mapbox://styles/earthrise/ckxht1jfm2h9k15m7wrv5wz5w`
                );
              } else {
                setMapStyle(
                  'mapbox://styles/earthrise/clvwchqxi06gh01pe1huv70id'
                );
              }
            }}
            optionType="button"
            buttonStyle="solid"
          />
        </div>

        <div className="partners">
          <a className="pc-logo" href="https://pulitzercenter.org">
            Pulitzer Center
          </a>
          <a
            className="rin-logo"
            href="https://pulitzercenter.org/journalism/initiatives/rainforest-investigations-network-initiative"
          >
            RIN
          </a>
          <a className="ac-logo" href="https://www.amazonconservation.org/">
            Amazon Conservation
          </a>
          <a className="eg-logo" href="https://earthgenome.org/">
            Earth Genome
          </a>
        </div>

        {areaVisible && <Area dictionary={dictionary} year={activeLayer} />}
        {/* @ts-ignore */}
        {map && map?.getZoom() > 5 && (
          /* @ts-ignore */
          <MiniMap bounds={bounds} />
        )}
        {/* @ts-ignore */}
        <Footer
          year={activeLayer}
          zoom={map?.getZoom() || 4}
          dictionary={dictionary}
        />
      </div>
    </>
  );
};

export default MainMap;
