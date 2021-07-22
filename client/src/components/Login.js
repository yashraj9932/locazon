import React, { useState, useContext } from "react";
import {
  TextField,
  makeStyles,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";
import AuthContext from "../context/authcontext/authContext";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
      width: "45ch",
      [theme.breakpoints.down("sm")]: {
        width: "35ch",
      },
      textAlign: "center",
    },
  },
  welcome: {
    textAlign: "center",
  },
}));

const Login = () => {
  const authContext = useContext(AuthContext);
  const classes = useStyles();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setPhone("");
    setPassword("");
    authContext.login({
      phone,
      password,
    });
  };

  return (
    <div>
      <Navbar />
      <Grid
        justifyContent="space-around"
        alignItems="center"
        container
        style={{ height: "83.8vh", backgroundColor: "#e98074" }}
      >
        <Grid item className={classes.welcome}>
          <Typography color="primary" variant="h2">
            Welcome Back!
          </Typography>
          <Typography color="primary" variant="h6" style={{ margin: "4% 2%" }}>
            Not A User Yet?
          </Typography>
          <Typography color="primary" variant="h6" style={{ margin: "4% 2%" }}>
            <Link to="/register" style={{ color: "#00131a" }}>
              Click here to Register!
            </Link>
          </Typography>
        </Grid>
        <form onSubmit={onSubmit} className={classes.root}>
          <Grid
            container
            item
            justifyContent="center"
            alignItems="center"
            className={classes.welcome}
          >
            <Grid item xs={12}>
              <TextField
                required
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
                label="Password"
                type="password"
                variant="outlined"
                value={password}
                autoComplete="on"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                style={{ marginTop: "3%", width: "100%" }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button type="submit" style={{ marginTop: "5%", width: "100%" }}>
                Submit
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </div>
  );
};

export default Login;
