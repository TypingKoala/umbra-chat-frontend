import {
  Box,
  Button,
  Heading,
} from "grommet";
import { Group, Wifi } from "grommet-icons";
import {
  IRoomData,
  disconnectSocket,
  subscribeToRoomData,
} from "../api/ChatSocket";
import React, { useEffect, useState } from "react";

import { ChatConnection } from "../api/ChatConnection";
import { MessageBox } from "./MessageBox";
import { useHistory } from "react-router-dom";

const getUsersConnectedString = (numUsers: number) => {
  if (numUsers === 1) {
    return "1 User Connected";
  } else {
    return `${numUsers} Users Connected`;
  }
};

interface IChatInterfaceProps {
  chatConnection: ChatConnection;
  handleChatConnectionUpdate: (updated: ChatConnection) => void;
}

export default function ChatInterface(props: IChatInterfaceProps) {
  const [numberInRoom, setNumberInRoom] = useState(0);

  const history = useHistory();

  // redirect back to start page if chat connection is not valid
  if (!props.chatConnection.room || !props.chatConnection.username) {
    history.push('/');
  }

  useEffect(() => {
    subscribeToRoomData((data: IRoomData) => {
      console.log("roomData", data);
      setNumberInRoom(data.numUsers);
    });

    // return a cleanup function
    return disconnectSocket;
  }, [props.chatConnection]);

  return (
    <Box flex align='center' justify='center'>
      <Box
        direction='row'
        align='center'
        justify='between'
        fill='horizontal'
        pad={{ horizontal: "medium" }}
      >
        {/* Chat Header */}
        <Heading level={3}>{props.chatConnection.room}</Heading>
        {numberInRoom ? (
          <Button
            secondary
            icon={<Group />}
            label={getUsersConnectedString(numberInRoom)}
            hoverIndicator={false}
          />
        ) : (
          <Button
            secondary
            icon={<Wifi />}
            label='Connecting...'
            hoverIndicator={false}
          />
        )}
      </Box>
      <MessageBox
        chatConnection={props.chatConnection}
      />
    </Box>
  );
};
