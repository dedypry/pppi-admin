import { createSlice } from "@reduxjs/toolkit";

import { getUser, getUserDetail } from "./action";

import { IUser } from "@/interface/IUser";
import { IPagination } from "@/interface/IPagination";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    list: {} as IPagination<IUser[]>,
    user: null as IUser | null,
    detail: null as IUser | null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserDetail: (state, action) => {
      state.detail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.list = action.payload;
      })
      .addCase(getUserDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
      });
  },
});

export const { setUser, setUserDetail } = userSlice.actions;
export default userSlice.reducer;
