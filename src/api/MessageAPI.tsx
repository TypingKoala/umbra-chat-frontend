// Specifies whether a message was sent or received
export enum MessageDirection {
  Sent = 1,
  Received,
  Alert // an alert
}

// Class that represents a chat message
export class Message {
  username: string;
  text: string;
  direction: MessageDirection;
  timeSent: Date;

  constructor(username: string, text: string, direction: MessageDirection, timeSent: Date) {
    this.username = username;
    this.text = text;
    this.direction = direction;
    this.timeSent = timeSent;
  }
}

// Get the background message color based on the message direction
export const getMessageColor = (message: Message) => {
  switch (message.direction) {
    case MessageDirection.Received:
      return "receivedMessage";
    case MessageDirection.Sent:
      return "sentMessage";
    default:
      throw Error("Direction not supported");
  }
};

// Get the message alignment based on the message direction
export const getMessageAlign = (message: Message) => {
  switch (message.direction) {
    case MessageDirection.Received:
      return "start";
    case MessageDirection.Sent:
      return "end";
    default:
      throw Error("Direction not supported");
  }
};
