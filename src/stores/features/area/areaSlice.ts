import { createSlice } from "@reduxjs/toolkit";

import { getCity, getDistrict, getProvince } from "./action";

import { IPagination } from "@/interface/IPagination";
import { ICity, IDistrict, IProvince } from "@/interface/IUser";

export const areaSlice = createSlice({
  name: "area",
  initialState: {
    provinces: null as IPagination<IProvince[]> | null,
    cities: null as IPagination<ICity[]> | null,
    districts: null as IPagination<IDistrict[]> | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getProvince.fulfilled, (state, action) => {
        state.provinces = action.payload;
      })
      .addCase(getCity.fulfilled, (state, action) => {
        state.cities = action.payload;
      })
      .addCase(getDistrict.fulfilled, (state, action) => {
        state.districts = action.payload;
      }),
});

export const {} = areaSlice.actions;
export default areaSlice.reducer;
