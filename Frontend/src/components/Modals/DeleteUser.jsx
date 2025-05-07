import React, { useState } from 'react'
import { deleteUser } from '../../services/userService'

export const DeleteUser = ({ userId, onClose, refreshData }) => {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async () => {
    try {
      setIsDeleting(true)
      await deleteUser(userId)
      refreshData()
      onClose()
    } catch (error) {
      setError(error.response?.data?.message || 'فشل في حذف المستخدم')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md rtl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">حذف المستخدم</h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            disabled={isDeleting}
          >
            ✕
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          هل أنت متأكد من أنك تريد حذف هذا المستخدم؟ هذه العملية لا يمكن التراجع عنها.
        </p>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            disabled={isDeleting}
          >
            إلغاء
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
            disabled={isDeleting}
          >
            {isDeleting ? 'جاري الحذف...' : 'تأكيد الحذف'}
          </button>
        </div>
      </div>
    </div>
  )
}
