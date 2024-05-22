"use client";
import ScaleBar from "../ScaleBar";
import "./style.css";

interface FooterProps {
  zoom: number;
  dictionary?: { [key: string]: any };
}

const Footer: React.FC<FooterProps> = ({ zoom, dictionary }) => {
  return (
    <div className="footer">
      <div className="mode"></div>
      <div className="mining-legend">
        <div className="mine-swatch"></div>{" "}
        {dictionary?.map_ui.mining_areas_detected}
      </div>
      <ScaleBar zoom={zoom} />
    </div>
  );
};

export default Footer;
