import { createSlice } from "@reduxjs/toolkit";

import {
  getShopOrderNotifications,
  readShopOrderNotifications,
} from "./action";

import { IShopOrder } from "@/interface/IEcommerce";

export const shopOrderSlice = createSlice({
  name: "shop-orders",
  initialState: {
    newOrdersCount: 0,
    notifications: [] as IShopOrder[],
  },
  reducers: {},
  extraReducers: (builder) =>
    builder
      .addCase(getShopOrderNotifications.fulfilled, (state, action) => {
        state.newOrdersCount = action.payload.new_orders_count;
        state.notifications = action.payload.items;
      })
      .addCase(readShopOrderNotifications.fulfilled, (state, action) => {
        if (action.payload) {
          state.newOrdersCount = 0;
        }
      }),
});

export const {} = shopOrderSlice.actions;

export default shopOrderSlice.reducer;
