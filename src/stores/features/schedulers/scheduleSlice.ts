import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getScheduler } from "./action";

import { IPagination } from "@/interface/IPagination";
import { IScheduler } from "@/interface/ISchedule";
import dayjs from "dayjs";

export const scheduleSlice = createSlice({
  name: "schedulers",
  initialState: {
    schedulers: null as IPagination<IScheduler[]> | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(
      getScheduler.fulfilled,
      (state, action: PayloadAction<IPagination<IScheduler[]>>) => {
        state.schedulers = action.payload;
      }
    ),
});

export const {} = scheduleSlice.actions;
export default scheduleSlice.reducer;
