import { createSlice } from "@reduxjs/toolkit";

import { getBanner } from "./action";

import { IBanners } from "@/interface/IBanner";

export const bannerSlice = createSlice({
  name: "banner",
  initialState: {
    banners: [] as IBanners[],
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getBanner.fulfilled, (state, action) => {
      state.banners = action.payload;
    }),
});

export const {} = bannerSlice.actions;
export default bannerSlice.reducer;
