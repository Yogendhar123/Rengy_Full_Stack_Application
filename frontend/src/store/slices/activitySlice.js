import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  activities: [],
  total: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
}

// Get all activities
export const getActivities = createAsyncThunk(
  'activities/getActivities',
  async ({ page = 1, limit = 20 } = {}, { rejectWithValue }) => {
    try {
      const response = await api.get(`/activities?page=${page}&limit=${limit}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch activities')
    }
  }
)

const activitySlice = createSlice({
  name: 'activities',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Activities
      .addCase(getActivities.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getActivities.fulfilled, (state, action) => {
        state.loading = false
        state.activities = action.payload.data
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getActivities.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { clearError } = activitySlice.actions
export default activitySlice.reducer

