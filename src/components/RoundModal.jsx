import React, { useEffect, useState } from "react";
import "./RoundModal.css";
import { addNewRound } from "../lib/context/round";

//Select für Tichus, garantiert, dass maximal ein tichu gewonnen und maximal 3 tichus verloren werden können
const TICHU_OPTIONS = [
  { label: "–", value: "none" },
  { label: "t gewonnen", value: "twon", type: "win" },
  { label: "gt gewonnen", value: "gtwon", type: "win" },
  { label: "t verloren", value: "tlose", type: "lose" },
  { label: "gt verloren", value: "gtlose", type: "lose" },
];

const MAX = { win: 1, lose: 3 };

function isDisabled(optionType, roundData, currentValue) {
  if (!optionType || optionType === "none") return false;

  const count = Object.values(roundData).filter(
    (r) =>
      r?.tichu &&
      r.tichu !== currentValue &&
      (optionType === "win"
        ? r.tichu === "twon" || r.tichu === "gtwon"
        : r.tichu === "tlose" || r.tichu === "gtlose"),
  ).length;

  return count >= MAX[optionType];
}

const TichuSelect = ({ playerId, roundData, updatePlayer }) => {
  const currentValue = roundData[playerId]?.tichu || "none";

  return (
    <select
      value={currentValue}
      onChange={(e) => updatePlayer(playerId, "tichu", e.target.value)}
    >
      {TICHU_OPTIONS.map((opt) => (
        <option
          key={opt.value}
          value={opt.value}
          disabled={isDisabled(opt.type, roundData, currentValue)}
        >
          {opt.label}
        </option>
      ))}
    </select>
  );
};

//popup fenster für die eingabe einer neuen runde
function RoundModal({ gameDoc, teams, onClose, onSave }) {
  const [points, setPoints] = useState(["50", "50"]);
  const [players, setPlayers] = useState([]);

  const [roundData, setRoundData] = useState({});

  //initialisierung der state variablen
  useEffect(() => {
    const playerDocs = teams[0].teamPlayers.concat(teams[1].teamPlayers);
    setPlayers(playerDocs.map((teamPlayer) => teamPlayer.player));

    const initialRoundData = {};
    playerDocs.forEach((p) => {
      initialRoundData[p.player.$id] = {
        tichu: "none",
        mahjongIgnored: false,
        bombs: 0,
      };
    });
    setRoundData(initialRoundData);
  }, []);

  function updatePlayer(playerId, field, value) {
    setRoundData((prev) => ({
      ...prev,
      [playerId]: {
        ...prev[playerId],
        [field]: value,
      },
    }));
  }

  function changePoints(team, teamPoints) {
    const teamIdx = team === teams[0] ? 0 : 1;
    const otherIdx = (teamIdx + 1) % 2;

    const newPoints = ["0", "0"];
    newPoints[teamIdx] = teamPoints;
    newPoints[otherIdx] =
      teamPoints === "200" ? String(0) : String(100 - teamPoints);

    setPoints(newPoints);
  }

  function validatePoints(team, value) {
    let num = Number(value);

    if (Number.isNaN(num)) num = 50;
    if (num % 5 !== 0) {
      num = Math.round(num / 5) * 5;
    }

    if (num < -25) num = -25;
    if (num > 125) num = 200;

    if (String(num) !== value) {
      changePoints(team, String(num));
    }
  }

  async function handleSave() {
    const newRound = await addNewRound(
      gameDoc,
      teams,
      players,
      roundData,
      points,
    );
    onSave(newRound);
    onClose();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Neue Runde</h2>

        {teams.map((team) => (
          <div key={team.$id}>
            {`${team.teamPlayers.map((teamPlayer) => teamPlayer.player.alias).join(" und ")}: `}
            <input
              type="number"
              min="-25"
              max="200"
              step="5"
              value={points[team === teams[0] ? 0 : 1]}
              onChange={(e) => changePoints(team, e.target.value)}
              onBlur={(e) => validatePoints(team, e.target.value)}
            />
          </div>
        ))}

        <table>
          <thead>
            <tr>
              <th>Spieler</th>
              <th>Tichus</th>
              <th>Wunsch ignoriert</th>
              <th>Bomben</th>
            </tr>
          </thead>

          <tbody>
            {players.map((p) => (
              <tr key={p.$id}>
                <td>{p.alias}</td>

                <td>
                  <TichuSelect
                    playerId={p.$id}
                    roundData={roundData}
                    updatePlayer={updatePlayer}
                  />
                </td>

                <td>
                  <div className="check">
                    <input
                      checked={roundData[p.$id]?.mahjongIgnored}
                      type="checkbox"
                      onChange={(e) =>
                        updatePlayer(p.$id, "mahjongIgnored", e.target.checked)
                      }
                    />
                  </div>
                </td>

                <td>
                  <div>
                    <button
                      onClick={() =>
                        updatePlayer(
                          p.$id,
                          "bombs",
                          Math.max((roundData[p.$id]?.bombs ?? 0) - 1, 0),
                        )
                      }
                    >
                      -
                    </button>

                    {roundData[p.$id]?.bombs ?? 0}

                    <button
                      onClick={() =>
                        updatePlayer(
                          p.$id,
                          "bombs",
                          Math.min((roundData[p.$id]?.bombs ?? 0) + 1, 3),
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleSave}>Speichern</button>
        <button onClick={onClose}>Abbrechen</button>
      </div>
    </div>
  );
}

export default RoundModal;
