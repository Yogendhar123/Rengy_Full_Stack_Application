import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { 
  getContacts, 
  createContact, 
  updateContact, 
  deleteContact, 
  exportContacts,
  setSearch,
  setStatus,
  setCurrentPage
} from '../store/slices/contactSlice'
import { getActivities } from '../store/slices/activitySlice'
import Navbar from '../components/Navbar'
import ReactPaginate from 'react-paginate'
import { StatusOverlay } from '../components/StatusOverlay'
import { 
  Search, 
  Filter, 
  Plus, 
  Edit2, 
  Trash2, 
  Download, 
  Activity, 
  X,
  Check,
  Phone,
  Mail,
  Building,
  User,
  ChevronLeft,
  ChevronRight,
  FileText
} from 'lucide-react'

const Dashboard = () => {
  const dispatch = useDispatch()
  const { contacts, total, totalPages, currentPage, loading, search, status } = useSelector((state) => state.contacts)
  const { activities } = useSelector((state) => state.activities)
  
  const [showModal, setShowModal] = useState(false)
  const [showActivities, setShowActivities] = useState(false)
  const [editingContact, setEditingContact] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: 'lead',
    notes: ''
  })
  const [errors, setErrors] = useState({})
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Status overlay state
  const [overlay, setOverlay] = useState({
    open: false,
    variant: 'info',
    title: '',
    message: ''
  })

  useEffect(() => {
    // Fetch user data on mount to ensure we have the latest
    const fetchData = async () => {
      try {
        await dispatch(getContacts({ page: currentPage, limit: 10, search, status }))
        await dispatch(getActivities({}))
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    
    fetchData()
  }, [dispatch, currentPage, search, status])

  const validateForm = () => {
    const newErrors = {}
    if (!formData.name.trim()) newErrors.name = 'Name is required'
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSearch = (e) => {
    dispatch(setSearch(e.target.value))
    dispatch(setCurrentPage(1))
  }

  const handleStatusFilter = (e) => {
    dispatch(setStatus(e.target.value))
    dispatch(setCurrentPage(1))
  }

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page.selected + 1))
  }

  const openModal = (contact = null) => {
    if (contact) {
      setEditingContact(contact)
      setFormData({
        name: contact.name,
        email: contact.email,
        phone: contact.phone || '',
        company: contact.company || '',
        status: contact.status,
        notes: contact.notes || ''
      })
    } else {
      setEditingContact(null)
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        status: 'lead',
        notes: ''
      })
    }
    setErrors({})
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingContact(null)
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      status: 'lead',
      notes: ''
    })
    setErrors({})
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        if (editingContact) {
          await dispatch(updateContact({ id: editingContact._id, contactData: formData }))
          setOverlay({
            open: true,
            variant: 'success',
            title: 'Contact Updated',
            message: 'The contact has been updated successfully.'
          })
        } else {
          await dispatch(createContact(formData))
          setOverlay({
            open: true,
            variant: 'success',
            title: 'Contact Created',
            message: 'The contact has been added successfully.'
          })
        }
        dispatch(getActivities({}))
        closeModal()
      } catch (error) {
        setOverlay({
          open: true,
          variant: 'error',
          title: 'Error',
          message: error.message || 'Something went wrong. Please try again.'
        })
      }
    }
  }

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteContact(id))
      dispatch(getActivities({}))
      setDeleteConfirm(null)
      setOverlay({
        open: true,
        variant: 'success',
        title: 'Contact Deleted',
        message: 'The contact has been deleted successfully.'
      })
    } catch (error) {
      setOverlay({
        open: true,
        variant: 'error',
        title: 'Error',
        message: error.message || 'Failed to delete contact. Please try again.'
      })
    }
  }

  const handleExport = () => {
    dispatch(exportContacts())
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'lead': return 'bg-yellow-100 text-yellow-800'
      case 'prospect': return 'bg-blue-100 text-blue-800'
      case 'customer': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getActivityIcon = (action) => {
    switch (action) {
      case 'create': return <Plus className="h-4 w-4 text-green-600" />
      case 'update': return <Edit2 className="h-4 w-4 text-blue-600" />
      case 'delete': return <Trash2 className="h-4 w-4 text-red-600" />
      case 'login': return <User className="h-4 w-4 text-purple-600" />
      default: return <Activity className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Contacts</h1>
              <p className="text-sm text-gray-500">Manage your customer contacts</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowActivities(!showActivities)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                {showActivities ? 'Hide Activities' : 'View Activities'}
              </button>
              <button
                onClick={handleExport}
                className="px-4 py-2 bg-primary-100 text-primary-700 rounded-lg hover:bg-primary-200 transition-colors text-sm font-medium flex items-center gap-2"
              >
                <Download className="h-4 w-4" />
                Export CSV
              </button>
              <button
                onClick={() => openModal()}
                className="px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </button>
            </div>
          </div>

          {/* Search and Filter */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={search}
                  onChange={handleSearch}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>
              <select
                value={status}
                onChange={handleStatusFilter}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="lead">Lead</option>
                <option value="prospect">Prospect</option>
                <option value="customer">Customer</option>
              </select>
            </div>
          </div>

          {/* Activities Panel */}
          {showActivities && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6 animate-fadeIn">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activities</h2>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-sm">No activities yet</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity._id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-lg">{getActivityIcon(activity.action)}</span>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Contacts Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {loading ? (
              <div className="p-8 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
              </div>
            ) : contacts.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No contacts found. Add your first contact!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-primary-50 to-secondary-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {contacts.map((contact) => (
                      <tr key={contact._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{contact.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{contact.phone || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{contact.company || '-'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(contact.status)}`}>
                            {contact.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => openModal(contact)}
                            className="text-primary-600 hover:text-primary-900 mr-3 inline-flex items-center gap-1"
                          >
                            <Edit2 className="h-4 w-4" />
                            Edit
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(contact._id)}
                            className="text-red-600 hover:text-red-900 inline-flex items-center gap-1"
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200">
                <ReactPaginate
                  previousLabel="Previous"
                  nextLabel="Next"
                  pageCount={totalPages}
                  onPageChange={handlePageChange}
                  containerClassName="flex justify-center gap-2"
                  pageClassName="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                  pageLinkClassName="text-gray-700"
                  previousClassName="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                  nextClassName="px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50"
                  activeClassName="bg-primary-500 text-white border-primary-500"
                  forcePage={currentPage - 1}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={closeModal}></div>
              <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 z-10 animate-fadeIn">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                {editingContact ? 'Edit Contact' : 'Add New Contact'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className={`mt-1 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  >
                    <option value="lead">Lead</option>
                    <option value="prospect">Prospect</option>
                    <option value="customer">Customer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    rows={3}
                    className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                  >
                    {editingContact ? 'Update' : 'Add'} Contact
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="fixed inset-0 bg-black opacity-50" onClick={() => setDeleteConfirm(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 z-10 animate-fadeIn">
              <h2 className="text-xl font-bold text-gray-900 mb-2">Delete Contact</h2>
              <p className="text-gray-600 mb-6">Are you sure you want to delete this contact? This action cannot be undone.</p>
              <div className="flex gap-3">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDelete(deleteConfirm)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Status Overlay for success/error messages */}
      <StatusOverlay
        open={overlay.open}
        variant={overlay.variant}
        title={overlay.title}
        message={overlay.message}
        onClose={() => setOverlay({ ...overlay, open: false })}
        autoDismissMs={3000}
      />
    </div>
  )
}

export default Dashboard

