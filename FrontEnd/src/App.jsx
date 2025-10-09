import React from "react";
import { Routes, Route } from "react-router-dom";
import LandingPages from "./pages/LandingPages";
import UserProvider from "./context/userContext";
import Dashboard from "./pages/Dashboard";
import EditResume from "./components/EditResume";
import { Toaster } from "react-hot-toast";
const App = () => {
  return (
    <>
      <UserProvider>
        <Routes>
          <Route path="/" element={<LandingPages />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/resume/:id" element={<EditResume />} />
        </Routes>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </UserProvider>
    </>
  );
};

export default App;
