import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Grid,
  Divider,
  ListItem,
  ListItemText,
  makeStyles,
} from "@material-ui/core";
import { Info, CallSplit, GitHub, LinkedIn, Mail } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper,
  },
  linkStyle: {
    textDecoration: "none",
    color: "black",
  },
}));

const Footer = () => {
  const classes = useStyles();

  return (
    <div id="conti">
      {/* <Grid
        container
        justify="center"
        style={{ minHeight: "212px", margin: "2% auto" }}
      >
        <Grid container item sm={6} xs={11} justify="space-between">
          <Grid item sm={5} xs={12} style={{ marginBottom: "2%" }}>
            <Info color="black" />

            <Typography paragraph>
              Music, Poems, Programming, Eating, Sleeping. These words pretty
              much sum up my life. Exploring, learning, growing each day is what
              matters to me. I'm always up for collabs, be it projects, random
              jams, Yash Raj's here .
            </Typography>
          </Grid>
          <Grid item sm={5} xs={11}>
            <CallSplit color="black" />
            <a
              href="https://www.github.com/yashraj9932"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.linkStyle}
            >
              <ListItem button>
                <GitHub color="black" style={{ paddingRight: "3%" }} />
                <ListItemText primary="GitHub" />
              </ListItem>
            </a>
            <Divider />
            <a
              href="https://www.linkedin.com/in/yash-raj-goel-118511190/"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.linkStyle}
            >
              <ListItem button>
                <LinkedIn color="black" style={{ paddingRight: "3%" }} />

                <ListItemText primary="LinkedIn" />
              </ListItem>
            </a>
            <Divider light />
            <a
              href="mailto:yrg2828@gmail.com"
              rel="noopener noreferrer"
              target="_blank"
              className={classes.linkStyle}
            >
              <ListItem button>
                <Mail color="black" style={{ paddingRight: "3%" }} />

                <ListItemText primary="Mail" />
              </ListItem>
            </a>
          </Grid>
        </Grid>
      </Grid> */}
      <AppBar
        position="static"
        elevation={0}
        component="footer"
        style={{ backgroundColor: "#00131a" }}
      >
        <Toolbar
          style={{
            justifyContent: "center",
            color: "white",
          }}
        >
          <Typography variant="subtitle1">
            Made By Yash Raj Goel 2021©
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default Footer;
