import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../context/authcontext/authContext";
import Navbar from "./Navbar";
import {
  TextField,
  makeStyles,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";

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

const HomeAuth = () => {
  const classes = useStyles();

  const authContext = useContext(AuthContext);
  const [dist, setDist] = useState("");
  useEffect(() => {
    authContext.loadUser();

    // eslint-disable-next-line
  }, []);

  useEffect(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/authSeller/distance/500`
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <Navbar />
      <form onSubmit={onSubmit} className={classes.root}>
        <Grid item xs={12}>
          <TextField
            required
            label="Radius"
            variant="outlined"
            value={dist}
            onChange={(e) => {
              setDist(e.target.value);
            }}
            style={{ width: "100%" }}
          />
        </Grid>
      </form>
    </div>
  );
};

export default HomeAuth;
