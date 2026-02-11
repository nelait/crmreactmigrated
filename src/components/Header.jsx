// src/components/Header.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import "../index.css";

const Header = () => (
  <header>
    <div className="logo" aria-label="MINI Logo">
      MINI
    </div>
    <nav className="navigation" aria-label="Main Navigation">
      <NavLink to="/" end className={({ isActive }) => isActive ? "active" : undefined}>home</NavLink>
      <NavLink to="/home/exampleone" className={({ isActive }) => isActive ? "active" : undefined}>subpage</NavLink>
      <NavLink to="/home/exampletwo" className={({ isActive }) => isActive ? "active" : undefined}>subpage 2</NavLink>
      <NavLink to="/songs" className={({ isActive }) => isActive ? "active" : undefined}>songs</NavLink>
    </nav>
  </header>
);

export default Header;
