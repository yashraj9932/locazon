import React, { useEffect, useState } from "react";
import "./App.css";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Grid,
  Button,
} from "@material-ui/core";
import photoo from "./images/home_photo.png";

const useStyles = makeStyles((theme) => ({
  homelanding: {
    minHeight: "100vh",
    margin: "0px",
    padding: "0px",
    height: "100vh",
    backgroundColor: "#f5efe0",
  },
  header: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  homepic: {
    width: "70vh",
    height: "70vh",
    textAlign: "center",
    [theme.breakpoints.down("sm")]: {
      width: "50vh",
      height: "50vh",
    },
  },
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  navlist: {
    display: "flex",
    justifyContent: "center",
    textAlign: "center",
    paddingBottom: "0px",
    marginRight: "40px",
    [theme.breakpoints.down("sm")]: {
      marginRight: "12px",
      marginLeft: "0px",
    },
  },
}));

const Header = () => {
  const classes = useStyles();
  const [background, setBackground] = useState("transparent");

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const backgroundcolor = window.scrollY < 400 ? "transparent" : "black";

      setBackground(backgroundcolor);
    });
  }, []);
  return (
    <div className={classes.homelanding}>
      <AppBar
        position="fixed"
        className={classes.header}
        style={{ backgroundColor: `${background}` }}
      >
        <Toolbar>
          <Typography variant="h5" className={classes.title}>
            {/* Aiye Aapka Intezaar Thaa */}
          </Typography>
          <div className={classes.navlist}>
            <Button className={classes.textColor} style={{ padding: "20px" }}>
              <Typography>Home</Typography>
            </Button>
            <Button className={classes.textColor} style={{ padding: "20px" }}>
              <Typography>Get Started</Typography>
            </Button>
            <Button className={classes.textColor} style={{ padding: "20px " }}>
              <Typography>Contact</Typography>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Grid
        container
        alignItems="center"
        justifyContent="flex-start"
        style={{ height: "100vh", padding: "5%" }}
      >
        <Grid
          item
          md={6}
          xs={12}
          style={{ textAlign: "center", color: "#e85a4f", margin: "0px" }}
        >
          <Typography
            variant="h2"
            style={{ margin: "15px 0", color: "#e85a4f" }}
          >
            Locate-It
          </Typography>
          <Typography style={{ color: "#e98074" }}>
            Hello and Welcome All! This website is specifically designed to
            cater to the needs of you people, to actually help the take the
            actual essence of the place you go to. Head to the get started
            section and explore the various features of the website
          </Typography>
        </Grid>
        <Grid
          item
          md={6}
          xs={12}
          style={{ textAlign: "center", paddingRight: "5%" }}
        >
          <img src={photoo} className={classes.homepic} alt="homepic" />
        </Grid>
      </Grid>
    </div>
  );
};

export default Header;
