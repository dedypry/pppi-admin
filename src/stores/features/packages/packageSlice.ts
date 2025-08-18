import { createSlice } from "@reduxjs/toolkit";

import { getPackage } from "./action";

import { IPackage } from "@/interface/IPartner";

export const packageSlice = createSlice({
  name: "package",
  initialState: {
    packages: [] as IPackage[],
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getPackage.fulfilled, (state, action) => {
      state.packages = action.payload;
    }),
});

export const {} = packageSlice.actions;

export default packageSlice.reducer;
