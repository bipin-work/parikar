import { ComponentProps } from "@/type/types";
import React, { ButtonHTMLAttributes, PropsWithChildren } from "react";

type ButtonProps = ComponentProps & ButtonHTMLAttributes<HTMLButtonElement>;

const Button: React.FC<PropsWithChildren<ButtonProps>> = ({
  children,
  className,
  variant,
  size,
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    primary:
      "bg-blue-600 text-gray hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary:
      "bg-gray-200 text-gray-900 hover:bg-gray-300 focus-visible:ring-gray-500",
    destructive:
      "bg-red-600 text-gray hover:bg-red-700 focus-visible:ring-red-500",
    outline:
      "border border-gray-300 bg-transparent hover:bg-gray-50 focus-visible:ring-gray-500",
  };

  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4",
    lg: "h-12 px-6 text-lg",
  };
  return (
    <button
      {...props}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  );
};
export default Button;
