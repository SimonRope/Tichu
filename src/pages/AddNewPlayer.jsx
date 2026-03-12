import React, { useState } from "react";
import { addPlayer } from "../lib/context/players";


function AddNewPlayer() {
  const [username, setUsername] = useState("");
  const [alias, setAlias] = useState("");

  async function handleSubmit(e) {
    e.preventDefault(); // Page Reload verhindern
    if (!username) return;

    try {
      await addPlayer(username, alias);
      alert("Spieler wurde erstellt");
      setAlias("");
    } catch (err) {
      if (err.code === 409) {
        alert("Username existiert bereits");
      } else {
        alert("Fehler beim Erstellen des Spielers");
        console.error(error);
        setAlias("");
      }
    }
    setUsername(""); // Input leeren nach Submit
  }

  return (
    <div>
      <h2>Neuen Spieler erstellen</h2>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Alias"
          value={alias}
          onChange={(e) => setAlias(e.target.value)}
        />
        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <button type="submit">Add Player</button>
      </form>
    </div>
  );
}

export default AddNewPlayer;
