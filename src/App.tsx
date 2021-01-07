import { Box, Grommet, ResponsiveContext } from "grommet";
import React, { useState } from "react";
import { Route, BrowserRouter as Router, Switch } from "react-router-dom";

import { ChatConnection } from "./api/ChatConnection";
import ChatInterface from "./components/ChatInterface";
import Div100vh from "react-div-100vh";
import { ErrorNotification } from "./components/Notification";
import GrommetTheme from "./GrommetTheme";
import { Helmet } from "react-helmet";
import NavBar from "./components/NavBar";
import ResponsiveSidebar from "./components/ResponsiveSidebar";
import StartPage from "./components/StartPage";
import Verify from "./components/Verify";

function App() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [chatConnection, setChatConnection] = useState(
    new ChatConnection("", "", "")
  );

  // error display
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <Grommet theme={GrommetTheme} full themeMode={darkMode ? "dark" : "light"}>
      <ResponsiveContext.Consumer>
        {(size) => (
          <Div100vh>
            <Helmet>
              <title>Umbra</title>
            </Helmet>
            <Box fill height='100%' background='background'>
              <Router>
                <Switch>
                  <Route exact path='/'>
                    <StartPage
                      chatConnection={chatConnection}
                      handleChatConnectionUpdate={setChatConnection}
                    />
                  </Route>
                  <Route exact path='/verify'>
                    <Verify />
                  </Route>
                  <Route exact path='/chat'>
                    <ErrorNotification
                      errorMessage={errorMessage}
                      onClose={() => setErrorMessage("")}
                    />
                    <NavBar
                      darkMode={darkMode}
                      setDarkMode={setDarkMode}
                      showSidebar={showSidebar}
                      setShowSidebar={setShowSidebar}
                    />
                    <Box
                      direction='row'
                      flex
                      overflow={{ horizontal: "hidden" }}
                    >
                      <ChatInterface
                        chatConnection={chatConnection}
                        handleChatConnectionUpdate={setChatConnection}
                      />
                      <ResponsiveSidebar
                        showSidebar={showSidebar}
                        setShowSidebar={setShowSidebar}
                        size={size}
                        chatConnection={chatConnection}
                        setChatConnection={setChatConnection}
                      />
                    </Box>
                  </Route>
                </Switch>
              </Router>
            </Box>
          </Div100vh>
        )}
      </ResponsiveContext.Consumer>
    </Grommet>
  );
}

export default App;
