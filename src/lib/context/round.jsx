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

export async function addNewRound(gameDoc, teams, players, roundData, points) {
  const gameId = gameDoc.$id;
  let response = await tablesDB.createRow({
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
    tableId: import.meta.env.VITE_APPWRITE_TABLE_ROUND,
    rowId: ID.unique(),
    data: {
      game: gameId,
    },
  });

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

      //gesamt score des teams in dieser runde berechnen
      let teamScore = cardPoints;

      //doppel sieg, genau dann wenn 200 kartenpunkte
      const double_win = cardPoints === 200;

      //ansagen und mahjong wunsch daten pro spieler addieren
      team.teamPlayers.forEach((teamPlayer) => {
        const playerData = roundData[teamPlayer.player.$id];

        teamScore += TICHU_POINTS_MAP[playerData.tichu];
        if (playerData.mahjongIgnored) {
          teamScore -= 200;
        }
      });

      // die row in der tabelle Round_Score erstellen
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

  //Game Teams einträge mit dem neuen total score updaten
  await updateTotalScore(roundScores, gameDoc, true);

  response.playerRounds = playerData
    .map((playerRound) =>
      playerRound ? { ...playerRound, player: playerRound.player.$id } : null,
    )
    .filter(Boolean);

  response.roundScores = roundScores.map((roundScore) => ({
    ...roundScore,
    team: roundScore.team.$id,
  }));

  return response;
}

async function updateTotalScore(roundScores, gameDoc, addScore) {
  await Promise.all(
    roundScores.map(async (roundScore) => {
      const teamId =
        typeof roundScore.team === "string"
          ? roundScore.team
          : roundScore.team?.$id;

      const gameTeam = gameDoc.gameTeams.find(
        (gameTeam) => gameTeam.team === teamId,
      );

      const newTotalScore =
        (gameTeam.total_score || 0) +
        (addScore ? roundScore.score : -roundScore.score);

      return await tablesDB.updateRow({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_GAME_TEAM,
        rowId: gameTeam.$id,
        data: { total_score: newTotalScore },
      });
    }),
  );
}

export async function deleteRound(round, gameDoc) {
  await tablesDB.deleteRow({
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
    tableId: import.meta.env.VITE_APPWRITE_TABLE_ROUND,
    rowId: round.$id,
  });

  await updateTotalScore(round.roundScores, gameDoc, false);
}
