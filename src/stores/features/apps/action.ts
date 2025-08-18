import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";

export const getApps = createAsyncThunk("apps-get", async () => {
  try {
    const { data } = await http.get(`/apps?key=apps`);

    return data;
  } catch (error) {
    return null;
  }
});
