import React from "react";
import { Route, Routes } from "react-router-dom";
import { Login } from "./pages/auth/Login";
import { HomeC } from "./pages/chefDev/HomeC";
import { HomeS } from "./pages/saisie/HomeS";
import { PersisLogin } from "./pages/auth/PersisLogin";
import Layout from "./components/Layout/Layout";
import { Devisions } from "./pages/admin/Devisions";
import { Courriers } from "./pages/admin/Courriers";
import { Utilisateurs } from "./pages/admin/Utilisateurs";
import { ExpDes } from "./pages/admin/ExpDes";
import { CourriersDeleted } from "./pages/admin/CourriersDeleted";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route element={<PersisLogin />}>
        <Route element={<Layout />}>
          <Route path="/admin/devisions" element={<Devisions />} />
          <Route path="/admin/courriers" element={<Courriers />} />
          <Route path="/admin/courriersdeleted" element={<CourriersDeleted />} />
          <Route path="/admin/utilisateurs" element={<Utilisateurs />} />
          <Route path="/admin/expDes" element={<ExpDes />} />
          <Route path="/chef_division/home" element={<HomeC />} />
          <Route path="/saisie/home" element={<HomeS />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
