import { createSlice } from "@reduxjs/toolkit";

import { getBlogComment, getBlogDetail, getBlogs } from "./actions";

import { IBlog, IComment } from "@/interface/IBlogs";
import { IPagination } from "@/interface/IPagination";

export const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    blogs: null as IPagination<IBlog[]> | null,
    blog: null as IBlog | null,
    comments: [] as IComment[],
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getBlogs.fulfilled, (state, action) => {
        state.blogs = action.payload;
      })
      .addCase(getBlogDetail.fulfilled, (state, action) => {
        state.blog = action.payload;
      })
      .addCase(getBlogComment.fulfilled, (state, action) => {
        state.comments = action.payload;
      }),
});

export const {} = blogSlice.actions;
export default blogSlice.reducer;
