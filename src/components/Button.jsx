import React from "react";

function Button({
  children,
  type = "button",
  bgColor = "bg-[#673de6]",
  textColor = "text-white",
  className = "",
  ...props
}) {
  return (
    <button
      className={`cursor-pointer px-2 py-2 rounded-lg ${bgColor} ${textColor} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export default Button;
