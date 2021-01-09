import { Box, Button, Collapsible, FormField, Layer, TextInput } from "grommet";
import React, { useState } from "react";

import { ChatConnection } from "../api/ChatConnection";
import { FormClose } from "grommet-icons";

interface ISidebarBodyProps {
  chatConnection: ChatConnection;
  handleChatConnectionUpdate: (updated: ChatConnection) => void;
}

const SidebarBody = (props: ISidebarBodyProps) => {
  const [username, setUsername] = useState(props.chatConnection.username);

  const handleSubmit = () => {
    props.handleChatConnectionUpdate(
      new ChatConnection(
        props.chatConnection.room,
        username,
        props.chatConnection.authToken
      )
    );
  }

  return (
    <form
      onSubmit={(evt) => {
        evt.preventDefault();
        handleSubmit();
      }}
    >
      <Box>
        <FormField label='Display Name'>
          <TextInput
            placeholder='Enter a display name...'
            value={username}
            onChange={(evt) => setUsername(evt.target.value)}
          />
        </FormField>
        <Button primary label='Update' type='submit' />
      </Box>
    </form>
  );
};

interface IResponsiveSidebar {
  showSidebar: boolean;
  setShowSidebar: (status: boolean) => void;
  size: string;
  chatConnection: ChatConnection;
  setChatConnection: (updated: ChatConnection) => void;
}

const ResponsiveSidebar = (props: IResponsiveSidebar) => {
  const {
    showSidebar,
    setShowSidebar,
    size,
    chatConnection,
    setChatConnection,
  } = props;

  if (!showSidebar || size !== "small") {
    return (
      <Collapsible direction='horizontal' open={showSidebar}>
        <Box
          width='medium'
          flex
          background='background'
          elevation='small'
          align='center'
          justify='center'
        >
          <SidebarBody
            chatConnection={chatConnection}
            handleChatConnectionUpdate={setChatConnection}
          />
        </Box>
      </Collapsible>
    );
  } else {
    return (
      <Layer>
        <Box
          background='light-2'
          tag='header'
          justify='end'
          align='center'
          direction='row'
        >
          <Button icon={<FormClose />} onClick={() => setShowSidebar(false)} />
        </Box>
        <Box fill background='light-2' align='center'>
          <SidebarBody
            chatConnection={chatConnection}
            handleChatConnectionUpdate={setChatConnection}
          />
        </Box>
      </Layer>
    );
  }
};

export default ResponsiveSidebar;
