import {
  Box,
  Button,
  Collapsible,
  FormField,
  Grommet,
  Heading,
  Layer,
  ResponsiveContext,
  TextInput,
} from "grommet";
import { FormClose, Group, Sun, User, Wifi } from "grommet-icons";
import {
  IRoomData,
  disconnectSocket,
  subscribeToRoomData,
} from "./Chat/ChatSocket";
import React, { useEffect, useState } from "react";

import Div100vh from "react-div-100vh";
import { MessageBox } from "./Chat/MessageBox";
import { Notification } from "./components/Notification";

const theme = {
  global: {
    colors: {
      brand: "#228BE6",
      background: {
        dark: "#222222",
        light: "light-1",
      },
      focus: "brand",
      sentMessage: {
        dark: "brand",
        light: "brand",
      },
      receivedMessage: {
        dark: "dark-3",
        light: "light-3",
      },
      messageMetadata: {
        dark: "light-5",
        light: "dark-5",
      },
      border: {
        dark: "dark-2",
        light: "light-5",
      },
    },
    elevation: {
      dark: {
        none: "none",
        xsmall: "none",
        small: "none",
        medium: "none",
        large: "none",
        xlarge: "none",
      },
    },
    font: {
      family: "Montserrat",
      size: "18px",
      height: "20px",
    },
    input: {
      font: {
        weight: 400,
      },
    },
  },
  box: {
    extend: {
      transition: "all 0.1s linear",
    },
  },
  tip: {
    content: {
      background: {
        dark: "light-1",
        light: "dark-1",
      },
      width: "fit-content",
    },
  },
};

const AppBar = (props: any) => (
  <Box
    tag='header'
    direction='row'
    align='center'
    justify='between'
    background='brand'
    pad={{ left: "medium", right: "small", vertical: "small" }}
    elevation='medium'
    style={{ zIndex: "1" }}
    {...props}
  />
);

interface ISidebarProps {
  chatConnection: ChatConnection;
  handleChatConnectionUpdate: (room: string, username: string) => void;
}

const Sidebar = (props: ISidebarProps) => {
  const [room, setRoom] = useState(props.chatConnection.room);
  const [username, setUsername] = useState(props.chatConnection.username);

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        props.handleChatConnectionUpdate(room, username);
      }}
    >
      <Box>
        <FormField label='Username'>
          <TextInput
            placeholder='Enter a username...'
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        </FormField>
        <FormField label='Room'>
          <TextInput
            placeholder='Enter a room to join...'
            value={room}
            onChange={(evt) => setRoom(evt.target.value)}
          />
        </FormField>
        <Button primary label='Connect' type='submit' />
      </Box>
    </form>
  );
};

const getUsersConnectedString = (numUsers: number) => {
  if (numUsers === 1) {
    return "1 User Connected";
  } else {
    return `${numUsers} Users Connected`;
  }
};
class ChatConnection {
  room: string;
  username: string;

  constructor(room: string, username: string) {
    this.room = room;
    this.username = username;
  }
}

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [chatConnection, setChatConnection] = useState(
    new ChatConnection("#general", `Frank`)
  );
  const [numberInRoom, setNumberInRoom] = useState(0);

  // error display
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    subscribeToRoomData((data: IRoomData) => {
      console.log("roomData", data);
      setNumberInRoom(data.numUsers);
    });

    // return a cleanup function
    return disconnectSocket;
  }, [chatConnection]);

  const handleChatConnectionUpdate = (room: string, username: string) => {
    setChatConnection(new ChatConnection(room, username));
  };

  return (
    <Grommet theme={theme} full themeMode={darkMode ? "dark" : "light"}>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Div100vh>
            <Box fill height='100%' background='background'>
              {errorMessage && (
                <Notification
                  message={errorMessage}
                  color='status-error'
                  onClose={() => {
                    setErrorMessage(""); // clear error message
                  }}
                  secondsToDisplay={5}
                />
              )}
              <AppBar>
                <Heading level='2' margin='none'>
                  Zoom Chat
                </Heading>
                <Box direction='row'>
                  <Button
                    icon={<Sun />}
                    onClick={() => {
                      setDarkMode(!darkMode);
                    }}
                    hoverIndicator={true}
                  />
                  <Button
                    icon={<User />}
                    onClick={() => {
                      setShowSidebar(!showSidebar);
                    }}
                    hoverIndicator={true}
                    active={showSidebar}
                  />
                </Box>
              </AppBar>
              <Box direction='row' flex overflow={{ horizontal: "hidden" }}>
                <Box flex align='center' justify='center'>
                  <Box
                    direction='row'
                    align='center'
                    justify='between'
                    fill='horizontal'
                    pad={{ horizontal: "medium" }}
                  >
                    {/* Chat Header */}
                    <Heading level={3}>{chatConnection.room}</Heading>
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
                    username={chatConnection.username}
                    room={chatConnection.room}
                  />
                </Box>
                {!showSidebar || size !== "small" ? (
                  <Collapsible direction='horizontal' open={showSidebar}>
                    <Box
                      width='medium'
                      flex
                      background='background'
                      elevation='small'
                      align='center'
                      justify='center'
                    >
                      <Sidebar
                        chatConnection={chatConnection}
                        handleChatConnectionUpdate={handleChatConnectionUpdate}
                      />
                    </Box>
                  </Collapsible>
                ) : (
                  <Layer>
                    <Box
                      background='light-2'
                      tag='header'
                      justify='end'
                      align='center'
                      direction='row'
                    >
                      <Button
                        icon={<FormClose />}
                        onClick={() => setShowSidebar(false)}
                      />
                    </Box>
                    <Box fill background='light-2' align='center'>
                      <Sidebar
                        chatConnection={chatConnection}
                        handleChatConnectionUpdate={handleChatConnectionUpdate}
                      />
                    </Box>
                  </Layer>
                )}
              </Box>
            </Box>
          </Div100vh>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
