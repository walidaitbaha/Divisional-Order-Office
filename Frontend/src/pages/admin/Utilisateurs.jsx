import React, { useEffect, useState } from 'react'
import { filterUsersByRole, getUsers } from '../../services/userService'
import { AddUser } from '../../components/Modals/AddUser'
import { EditUser } from '../../components/Modals/EditUser'
import { DeleteUser } from '../../components/Modals/DeleteUser'
import { FiEdit, FiTrash2 } from 'react-icons/fi'

export const Utilisateurs = () => {
  const [users, setUsers] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedRole, setSelectedRole] = useState('')

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [from, setFrom] = useState(0)
  const [to, setTo] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

  const fetchUsers = async (page = 1) => {
    setLoading(true)
    try {
      const response = await getUsers(page)
      setUsers(response.data.users.data)
      setCurrentPage(response.data.users.current_page)
      setTotalPages(response.data.users.last_page)
      setFrom(response.data.users.from)
      setTo(response.data.users.to)
      setTotalUsers(response.data.users.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const filterUsersByRole_FUNCTION = async (role) => {
    setLoading(true)
    try{
        const response = await filterUsersByRole(role, currentPage)
        setUsers(response.data.users.data)
        setCurrentPage(response.data.users.current_page)
        setTotalPages(response.data.users.last_page)
        setFrom(response.data.users.from)
        setTo(response.data.users.to)
        setTotalUsers(response.data.users.total)
        setLoading(false)
        setError(null)
    }catch(err){
        setError(err.message)
  }
}

  useEffect(() => {
    if (selectedRole === '') {
      fetchUsers(1); // Show all users
    } else {
      filterUsersByRole_FUNCTION(selectedRole);
    }
  }, [selectedRole])

  if (loading) return <div className="text-center py-8">Loading users...</div>
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8" dir="rtl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المستخدمين</h1>
          <p className="mt-2 text-sm text-gray-500">إدارة المستخدمين والصلاحيات في النظام</p>
        </div>
        <div className="w-full sm:w-auto flex flex-col sm:flex-row gap-3">
          <select
            className="px-4 py-2 border rounded-md"
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            <option value="">جميع المستخدمين</option>
            <option value="admin">admin</option>
            <option value="saisie">saisie</option>
            <option value="chef_division">chef division</option>
          </select>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          >
            إضافة مستخدم جديد
          </button>
        </div>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الاسم</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">البريد الإلكتروني</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الدور</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">القسم</th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-center text-gray-500">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full`}>
                    {user.devisions?.name ?? '—'}
                  </span>
                </td>
  
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-center gap-3 flex justify-center">
                  <button
                    onClick={() => {
                      setSelectedUser(user)
                      setShowEditModal(true)
                    }}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user)
                      setShowDeleteModal(true)
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                     <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => fetchUsers(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              السابق
            </button>
            <button
              onClick={() => fetchUsers(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              التالي
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                عرض <span className="font-medium">{from}</span> إلى{' '}
                <span className="font-medium">{to}</span> من{' '}
                <span className="font-medium">{totalUsers}</span> النتائج
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                <button
                  onClick={() => fetchUsers(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">السابق</span>
                  &lt;
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => fetchUsers(page)}
                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => fetchUsers(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  <span className="sr-only">التالي</span>
                  &gt;
                </button>
              </nav>
            </div>
          </div>
        </div>

        {users.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {selectedRole ? 'لا توجد مستخدمين مطابقة' : 'لا توجد مستخدمين'}
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddUser
          onClose={() => setShowAddModal(false)}
          refreshData={fetchUsers}
        />
      )}

      {showEditModal && (
        <EditUser
          user={selectedUser}
          onClose={() => {
            setShowEditModal(false)
            setSelectedUser(null)
          }}
          refreshData={fetchUsers}
        />
      )}

      {showDeleteModal && (
        <DeleteUser
          userId={selectedUser?.id}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedUser(null)
          }}
          refreshData={fetchUsers}
        />
      )}
    </div>
  )
}
