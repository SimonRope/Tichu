import { tablesDB } from "../appwrite";
import { ID, Query } from "appwrite";
import sha256 from "js-sha256";

function calculateTeamKey(playerIds) {
  const teamKey = sha256(JSON.stringify(playerIds.sort()));
  return teamKey;
}

export async function getTeamRow(teamId) {
  const teamRow = await tablesDB.getRow({
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
    tableId: import.meta.env.VITE_APPWRITE_TABLE_TEAM,
    rowId: teamId,
    queries: [Query.select(["teamPlayers.player", "teamPlayers.player.alias"])],
  });
  return teamRow;
}

export async function getTeamDoc(playerIds) {
  const teamKey = calculateTeamKey(playerIds);

  const response = await tablesDB.listRows({
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
    tableId: import.meta.env.VITE_APPWRITE_TABLE_TEAM,
    queries: [Query.equal("team_key", teamKey)],
  });

  if (response.rows.length === 0) {
    //Team existiert noch nicht, deshalb neues team ohne namen erstellen
    return createTeam(playerIds, "");
  }

  //Team existiert, da teamKey unique kann rows auch nur ein element beinhalten
  return response.rows[0];
}

export async function createTeam(playerIds, teamName) {
  const teamKey = calculateTeamKey(playerIds);

  const response = await tablesDB.createRow({
    databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
    tableId: import.meta.env.VITE_APPWRITE_TABLE_TEAM,
    rowId: ID.unique(),
    data: {
      team_name: teamName,
      team_key: teamKey,
    },
  });

  const teamID = response.$id;

  await Promise.all(
    playerIds.map((pId) =>
      tablesDB.createRow({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_TEAM_PLAYER,
        rowId: ID.unique(),
        data: {
          team: teamID,
          player: pId,
        },
      }),
    ),
  );

  return response;
}
