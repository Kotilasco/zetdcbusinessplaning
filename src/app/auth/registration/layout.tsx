import { Toaster } from "@/components/ui/toaster";
import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  // bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800
  return (
    <div
      style={{
        backgroundImage: "url(/images/logo/lightmode.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className="min-h-screen h-fit "
    >
      {children}

      <Toaster />
    </div>
  );
}

export default layout;
