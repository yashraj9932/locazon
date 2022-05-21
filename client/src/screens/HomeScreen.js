import React, { useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import { Row, Col } from "react-bootstrap";
import SellersDisplay from "../components/SellersDisplay";
import Message from "../components/Message";
import Loader from "../components/Loader";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";
import AuthSellerContext from "../context/authSellerContext/authSellerContext";

const HomeScreen = () => {
  const params = useParams();
  const keyword = params.keyword;

  const authSellerContext = useContext(AuthSellerContext);
  const { sellersRadius, getSellersInDistance, error } = authSellerContext;
  console.log(sellersRadius);
  useEffect(() => {
    getSellersInDistance(300);
    // eslint-disable-next-line
  }, []);

  const loading = false;

  return (
    <div style={{ textAlign: "center" }}>
      <Meta />
      {!keyword ? (
        <ProductCarousel />
      ) : (
        <Link to="/" className="btn btn-light">
          Go Back
        </Link>
      )}
      <h1>Sellers in 300mile Radius</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Row>
            {sellersRadius.map((seller) => (
              <Col key={seller._id} sm={12} md={6}>
                <SellersDisplay seller={seller} />
              </Col>
            ))}
          </Row>
        </>
      )}
    </div>
  );
};

export default HomeScreen;
