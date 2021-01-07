const io = require("socket.io-client");

let socket: SocketIOClient.Socket;
export let SocketConnected: boolean;

// Initiate 
export const initiateSocket = (room: string, username: string) => {
  socket = io(process.env.REACT_APP_SOCKET_URL, {
    query: { room, username }
  });
  console.log('Connecting to socket...');
  socket.on('connect', () => {
    console.log('Connected to server.');
    SocketConnected = true;
  });
  socket.on('disconnect', () => {
    console.log('Disconnecting socket...');
    SocketConnected = false;
  })
}

export const disconnectSocket = () => {
  if (socket) socket.disconnect();
}

interface IHistoryElement {
  username: string,
  text: string,
  timeStamp: number
}

export interface IHistoryData {
  history: Array<IHistoryElement>
}

// Subscribe to chat history updates, usually sent immediately after connection
export const subscribeToHistory = (cb: (data: IHistoryData) => void) => {
  if (!socket) return false;
  socket.on('history', cb);
  return true;
}

export interface IChatData {
  username: string,
  text: string,
  timestamp: number
}

// Subscribe to chat messages
export const subscribeToChat = (cb: (data: IChatData) => void) => {
  if (!socket) return false;
  socket.on('Message', cb);
  return true;
}

export interface IRoomData {
  room: string,
  numUsers: number,
}

// Subscribe to room data updates
export const subscribeToRoomData = (cb: (data: IRoomData) => void) => {
  if (!socket) return false;
  socket.on('roomData', cb);
  return true;
}

export const sendMessage = (message: string) => {
  if (socket) socket.emit('sendMessage', message)
}