import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";

import AuthState from "./context/authcontext/AuthState";
import ProdState from "./context/product/ProdState";
ReactDOM.render(
  <React.StrictMode>
    <AuthState>
      <ProdState>
        <App />
      </ProdState>
    </AuthState>
  </React.StrictMode>,
  document.getElementById("root")
);
