import React, { useEffect, useContext } from "react";
import { Link, useParams, useLocation, useNavigate } from "react-router-dom";
import OrderContext from "../context/orderContext/orderContext";

import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import Message from "../components/Message";

const CartScreen = ({ history }) => {
  const navigate = useNavigate();
  const params = useParams();
  const productId = params.id;
  const location = useLocation();
  const qty = location.search ? Number(location.search.split("=")[1]) : 1;

  const orderContext = useContext(OrderContext);
  const { getCartOrders, cartOrders } = orderContext;
  // useEffect(() => {
  //   if (productId) {
  //     dispatch(addToCart(productId, qty))
  //   }
  // }, [dispatch, productId, qty])

  useEffect(() => {
    getCartOrders();
  }, []);

  const removeFromCartHandler = (id) => {
    // removeFromCart(id);
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=shipping");
  };

  console.log(cartOrders);
  const productC = cartOrders[0];
  return (
    <Row>
      <Col md={8}>
        <h1>Shopping Cart</h1>
        {cartOrders && cartOrders.length === 0 ? (
          <Message>
            Your cart is empty <Link to="/">Go Back</Link>
          </Message>
        ) : (
          <ListGroup variant="flush">
            {productC &&
              productC.map((item) => (
                <ListGroup.Item key={item._id}>
                  <Row>
                    <Col md={2}>
                      <Image src={item.image} alt={item.name} fluid rounded />
                    </Col>
                    <Col md={3}>
                      <Link to={`/product/${item.product}`}>{item.name}</Link>
                    </Col>
                    <Col md={2}>${item.price}</Col>
                    <Col md={2}>
                      <Form.Control
                        as="select"
                        value={item.qty}
                        // onChange={(e) =>
                        //   addToCart(item.product, Number(e.target.value))
                        // }
                      >
                        {[...Array(item.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                    <Col md={2}>
                      <Button
                        type="button"
                        variant="light"
                        onClick={() => removeFromCartHandler(item.product)}
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </Col>
                  </Row>
                </ListGroup.Item>
              ))}
          </ListGroup>
        )}
      </Col>
      <Col md={4}>
        <Card>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>
                Subtotal ({cartOrders.reduce((acc, item) => acc + item.qty, 0)})
                items
              </h2>
              $
              {cartOrders
                .reduce((acc, item) => acc + item.qty * item.price, 0)
                .toFixed(2)}
            </ListGroup.Item>
            <ListGroup.Item>
              <Button
                type="button"
                className="btn-block"
                disabled={cartOrders.length === 0}
                onClick={checkoutHandler}
              >
                Proceed To Checkout
              </Button>
            </ListGroup.Item>
          </ListGroup>
        </Card>
      </Col>
    </Row>
  );
};

export default CartScreen;
