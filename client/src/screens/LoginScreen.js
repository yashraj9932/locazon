import React, { useState, useEffect, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";
import Message from "../components/Message";
import Loader from "../components/Loader";
import FormContainer from "../components/FormContainer";
import AuthContext from "../context/authContext/authContext";

const LoginScreen = () => {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("password");
  const authContext = useContext(AuthContext);
  const { login, error, loading, user, loginOtp, confirmOtp } = authContext;

  let location = useLocation();
  const navigate = useNavigate();
  const redirect = location.search ? location.search.split("=")[1] : "/";

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [navigate, user, redirect]);

  const submitHandler = (e) => {
    e.preventDefault();
    if (mode === "password") {
      login({
        phone,
        password,
      });
    } else {
      confirmOtp({
        phone,
        password,
      });
    }
  };

  return (
    <FormContainer>
      <h1 style={{ marginTop: "30%", textAlign: "center" }}>Sign In</h1>
      {error && <Message variant="danger">{error}</Message>}
      {loading && <Loader />}
      <Form onSubmit={submitHandler}>
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
          <Form.Label>{mode === "otp" ? "OTP" : "Password"}</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="true"
          ></Form.Control>
        </Form.Group>
        <Row className="py-3" style={{ textAlign: "center" }}>
          {mode === "otp" && (
            <Col
              onClick={() => {
                loginOtp({
                  phone,
                  password,
                });
              }}
            >
              Send OTP
            </Col>
          )}
        </Row>
        <Row style={{ textAlign: "center", marginBottom: "2%" }}>
          <Col
            onClick={() => {
              setMode((mode) => (mode === "otp" ? "password" : "otp"));
            }}
          >
            Login with {mode === "otp" ? "Password" : "OTP"}
          </Col>
        </Row>
        <div style={{ textAlign: "center" }}>
          <Button type="submit" variant="primary">
            Sign In
          </Button>
        </div>
      </Form>

      <Row className="py-3" style={{ textAlign: "center" }}>
        <Col>
          New Customer?{" "}
          <Link to={redirect ? `/register?redirect=${redirect}` : "/register"}>
            Register
          </Link>
        </Col>
      </Row>
    </FormContainer>
  );
};

export default LoginScreen;
