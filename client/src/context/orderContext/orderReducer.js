import { ORDERS_SUCCESS, ORDERS_FAIL } from "../types";

const orderReducer = (state, action) => {
  switch (action.type) {
    case ORDERS_SUCCESS:
      return {
        ...state,
        orders: action.payload,
      };
    case ORDERS_FAIL:
      return {
        ...state,
        error: action.payload,
      };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default orderReducer;
