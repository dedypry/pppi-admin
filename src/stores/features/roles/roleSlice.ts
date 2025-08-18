import { createSlice } from "@reduxjs/toolkit";

import { getRoles } from "./action";

import { IPagination } from "@/interface/IPagination";
import { IRole } from "@/interface/IUser";

export const roleSlice = createSlice({
  name: "roles",
  initialState: {
    roles: null as IPagination<IRole[]> | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getRoles.fulfilled, (state, action) => {
      state.roles = action.payload;
    }),
});

export const {} = roleSlice.actions;

export default roleSlice.reducer;
