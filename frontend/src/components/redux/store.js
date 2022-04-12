import { configureStore } from "@reduxjs/toolkit";
import indexReducer from "./reduxIndex";

export const store = configureStore({
  reducer: {
    directions: indexReducer,
  },
});
