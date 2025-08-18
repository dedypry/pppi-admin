import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { IQueryPagination } from "@/interface/IPagination";

export const getRoles = createAsyncThunk(
  "/get-role",
  async ({ page = 1, pageSize = 10 }: IQueryPagination) => {
    try {
      const { data } = await http.get(
        `/roles?page=${page}&pageSize=${pageSize}`,
      );

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
