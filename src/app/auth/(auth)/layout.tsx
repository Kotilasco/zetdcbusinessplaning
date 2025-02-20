import React from "react";

function layout({ children }: { children: React.ReactNode }) {
  // bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-400 to-blue-800
  return (
    <div
      style={{
        backgroundImage: "url(/images/logo/bgimagedark.jpg)",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
      className=" flex h-full min-h-screen items-center justify-center"
    >
      {children}
    </div>
  );
}

export default layout;
