import {
  REGISTERSELLER_SUCCESS,
  REGISTERSELLER_FAIL,
  SELLER_LOADED,
  AUTHSELLER_ERROR,
  LOGINSELLER_SUCCESS,
  LOGINSELLER_FAIL,
  LOGOUTSELLER,
  CLEAR_ERRORS,
  UPDATE_FAIL,
  SELLERS_RADIUS,
} from "../types";

const authSellerReducer = (state, action) => {
  switch (action.type) {
    case SELLER_LOADED:
      localStorage.setItem("seller", JSON.stringify(action.payload.data));
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        seller: action.payload.data,
      };

    case REGISTERSELLER_SUCCESS:
    case LOGINSELLER_SUCCESS:
      localStorage.setItem("token", action.payload.token);

      return {
        ...state,
        ...action.payload,
        isAuthenticated: true,
        loading: false,
      };
    case SELLERS_RADIUS:
      return {
        ...state,
        sellersRadius: [...action.payload],
      };
    case REGISTERSELLER_FAIL:
    case AUTHSELLER_ERROR:
    case LOGINSELLER_FAIL:
    case LOGOUTSELLER:
      //   localStorage.removeItem("token");
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false,
        seller: null,
        error: action.payload,
      };
    case UPDATE_FAIL:
      return { ...state, error: action.payload };
    case CLEAR_ERRORS:
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
};

export default authSellerReducer;
