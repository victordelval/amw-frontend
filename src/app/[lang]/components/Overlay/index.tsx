import { ReactNode } from "react";
import "./style.css";

interface OverlayProps {
  children?: ReactNode;
  opacity?: number;
}

const Overlay: React.FC<OverlayProps> = (props) => {
  const { children, opacity } = props;
  return (
    <div 
      className="overlay"
      style={{
        background: opacity === 1 ? `#003e36` : `rgba(0, 54, 56, 0.9)`
      }}
    >
      <div className="content">{children}</div>
    </div>
  );
};

export default Overlay;
