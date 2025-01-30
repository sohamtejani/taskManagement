import React from "react";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import { Outlet } from "react-router-dom";
import FilterComponent from "./components/Filter/FilterComponent";

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <Header />
      <div className="flex flex-1">
      <div className="w-full">
          <Outlet /> {/* Your AddTask component */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Layout;
