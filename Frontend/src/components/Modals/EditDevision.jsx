import React, { useState, useEffect } from 'react';
import { updateDevision } from '../../services/devisionServices';
import { Notification } from '../Layout/Notification';

export const EditDevision = ({ onClose, refreshData, division }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    if (division) {
      setFormData({
        name: division.name,
        description: division.description
      });
    }
  }, [division]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateDevision(division.id, formData);
      setNotification({ message: response.data.message, type: 'success' });
      setTimeout(() => {
        onClose();
      }, 3000);
      refreshData();
    } catch (error) {
      setNotification({ message: 'حدث خطأ أثناء تعديل المصلحة', type: 'error' });
      console.error('حدث خطأ أثناء تعديل المصلحة:', error);
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">تعديل المصلحة</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border rounded-md"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الوصف
            </label>
            <textarea
              className="w-full px-3 py-2 border rounded-md"
              rows="3"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              حفظ التعديلات
            </button>
          </div>

          {notification && (
            <Notification message={notification.message} type={notification.type} />
          )}
        </form>
      </div>
    </div>
  );
};
