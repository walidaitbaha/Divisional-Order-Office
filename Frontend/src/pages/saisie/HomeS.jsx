import React, { useEffect, useState } from "react";
import { Button } from "../../components/UI/Button";
import { getMessages } from "../../services/messageService";
import { FiFile, FiPlus, FiChevronRight } from "react-icons/fi";
import { MessageModalWrapper } from "../../components/Modals/MessageModalWrapper";

export const HomeS = () => {
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState("");

  const fetchMessages = async (currentPage = 1) => {
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
    const matchesType = filterType
      ? msg.type?.toLowerCase().includes(filterType.toLowerCase())
      : true;

    return matchesType;
  });

  useEffect(() => {
    fetchMessages(page);
  }, [page]);

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen text-right" dir="rtl">
      <MessageModalWrapper
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={() => fetchMessages(page)}
      />

      {/* Header */}
      <div className="flex justify-between items-center py-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-indigo-50">
            <FiFile className="text-indigo-600 w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              الرسائل الواردة والصادرة 
            </h1>
            <span className="text-xs text-gray-500 font-medium">
              {messages.length} رسالة
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4">
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

          <Button
            text="رسالة جديدة"
            width="w-28"
            onClick={() => setShowModal(true)}
            className="h-7 px-2.5 py-0.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-all ring-1 ring-indigo-100 hover:ring-indigo-200"
            icon={
              <FiPlus className="w-3 h-3 transform transition-transform group-hover:rotate-90" />
            }
          />
        </div>
      </div>

      {/* Messages Table */}
<div className="overflow-x-auto mt-6 bg-white rounded-lg shadow-sm border border-gray-100">
  {filteredMessages.length === 0 ? (
    <div className="text-center p-12">
      <div className="text-gray-400 mb-4">
        <FiFile className="w-16 h-16 mx-auto" />
      </div>
      <p className="text-gray-500 text-lg">لا توجد رسائل متاحة</p>
    </div>
  ) : (
    <table className="min-w-full text-sm text-right text-gray-700">
      <thead className="bg-gray-50 text-xs text-gray-500 font-semibold border-b">
        <tr>
          <th className="px-4 py-3">#الرقم</th>
          <th className="px-4 py-3">المرجع</th>
          <th className="px-4 py-3">الموضوع</th>
          <th className="px-4 py-3">النوع</th>
          <th className="px-4 py-3">المرسل/المستلم</th>
          <th className="px-4 py-3">تاريخ الإرسال</th>
          <th className="px-4 py-3">تاريخ الاستلام</th>
          <th className="px-4 py-3">الملف</th>
        </tr>
      </thead>
      <tbody>
        {filteredMessages.map((msg) => (
          <tr key={msg.id} className="border-t hover:bg-gray-50">
            <td className="px-4 py-2 font-mono text-indigo-600">#{msg.num}</td>
            <td className="px-4 py-2">{msg.ref || "-"}</td>
            <td className="px-4 py-2">{msg.objet}</td>
            <td className="px-4 py-2">
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
            <td className="px-4 py-2">{msg.exp_des?.name || "-"}</td>
            <td className="px-4 py-2">{msg.date_envoi}</td>
            <td className="px-4 py-2">{msg.date_reception}</td>
            <td className="px-4 py-2">
              {msg.fichier_path && (
                <a
                  href={msg.fichier_path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <FiFile className="w-4 h-4" />
                  <FiChevronRight className="w-3 h-3" />
                </a>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )}
</div>


      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              السابق
            </button>
            <span className="px-4 py-2 border-t border-b border-gray-300 text-gray-700">
              الصفحة {page} من {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              التالي
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};
