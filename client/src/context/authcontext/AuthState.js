import React, { useReducer } from "react";
import axios from "axios";
import AuthContext from "./authContext";
import authReducer from "./authReducer";
import setAuthToken from "../../utils/setAuthToken";
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS,
  UPDATE_FAIL,
} from "../types";

const { REACT_APP_BASE_URL } = process.env;

const AuthState = (props) => {
  const initialState = {
    token: localStorage.getItem("token"),
    isAuthenticated: null,
    loading: false,
    user: JSON.parse(localStorage.getItem("user")),
    error: null,
  };
  const [state, dispatch] = useReducer(authReducer, initialState);

  //Load User
  const loadUser = async () => {
    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }
    try {
      const res = await axios.get("http://localhost:5000/auth/me");
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      });
    } catch (err) {
      dispatch({ type: AUTH_ERROR });
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
        "http://localhost:5000/auth/register/user",
        formData,
        config
      );
      dispatch({
        type: REGISTER_SUCCESS,
        payload: res.data,
      });
      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
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
  const loginOtp = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      await axios.post(
        "http://localhost:5000/auth/loginOtp/user",
        formData,
        config
      );
    } catch (err) {
      dispatch({
        type: LOGIN_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  const confirmOtp = async (formData) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/confirmOtp/user",
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
        `${REACT_APP_BASE_URL}/auth/updateLocation/user`,
        { coordinates: location },
        config
      );
      loadUser();
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
        "http://localhost:5000/auth/updatedetails/user",
        formData,
        config
      );
      loadUser();
    } catch (err) {
      dispatch({
        type: UPDATE_FAIL,
        payload: err.response.data.error,
      });
    }
  };

  //Logout
  const logout = () => dispatch({ type: LOGOUT });

  //Clear Errors
  const clearErrors = () => dispatch({ type: CLEAR_ERRORS });

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        clearErrors,
        loadUser,
        login,
        loginOtp,
        logout,
        confirmOtp,
        updateLocation,
        updateDetails,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
