import { createSlice } from "@reduxjs/toolkit";

import { getForm, getFormDetail } from "./actions";

import { IPagination } from "@/interface/IPagination";
import { IFormList } from "@/interface/IForm";

export const formSlice = createSlice({
  name: "form",
  initialState: {
    forms: null as IPagination<IFormList[]> | null,
    detail: null as IFormList | null,
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getForm.fulfilled, (state, action) => {
        state.forms = action.payload;
      })
      .addCase(getFormDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
      }),
});

export default formSlice.reducer;
