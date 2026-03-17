import React from "react";
import { NavLink } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <NavLink to="/" end>
        Neues Spiel
      </NavLink>

      <NavLink to="/addNewPlayer" end>
        Neuen Spieler erstellen
      </NavLink>
    </nav>
  );
}

export default Navbar;
