import { createSlice } from "@reduxjs/toolkit";

import { getApps } from "./action";

import { IApps } from "@/interface/IApps";

export const appSlice = createSlice({
  name: "apps",
  initialState: {
    apps: null as IApps | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getApps.fulfilled, (state, action) => {
      state.apps = action.payload;
    }),
});

export const {} = appSlice.actions;

export default appSlice.reducer;
