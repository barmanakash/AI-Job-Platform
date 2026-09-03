// frontend/src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import resumeReducer from './slices/resumeSlice';
import jobReducer from './slices/jobSlice';
import kanbanReducer from './slices/kanbanSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    resumes: resumeReducer,
    jobs: jobReducer,
    kanban: kanbanReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;