import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";

export const getBanner = createAsyncThunk("banners", async () => {
  try {
    const { data } = await http.get("/banners");

    return data;
  } catch (error) {
     console.error(error);
     
    return [];
  }
});
