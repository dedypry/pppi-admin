import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { IPartner } from "@/interface/IPartner";

export const getPartners = createAsyncThunk("partners/list", async () => {
  try {
    const { data } = await http.get("/partners");

    if (Array.isArray(data)) {
      return data as IPartner[];
    }

    return (data?.data || []) as IPartner[];
  } catch (error) {
    console.error(error);

    return [];
  }
});
