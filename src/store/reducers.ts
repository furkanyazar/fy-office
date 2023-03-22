import { combineReducers } from "redux";

import notificationSlice from "./slices/notificationSlice";
import userSlice from "./slices/userSlice";

export const reducers = combineReducers({
  userItems: userSlice,
  notificationItems: notificationSlice,
});
