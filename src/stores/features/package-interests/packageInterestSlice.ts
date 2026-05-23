import { createSlice } from "@reduxjs/toolkit";

import { getPackageInterests } from "./action";

import { IPagination } from "@/interface/IPagination";
import { IPackageInterest } from "@/interface/IPartner";

export const packageInterestSlice = createSlice({
  name: "package-interests",
  initialState: {
    list: null as IPagination<IPackageInterest[]> | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getPackageInterests.fulfilled, (state, action) => {
      state.list = action.payload;
    }),
});

export const {} = packageInterestSlice.actions;

export default packageInterestSlice.reducer;
