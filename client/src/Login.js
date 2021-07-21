import React, { useState, useEffect } from "react";
import {
  TextField,
  makeStyles,
  Button,
  Grid,
  ThemeProvider,
  createTheme,
} from "@material-ui/core";
import Navbar from "./Navbar";

const theme = createTheme({
  palette: {
    primary: {
      main: "#00131a",
    },
    secondary: {
      light: "#0066ff",
      main: "#0044ff",
      contrastText: "#ffcc00",
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "35ch",
    },
  },
}));

const Login = () => {
  const classes = useStyles();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setPhone("");
    setPassword("");
  };

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Grid
        justifyContent="center"
        alignItems="center"
        container
        style={{ height: "83.8vh", backgroundColor: "#e98074" }}
      >
        <form
          className={classes.root}
          noValidate
          autoComplete="off"
          style={{ padding: "5%" }}
        >
          <Grid item xs={12}>
            <TextField
              required
              id="outlined-required"
              label="Phone"
              variant="outlined"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="outlined-required"
              label="Password"
              type="password"
              variant="outlined"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              style={{ marginTop: "3%", width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={onSubmit}
              style={{ marginTop: "5%", width: "100%" }}
            >
              Submit
            </Button>
          </Grid>
        </form>
      </Grid>
    </ThemeProvider>
  );
};

export default Login;
