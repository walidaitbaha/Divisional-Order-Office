import React from "react";

export const DeleteMessage = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen || !message) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div dir="rtl" className="bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          حذف الرسالة
        </h2>
        <p className="text-gray-600 mb-6">
          هل أنت متأكد أنك تريد حذف الرسالة <strong>#{message.num}</strong>؟
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm bg-red-600 text-white rounded hover:bg-red-700"
          >
            حذف
          </button>
        </div>
      </div>
    </div>
  );
};
