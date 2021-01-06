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
import {
  FormClose,
  User,
} from "grommet-icons";
import React, { useState } from "react";

import { MessageBox } from './Chat/MessageBox';

const theme = {
  global: {
    colors: {
      brand: "#228BE6",
    },
    font: {
      family: "Roboto",
      size: "18px",
      height: "20px",
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
  username: string,
  handleUsernameChange: (newUsername: string) => void,
  room: string,
  handleRoomChange: (newRoom: string) => void
}

const Sidebar = (props: ISidebarProps) => {
  return (
    <Box>
      <FormField label="Username">
        <TextInput
          placeholder="Enter a username..."
          value={props.username}
          onChange={evt => props.handleUsernameChange(evt.target.value)}
        />
      </FormField>
      <FormField label="Room">
        <TextInput
          placeholder="Enter a room to join..."
          value={props.room}
          onChange={evt => props.handleRoomChange(evt.target.value)}
        />
      </FormField>
    </Box>
  )
}


function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [room, setRoom] = useState("#general");
  const [username, setUsername] = useState("");

  return (
    <Grommet theme={theme} full themeMode='dark'>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Box fill>
            <AppBar>
              <Heading level='3' margin='none'>
                Zoom Chat
              </Heading>
              <Button
                icon={<User />}
                onClick={() => {
                  setShowSidebar(!showSidebar);
                }}
              />
            </AppBar>
            <Box direction='row' flex overflow={{ horizontal: "hidden" }}>
              <Box flex align='center' justify='center'>
                <MessageBox username={username} room={room} />
              </Box>
              {!showSidebar || size !== "small" ? (
                <Collapsible direction='horizontal' open={showSidebar}>
                  <Box
                    width='medium'
                    flex
                    background='light-2'
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
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
