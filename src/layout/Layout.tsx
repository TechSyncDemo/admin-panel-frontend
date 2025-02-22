import { ReactNode } from "react";
import Sidebar from "./Sidebar";
import React from "react";
import Navbar from "./Navbar";

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <Navbar />
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
