import axios from "axios";
import React, { useEffect, useContext, useState } from "react";
import AuthContext from "../context/authcontext/authContext";
import Navbar from "./Navbar";
import {
  TextField,
  makeStyles,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  CardActions,
  Button,
  Grid,
  Typography,
} from "@material-ui/core";
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      textAlign: "center",
    },
  },
  rooti: {
    // maxWidth: 345,
  },
  media: {
    height: 140,
  },
}));

const HomeAuth = () => {
  const classes = useStyles();

  const authContext = useContext(AuthContext);
  const [dist, setDist] = useState("");
  const [shops, setShops] = useState([]);
  useEffect(() => {
    authContext.loadUser();

    // eslint-disable-next-line
  }, []);

  useEffect(async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/authSeller/distance/500`
      );
      console.log(res.data.data);
      setShops(res.data.data);
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
        <Grid
          justifyContent="center"
          container
          style={{ textAlign: "center", width: "100%", margin: "3% auto" }}
        >
          <Grid item xs={10} md={4}>
            <TextField
              label="Radius"
              variant="outlined"
              value={dist}
              onChange={(e) => {
                setDist(e.target.value);
              }}
              style={{ width: "100%" }}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          {shops &&
            shops.map((shop) => {
              console.log(shop);
              const { name, phone, location, products } = shop;
              return (
                <Grid
                  item
                  xs={10}
                  sm={5}
                  md={4}
                  style={{ textAlign: "center" }}
                >
                  <Card className={classes.rooti}>
                    <CardActionArea>
                      <CardMedia
                        className={classes.media}
                        image="/static/images/cards/contemplative-reptile.jpg"
                        title="Contemplative Reptile"
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Phone: {phone}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Location: {location.formattedAddress}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                    <CardActions>
                      <Button size="small" color="primary">
                        Share
                      </Button>
                      <Button size="small" color="primary">
                        <Link to={`/shop/${shop._id}`}>Know More</Link>
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
        </Grid>
      </form>
    </div>
  );
};

export default HomeAuth;
