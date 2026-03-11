import React, { useState } from "react";
import BambooBox from "../components/BambooBox";
import Navbar from "../components/Navbar";
import { addPlayer } from "../lib/context/players";

function NewGame() {
  // State für das Input-Feld
  const [name, setName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // Page Reload verhindern
    if (!name) return;

    await addPlayer(name, name); // Hier aufrufen
    setName(""); // Input leeren nach Submit
  }

  return (
    <BambooBox>
      <h2>Tichu Tracker</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button type="submit">Add Player</button>
      </form>
    </BambooBox>
  );
}

export default NewGame;
