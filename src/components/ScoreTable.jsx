import "./ScoreTable.css";

const TeamHeader = ({ team }) => {
  return (
    <div className="teamHead">
      {team?.teamPlayers.map((teamPlayer) => (
        <span key={teamPlayer.$id}>{teamPlayer.player.alias}</span>
      ))}
    </div>
  );
};

const getPlayerData = (round, playerId) => {
  const playerRound = round?.playerRounds?.find(
    (playerRound) => playerRound.player === playerId,
  );
  return playerRound;
};

const TeamData = ({ team, round }) => {
  const p1 = team?.teamPlayers?.[0];
  const p2 = team?.teamPlayers?.[1];

  const p1Data = getPlayerData(round, p1?.player.$id);
  const p2Data = getPlayerData(round, p2?.player.$id);

  const renderTichu = (playerData) => {
    if (!playerData?.announcement) return null;

    const text = playerData.announcement === "Tichu" ? "T" : "GT";
    const color = playerData.success ? "green" : "red";

    return <span style={{ color }}>{text}</span>;
  };

  return (
    <div className="teamData">
      <div>{renderTichu(p1Data)}</div>
      <div>
        {isDoubleWin(team, round?.roundScores) && (
          <span style={{ color: "green" }}>D</span>
        )}
      </div>
      <div>{renderTichu(p2Data)}</div>
    </div>
  );
};

const isDoubleWin = (team, roundScores) => {
  if (team?.$id === roundScores[0]?.team) {
    return roundScores[0].is_double_win;
  }
  return roundScores[1]?.is_double_win;
};

const getScore = (team, roundScores) => {
  if (team?.$id === roundScores[0]?.team) {
    return roundScores[0].score;
  }
  return roundScores[1]?.score;
};

function ScoreTable({ gameDoc, teams }) {
  return (
    <table>
      <thead>
        <tr>
          <th>
            <TeamHeader team={teams[0]} />
          </th>
          <th>Stand</th>
          <th>
            <TeamHeader team={teams[1]} />
          </th>
        </tr>
      </thead>

      <tbody>
        {gameDoc.rounds.map((round) => (
          <tr key={round.$id}>
            <td>
              <TeamData team={teams[0]} round={round} />
            </td>
            <td>
              <div className="scoreData">
                <span>
                  {getScore(teams[0], round?.roundScores)} :{" "}
                  {getScore(teams[1], round?.roundScores)}{" "}
                </span>
              </div>
            </td>
            <td>
              <TeamData team={teams[1]} round={round} />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
export default ScoreTable;
