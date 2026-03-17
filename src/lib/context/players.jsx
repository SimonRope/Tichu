import { createContext, useContext, useEffect, useState } from "react";
import { tablesDB } from "../appwrite";
import { Query, ID } from "appwrite";

export async function addPlayer(username, alias) {
  try {
    const response = await tablesDB.createRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: import.meta.env.VITE_APPWRITE_TABLE_PLAYER,
      rowId: ID.unique(),
      data: { alias: alias, username: username },
    });

    return response;
  } catch (err) {
    throw err;
  }
}

// gibt das array zurück, wobei bei existierenden Usern die gespeicherten documents zurück gegeben werden, ansonsten null
export async function getPlayerDocs(players) {
  //datenbank abfrage, ob die eingegebenen spieler existieren
  try {
    const response = await tablesDB.listRows({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: import.meta.env.VITE_APPWRITE_TABLE_PLAYER,
      queries: [Query.equal("username", players)],
    });

    //map die jedem username sein document zuordnet
    const playerMap = new Map(response.rows.map((row) => [row.username, row]));

    //array mit den player documents an der Position wo sie eingegeben wurden
    //wenn nicht in der datenbank vorhanden ist dort undefined
    const playerDocs = players.map((username) => playerMap.get(username));

    return playerDocs;
  } catch (err) {
    throw err;
  }
}
