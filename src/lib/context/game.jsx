import { tablesDB } from "../appwrite";
import { ID, Query } from "appwrite";

export async function createGame(teamIds) {
  const response = await tablesDB.createRow({
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
    tableId: import.meta.env.VITE_APPWRITE_TABLE_GAME,
    rowId: ID.unique(),
    data: {
      is_finished: false,
    },
  });

  await Promise.all(
    teamIds.map((tId) =>
      tablesDB.createRow({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_GAME_TEAM,
        rowId: ID.unique(),
        data: {
          team: tId,
          game: response.$id,
        },
      }),
    ),
  );

  return response;
}

export async function getGameRow(gameId) {
  const gameRow = await tablesDB.getRow({
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
    tableId: import.meta.env.VITE_APPWRITE_TABLE_GAME,
    rowId: gameId,
    queries: [
      Query.select([
        "gameTeams.team",
        "gameTeams.total_score",

        "rounds.playerRounds.announcement",
        "rounds.playerRounds.success",
        "rounds.playerRounds.mahjong_ignored",
        "rounds.playerRounds.player",

        "rounds.roundScores.team",
        "rounds.roundScores.is_double_win",
        "rounds.roundScores.score",
        "rounds.roundScores.card_points",
      ]),
    ],
  });
  return gameRow;
}
