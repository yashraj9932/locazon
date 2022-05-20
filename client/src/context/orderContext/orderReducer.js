import {
  ORDERS_SUCCESS,
  ORDERS_FAIL,
  CLEAR_OERRORS,
  CART_ORDERS,
} from "../types";

const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
      };
    case CART_ORDERS:
      return {
        ...state,
        cartOrders: action.payload,
      };
    case ORDERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_OERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default orderReducer;
