import React, { useReducer } from "react";
import axios from "axios";
import OrderContext from "./orderContext";
import orderReducer from "./orderReducer";
import { ORDERS_SUCCESS, ORDERS_FAIL } from "../types";

const OrderState = (props) => {
  const initialState = {
    orders: [],
    errorOrder: null,
  };
  const [state, dispatch] = useReducer(orderReducer, initialState);

  //Functions
  const getOrders = async () => {
    try {
      const res = await axios.get("http://localhost:5000/auth/orders");
      dispatch({
        type: ORDERS_SUCESS,
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: ORDERS_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        error: state.error,
        getOrders,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderState;
