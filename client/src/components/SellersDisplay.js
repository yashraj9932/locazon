import React from "react";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

const SellersDisplay = ({ seller }) => {
  return (
    <Card className="my-3 p-3 rounded">
      <Card.Img src={seller.image} variant="top" />
      <Card.Body>
        {seller.products.slice(0, 3).map((product) => {
          return (
            <div key={product._id}>
              <Card.Title as="div">
                <strong>{product.name}</strong>
              </Card.Title>

              <Card.Text as="div">
                <Rating value={4} text={`${6} reviews`} />
              </Card.Text>

              <Card.Text as="h5">INR {product.price}</Card.Text>
            </div>
          );
        })}
      </Card.Body>
    </Card>
  );
};

export default SellersDisplay;
