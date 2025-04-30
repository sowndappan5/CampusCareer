import React from "react";
import { Routes, Route } from "react-router-dom";
import Company from "./components/Company";
import CompanyRounds from "./components/CompanyRounds";
import R from "./components/R";
import Info from "./components/Info";
import Dashboard from "./components/Dashboard";  // Make sure this component exists
import Login from "./components/Login"; // Make sure this component exists
import Register from "./components/Register"; // Make sure this component exists
import Personal from "./components/Personal"; // Make sure this component exists
import Assessment from "./components/Assessment"; // Make sure this component exists
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/personal" element={<Personal />} />
      <Route path="/company" element={<Company />} />
      <Route path="/company-rounds/:companyName" element={<CompanyRounds />} />
      <Route path="/changed" element={<R />} />
      <Route path="/info" element={<Info />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessment/:week/:day" element={<Assessment />} />

    </Routes>
  );
}
