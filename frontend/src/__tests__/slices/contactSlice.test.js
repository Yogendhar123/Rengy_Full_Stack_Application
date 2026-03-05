import { describe, it, expect, vi, beforeEach } from 'vitest'
import contactReducer, { 
  setSearch, 
  setStatus, 
  setCurrentPage,
  clearCurrentContact,
  clearError,
  getContacts,
  createContact,
  updateContact,
  deleteContact
} from '../../store/slices/contactSlice'

// Mock axios
vi.mock('../../services/api', () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}))

import api from '../../services/api'

describe('contactSlice', () => {
  const initialState = {
    contacts: [],
    currentContact: null,
    total: 0,
    totalPages: 0,
    currentPage: 1,
    loading: false,
    error: null,
    search: '',
    status: ''
  }

  it('should return the initial state', () => {
    expect(contactReducer(undefined, { type: 'unknown' })).toEqual(initialState)
  })

  it('should handle setSearch', () => {
    const result = contactReducer(initialState, setSearch('test search'))
    expect(result.search).toBe('test search')
  })

  it('should handle setStatus', () => {
    const result = contactReducer(initialState, setStatus('lead'))
    expect(result.status).toBe('lead')
  })

  it('should handle setCurrentPage', () => {
    const result = contactReducer(initialState, setCurrentPage(3))
    expect(result.currentPage).toBe(3)
  })

  it('should handle clearCurrentContact', () => {
    const stateWithContact = {
      ...initialState,
      currentContact: { id: '1', name: 'Test' }
    }
    
    const result = contactReducer(stateWithContact, clearCurrentContact())
    expect(result.currentContact).toBeNull()
  })

  it('should handle clearError', () => {
    const stateWithError = {
      ...initialState,
      error: 'Some error'
    }
    
    const result = contactReducer(stateWithError, clearError())
    expect(result.error).toBeNull()
  })

  it('should handle getContacts.pending', () => {
    const action = { type: getContacts.pending.type }
    const result = contactReducer(initialState, action)
    
    expect(result.loading).toBe(true)
    expect(result.error).toBeNull()
  })

  it('should handle getContacts.fulfilled', () => {
    const contacts = [
      { _id: '1', name: 'Contact 1', email: 'test1@example.com' },
      { _id: '2', name: 'Contact 2', email: 'test2@example.com' }
    ]
    const action = { 
      type: getContacts.fulfilled.type, 
      payload: { 
        data: contacts, 
        total: 2, 
        totalPages: 1, 
        currentPage: 1 
      } 
    }
    const result = contactReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.contacts).toEqual(contacts)
    expect(result.total).toBe(2)
    expect(result.totalPages).toBe(1)
    expect(result.currentPage).toBe(1)
  })

  it('should handle getContacts.rejected', () => {
    const action = { 
      type: getContacts.rejected.type, 
      payload: 'Failed to fetch contacts' 
    }
    const result = contactReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.error).toBe('Failed to fetch contacts')
  })

  it('should handle createContact.pending', () => {
    const action = { type: createContact.pending.type }
    const result = contactReducer(initialState, action)
    
    expect(result.loading).toBe(true)
    expect(result.error).toBeNull()
  })

  it('should handle createContact.fulfilled', () => {
    const newContact = { _id: '1', name: 'New Contact', email: 'new@example.com' }
    const action = { 
      type: createContact.fulfilled.type, 
      payload: newContact 
    }
    const result = contactReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.contacts[0]).toEqual(newContact)
    expect(result.total).toBe(1)
  })

  it('should handle createContact.rejected', () => {
    const action = { 
      type: createContact.rejected.type, 
      payload: 'Failed to create contact' 
    }
    const result = contactReducer(initialState, action)
    
    expect(result.loading).toBe(false)
    expect(result.error).toBe('Failed to create contact')
  })

  it('should handle updateContact.fulfilled', () => {
    const stateWithContact = {
      ...initialState,
      contacts: [
        { _id: '1', name: 'Old Name', email: 'old@example.com' }
      ]
    }
    const updatedContact = { _id: '1', name: 'New Name', email: 'old@example.com' }
    const action = { 
      type: updateContact.fulfilled.type, 
      payload: updatedContact 
    }
    const result = contactReducer(stateWithContact, action)
    
    expect(result.contacts[0].name).toBe('New Name')
  })

  it('should handle deleteContact.fulfilled', () => {
    const stateWithContact = {
      ...initialState,
      contacts: [
        { _id: '1', name: 'Contact 1' },
        { _id: '2', name: 'Contact 2' }
      ],
      total: 2
    }
    const action = { 
      type: deleteContact.fulfilled.type, 
      payload: '1' 
    }
    const result = contactReducer(stateWithContact, action)
    
    expect(result.contacts.length).toBe(1)
    expect(result.contacts[0]._id).toBe('2')
    expect(result.total).toBe(1)
  })
})

