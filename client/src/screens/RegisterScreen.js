import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import AuthContext from "../context/authContext/authContext";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState(null);
  const authContext = useContext(AuthContext);
  const { register, error, loading, user } = authContext;

  const location = useLocation();
  const navigate = useNavigate();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      register({ name, phone, password });
    }
  };

  return (
    <FormContainer>
      <h1 style={{ marginTop: "15%", textAlign: "center" }}>Sign Up</h1>
      {message && <Message variant="danger">{message}</Message>}
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
        <Form.Group controlId="name">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="name"
            placeholder="Enter name"
            value={name}
            style={{ marginBottom: "2%" }}
            onChange={(e) => setName(e.target.value)}
            autoComplete="true"
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Label>Phone Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter Phone"
            value={phone}
            style={{ marginBottom: "2%" }}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="true"
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            style={{ marginBottom: "2%" }}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="true"
          ></Form.Control>
        </Form.Group>

        <Form.Group controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            style={{ marginBottom: "4%" }}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="true"
          ></Form.Control>
        </Form.Group>
        <div style={{ textAlign: "center" }}>
          <Button type="submit" variant="primary">
            Register
          </Button>
        </div>
      </Form>

      <Row className="py-3" style={{ textAlign: "center" }}>
        <Col>
          Have an Account?{" "}
          <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
            Login
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default RegisterScreen;
