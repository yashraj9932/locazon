import React from "react";
import ReactDOM from "react-dom/client";
import "./bootstrap.min.css";
import "./index.css";
import App from "./App";
import AuthState from "./context/authContext/AuthState";
import AuthSellerState from "./context/authSellerContext/AuthSellerState";
import OrderState from "./context/orderContext/OrderState";

import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthState>
      <AuthSellerState>
        <OrderState>
          <App />
        </OrderState>
      </AuthSellerState>
    </AuthState>
  </React.StrictMode>
);

reportWebVitals();
