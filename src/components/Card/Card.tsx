import "./Card.css";
const imageSource = "./Images/";

interface CardProps {
  name: string;
  isActive?: boolean;
  disable?: boolean;
  openPicker?: () => void;
}

function Card({ name = "none", isActive, openPicker, disable }: CardProps) {
  return (
    <img
      className={`Card ${isActive ? "active" : ""} ${disable ? "disable" : ""}`}
      src={`${imageSource}${name}.png`}
      alt={name}
      onClick={openPicker}
    />
  );
}

export default Card;
