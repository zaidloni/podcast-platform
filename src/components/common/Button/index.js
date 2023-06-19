import "./style.css"
const Button = ({ text, onClick, disabled, width }) => {
  return (
    <div style={{width: `${width}`}} onClick={onClick} disabled={disabled} className="custom-btn">
        {text}
    </div>
  );
};

export default Button;
