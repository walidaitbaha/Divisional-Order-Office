import React, { useState, useEffect } from 'react'
import { register } from '../../services/authServices'
import { getDevisions } from '../../services/devisionServices'
import { Notification } from '../Layout/Notification'

export const AddUser = ({ onClose, refreshData }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: 'agent',
    division_id: ''
  })
  const [divisions, setDivisions] = useState([])
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await getDevisions()
        setDivisions(response.data.Devisions)
      } catch (error) {
        console.error('Error fetching divisions:', error)
      }
    }
    fetchDivisions()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    
    try {
      await register(formData)
      refreshData()
      onClose()
      setNotification({ message: 'User created successfully', type: 'success' })
    } catch (error) {
      setNotification({ message: 'Error creating user', type: 'error' })
      console.error('Error creating user:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md rtl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">إضافة مستخدم جديد</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">الاسم الكامل</label>
            <input
              type="text"
              required
              className={`mt-1 block w-full rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} shadow-sm`}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">البريد الإلكتروني</label>
            <input
              type="email"
              required
              className={`mt-1 block w-full rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} shadow-sm`}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">كلمة المرور</label>
            <input
              type="password"
              required
              minLength="8"
              className={`mt-1 block w-full rounded-md ${errors.password ? 'border-red-500' : 'border-gray-300'} shadow-sm`}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">تأكيد كلمة المرور</label>
            <input
              type="password"
              required
              className={`mt-1 block w-full rounded-md ${errors.password_confirmation ? 'border-red-500' : 'border-gray-300'} shadow-sm`}
              value={formData.password_confirmation}
              onChange={(e) => setFormData({ ...formData, password_confirmation: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">الدور</label>
            <select
              required
              className={`mt-1 block w-full rounded-md ${errors.role ? 'border-red-500' : 'border-gray-300'} shadow-sm`}
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="agent">وكيل</option>
              <option value="chef_division">رئيس قسم</option>
              <option value="saisie">كتابة</option>
              <option value="admin">مسؤول</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">القسم</label>
            <select
              className={`mt-1 block w-full rounded-md ${errors.division_id ? 'border-red-500' : 'border-gray-300'} shadow-sm`}
              value={formData.division_id}
              onChange={(e) => setFormData({ ...formData, division_id: e.target.value })}
            >
              <option value="">اختر القسم</option>
              {divisions.map(division => (
                <option key={division.id} value={division.id}>{division.name}</option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              disabled={isLoading}
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={isLoading}
            >
              {isLoading ? 'جاري الإنشاء...' : 'إنشاء مستخدم'}
            </button>
          </div>
        </form>
      </div>
      {notification && <Notification message={notification.message} type={notification.type}/>}
    </div>
  )
}
