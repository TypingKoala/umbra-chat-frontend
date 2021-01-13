import {
  Box,
  Button,
  Card,
  CardBody,
  Text,
  TextInput,
  Tip,
} from "grommet";
import { Chat, Send } from "grommet-icons";
import {
  IChatData,
  IErrorData,
  IHistoryData,
  IJoinLeaveAlertData,
  disconnectSocket,
  initiateSocket,
  sendMessage,
  subscribeToChat,
  subscribeToConnectErrors,
  subscribeToHistory,
  subscribeToJoinAlert,
  subscribeToLeaveAlert
} from "../api/ChatSocket";
import {
  Message,
  MessageDirection,
  getMessageAlign,
  getMessageColor,
} from "../api/MessageAPI";
import { useEffect, useRef, useState } from "react";

import { ChatConnection } from "../api/ChatConnection";
import { Helmet } from "react-helmet-async";
import log from '../api/AppLogger';
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

interface IAlertMessageProps {
  text: string;
}

export const AlertMessage = (props: IAlertMessageProps) => {
  const { text } = props;

  return (
    <Box margin='xsmall' flex={false}>
      <Text
        textAlign='center'
        margin={{ vertical: "xsmall" }}
        size='small'
        color='messageMetadata'
      >
        {text}
      </Text>
    </Box>
  );
};

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
  const [messageList, setMessageList] = useState<Array<Message>>([]);

  const appendMessageList = (newMessage: Message) => {
    setMessageList((messageList) => [...messageList, newMessage]);
  };

  const history = useHistory();

  // establish connection to chat server
  useEffect(() => {
    if (chatConnection.room)
      initiateSocket(
        chatConnection.room,
        chatConnection.username,
        chatConnection.authToken
      );

      subscribeToConnectErrors((data: IErrorData) => {
        log.error('Connection Error:', data.data);
        toast.error(data.message);
        if (data.data.logOut) {
          // remove token if server says to log out
          window.localStorage.removeItem('token');
        }
        // redirect back to start page
        history.push("/");
      })

    subscribeToChat((data: IChatData) => {
      const newMessage = new Message(
        data.username,
        data.text,
        MessageDirection.Received,
        new Date(Date.now())
      );
      appendMessageList(newMessage);
    });

    subscribeToJoinAlert((data: IJoinLeaveAlertData) => {
      log.info("joinalert", data.username);
      const alert = new Message(
        data.username,
        `${data.username} has joined`,
        MessageDirection.Alert,
        new Date(Date.now())
      );
      appendMessageList(alert);
    });

    subscribeToLeaveAlert((data: IJoinLeaveAlertData) => {
      log.info("leavealert", data.username);
      const alert = new Message(
        data.username,
        `${data.username} has left`,
        MessageDirection.Alert,
        new Date(Date.now())
      );
      appendMessageList(alert);
    });

    subscribeToHistory((data: IHistoryData) => {
      log.info("history", data);
      data.history.forEach((msgdata) => {
        var direction;
        var username;
        var text;
        var timestamp;
        switch (msgdata.type) {
          case "Message":
            direction =
              msgdata.username === chatConnection.username
                ? MessageDirection.Sent
                : MessageDirection.Received;
            username = msgdata.username;
            text = msgdata.text;
            timestamp = msgdata.timeStamp;
            break;
          case "JoinAlert":
            direction = MessageDirection.Alert;
            username = msgdata.username;
            text = `${username} has joined`;
            timestamp = msgdata.timeStamp;
            break;
          case "LeaveAlert":
            direction = MessageDirection.Alert;
            username = msgdata.username;
            text = `${username} has left`;
            timestamp = msgdata.timeStamp;
            break;
        }
        const message = new Message(
          username,
          text,
          direction,
          new Date(timestamp)
        );
        appendMessageList(message);
      });
    });

    // return a cleanup function
    return () => {
      disconnectSocket(); // disconnect from socketio
      setMessageList([]); // clear message list
    };
  }, [chatConnection, history]);

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
      <Helmet>
        <title>{`Chat | ${props.chatConnection.room}`}</title>
      </Helmet>
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
          {messageList.map((message: Message, idx: number) => {
            switch (message.direction) {
              case MessageDirection.Alert:
                return <AlertMessage text={message.text} key={idx}/>;
              case MessageDirection.Received:
              case MessageDirection.Sent:
                // hide username if previous message is from the same sender and same direction
                var hideName;
                const sameSender =
                  idx > 0 && messageList[idx - 1].username === message.username;
                const sameDirection =
                  idx > 0 &&
                  messageList[idx - 1].direction === message.direction;
                if (sameSender && sameDirection) {
                  hideName = true;
                } else {
                  hideName = false;
                }
                return (
                  <MessageCard
                    key={idx}
                    message={message}
                    hideName={hideName}
                  />
                );
              default:
                throw Error("Invalid message direction.");
            }
          })}
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
