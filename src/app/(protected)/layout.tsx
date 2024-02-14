import React from "react";
import { Navbar } from "./_components/navbar";
import { Sidebar } from "./_components/sidebar";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full w-full flex flex-row items-center">
      <Sidebar />
      <div className="h-full w-full flex flex-col items-center justify-center">
        {children}
      </div>
      {/* <div className="h-full w-full flex flex-row gap-y-10 items-center justify-center">
        <Navbar />
      </div> */}
    </div>
  );
};

export default ProtectedLayout;
