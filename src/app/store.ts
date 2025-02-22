import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import trainerReducer from "../features/trainer/TrainerSlice";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

// Persist config for user and trainer
const userPersistConfig = {
  key: "user",
  storage,
};

const trainerPersistConfig = {
  key: "trainer",
  storage,
};

// Persisted reducers for user and trainer
const persistedUserReducer = persistReducer(userPersistConfig, userReducer);
const persistedTrainerReducer = persistReducer(trainerPersistConfig, trainerReducer);

const store = configureStore({
  reducer: {
    user: persistedUserReducer,
    trainer: persistedTrainerReducer,
  },
  // Configure middleware to check for non-serializable values
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // You can ignore specific actions here if necessary
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

const persistor = persistStore(store);

export default store;
export { persistor };

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
