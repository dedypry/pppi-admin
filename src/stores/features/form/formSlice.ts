import { createSlice } from "@reduxjs/toolkit";

import { getForm, getFormDetail, getFormResultDetail } from "./actions";

import { IPagination } from "@/interface/IPagination";
import { IFormList } from "@/interface/IForm";

export const formSlice = createSlice({
  name: "form",
  initialState: {
    forms: null as IPagination<IFormList[]> | null,
    detail: null as IFormList | null,
    result: null as IFormList | null,
  },
  reducers: {
    setDetail: (state, action) => {
      state.detail = action.payload;
    },
  },
  extraReducers: (builder) =>
    builder
      .addCase(getForm.fulfilled, (state, action) => {
        state.forms = action.payload;
      })
      .addCase(getFormDetail.fulfilled, (state, action) => {
        state.detail = action.payload;
      })
      .addCase(getFormResultDetail.fulfilled, (state, action) => {
        state.result = action.payload;
      }),
});
export const { setDetail } = formSlice.actions;
export default formSlice.reducer;
