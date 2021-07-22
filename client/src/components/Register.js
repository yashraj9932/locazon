import React, { useState, useEffect } from "react";
import {
  TextField,
  makeStyles,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import Navbar from "./Navbar";

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
}));

const Register = () => {
  const classes = useStyles();
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [coordinates, setCoordinates] = useState([]);
  //name,email,password,phone,coordinates

  const onSubmit = (e) => {
    e.preventDefault();
    setPassword("");
    setPhone("");
    setName("");
    setEmail("");
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
      let cords = [];
      cords.push(position.coords.latitude);
      cords.push(position.coords.longitude);
      setCoordinates(cords);
    });
  }, []);
  return (
    <div
      style={{ height: "91.9vh", marginTop: "0", backgroundColor: "#e98074" }}
    >
      <Navbar />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        style={{ height: "100%" }}
      >
        <form
          onSubmit={onSubmit}
          className={classes.root}
          style={{ paddingBottom: "6%" }}
          // className={classes.welcome}
        >
          {/* <Grid container> */}
          <Grid item xs={12}>
            <Typography
              gutterBottom
              style={{
                fontSize: "3em",
                borderBottom: "1px solid black",
                marginBottom: "5%",
              }}
            >
              The Name
            </Typography>
            <TextField
              required
              label="Name"
              variant="outlined"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              style={{ width: "100%" }}
            />
          </Grid>
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
              label="Email"
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              style={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              id="outlined-password-input"
              label="Password"
              type="password"
              autoComplete="current-password"
              variant="outlined"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              style={{ width: "100%" }}
            />
          </Grid>

          <Grid item xs={12}>
            <Button type="submit" style={{ width: "100%", margin: "2vh auto" }}>
              Sign Up
            </Button>
          </Grid>
          {/* </Grid> */}
        </form>
      </Grid>
    </div>
  );
};

export default Register;
