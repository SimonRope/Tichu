import React from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const lastGameId = localStorage.getItem("lastGameId");

  const goToLastGame = () => {
    if (lastGameId) {
      navigate(`/game/${lastGameId}`);
    }
  };

  return (
    <nav className="navbar">
      <button
        onClick={() => {
          sessionStorage.setItem("didRedirect", "true");
          navigate("/");
        }}
      >
        Home
      </button>

      <button onClick={() => navigate("/newGame")}>Neues Spiel</button>

      <button onClick={() => navigate("/addNewPlayer")}>
        Neuen Spieler erstellen
      </button>

      {
        //button nur anzeigen, wenn es ein letztes spiel gibt und man gerade nicht in einem spiel ist.
        lastGameId && !location.pathname.startsWith("/game/") && (
          <button onClick={goToLastGame}>Letztes Spiel</button>
        )
      }
    </nav>
  );
}

export default Navbar;
