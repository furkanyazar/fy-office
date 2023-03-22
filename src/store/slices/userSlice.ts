import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import UserDto from "../../models/users/userDto";

import { userItems } from "../initialValues/userItems";

export const modalSlice = createSlice({
  name: "modal",
  initialState: userItems,
  reducers: {
    setUser: (state, action: PayloadAction<UserDto>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = modalSlice.actions;

export default modalSlice.reducer;
