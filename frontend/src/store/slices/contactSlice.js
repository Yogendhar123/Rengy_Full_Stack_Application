import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../services/api'

const initialState = {
  contacts: [],
  currentContact: null,
  total: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  error: null,
  search: '',
  status: '',
}

// Get all contacts
export const getContacts = createAsyncThunk(
  'contacts/getContacts',
  async ({ page = 1, limit = 10, search = '', status = '' }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contacts?page=${page}&limit=${limit}&search=${search}&status=${status}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contacts')
    }
  }
)

// Get single contact
export const getContact = createAsyncThunk(
  'contacts/getContact',
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contacts/${id}`)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact')
    }
  }
)

// Create contact
export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (contactData, { rejectWithValue }) => {
    try {
      const response = await api.post('/contacts', contactData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create contact')
    }
  }
)

// Update contact
export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, contactData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contacts/${id}`, contactData)
      return response.data.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update contact')
    }
  }
)

// Delete contact
export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/contacts/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete contact')
    }
  }
)

// Export contacts
export const exportContacts = createAsyncThunk(
  'contacts/exportContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contacts/export', { responseType: 'blob' })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'contacts.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      return true
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to export contacts')
    }
  }
)

const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setSearch: (state, action) => {
      state.search = action.payload
    },
    setStatus: (state, action) => {
      state.status = action.payload
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload
    },
    clearCurrentContact: (state) => {
      state.currentContact = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Contacts
      .addCase(getContacts.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(getContacts.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = action.payload.data
        state.total = action.payload.total
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
      })
      .addCase(getContacts.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Get Single Contact
      .addCase(getContact.pending, (state) => {
        state.loading = true
      })
      .addCase(getContact.fulfilled, (state, action) => {
        state.loading = false
        state.currentContact = action.payload
      })
      .addCase(getContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Create Contact
      .addCase(createContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.loading = false
        state.contacts.unshift(action.payload)
        state.total += 1
      })
      .addCase(createContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Update Contact
      .addCase(updateContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.loading = false
        const index = state.contacts.findIndex(c => c._id === action.payload._id)
        if (index !== -1) {
          state.contacts[index] = action.payload
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
      // Delete Contact
      .addCase(deleteContact.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.loading = false
        state.contacts = state.contacts.filter(c => c._id !== action.payload)
        state.total -= 1
      })
      .addCase(deleteContact.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })
  },
})

export const { setSearch, setStatus, setCurrentPage, clearCurrentContact, clearError } = contactSlice.actions
export default contactSlice.reducer

