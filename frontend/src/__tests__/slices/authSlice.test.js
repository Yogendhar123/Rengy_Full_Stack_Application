import { describe, it, expect, vi, beforeEach } from 'vitest'
import authReducer, { 
  clearError, 
  signin, 
  signup, 
  logout, 
  getMe 
} from '../../store/slices/authSlice'

// Mock axios
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn()
  }
}))

import api from '../../services/api'

describe('authSlice', () => {
  const initialState = {
    token: null,
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }

  it('should return the initial state', () => {
    expect(authReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error message'
    }
    
    const result = authReducer(stateWithError, clearError())
    expect(result.error).toBeNull()
  })

  it('should handle signin.pending', () => {
    const action = { type: signin.pending.type }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(true)
    expect(result.error).toBeNull()
  })

  it('should handle signin.fulfilled', () => {
    const user = { id: '1', name: 'Test User', email: 'test@example.com' }
    const token = 'test-token'
    const action = { 
      type: signin.fulfilled.type, 
      payload: { token, user } 
    }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.isAuthenticated).toBe(true)
    expect(result.token).toBe(token)
    expect(result.user).toEqual(user)
  })

  it('should handle signin.rejected', () => {
    const action = { 
      type: signin.rejected.type, 
      payload: 'Invalid credentials' 
    }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.error).toBe('Invalid credentials')
  })

  it('should handle signup.pending', () => {
    const action = { type: signup.pending.type }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(true)
    expect(result.error).toBeNull()
  })

  it('should handle signup.fulfilled', () => {
    const user = { id: '1', name: 'Test User', email: 'test@example.com' }
    const token = 'test-token'
    const action = { 
      type: signup.fulfilled.type, 
      payload: { token, user } 
    }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.isAuthenticated).toBe(true)
    expect(result.token).toBe(token)
    expect(result.user).toEqual(user)
  })

  it('should handle signup.rejected', () => {
    const action = { 
      type: signup.rejected.type, 
      payload: 'User already exists' 
    }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.error).toBe('User already exists')
  })

  it('should handle logout.fulfilled', () => {
    const stateWithAuth = {
      ...initialState,
      token: 'test-token',
      user: { id: '1', name: 'Test' },
      isAuthenticated: true
    }
    
    const result = authReducer(stateWithAuth, logout.fulfilled())
    
    expect(result.token).toBeNull()
    expect(result.user).toBeNull()
    expect(result.isAuthenticated).toBe(false)
    expect(result.error).toBeNull()
  })

  it('should handle getMe.pending', () => {
    const action = { type: getMe.pending.type }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(true)
  })

  it('should handle getMe.fulfilled', () => {
    const user = { id: '1', name: 'Test User', email: 'test@example.com' }
    const action = { 
      type: getMe.fulfilled.type, 
      payload: user 
    }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.user).toEqual(user)
  })

  it('should handle getMe.rejected', () => {
    const action = { 
      type: getMe.rejected.type, 
      payload: 'Failed to get user' 
    }
    const result = authReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.error).toBe('Failed to get user')
  })
})

