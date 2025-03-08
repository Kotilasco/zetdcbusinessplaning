"use client";

import { logout } from "@/app/actions/logout";
import { useTransition } from "react";

interface LogoutButtonProps {
  children?: React.ReactNode;
}

export const LogoutButton = ({ children }: LogoutButtonProps) => {
  const [isPending, startTransition] = useTransition();

  const onClick = () => {
    startTransition(() => {
      logout();
    });
  };

  return (
    <span
      onClick={onClick}
      className={`${isPending ? " cursor-not-allowed" : "cursor-pointer"}`}
    >
      {children}
    </span>
  );
};
