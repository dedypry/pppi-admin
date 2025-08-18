import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";

export const getPackage = createAsyncThunk("package-lsit", async () => {
  try {
    const { data } = await http.get("/packages");

    return data;
  } catch (error) {
    console.error(error);

    return [];
  }
});
