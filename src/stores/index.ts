import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import auth from "./features/auth/authSlice";
import user from "./features/user/userSlice";
import categories from "./features/categories/categorySlice";
import blogs from "./features/blogs/blogSlice";
import banners from "./features/banners/bannerSlice";
import schedulers from "./features/schedulers/scheduleSlice";
import area from "./features/area/areaSlice";
import role from "./features/roles/roleSlice";
import apps from "./features/apps/appSlice";

const persistedAuth = persistReducer({ key: "auth", storage }, auth);

export const store = configureStore({
  reducer: {
    auth: persistedAuth,
    user,
    categories,
    blogs,
    banners,
    schedulers,
    area,
    role,
    apps,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
