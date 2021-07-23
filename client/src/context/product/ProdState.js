import axios from "axios";
import React, { useReducer } from "react";

import ProdContext from "./prodContext";
import prodReducer from "./prodReducer";

import { ADD_ORDER } from "../types";

const ProdState = (props) => {
  const initialState = {
    orders: [],
  };

  const [state, dispatch] = useReducer(prodReducer, initialState);

  const setOrders = () => {};

  const confirmOrder = () => {};

  return (
    <ProdContext.Provider
      value={{
        orders: state.orders,
        setOrders,
        confirmOrder,
      }}
    >
      {props.children}
    </ProdContext.Provider>
  );
};

export default ProdState;
