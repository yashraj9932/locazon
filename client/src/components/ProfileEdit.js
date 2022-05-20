import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import AuthContext from "../context/authContext/authContext";
import Message from "./Message";
import Loader from "./Loader";

const ProfileEdit = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const authContext = useContext(AuthContext);
  const { loading, error, updateLocation, updateDetails } = authContext;

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      var lat = position.coords.latitude;
      var lng = position.coords.longitude;

      updateLocation([lat, lng]);
    });
  };

  const submitHandler = (e) => {
    e.preventDefault();
    updateDetails({ name, phone, email });
  };
  return (
    <div>
      {/* {success && <Message variant="success">Profile Updated</Message>} */}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <Form onSubmit={submitHandler}>
          <Form.Group controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="name"
              placeholder="Enter name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ marginBottom: "2%" }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Label>Email Address</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ marginBottom: "2%" }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label>Phone</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{ marginBottom: "4%" }}
            ></Form.Control>
          </Form.Group>

          <Form.Group controlId="phone">
            <Form.Label
              onClick={() => getLocation()}
              style={{ marginBottom: "4%" }}
            >
              Add / Reset Location
            </Form.Label>
          </Form.Group>
          <div style={{ textAlign: "center" }}>
            <Button type="submit" variant="primary">
              Update Details
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

export default ProfileEdit;
