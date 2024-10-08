import { configureStore } from "@reduxjs/toolkit";

import timerReducer from "./reducers/timerReducer";
import currentTaskReducer from "./reducers/currentTaskReducer";

const store = configureStore({
  reducer: {
    timer: timerReducer,
    currentTask: currentTaskReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
