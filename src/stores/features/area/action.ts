/* eslint-disable no-console */
import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";
import { IQueryPagination } from "@/interface/IPagination";

export const getProvince = createAsyncThunk(
  "province-get",
  async ({ page = 1, pageSize = 15, q = "" }: IQueryPagination) => {
    try {
      const { data } = await http.get(
        `/provinces?page=${page}&pageSize=${pageSize}&q=${q}`,
      );

      return data;
    } catch (error) {
      console.error(error);
      notifyError(error as any);

      return null;
    }
  },
);

export const getCity = createAsyncThunk(
  "city-get",
  async ({ page = 1, pageSize = 15, q = "" }: IQueryPagination) => {
    try {
      const { data } = await http.get(
        `/cities?page=${page}&pageSize=${pageSize}&q=${q}`,
      );

      return data;
    } catch (error) {
      console.error(error);
      notifyError(error as any);

      return null;
    }
  },
);
export const getDistrict = createAsyncThunk(
  "districts-get",
  async ({ page = 1, pageSize = 15, q = "" }: IQueryPagination) => {
    try {
      const { data } = await http.get(
        `/districts?page=${page}&pageSize=${pageSize}&q=${q}`,
      );

      return data;
    } catch (error) {
      console.error(error);
      notifyError(error as any);

      return null;
    }
  },
);
