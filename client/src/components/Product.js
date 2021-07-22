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
    height: 150,
    margin: " 5%",
  },
}));

const Product = ({ product }) => {
  const classes = useStyles();
  const { description, discount, picture, price, productOf } = product;
  return (
    <Grid item xs={10} sm={5} md={4} style={{ textAlign: "center" }}>
      <Card className={classes.rooti}>
        <CardActionArea>
          <CardMedia
            className={classes.media}
            image={
              picture === "" ? "/uploads/none.jpeg" : `/uploads/${picture}`
            }
            title={description}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="h2">
              {description}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Price: ${price}
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Discount: {discount}%
            </Typography>
            <Typography variant="body2" color="textSecondary" component="p">
              Product Of: {productOf}
            </Typography>
          </CardContent>
        </CardActionArea>
        <CardActions style={{ justifyContent: "center" }}>
          <Button size="small" color="primary" variant="contained">
            -
          </Button>
          <TextField
            defaultValue="1"
            style={{ width: "20px", textAlign: "center" }}
            onChange
          />
          <Button size="small" color="primary" variant="contained">
            +
          </Button>
        </CardActions>
        <CardContent>
          <Button
            size="small"
            color="secondary"
            variant="contained"
            style={{ width: "100%" }}
          >
            Add to Cart
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default Product;
