import { tablesDB } from "../appwrite";
import { ID, Query } from "appwrite";

const TICHU_MAP = {
  none: { announcement: null, success: null },
  twon: { announcement: "Tichu", success: true },
  tlose: { announcement: "Tichu", success: false },
  gtwon: { announcement: "GrandTichu", success: true },
  gtlose: { announcement: "GrandTichu", success: false },
};

const TICHU_POINTS_MAP = {
  none: 0,
  twon: 100,
  tlose: -100,
  gtwon: 200,
  gtlose: -200,
};

export async function addNewRound(gameId, teams, players, roundData, points) {
  let response = await tablesDB.createRow({
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
    tableId: import.meta.env.VITE_APPWRITE_TABLE_ROUND,
    rowId: ID.unique(),
    data: {
      game: gameId,
    },
  });

  console.log(response);
  const roundId = response.$id;

  const playerData = await Promise.all(
    players.map((player) => {
      const playerData = roundData[player.$id];
      //wenn keine besonderen Daten, muss nichts in die Datenbank geschrieben werden
      if (
        playerData.tichu === "none" &&
        playerData.mahjongIgnored === false &&
        playerData.bombs === 0
      )
        return null;

      const tichus = TICHU_MAP[playerData.tichu];

      //neuen Eintrag in Player_Round Tabelle erstellebn
      return tablesDB.createRow({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_PLAYER_ROUND,
        rowId: ID.unique(),
        data: {
          announcement: tichus.announcement,
          success: tichus.success,
          mahjong_ignored: playerData.mahjongIgnored,
          round: roundId,
          player: player.$id,
        },
      });
    }),
  );

  const roundScores = await Promise.all(
    teams.map((team) => {
      const cardPoints =
        team === teams[0] ? Number(points[0]) : Number(points[1]);
      let teamScore = cardPoints;

      const double_win = teamScore === 200;

      team.teamPlayers.forEach((teamPlayer) => {
        const playerData = roundData[teamPlayer.player.$id];

        teamScore += TICHU_POINTS_MAP[playerData.tichu];
        if (playerData.mahjongIgnored) {
          teamScore -= 200;
        }
      });

      console.log(teamScore);
      return tablesDB.createRow({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_ROUND_SCORE,
        rowId: ID.unique(),
        data: {
          round: roundId,
          team: team.$id,
          is_double_win: double_win,
          card_points: cardPoints,
          score: teamScore,
        },
      });
    }),
  );

  response.playerRounds = playerData
    .map((playerRound) =>
      playerRound ? { ...playerRound, player: playerRound.player.$id } : null,
    )
    .filter(Boolean);

  response.roundScores = roundScores;

  console.log(response);

  return response;
}
