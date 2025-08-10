import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { IQueryPagination } from "@/interface/IPagination";
import { IScheduler } from "@/interface/ISchedule";
import dayjs from "dayjs";

export const getScheduler = createAsyncThunk(
  "get-schedule",
  async ({ page = 1, pageSize = 10 }: IQueryPagination) => {
    try {
      const { data } = await http.get(
        `/schedulers?page=${page}&pageSize=${pageSize}`
      );

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  }
);

export function formatDateSchedule(schedules: IScheduler[] = []) {
  return schedules.map((e) => ({
    ...e,
    start: dayjs(e.start_at).format("YYYY-MM-DD"),
    end: dayjs(e.end_at).format("YYYY-MM-DD"),
  }));
}

export function getRandomSafeColor() {
  const colors = [
    "#d4d4d8",
    "#15980d",
    "#17c964",
    "#f5a524",
    "#f31260",
    "#373638",
  ];

  return colors[Math.floor(Math.random() * colors.length)];
}