import React, { useState } from "react";
import {
  TextField,
  makeStyles,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import Navbar from "./Navbar";
import { Link } from "react-router-dom";

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
  const classes = useStyles();
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = (e) => {
    e.preventDefault();
    setPhone("");
    setPassword("");
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
            <Link
              to="/register"
              style={{ textDecoration: "none", color: "#00131a" }}
            >
              Click here to Register!
            </Link>
          </Typography>
        </Grid>
        <form className={classes.root} noValidate autoComplete="off">
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
          </Grid>
        </form>
      </Grid>
    </div>
  );
};

export default Login;
