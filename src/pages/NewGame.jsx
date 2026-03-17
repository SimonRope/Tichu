import React, { useState } from "react";
import BambooBox from "../components/BambooBox";
import Navbar from "../components/Navbar";
import { tablesDB } from "../lib/appwrite";
import { createTeam, getTeamDoc } from "../lib/context/team";
import { getPlayerDocs } from "../lib/context/players";
import { useNavigate } from "react-router-dom";
import { createGame } from "../lib/context/game";

function NewGame() {
  // State für das Input-Feld
  const [players, setPlayers] = useState(["", "", "", ""]);

  const navigate = useNavigate();

  async function startGame(gameId) {
    navigate(`/game/${gameId}`);
  }

  async function handleSubmit(e) {
    e.preventDefault(); // Page Reload verhindern

    //leere Felder rausfiltern
    if (players.includes("")) {
      alert("Bitte alle Felder ausfüllen");
      return;
    }

    //doppelte Namen rausfiltern
    const playersSet = new Set(players); //enthält keine Duplikate mehr

    if (players.length != playersSet.size) {
      //prüfen ob weniger spieler in dem set sind
      const playersWithoutDuplicats = players.map((p) => {
        if (playersSet.delete(p)) return p;
        return "";
      });

      setPlayers(playersWithoutDuplicats);
      alert("Bitte keine doppelten Namen eintragen");
      return;
    }

    //Überprüfung der Internetverbindung vor datenbank abfrage
    if (!navigator.onLine) {
      alert("Keine Internetverbindung");
      return;
    }

    //Datenbank überprüfen, welche spieler existieren
    try {
      const playerDocs = await getPlayerDocs(players);

      //Nicht vorhandene Spieler aus players entfernen
      const updatedPlayers = playerDocs.map((p) => {
        if (p) return p.username;
        return "";
      });

      //Prüfen ob spieler nicht existieren.
      if (updatedPlayers.includes("")) {
        const invalidPlayers = new Set();
        for (let i = 0; i < updatedPlayers.length; i++) {
          if (!playerDocs[i]) invalidPlayers.add(players[i]);
        }

        const invalidPlayersArr = [...invalidPlayers];
        if (invalidPlayers.size > 1)
          alert(
            `Diese Spieler existieren nicht: ${invalidPlayersArr.join(", ")}`,
          );
        else
          alert(
            `Dieser Spieler existiert nicht: ${invalidPlayersArr.join(", ")}`,
          );

        setPlayers(updatedPlayers);
        return;
      }

      //start game
      console.log("spiel gestartet");

      const teamA = playerDocs.slice(0, 2);
      const teamB = playerDocs.slice(2);

      const teamADoc = await getTeamDoc(teamA.map((p) => p.$id));
      const teamBDoc = await getTeamDoc(teamB.map((p) => p.$id));

      const gameDoc = await createGame([teamADoc.$id, teamBDoc.$id]);

      startGame(gameDoc.$id);

      return;
    } catch (err) {
      if (err instanceof TypeError) {
        alert("Keine Verbindung zum Server");
        return;
      }
      console.log(err);
    }
  }

  const handleChange = (index, value) => {
    const updatedPlayers = [...players];
    updatedPlayers[index] = value;
    setPlayers(updatedPlayers);
  };

  return (
    <BambooBox>
      <Navbar />
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
