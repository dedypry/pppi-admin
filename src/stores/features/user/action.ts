import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { IApprove } from "@/interface/IUser";
import { notify, notifyError } from "@/utils/helpers/notify";
import { AppDispatch } from "@/stores";
import { IQueryPagination } from "@/interface/IPagination";

export const getUser = createAsyncThunk(
  "user/get-user",
  async ({
    page = 1,
    pageSize = 10,
    q = "",
    status = "",
  }: IQueryPagination) => {
    try {
      const { data } = await http.get(
        `/members?page=${page}&pageSize=${pageSize}&q=${q}&status=${status}`,
      );

      return data;
    } catch (error) {
      console.log("GET USER", error);

      return {};
    }
  },
);

export const getUserDetail = createAsyncThunk(
  "user-detail",
  async ({ id }: { id: number }) => {
    try {
      const { data } = await http.get(`/members/${id}`);

      return data;
    } catch (error) {
      notifyError(error as any);

      return null;
    }
  },
);

export function handleApprove(data: IApprove, dispatchCallback: () => any) {
  return (dispatch: AppDispatch) => {
    http
      .patch(`/members/${data.user_id}`, {
        approved: data.approve,
        rejected_note: data?.rejected_note,
        nia: data.nia,
      })
      .then(({ data }) => {
        notify(data.message);
      })
      .catch((err) => notifyError(err))
      .finally(() => dispatch(dispatchCallback()));
  };
}
