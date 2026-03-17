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
  const [gameDoc, setGameDoc] = useState(null);
  const [teams, setTeams] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (gameId) {
      localStorage.setItem("lastGameId", gameId);
    }

    async function loadData() {
      const gameRow = await getGameRow(gameId);
      setGameDoc(gameRow);

      const teamRows = await Promise.all(
        gameRow.gameTeams.map((gameTeam) => getTeamRow(gameTeam.team)),
      );
      setTeams(teamRows);
    }

    loadData();
  }, [gameId]);

  const handleNewRound = (newRound) => {
    setGameDoc((prev) => ({
      ...prev,
      rounds: [...(prev.rounds || []), newRound],
    }));
  };

  if (!gameDoc) {
    return <div>Loading...</div>;
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
          onSave={handleNewRound}
          teams={teams}
          gameId={gameId}
        />
      )}
      <ScoreTable gameDoc={gameDoc} teams={teams} />
    </BambooBox>
  );
}

export default Game;
