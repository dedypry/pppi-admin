import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { IQueryPagination } from "@/interface/IPagination";

export const getPackageInterests = createAsyncThunk(
  "package-interests/list",
  async ({
    page = 1,
    pageSize = 10,
    q = "",
    status = "all",
  }: IQueryPagination) => {
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: String(pageSize),
        q: String(q || ""),
        status: String(status || "all"),
      }).toString();
      const { data } = await http.get(`/package-interests?${params}`);

      return data;
    } catch (error) {
      console.error(error);

      return null;
    }
  },
);
