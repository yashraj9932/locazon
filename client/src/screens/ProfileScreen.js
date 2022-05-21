import React, { useState, useEffect, useContext } from "react";
// import { useNavigate } from "react-router-dom";
import { Table, Button, Row, Col } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import OrderContext from "../context/orderContext/orderContext";
import AuthContext from "../context/authContext/authContext";
import ProfileEdit from "../components/ProfileEdit";

const ProfileScreen = () => {
  const [message, setMessage] = useState(null);
  const [editP, seteditP] = useState(false);
  const orderContext = useContext(OrderContext);
  const { getOrders, errorOrder, loading, orders } = orderContext;
  const authContext = useContext(AuthContext);
  const { user } = authContext;
  // const navigate = useNavigate();

  useEffect(() => {
    getOrders();
  }, []);

  const { name, phone, email, location, totalSpent, profilepicture } = user;
  console.log(profilepicture);
  return (
    <Row>
      <Col md={9} style={{ margin: "5% auto" }}>
        {message && <Message variant="danger">{message}</Message>}

        <h2>User Profile</h2>
        <div
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          <div style={{ flex: 1 }}>
            <img
              style={{
                border: "1px solid gray",
                padding: "2%",
                borderRadius: "50%",
                width: "80%",
                // height: "50%",
              }}
              src={
                profilepicture !== ""
                  ? `http://localhost:5000/uploads/${profilepicture}`
                  : "https://www.business2community.com/wp-content/uploads/2017/08/blank-profile-picture-973460_640.png"
              }
              alt="mepic"
            ></img>
          </div>
          <div style={{ flex: 2, textAlign: "left" }}>
            {name && <p>Name: {name}</p>}
            {phone && <p>Phone: {phone}</p>}
            {email && <p>Email: {email}</p>}
            {location && <p>Location: {location.formattedAddress}</p>}
            {totalSpent && <p>Total Spent: INR{totalSpent}</p>}
          </div>
        </div>
      </Col>
      <Col md={9}>
        <div style={{ float: "right" }}>
          <Button onClick={() => seteditP((editP) => !editP)} variant="primary">
            Edit Profile
          </Button>
        </div>
      </Col>
      <Col style={{ margin: "0 auto" }} md={6}>
        <div style={{ transition: "opacity 10s ease-in-out" }}>
          {editP && <ProfileEdit />}
        </div>
      </Col>
      <Col md={9} style={{ margin: "4% auto" }}>
        <h2>My Orders</h2>
        {loading ? (
          <Loader />
        ) : errorOrder ? (
          <Message variant="danger">{errorOrder}</Message>
        ) : (
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>DATE</th>
                <th>TOTAL</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>{order.totalPrice}</td>
                  <td>
                    {order.paid ? (
                      <i
                        className="fas fa-check"
                        style={{ color: "green" }}
                      ></i>
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-times" style={{ color: "red" }}></i>
                    )}
                  </td>
                  <td>
                    <LinkContainer
                      to={{
                        pathname: `/order/${order._id}`,
                        query: { order: order },
                      }}
                    >
                      {/* to={`/order/${order._id}`}
                      params={{ order }}
                    > */}
                      <Button className="btn-sm" variant="light">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Col>
    </Row>
  );
};

export default ProfileScreen;
