import React, { useReducer } from "react";
import axios from "axios";
import OrderContext from "./orderContext";
import orderReducer from "./orderReducer";
import setAuthToken from "../../utils/setAuthToken";

import {
  ORDERS_SUCCESS,
  ORDERS_FAIL,
  ORDER_CANCELLED,
  CART_ORDERS,
} from "../types";

const OrderState = (props) => {
  const initialState = {
    orders: [],
    cartOrders: [],
    errorOrder: null,
    loading: false,
  };
  const [state, dispatch] = useReducer(orderReducer, initialState);

  //Functions
  const getOrders = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("http://localhost:5000/auth/orders");
      dispatch({
        type: ORDERS_SUCCESS,
        payload: res.data.orders,
      });
    } catch (err) {
      dispatch({
        type: ORDERS_FAIL,
        payload: err.response,
      });
    }
  };

  const payOrder = (orderId, paymentResult) => {};

  const getCartOrders = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("http://localhost:5000/order/cart");

      dispatch({
        type: CART_ORDERS,
        payload: res.data.order,
      });
    } catch (err) {
      dispatch({
        type: ORDERS_FAIL,
        payload: err.response,
      });
    }
  };

  const deleteOrder = async (orderId) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      await axios.delete("http://localhost:5000/order/" + orderId);
      dispatch({
        type: ORDER_CANCELLED,
      });
    } catch (err) {
      dispatch({
        type: ORDERS_FAIL,
        payload: err.response,
      });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        orders: state.orders,
        error: state.error,
        loading: state.loading,
        cartOrders: state.cartOrders,
        getOrders,
        payOrder,
        deleteOrder,
        getCartOrders,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderState;
