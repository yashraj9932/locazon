import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";

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

const Navbar = () => {
  const classes = useStyles();

  return (
    <div>
      <AppBar
        position="relative"
        className={classes.header}
        style={{ backgroundColor: "#f5efe0" }}
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
              <Typography>Contact</Typography>
            </Button>
            <Button className={classes.textColor} style={{ padding: "20px " }}>
              <Typography>Register</Typography>
            </Button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};
export default Navbar;
