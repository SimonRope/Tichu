import React, { useState } from "react";
import BambooBox from "../components/BambooBox";
import Navbar from "../components/Navbar";
import { tablesDB } from "../lib/appwrite";
import { Query } from "appwrite";

function NewGame() {
  // State für das Input-Feld
  const [players, setPlayers] = useState(["", "", "", ""]);

  async function handleSubmit(e) {
    e.preventDefault(); // Page Reload verhindern

    //doppelte Namen rausfiltern
    //TODO
    if (false) return;

    const response = await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: import.meta.env.VITE_APPWRITE_TABLE_PLAYERS,
      queries: [Query.equal("username", players)],
    });

    const existingPlayers = new Set(response.rows.map((p) => p.username));

    const invalidPlayers = [];

    const updatedPlayers = players.map((p) => {
      if (existingPlayers.has(p)) return p;
      invalidPlayers.push(p);
      return "";
    });

    setPlayers(updatedPlayers);

    console.log(invalidPlayers);

    if ((invalidPlayers.length == 0)) {
      //start game
    }

    alert(`Diese Spieler existieren nicht: ${invalidPlayers.join(", ")}`);
  }

  const handleChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  return (
    <BambooBox>
      <h2>Neues Spiel</h2>
      <form onSubmit={handleSubmit}>
        {players.map((player, index) => (
          <input
            placeholder={"Spieler " + (index + 1)}
            key={index}
            value={player}
            onChange={(e) => handleChange(index, e.target.value)}
          />
        ))}
        <button type="submit">Spiel starten</button>
      </form>
    </BambooBox>
  );
}

export default NewGame;
