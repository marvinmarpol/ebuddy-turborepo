"use client";

import { Button } from "@mui/material";
import { ReactNode } from "react";

interface ButtonProps {
  children?: ReactNode;
  onclick?: () => void;
  disabled?: boolean;
}

export const UpdateButton = ({ children, onclick, disabled }: ButtonProps) => {
  return (
    <Button
      variant='contained'
      color='primary'
      onClick={onclick}
      disabled={disabled}
    >
      {children}
    </Button>
  );
};
