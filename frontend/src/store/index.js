import { configureStore } from '@reduxjs/toolkit'
import authReducer from './slices/authSlice'
import contactReducer from './slices/contactSlice'
import activityReducer from './slices/activitySlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    contacts: contactReducer,
    activities: activityReducer,
  },
})

