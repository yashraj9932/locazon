import React from "react";
import { AppBar, Toolbar, Typography } from "@material-ui/core";

const Footer = () => {
  return (
    <div id="conti">
      <AppBar
        position="static"
        elevation={0}
        component="footer"
        style={{ backgroundColor: "#00131a", position: "fixed", bottom: "0" }}
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
