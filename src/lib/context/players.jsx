import { createContext, useContext, useEffect, useState } from "react";
import { tablesDB } from "../appwrite";
import { Query } from "appwrite";

export async function addPlayer(username, alias ) {
  try {
    console.log(
      await tablesDB.listRows({
        databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
        tableId: import.meta.env.VITE_APPWRITE_TABLE_PLAYERS,
        queries: [Query.equal("alias", "Simon")],
      }),
    );
    const response = await tablesDB.createRow({
      databaseId: import.meta.env.VITE_APPWRITE_DB_ID,
      tableId: import.meta.env.VITE_APPWRITE_TABLE_PLAYERS,
      rowId: "unique()",
      data: { alias: alias, username: username },
    });

    return response;
  } catch (err) {
    console.error("Fehler beim Hinzufügen:", err);
  }
}
