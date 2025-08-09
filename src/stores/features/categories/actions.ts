import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { notifyError } from "@/utils/helpers/notify";
import { IQueryPagination } from "@/interface/IPagination";

export const getCategories = createAsyncThunk(
  "category-list",
  async ({ page = 1, pageSize = 10 }: IQueryPagination) => {
    try {
      const { data } = await http.get(
        `/blogs/categories?page=${page}&pageSize=${pageSize}`,
      );

      return data;
    } catch (error) {
      console.error(error);
      notifyError(error as any);

      return null;
    }
  }
);
