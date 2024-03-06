import { ReactNode } from "react";
import "./style.css";

interface OverlayProps {
  children?: ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ children }) => {
  return (
    <div className="overlay">
      <div className="content">{children}</div>
    </div>
  );
};

export default Overlay;
