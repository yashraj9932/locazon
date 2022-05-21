import React, { useReducer } from "react";
import axios from "axios";
import AuthSellerContext from "./authSellerContext";
import authSellerReducer from "./authSellerReducer";
import setAuthToken from "../../utils/setAuthToken";
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

const { REACT_APP_BASE_URL } = process.env;

const AuthSellerState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: false,
    seller: JSON.parse(localStorage.getItem("user")),
    error: null,
    sellersRadius: [],
  };
  const [state, dispatch] = useReducer(authSellerReducer, initialState);

  //Load User
  const loadSeller = async () => {
    console.log(localStorage.getItem("token"));

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("http://localhost:5000/authSeller/me");
      dispatch({
        type: SELLER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTHSELLER_ERROR });
    }
  };

  //Register
  const register = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/authSeller/register/user",
        formData,
        config
      );
      dispatch({
        type: REGISTERSELLER_SUCCESS,
        payload: res.data,
      });
      loadSeller();
    } catch (err) {
      dispatch({
        type: REGISTERSELLER_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  //Login
  const login = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/authSeller/loginpass",
        formData,
        config
      );
      dispatch({
        type: LOGINSELLER_SUCCESS,
        payload: res.data,
      });
      loadSeller();
    } catch (err) {
      dispatch({
        type: LOGINSELLER_FAIL,
        payload: err.response.data.error,
      });
    }
  };
  const loginOtp = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.post(
        "http://localhost:5000/authSeller/loginOtp",
        formData,
        config
      );
    } catch (err) {
      dispatch({
        type: LOGINSELLER_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  //   const confirmOtp = async (formData) => {
  //     const config = {
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     };
  //     try {
  //       const res = await axios.post(
  //         "http://localhost:5000/authSeller/confirmOtp/user",
  //         formData,
  //         config
  //       );
  //       dispatch({
  //         type: LOGINSELLER_SUCCESS,
  //         payload: res.data,
  //       });
  //       loadSeller();
  //     } catch (err) {
  //       dispatch({
  //         type: LOGINSELLER_FAIL,
  //         payload: err.response.data.error,
  //       });
  //     }
  //   };

  const getSellersInDistance = async (radius) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get(
        `${REACT_APP_BASE_URL}/authSeller/distance/${radius}`
      );
      dispatch({
        type: SELLERS_RADIUS,
        payload: res.data.data,
      });
    } catch (err) {
      dispatch({
        type: UPDATE_FAIL,
        payload: err.response.data.error,
      });
    }
  };
  const updateLocation = async (location) => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.put(
        `${REACT_APP_BASE_URL}/authSeller/updateLocation`,
        { coordinates: location },
        config
      );
      loadSeller();
    } catch (err) {
      dispatch({
        type: UPDATE_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  const updateDetails = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.put(
        "http://localhost:5000/authSeller/updatedetails",
        formData,
        config
      );
      loadSeller();
    } catch (err) {
      dispatch({
        type: UPDATE_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  //Logout
  const logout = () => dispatch({ type: LOGOUTSELLER });

  //Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthSellerContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        sellersRadius: state.sellersRadius,
        register,
        clearErrors,
        loadSeller,
        login,
        loginOtp,
        logout,
        updateLocation,
        updateDetails,
        getSellersInDistance,
      }}
    >
      {props.children}
    </AuthSellerContext.Provider>
  );
};

export default AuthSellerState;
