import { createAsyncThunk } from "@reduxjs/toolkit";

import { http } from "@/config/axios";
import { IApprove } from "@/interface/IUser";
import { notify, notifyError } from "@/utils/helpers/notify";
import { AppDispatch } from "@/stores";

export const getUser = createAsyncThunk("user/get-user", async () => {
  try {
    console.log("GET USER");
    const { data } = await http.get("/members");

    return data;
  } catch (error) {
    console.log("GET USER", error);

    return {};
  }
});

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
  }
);

export function handleApprove(data: IApprove, dispatchCallback: () => any) {
  return (dispatch: AppDispatch) => {
    http
      .patch(`/members/${data.user_id}`, {
        approved: data.approve,
        rejected_note: data?.rejected_note,
      })
      .then(({ data }) => {
        notify(data.message);
      })
      .catch((err) => notifyError(err))
      .finally(() => dispatch(dispatchCallback()));
  };
}
