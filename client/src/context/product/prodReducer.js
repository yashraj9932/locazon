import { ADD_ORDER } from "../types";

const prodReducer = (state, action) => {
  switch (action.type) {
    case ADD_ORDER:
      return {
        ...state,
        orders: [...action.payload.ordd, action.payload.order],
      };
    default:
      return {
        ...state,
      };
  }
};

export default prodReducer;
