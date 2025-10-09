import React from "react";
import { useUserContext } from "../context/userContext";
import Navbar from "./Navbar";

const DashboardLayout = ({ activeMenu, children }) => {
  const { user } = useUserContext();

  return (
    <>
      <Navbar activeMenu={activeMenu} />
      {user && <div className="container mx-auto pb-4">{children}</div>}
    </>
  );
};

export default DashboardLayout;
