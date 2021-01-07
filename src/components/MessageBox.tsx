import {
  Box,
  Button,
  Card,
  CardBody,
  InfiniteScroll,
  Text,
  TextInput,
  Tip,
} from "grommet";
import { Chat, Send } from "grommet-icons";
import {
  IChatData,
  IHistoryData,
  disconnectSocket,
  initiateSocket,
  sendMessage,
  subscribeToChat,
  subscribeToHistory,
} from "../api/ChatSocket";
import {
  Message,
  MessageDirection,
  getMessageAlign,
  getMessageColor,
} from "../api/MessageAPI";
import { useEffect, useReducer, useRef, useState } from "react";

import { ChatConnection } from "../api/ChatConnection";

interface IMessageCardProps {
  message: Message;
  hideName?: boolean;
}

export const MessageCard = (props: IMessageCardProps) => {
  const { message } = props;

  return (
    <Box margin='xsmall' flex={false}>
      {!props.hideName && (
        <Text
          textAlign={getMessageAlign(message)}
          margin={{ bottom: "xsmall" }}
          size='small'
          color='messageMetadata'
        >
          {message.username}
        </Text>
      )}
      <Tip content={message.timeSent.toLocaleTimeString("en-US")}>
        <Card
          background={getMessageColor(message)}
          key={JSON.stringify(message)}
          width='fit-content'
          elevation='small'
          alignSelf={getMessageAlign(message)}
        >
          <CardBody pad='small'>
            <Text textAlign={getMessageAlign(message)}>{message.text}</Text>
          </CardBody>
        </Card>
      </Tip>
    </Box>
  );
};

interface IMessageBoxProps {
  chatConnection: ChatConnection;
}

export const MessageBox = (props: IMessageBoxProps) => {
  const { chatConnection } = props;

  const [message, setMessage] = useState("");
  const appendMessageReducer = (prev: Array<Message>, newMsg: Message) => [
    ...prev,
    newMsg,
  ];
  const [messageList, appendMessageList] = useReducer(appendMessageReducer, []);

  // establish connection to chat server
  useEffect(() => {
    if (chatConnection.room)
      initiateSocket(
        chatConnection.room,
        chatConnection.username,
        chatConnection.authToken
      );

    subscribeToChat((data: IChatData) => {
      const newMessage = new Message(
        data.username,
        data.text,
        MessageDirection.Received,
        new Date(Date.now())
      );
      appendMessageList(newMessage);
    });

    subscribeToHistory((data: IHistoryData) => {
      console.log("history", data);
      data.history.forEach((msgdata) => {
        const direction =
          msgdata.username === chatConnection.username
            ? MessageDirection.Sent
            : MessageDirection.Received;
        const message = new Message(
          msgdata.username,
          msgdata.text,
          direction,
          new Date(msgdata.timeStamp)
        );
        appendMessageList(message);
      });
    });

    // return a cleanup function
    return disconnectSocket;
  }, [chatConnection.room, chatConnection.username]);

  // auto-scroll to bottom of chat
  const divRef = useRef<HTMLDivElement>(null);
  const scrollToBottom = () => {
    const node = divRef.current;
    node?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messageList]);

  // message sending logic
  const handleMessageSend = () => {
    if (!message) return;
    sendMessage(message);

    // append sent message to message list
    const newMessage = new Message(
      chatConnection.username,
      message,
      MessageDirection.Sent,
      new Date(Date.now())
    );
    appendMessageList(newMessage);

    // clear message box
    setMessage("");
  };

  return (
    <Box pad={{ bottom: "medium", horizontal: "small" }} fill='vertical'>
      <Box
        pad={{
          horizontal: "large",
          bottom: "none",
        }}
        border={{ color: "border" }}
        round={{ size: "small", corner: "top" }}
        overflow='auto'
        flex={true}
        width='xxlarge'
      >
        <InfiniteScroll items={messageList}>
          {(message: Message, idx: number) => {
            // hide username if previous message is from the same sender and same direction
            var hideName;
            const sameSender =
              idx > 0 && messageList[idx - 1].username === message.username;
            const sameDirection =
              idx > 0 && messageList[idx - 1].direction === message.direction;
            if (sameSender && sameDirection) {
              hideName = true;
            } else {
              hideName = false;
            }
            return (
              <MessageCard
                key={JSON.stringify(message)}
                message={message}
                hideName={hideName}
              />
            );
          }}
        </InfiniteScroll>
        <div ref={divRef} />
      </Box>
      <form
        onSubmit={(evt) => {
          evt.preventDefault();
          handleMessageSend();
        }}
      >
        <Box direction='row' gap='small' margin={{ top: "medium" }}>
          <TextInput
            placeholder={`Send message as ${chatConnection.username}...`}
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
            color='brand'
          />
        </Box>
      </form>
    </Box>
  );
};
