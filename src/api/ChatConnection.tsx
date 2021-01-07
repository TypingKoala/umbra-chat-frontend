export class ChatConnection {
  room: string;
  username: string;

  constructor(room: string, username: string) {
    this.room = room;
    this.username = username;
  }
}