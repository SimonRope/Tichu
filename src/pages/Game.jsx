import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getGameRow } from "../lib/context/game";
import { getTeamRow } from "../lib/context/team";
import RoundModal from "../components/RoundModal";
import ScoreTable from "../components/ScoreTable";
import BambooBox from "../components/BambooBox";

function Game() {
  const { gameId } = useParams();
  const [invalidGameId, setInvalidGameId] = useState(false);
  const [gameDoc, setGameDoc] = useState(null);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (gameId) {
      localStorage.setItem("lastGameId", gameId);
    }

    async function loadData() {
      const gameRow = await getGameRow(gameId).catch((error) => {
        if (error.code === 404) {
          setInvalidGameId(true);
        } else {
          console.error(error);
        }
        return null;
      });

      if (gameRow === null) return;

      setGameDoc(gameRow);

      const teamRows = await Promise.all(
        gameRow.gameTeams.map((gameTeam) => getTeamRow(gameTeam.team)),
      );
      setTeams(teamRows);
    }

    loadData();
  }, [gameId]);

  const updateGameDoc = (newRound) => {
    setGameDoc((prev) => ({
      ...prev,
      //Update Rounds
      rounds: [...(prev.rounds || []), newRound],
      //update total score in game teams
      gameTeams: prev.gameTeams.map((gameTeam) => ({
        ...gameTeam,
        total_score:
          gameTeam.total_score +
          newRound.roundScores.find(
            (roundScore) => roundScore.team === gameTeam.team,
          ).score,
      })),
    }));
  };

  if (invalidGameId) {
    return (
      <BambooBox>
        <Navbar />
        <br></br>
        <h2>Spiel ID existiert nicht</h2>
      </BambooBox>
    );
  }

  if (!gameDoc) {
    return (
      <BambooBox>
        <Navbar />
        <br></br>
        <h2>Loading Game...</h2>
      </BambooBox>
    );
  }

  return (
    <BambooBox>
      <Navbar />
      <br></br>
      <button
        onClick={() => {
          setShowModal(true);
        }}
      >
        Neue Runde
      </button>
      {showModal && (
        <RoundModal
          onClose={() => setShowModal(false)}
          onSave={updateGameDoc}
          teams={teams}
          gameDoc={gameDoc}
        />
      )}
      <ScoreTable gameDoc={gameDoc} teams={teams} />
    </BambooBox>
  );
}

export default Game;
