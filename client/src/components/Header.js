import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Grid,
  Box,
  Button,
} from "@material-ui/core";
import photoo from "./images/home_photo.png";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";

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

  return (
    <div className={classes.homelanding}>
      <AppBar
        position="relative"
        className={classes.header}
        style={{ backgroundColor: "transparent" }}
      >
        <Toolbar>
          <Typography variant="h5" className={classes.title}></Typography>
          <div className={classes.navlist}>
            <Button className={classes.textColor} style={{ padding: "20px" }}>
              <Typography color="primary">Home</Typography>
            </Button>
            <Button className={classes.textColor} style={{ padding: "20px" }}>
              <Typography color="primary">Contact</Typography>
            </Button>
            <Button className={classes.textColor} style={{ padding: "20px " }}>
              <Typography color="primary">Register</Typography>
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
            component="div"
            variant="h2"
            style={{ margin: "15px 0", color: "#e85a4f" }}
          >
            <Box fontWeight="500">Locate-It</Box>
          </Typography>
          <Typography style={{ color: "#e98074" }}>
            Hello and Welcome All! This website is specifically designed to
            cater to the needs of you people, to actually help the take the
            actual essence of the place you go to. Head to the get started
            section and explore the various features of the website
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            style={{
              margin: "10% auto 20% auto",
              padding: "2% 4%",
              borderRadius: "25px",
            }}
            endIcon={<ArrowForwardIcon />}
          >
            Get Started
          </Button>
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
