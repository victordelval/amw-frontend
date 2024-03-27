import "./style.css";

interface FooterProps {
  dictionary: { [key: string]: any };
}

const Footer: React.FC<FooterProps> = ({ dictionary }) => {
  return (
    <div className="footer">
      <div className="mode">{dictionary.map_ui.map_mode}</div>
    </div>
  );
};

export default Footer;
