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
import { FormClose, Group, Sun, User } from "grommet-icons";
import React, { useState } from "react";

import Div100vh from "react-div-100vh";
import { MessageBox } from "./Chat/MessageBox";

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
  username: string;
  handleUsernameChange: (newUsername: string) => void;
  room: string;
  handleRoomChange: (newRoom: string) => void;
}

const Sidebar = (props: ISidebarProps) => {
  return (
    <Box>
      <FormField label='Username'>
        <TextInput
          placeholder='Enter a username...'
          value={props.username}
          onChange={(evt) => props.handleUsernameChange(evt.target.value)}
        />
      </FormField>
      <FormField label='Room'>
        <TextInput
          placeholder='Enter a room to join...'
          value={props.room}
          onChange={(evt) => props.handleRoomChange(evt.target.value)}
        />
      </FormField>
    </Box>
  );
};

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [room, setRoom] = useState("#general");
  const [username, setUsername] = useState("");

  return (
    <Grommet theme={theme} full themeMode={darkMode ? "dark" : "light"}>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Div100vh>
            <Box fill height='100%' background='background'>
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
                  />
                  <Button
                    icon={<User />}
                    onClick={() => {
                      setShowSidebar(!showSidebar);
                    }}
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
                    <Heading level={3}>{room}</Heading>
                    <Button
                      secondary
                      icon={<Group />}
                      label='2 Users in Chat'
                      hoverIndicator={false}
                    />
                  </Box>
                  <MessageBox username={username} room={room} />
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
                        room={room}
                        handleRoomChange={setRoom}
                        username={username}
                        handleUsernameChange={setUsername}
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
                        room={room}
                        handleRoomChange={setRoom}
                        username={username}
                        handleUsernameChange={setUsername}
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
