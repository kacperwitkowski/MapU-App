import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  destination: [],
  origin: [],
  gasoline: "",
  gasolineSummary: "",
  gasolineO: "",
  gasolineD: "",
  roadInfo: "",
  visitedCountries: "",
  items1: "",
  items2: "",
  distance: "",
};

export const counterSlice = createSlice({
  name: "roadInformations",
  initialState,
  reducers: {
    setDestinationCor: (state, action) => {
      state.destination = action.payload;
    },
    setOriginCor: (state, action) => {
      state.origin = action.payload;
    },
    setAvrTwoPrices: (state, action) => {
      state.gasolineSummary = action.payload;
    },
    setGasolineO: (state, action) => {
      state.gasolineO = action.payload;
    },
    setGasolineD: (state, action) => {
      state.gasolineD = action.payload;
    },
    setDistance: (state, action) => {
      state.distance = action.payload;
    },
    setRoadInfos: (state, action) => {
      state.roadInfo = action.payload;
    },
    setCountriesOnVecMap: (state, action) => {
      state.visitedCountries = action.payload;
    },
    setItems1: (state, action) => {
      state.items1 = action.payload;
    },
    setItems2: (state, action) => {
      state.items2 = action.payload;
    },
  },
});

export const {
  setDestinationCor,
  setOriginCor,
  setGasolinePrice,
  setAvrTwoPrices,
  setRoadInfos,
  setCountriesOnVecMap,
  setItems1,
  setItems2,
  setDistance,
  setGasolineD,
  setGasolineO,
} = counterSlice.actions;

export default counterSlice.reducer;
