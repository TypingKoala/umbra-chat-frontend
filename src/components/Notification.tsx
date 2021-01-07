import { Box, Button, Layer, Text } from "grommet";

import { FormClose } from "grommet-icons";
import { useEffect } from "react";

interface INotificationBarProps {
  message: string;
  color: string;
  onClose: () => void;
  secondsToDisplay: number; // in ms
}

export default function NotificationBar(props: INotificationBarProps) {
  useEffect(() => {
    const timeout = setTimeout(
      () => props.onClose(),
      props.secondsToDisplay * 1000
    );

    return () => clearTimeout(timeout);
  });

  return (
    <Layer
      position='top'
      animation={false}
      margin='medium'
      onClickOutside={props.onClose}
      onEsc={props.onClose}
      modal={false}
    >
      <Box
        direction='row'
        justify='between'
        align='center'
        elevation='small'
        pad={{ vertical: "small", left: "medium" }}
        background={props.color}
        width='fit-content'
        gap='small'
      >
        <Text size='medium'>{props.message}</Text>
        <Button icon={<FormClose />} onClick={props.onClose} />
      </Box>
    </Layer>
  );
};

interface IErrorNotification {
  errorMessage: string,
  onClose: () => void,
  secondsToDisplay?: number,
}

export function ErrorNotification(props: IErrorNotification) {
  if (props.errorMessage) {
    return (
      <NotificationBar
        message={props.errorMessage}
        color='status-error'
        onClose={props.onClose}
        secondsToDisplay={props.secondsToDisplay || 5}
      />
    )
  } else {
    return (null);
  }
}
