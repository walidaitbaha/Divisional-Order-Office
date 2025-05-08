import React, { useEffect, useState } from "react";
import { deleteMessage, getMessages } from "../../services/messageService";
import { format } from "date-fns";
import { FiChevronRight, FiEdit, FiFile, FiTrash2 } from "react-icons/fi";
import { EditMessage } from "../../components/Modals/EditMessage";
import { DeleteMessage } from "../../components/Modals/DeleteMessage";
import { Notification } from "../../components/Layout/Notification";

export const HomeC = () => {
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [notification, setNotification] = useState();
  const [filterDate, setFilterDate] = useState("");
  const [filterType, setFilterType] = useState("");

  const getMessageOfDevision_FUNCTION = async (currentPage = 1) => {
    try {
      const response = await getMessages(currentPage);
      setMessages(response.data.messages.data);
      setPage(response.data.messages.current_page);
      setTotalPages(response.data.messages.last_page);
    } catch (err) {
      console.error(err);
    }
  };

  const filteredMessages = messages.filter((msg) => {
    const matchesDate = filterDate
      ? format(new Date(msg.date_envoi), "yyyy-MM-dd") === filterDate
      : true;

    const matchesType = filterType
      ? msg.type?.toLowerCase().includes(filterType.toLowerCase())
      : true;

    return matchesDate && matchesType;
  });

  const updateMessage_FUNCTION = async () => {
    try {
      await getMessageOfDevision_FUNCTION(page);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage_FUNCTION = async () => {
    if (!messageToDelete) return;

    try {
      const response = await deleteMessage(messageToDelete.id);
      setShowDeleteModal(false);
      setMessageToDelete(null);
      await getMessageOfDevision_FUNCTION(page);
      setNotification({ message: response.data.message, type: "success" });
      setTimeout(() => {
        setNotification(null);
      }, 3000);
    } catch {
      setNotification({ message: "حدث خطأ أثناء الحذف", type: "error" });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "غير محدد";
    return format(new Date(dateString), "dd MMM yyyy");
  };

  useEffect(() => {
    getMessageOfDevision_FUNCTION(page);
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen text-right">
      {/* العنوان الرئيسي */}
      <div className="flex justify-between items-center py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-indigo-50">
            <FiFile className="text-indigo-600 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              رسائل مكتب الضبط
            </h1>
            <span className="text-xs text-gray-500 font-medium">
              {messages.length} رسالة
            </span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mt-6 mb-4">
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">تاريخ الإرسال</label>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-right"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm text-gray-600 mb-1">type</label>
            <select
              type="text"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-right"
            >
              <option value="">الكل</option>
              <option value="entrant">وارد</option>
              <option value="sortant">صادر</option>
            </select>
          </div>
        </div>
      </div>

      {/* شبكة الرسائل */}
      {/* جدول الرسائل */}
<div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-sm border border-gray-100">
  {filteredMessages.length === 0 ? (
    <div className="text-center p-12">
      <div className="text-gray-400 mb-4">
        <FiFile className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-gray-500 text-lg">لا توجد رسائل متاحة</p>
    </div>
  ) : (
    <table className="min-w-full text-sm text-right text-gray-600">
      <thead className="bg-gray-50 text-gray-700 text-xs">
        <tr>
          <th className="px-4 py-3">#الرقم</th>
          <th className="px-4 py-3">المرجع</th>
          <th className="px-4 py-3">الموضوع</th>
          <th className="px-4 py-3">النوع</th>
          <th className="px-4 py-3">المستلم/المرسل</th>
          <th className="px-4 py-3">تاريخ الإرسال</th>
          <th className="px-4 py-3">تاريخ الاستلام</th>
          <th className="px-4 py-3">الملف</th>
          <th className="px-4 py-3">إجراءات</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100 bg-white">
        {filteredMessages.map((msg) => (
          <tr key={msg.id} className="hover:bg-gray-50 transition-colors">
            <td className="px-4 py-3 font-mono text-indigo-600">#{msg.num}</td>
            <td className="px-4 py-3">{msg.ref || "-"}</td>
            <td className="px-4 py-3">{msg.objet}</td>
            <td className="px-4 py-3">
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold ${
                  msg.type === "entrant"
                    ? "bg-green-100 text-green-700"
                    : "bg-blue-100 text-blue-700"
                }`}
              >
                {msg.type === "entrant" ? "وارد" : "صادر"}
              </span>
            </td>
            <td className="px-4 py-3">{msg.exp_des?.name || "-"}</td>
            <td className="px-4 py-3">{formatDate(msg.date_envoi)}</td>
            <td className="px-4 py-3">{formatDate(msg.date_reception)}</td>
            <td className="px-4 py-3">
              {msg.fichier_path && (
                <a
                  href={msg.fichier_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <FiFile className="w-4 h-4" />
                </a>
              )}
            </td>
            <td className="px-4 py-3 flex gap-2">
              <button
                onClick={() => {
                  setSelectedMessage(msg);
                  setShowEditModal(true);
                }}
                className="text-gray-400 hover:text-indigo-600"
              >
                <FiEdit className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setMessageToDelete(msg);
                  setShowDeleteModal(true);
                }}
                className="text-gray-400 hover:text-red-600"
              >
                <FiTrash2 className="w-4 h-4" />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


      {/* التنقل بين الصفحات */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              السابق
            </button>
            <span className="px-4 py-2 border-t border-b border-gray-300 text-gray-700">
              الصفحة {page} من {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              التالي
            </button>
          </nav>
        </div>
      )}

      {/* نافذة التعديل */}
      {showEditModal && selectedMessage && (
        <EditMessage
          message={selectedMessage}
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false);
            setSelectedMessage(null);
          }}
          onSave={updateMessage_FUNCTION}
        />
      )}

      {/* نافذة الحذف */}
      <DeleteMessage
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setMessageToDelete(null);
        }}
        onConfirm={deleteMessage_FUNCTION}
        message={messageToDelete}
      />

      {/* الإشعار */}
      {notification && notification.message && (
        <Notification message={notification.message} type={notification.type} />
      )}
    </div>
  );
};
