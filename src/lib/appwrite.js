import { Client, Account} from 'appwrite';

export const client = new Client();

client
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('69aef4590016bd8f7b1b'); 

export const account = new Account(client);
export { ID } from 'appwrite';