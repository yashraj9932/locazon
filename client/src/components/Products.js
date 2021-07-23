import axios from "axios";
import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { TextField, makeStyles, Grid } from "@material-ui/core";
import Product from "./Product";

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

const Products = () => {
  const classes = useStyles();
  const [dist, setDist] = useState("");
  // const [order, setOrder] = useState([]);
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  useEffect(() => {
    // authContext.loadUser();
    // eslint-disable-next-line
  }, []);

  useEffect(async () => {
    try {
      const res = await axios.get(`http://localhost:5000/product`);
      setProducts(res.data.products);
      setFiltered(res.data.products);
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
              label="Product"
              variant="outlined"
              value={dist}
              onChange={(e) => {
                setDist(e.target.value);
                setFiltered(
                  products.filter((product) => {
                    const regex = new RegExp(e.target.value, "gi");
                    return product.description.match(regex);
                  })
                );
              }}
              style={{ width: "100%" }}
            />
          </Grid>
        </Grid>
        <Grid container justifyContent="center">
          {filtered &&
            filtered.map((product, i) => {
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
      </form>
    </div>
  );
};

export default Products;
