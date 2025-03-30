import { ButtonProps } from "../../Types/types";

const Button: React.FC<ButtonProps> = ({
  onClick,
  children,
  variant = "primary",
  className = "",
  disabled = false,
}) => {
  const baseStyles =
    "px-4 py-2.5 rounded-md flex items-center justify-center gap-2 font-medium transition-all shadow-wood";
  
  const variantStyles = {
    primary: "bg-amber-700 text-white hover:bg-amber-800 border-2 border-amber-900",
    secondary: "bg-amber-100 text-amber-900 hover:bg-amber-200 border-2 border-amber-300",
    outline: "bg-transparent border-2 border-amber-400 text-amber-800 hover:bg-amber-50",
  };

  const disabledStyle = "opacity-50 cursor-not-allowed";

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyle : ''} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;