import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { IShopOrder } from "@/interface/IEcommerce";

export const getShopOrderNotifications = createAsyncThunk(
  "shop-orders/notifications",
  async () => {
    try {
      const { data } = await http.get("/shop-orders/admin/notifications?limit=5");

      return {
        new_orders_count: data?.new_orders_count || 0,
        items: (data?.items || []) as IShopOrder[],
      };
    } catch (error) {
      console.error(error);

      return {
        new_orders_count: 0,
        items: [] as IShopOrder[],
      };
    }
  },
);

export const readShopOrderNotifications = createAsyncThunk(
  "shop-orders/read-notifications",
  async (ids?: number[]) => {
    try {
      await http.patch("/shop-orders/admin/notifications/read", {
        ...(ids?.length ? { ids } : {}),
      });

      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  },
);
