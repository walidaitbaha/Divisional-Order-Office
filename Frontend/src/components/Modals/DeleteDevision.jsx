import React, { useState } from 'react';
import { deleteDevision } from '../../services/devisionServices';
import { Notification } from '../Layout/Notification';

export const DeleteDevision = ({ onClose, refreshData, divisionId }) => {
  const [notification, setNotification] = useState(null);

  const handleDelete = async () => {
    try {
      const response = await deleteDevision(divisionId);
      setNotification({ message: response.data.message, type: 'success' });
      setTimeout(() => {
        onClose();
      }, 3000);
      refreshData();
    } catch (error) {
      setNotification({ message: 'حدث خطأ أثناء الحذف', type: 'error' });
      console.error('حدث خطأ أثناء حذف المصلحة:', error);
    }
  };

  return (
    <div dir="rtl" className="fixed inset-0 bg-black/30 backdrop-blur-sm bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">حذف المصلحة</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        <p className="mb-6 text-gray-600">
          هل أنت متأكد من أنك تريد حذف هذه المصلحة؟ هذه العملية لا يمكن التراجع عنها.
        </p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            إلغاء
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            تأكيد الحذف
          </button>
        </div>
      </div>
      {notification && (<Notification message={notification.message} type={notification.type} />)}
    </div>
  );
};
