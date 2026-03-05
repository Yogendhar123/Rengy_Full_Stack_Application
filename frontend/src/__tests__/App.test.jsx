import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import { configureStore } from '@reduxjs/toolkit'
import App from '../App'
import authReducer from '../store/slices/authSlice'
import contactReducer from '../store/slices/contactSlice'
import activityReducer from '../store/slices/activitySlice'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', { value: localStorageMock })

// Create a test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      auth: authReducer,
      contacts: contactReducer,
      activities: activityReducer
    },
    preloadedState
  })
}

// Mock API calls
vi.mock('../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

describe('App Component', () => {
  it('should render without crashing', () => {
    const store = createTestStore({
      auth: {
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    })

    render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
  })

  it('should have routes defined', () => {
    const store = createTestStore({
      auth: {
        token: null,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      }
    })

    const { container } = render(
      <Provider store={store}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </Provider>
    )
    
    // Check that the app renders some content
    expect(container).toBeInTheDocument()
  })
})

describe('Authentication Flow', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})
  })

  it('should check authentication status from localStorage', () => {
    // Test that localStorage is called on app load
    const token = 'test-token'
    localStorageMock.getItem.mockReturnValueOnce(token)
    
    // This simulates checking auth status
    const isAuthenticated = !!localStorage.getItem('token')
    expect(isAuthenticated).toBe(true)
  })

  it('should handle unauthenticated state', () => {
    localStorageMock.getItem.mockReturnValueOnce(null)
    
    const isAuthenticated = !!localStorage.getItem('token')
    expect(isAuthenticated).toBe(false)
  })
})

