import React, { useEffect, useState } from "react";
import { FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { Input } from '../../components/UI/Input';
import { Button } from '../../components/UI/Button';
import { Notification } from "../../components/Layout/Notification";
import { addExpDes, deleteExpDes, getDesExp, updateExpDes } from "../../services/ExpDesServices";

export const ExpDes = () => {
  const [list, setList] = useState([]);
  const [newName, setNewName] = useState("");
  const [editingName, setEditingName] = useState("");
  const [notification, setNotification] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchList = async () => {
    try {
      const res = await getDesExp();
      setList(res.data.exp_des);
    } catch {
      setNotification({ type: "error", message: "Failed to load data" });
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await addExpDes({ name: newName });
      setNewName("");
      fetchList();
      setNotification({ type: "success", message: "تمت الإضافة بنجاح" });
    } catch{
      setNotification({ type: "error", message: "فشل في الإضافة" });
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold"> الإدارات الخارجية </h2>

      <div className="flex gap-4">
        <Input
          placeholder="اسم جديد"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button icon={<FiPlus />} text="إضافة" onClick={handleCreate} />
      </div>

      <div className="space-y-3 mt-4">
        {list.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-gray-50 border p-3 rounded-lg">
            <span>{item.name}</span>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setEditingName(item.name);
                  setShowEditModal(true);
                }}
                className="text-blue-500 hover:text-blue-700"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => {
                  setSelectedItem(item);
                  setShowDeleteModal(true);
                }}
                className="text-red-500 hover:text-red-700"
              >
                <FiTrash2 />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {showEditModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">تعديل الاسم</h3>
            <Input
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button text="إلغاء" onClick={() => setShowEditModal(false)} />
              <Button
                text="حفظ"
                onClick={async () => {
                  try {
                    await updateExpDes({ name: editingName }, selectedItem.id);
                    setShowEditModal(false);
                    setEditingName("");
                    setSelectedItem(null);
                    fetchList();
                    setNotification({ type: "success", message: "تم التحديث" });
                  } catch {
                    setNotification({ type: "error", message: "فشل في التحديث" });
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md text-center">
            <h3 className="text-lg font-semibold mb-4">تأكيد الحذف</h3>
            <p>هل أنت متأكد أنك تريد حذف "{selectedItem.name}"؟</p>
            <div className="flex justify-center gap-4 mt-6">
              <Button text="إلغاء" onClick={() => setShowDeleteModal(false)} />
              <Button
                text="حذف"
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={async () => {
                  try {
                    await deleteExpDes(selectedItem.id);
                    setShowDeleteModal(false);
                    setSelectedItem(null);
                    fetchList();
                    setNotification({ type: "success", message: "تم الحذف" });
                  } catch {
                    setNotification({ type: "error", message: "فشل في الحذف" });
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}

      {notification && <Notification type={notification.type} message={notification.message} />}
    </div>
  );
};
