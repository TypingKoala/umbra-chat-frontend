import {
  Box,
  Button,
  Heading,
} from "grommet";
import { Sun, User } from "grommet-icons";

import React from "react";

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

interface INavBarProps {
  setDarkMode: (status: boolean) => void,
  darkMode: boolean,
  setShowSidebar: (status: boolean) => void,
  showSidebar: boolean,
}

const NavBar = (props: INavBarProps) => {
  const { setDarkMode, darkMode, setShowSidebar, showSidebar } = props;
  return (
    <AppBar>
      <Heading level='2' margin='none'>
        Umbra
      </Heading>
      <Box direction='row'>
        <Button
          icon={<Sun />}
          onClick={() => {
            setDarkMode(!darkMode);
          }}
          hoverIndicator={true}
          a11yTitle="Toggle Dark Mode"
        />
        <Button
          icon={<User />}
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
          hoverIndicator={true}
          active={showSidebar}
          a11yTitle="Toggle Sidebar"
        />
      </Box>
    </AppBar>
  );
};

export default NavBar;
