import { Client, TablesDB} from 'appwrite';

export const client = new Client();

console.log(import.meta.env.VITE_APPWRITE_ENDPOINT); 
console.log(import.meta.env.VITE_APPWRITE_PROJECT_ID); 


client
    .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT )
    .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID); 

export const tablesDB = new TablesDB(client);