import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { ISetNotification } from "../models/notificationItems";

import { notificationItems } from "../initialValues/notificationItems";

export const notificationSlice = createSlice({
  name: "notification",
  initialState: notificationItems,
  reducers: {
    showNotification: (state, action: PayloadAction<ISetNotification>) => {
      state.show = true;
      state.title = action.payload.title;
      state.description = action.payload.description;
      state.buttons = action.payload.buttons;
    },
    hideNotification: (state) => {
      state.show = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;

export default notificationSlice.reducer;
