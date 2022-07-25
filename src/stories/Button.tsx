import React from "react";
import { Button } from "../components/elements";

interface ButtonProps {
  disabled?: boolean;
  variant?: "primary" | "secondary" | "tertiary";
  label: string;
  onClick?: () => void;
}

export default ({ label, ...props }: ButtonProps) => {
  return <Button {...props}>{label}</Button>;
};
