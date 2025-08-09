import { createSlice } from "@reduxjs/toolkit";

import { getCategories } from "./actions";

import { ICategory } from "@/interface/IBlogs";
import { IPagination } from "@/interface/IPagination";

export const categorrySlice = createSlice({
  name: "category",
  initialState: {
    categories: null as IPagination<ICategory[]> | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder.addCase(getCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    }),
});

export const {} = categorrySlice.actions;
export default categorrySlice.reducer;
