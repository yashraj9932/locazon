import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
// import { PayPalButton } from "react-paypal-button-v2";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Row, Col, ListGroup, Image, Card, Button } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import OrderContext from "../context/orderContext/orderContext";
import AuthContext from "../context/authContext/authContext";

// import {
//   getOrderDetails,
//   payOrder,
//   deliverOrder,
// } from '../actions/orderActions'
// import {
//   ORDER_PAY_RESET,
//   ORDER_DELIVER_RESET,
// } from '../constants/orderConstants'

const OrderScreen = () => {
  const params = useParams();
  const navigate = useNavigate();
  const orderId = params.id;
  const orderContext = useContext(OrderContext);
  const { payOrder, deleteOrder, orders } = orderContext;
  const authContext = useContext(AuthContext);
  const { user, error } = authContext;

  let order = orders.map((order) => {
    return order._id === orderId ? order : null;
  });
  console.log(order);
  useEffect(() => {}, [order]);
  if (order._id === order) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };
    order.itemsPrice = addDecimals(
      order.products.reduce((acc, item) => acc + item.price * item.count, 0)
    );
  }

  const successPaymentHandler = (paymentResult) => {
    payOrder(orderId, paymentResult);
  };

  const cancelOrder = () => {
    deleteOrder(order._id);
  };
  if (order.length === 1) order = order[0];
  if (order.price <= 200) {
    order.shippingPrice = 40;
  }

  order.totalPrice = order.itemsPrice + order.shippingPrice + order.taxPrice;

  return order._id !== orderId ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <Row style={{ margin: "0 auto", width: "100%" }}>
        <h1>Order {order._id}</h1>
        <Col md={6}>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.orderOf}
              </p>
              {/* <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p> */}
              {/* <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p> */}
              {order.delivered ? (
                <Message variant="success">Delivered</Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              {/* <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p> */}
              {order.paid ? (
                <Message variant="success">Paid </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </ListGroup.Item>

            <ListGroup.Item>
              <h2>Order Items</h2>
              {order.products.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ListGroup variant="flush">
                  {order.products.map((item, index) => (
                    <ListGroup.Item key={index}>
                      <Row>
                        <Col md={1}>
                          <Image
                            src={item.picture}
                            alt={item.name}
                            fluid
                            rounded
                          />
                        </Col>
                        <Col>
                          {/* <Link to={`/product/${item.product}`}> */}
                          {item.name}
                          {/* </Link> */}
                        </Col>
                        <Col md={4}>
                          {item.count} x ${item.price} = $
                          {item.qty * item.price}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={4} style={{ textAlign: "center", marginLeft: "4%" }}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h2>Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Items</Col>
                  <Col>${order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Shipping</Col>
                  <Col>${order.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Tax</Col>
                  <Col>INR {0.18 * order.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item>
                <Row>
                  <Col>Total</Col>
                  <Col>${order.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              {/* {!order.paid && (
                <ListGroup.Item>
                  {loadingPay && <Loader />}
                  {!sdkReady ? (
                    <Loader />
                  ) : (
                    <PayPalButton
                      amount={order.totalPrice}
                      onSuccess={successPaymentHandler}
                    />
                  )}
                </ListGroup.Item>
              )} */}
              {/* {loadingDeliver && <Loader />} */}
              {user && order.paid && !order.delivered && (
                <ListGroup.Item>
                  <Button
                    type="button"
                    className="btn btn-block"
                    onClick={cancelOrder}
                  >
                    Cancel Order
                  </Button>
                </ListGroup.Item>
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default OrderScreen;

// const [sdkReady, setSdkReady] = useState(false);

// const orderDetails = useSelector((state) => state.orderDetails);
// const { order, loading, error } = orderDetails;

// const orderPay = useSelector((state) => state.orderPay);
// const { loading: loadingPay, success: successPay } = orderPay;

// const orderDeliver = useSelector((state) => state.orderDeliver);
// const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

// const userLogin = useSelector((state) => state.userLogin);
// const { userInfo } = userLogin;

// useEffect(() => {
// if (!user) {
//   navigate("/login");
// }

//   const addPayPalScript = async () => {
//     const { data: clientId } = await axios.get("/api/config/paypal");
//     const script = document.createElement("script");
//     script.type = "text/javascript";
//     script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`;
//     script.async = true;
//     script.onload = () => {
//       setSdkReady(true);
//     };
//     document.body.appendChild(script);
//   };

//   if (!order || successPay || successDeliver || order._id !== orderId) {
//     dispatch({ type: ORDER_PAY_RESET });
//     dispatch({ type: ORDER_DELIVER_RESET });
//     dispatch(getOrderDetails(orderId));
//   } else if (!order.isPaid) {
//     if (!window.paypal) {
//       addPayPalScript();
//     } else {
//       setSdkReady(true);
//     }
//   }
// }, [orderId, successPay, successDeliver, order]);
