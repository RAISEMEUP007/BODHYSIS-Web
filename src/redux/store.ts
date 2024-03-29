import { combineReducers, configureStore } from '@reduxjs/toolkit';

import reservationSlice from './slices/reservationSlice';
import { baseApiSlice } from './slices/baseApiSlice';

const rootReducer = combineReducers({
  reservation: reservationSlice,
  [baseApiSlice.reducerPath]: baseApiSlice.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(baseApiSlice.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
