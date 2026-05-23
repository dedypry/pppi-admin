import { createSlice } from "@reduxjs/toolkit";

import { getPartners } from "./action";

import { IPartner } from "@/interface/IPartner";

export const partnerSlice = createSlice({
  name: "partners",
  initialState: {
    partners: [] as IPartner[],
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getPartners.fulfilled, (state, action) => {
      state.partners = action.payload;
    }),
});

export const {} = partnerSlice.actions;

export default partnerSlice.reducer;
