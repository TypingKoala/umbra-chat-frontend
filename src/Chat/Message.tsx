// Specifies whether a message was sent or received
export enum MessageDirection {
  Sent = 1,
  Received,
}

// Class that represents a chat message
export class Message {
  text: string;
  direction: MessageDirection;
  timeSent: Date;

  constructor(text: string, direction: MessageDirection, timeSent: Date) {
    this.text = text;
    this.direction = direction;
    this.timeSent = timeSent;
  }
}

// Get the background message color based on the message direction
export const getMessageColor = (message: Message) => {
  switch (message.direction) {
    case MessageDirection.Received:
      return "light-1";
    case MessageDirection.Sent:
      return "neutral-3";
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

export const exampleMessages = [
  new Message(
    "Hello Johnny",
    MessageDirection.Received,
    new Date(Date.parse("2020-01-05T10:01:00.000-05:00"))
  ),
  new Message(
    "Hi there",
    MessageDirection.Sent,
    new Date(Date.parse("2020-01-05T10:02:05.000-05:00"))
  ),
  new Message(
    "It's been a while! I really like dogs and probably cats too. And I have too much homework! Whenever I think I have no work, I actually do have a lot of work. But I choose to sleep instead, which I don't regret. Sleep is great.",
    MessageDirection.Sent,
    new Date(Date.parse("2020-01-05T10:02:10.000-05:00"))
  ),
  new Message(
    "How are you?",
    MessageDirection.Sent,
    new Date(Date.parse("2020-01-05T10:03:00.000-05:00"))
  ),
  new Message(
    "I'm doing great!",
    MessageDirection.Received,
    new Date(Date.parse("2020-01-05T10:05:00.000-05:00"))
  ),
  new Message(
    "What are you up to these days?",
    MessageDirection.Received,
    new Date(Date.parse("2020-01-05T10:06:00.000-05:00"))
  ),
  new Message(
    "I'm working on this cool react app for chatting",
    MessageDirection.Sent,
    new Date(Date.parse("2020-01-05T10:06:10.000-05:00"))
  ),
  new Message(
    "It's pretty cool.",
    MessageDirection.Sent,
    new Date(Date.parse("2020-01-05T10:06:15.000-05:00"))
  ),
];