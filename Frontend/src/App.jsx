import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { Dashboard } from "./pages/admin/Dashboard";
import { HomeC } from "./pages/chefDev/HomeC";
import { HomeS } from "./pages/saisie/HomeS";
import { PersisLogin } from "./pages/auth/PersisLogin";
import Layout from "./components/Layout/Layout";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route element={<PersisLogin />}>
        <Route element={<Layout />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/chef_division/home" element={<HomeC />} />
          <Route path="/saisie/home" element={<HomeS />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
