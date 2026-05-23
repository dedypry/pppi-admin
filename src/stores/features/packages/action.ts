import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { IPackage } from "@/interface/IPartner";

export const getPackage = createAsyncThunk("package-lsit", async () => {
  try {
    const { data } = await http.get("/packages");

    if (Array.isArray(data)) {
      return data as IPackage[];
    }

    return (data?.data || []) as IPackage[];
  } catch (error) {
    console.error(error);

    return [];
  }
});
