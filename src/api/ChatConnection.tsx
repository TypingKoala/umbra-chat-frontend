export class ChatConnection {
  room: string;
  username: string;
  authToken: string;

  constructor(room: string, username: string, authToken: string) {
    this.room = room;
    this.username = username;
    this.authToken = authToken;
  }
}