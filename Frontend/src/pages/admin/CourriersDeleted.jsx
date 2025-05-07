import React, { useEffect, useState } from 'react';
import { getMessageDeleted } from '../../services/messageService';
import { getDevisions } from '../../services/devisionServices';
import { FiChevronLeft, FiFile } from 'react-icons/fi';

export const CourriersDeleted = () => {
  const [deletedMessages, setDeletedMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");

  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await getDevisions();
        setDivisions(response.data.Devisions || []);
      } catch {
        setError("فشل في تحميل الأقسام");
      }
    };
    fetchDivisions();
  }, []);

  useEffect(() => {
    const fetchDeletedMessages = async () => {
      if (!selectedDivisionId) return;
      try {
        setLoading(true);
        const response = await getMessageDeleted(selectedDivisionId);
        console.log(response.data);
        const data = response?.data?.messages?.data || [];
        setDeletedMessages(data);
        setError(null);
      } catch {
        setError("فشل في تحميل المراسلات المحذوفة");
        setDeletedMessages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchDeletedMessages();
  }, [selectedDivisionId]);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200" dir="rtl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            المراسلات المحذوفة الخاصة بالقسم
          </h3>
          <select
            value={selectedDivisionId}
            onChange={(e) => setSelectedDivisionId(e.target.value)}
            className="w-64 px-3 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">اختيار قسم</option>
            {divisions.map((division) => (
              <option key={division.id} value={division.id}>
                {division.name}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        {loading && (
          <div className="text-center py-4 text-blue-500">جارٍ التحميل...</div>
        )}

        {selectedDivisionId && !loading && (
          <div className="overflow-x-auto">
            {deletedMessages.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الرقم</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">المرجع</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الموضوع</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">النوع</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">أنشئ بواسطة</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">الملف</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {deletedMessages.map((courrier) => (
                    <tr key={courrier.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{courrier.num}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-600">{courrier.ref}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{courrier.objet}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {courrier.type === "entrant" ? "وارد" : "صادر"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{courrier.created_by}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {courrier.fichier_path ? (
                          <a
                            href={courrier.fichier_path}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                          >
                            <FiFile className="w-4 h-4" />
                            <FiChevronLeft className="w-3 h-3" />
                          </a>
                        ) : (
                          <span className="text-gray-400">لا يوجد</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                لا توجد مراسلات محذوفة لهذا القسم
              </div>
            )}
          </div>
        )}

        {!selectedDivisionId && !loading && (
          <div className="text-center py-8 text-gray-500">
            يرجى اختيار قسم لعرض المراسلات المحذوفة
          </div>
        )}
      </div>
    </div>
  );
};
