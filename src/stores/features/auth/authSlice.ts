import { createSlice, PayloadAction } from "@reduxjs/toolkit";
interface IUserComment {
  show: boolean;
  name: string;
  email: string;
  avatar: string;
}

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: "" as string,
    userCommnet: null as IUserComment | null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setUserComment: (state, action: PayloadAction<IUserComment>) => {
      state.userCommnet = action.payload;
    },
  },
});

export const { setToken, setUserComment } = authSlice.actions;
export default authSlice.reducer;
