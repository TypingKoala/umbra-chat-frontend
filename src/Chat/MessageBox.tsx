import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  InfiniteScroll,
  Text,
  TextInput,
} from "grommet";
import { Chat, Send } from "grommet-icons";
import {
  Message,
  exampleMessages,
  getMessageAlign,
  getMessageColor,
} from "./Message";
import { useEffect, useRef, useState } from "react";

const io = require("socket.io-client");

interface IMessageCardProps {
  message: Message;
}

export const MessageCard = (props: IMessageCardProps) => {
  const { message } = props;

  return (
    <Box margin='xsmall'>
      <Card
        background={getMessageColor(message)}
        key={JSON.stringify(message)}
        width='fit-content'
        flex={false}
        alignSelf={getMessageAlign(message)}
      >
        <CardBody pad={{ horizontal: "medium", vertical: "small" }}>
          <Text textAlign={getMessageAlign(message)}>{message.text}</Text>
        </CardBody>
      </Card>
      <Text textAlign={getMessageAlign(message)} margin={{top: "xsmall"}} size="small" color="dark-5">
      {message.timeSent.toLocaleTimeString("en-US")}
      </Text>
    </Box>
  );
};

interface IMessageBoxProps {
  username: string;
  room: string;
}

export const MessageBox = (props: IMessageBoxProps) => {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState(exampleMessages);

  // establish connection to chat server
  var socket = io("");
  socket.on("connection", () => {
    console.log("Connected to server...");
  });

  // auto-scroll to bottom
  const divRef = useRef(document.createElement("div"));
  useEffect(() => {
    divRef.current.scrollIntoView({ behavior: "smooth" });
  });

  return (
    <Box pad={{ vertical: "medium", horizontal: "small" }} fill='vertical'>
      <Box
        pad={{
          horizontal: "large",
          bottom: "none",
        }}
        border={{ color: "#eeeeee" }}
        round={{ size: "small", corner: "top" }}
        overflow='auto'
        flex={true}
      >
        <InfiniteScroll items={messageList}>
          {(message: Message) => <MessageCard message={message} />}
        </InfiniteScroll>
        <div ref={divRef} />
      </Box>
      <Box direction='row' gap='small' margin={{ top: "medium" }}>
        <TextInput
          placeholder='Enter message...'
          value={message}
          onChange={(evt) => setMessage(evt.target.value)}
          size='large'
          icon={<Chat />}
        />
        <Button
          icon={<Send />}
          onClick={() => {}}
          primary
          label='Send'
          type='submit'
          size='medium'
        />
      </Box>
    </Box>
  );
};
