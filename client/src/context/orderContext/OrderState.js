import React, { useReducer } from "react";
import axios from "axios";
import OrderContext from "./orderContext";
import orderReducer from "./orderReducer";
import {} from "../types";

const OrderState = (props) => {
  const initialState = {
    error: null,
  };
  const [state, dispatch] = useReducer(orderReducer, initialState);

  //Functions
  //Login eg
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/loginpass/user",
        formData,
        config
      );
      dispatch({
        type: LOGIN_SUCCESS,
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  return (
    <OrderContext.Provider
      value={{
        error: state.error,
        login,
      }}
    >
      {props.children}
    </OrderContext.Provider>
  );
};

export default OrderState;
