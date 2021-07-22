import React from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Home from "./components/Home";
import HomeAuth from "./components/HomeAuth";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { createTheme, ThemeProvider } from "@material-ui/core";
import PrivateRoute from "./routing/PrivateRoute";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00131a",
    },
    secondary: {
      main: "#e85a4f",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <PrivateRoute exact path="/home" component={HomeAuth} />
          <Route exact path="/" component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
        </Switch>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
