import React from "react";
import { Button, Container, Grid, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import Product from "./Product";
const Shop = (props) => {
  console.log(props.location.state.shop);
  const shop = props.location.state.shop;
  return (
    <Container maxWidth="md">
      <Button
        variant="contained"
        color="secondary"
        startIcon={<ArrowBackIcon />}
      >
        <Link to="/home">Back</Link>
      </Button>
      <Grid container style={{ textAlign: "center" }}>
        <Grid item xs={12}>
          <Typography variant="h3">{shop.name}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">Phone: {shop.phone}</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6">{shop.location.formattedAddress}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{shop.location.zipcode}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{shop.location.city}</Typography>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="h6">{shop.location.state}</Typography>
        </Grid>
      </Grid>
      <Grid container alignItems="center" justifyContent="center" item xs={12}>
        {shop.products.map((product, i) => {
          return (
            <Product
              key={i}
              product={product}
              // order={order}
              // setOrder={setOrder}
            />
          );
        })}
      </Grid>
    </Container>
  );
};

export default Shop;
