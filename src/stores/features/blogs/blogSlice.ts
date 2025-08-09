import { createSlice } from "@reduxjs/toolkit";

import { getBlogDetail, getBlogs } from "./actions";

import { IBlog } from "@/interface/IBlogs";
import { IPagination } from "@/interface/IPagination";

export const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: null as IPagination<IBlog[]> | null,
    blog: null as IBlog | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
      })
      .addCase(getBlogDetail.fulfilled, (state, action) => {
        state.blog = action.payload;
      }),
});

export const {} = blogSlice.actions;
export default blogSlice.reducer;
