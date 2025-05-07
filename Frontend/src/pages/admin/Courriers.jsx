import React, { useEffect, useState } from "react";
import { getMessagesofDevision } from "../../services/messageService";
import { getDevisions } from "../../services/devisionServices"; // Import divisions service
import { FiChevronLeft, FiFile } from "react-icons/fi";  // Changed Chevron icon for RTL direction

export const Courriers = () => {
  const [courriers, setCourriers] = useState([]);
  const [divisions, setDivisions] = useState([]);
  const [selectedDivisionId, setSelectedDivisionId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch divisions on component mount
  useEffect(() => {
    const fetchDivisions = async () => {
      try {
        const response = await getDevisions();
        setDivisions(response.data.Devisions);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchDivisions();
  }, []);

  // Fetch messages when division selection changes
  useEffect(() => {
    const fetchCourriers = async () => {
      if (!selectedDivisionId) return;

      try {
        setIsLoading(true);
        const response = await getMessagesofDevision(selectedDivisionId);
        setCourriers(response.data.messages);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourriers();
  }, [selectedDivisionId]);

  if (isLoading) return <div className="text-center py-4">جارٍ التحميل...</div>;
  if (error) return <div className="text-red-500 p-4">خطأ: {error}</div>;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200" dir="rtl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            المراسلات الخاصة بالقسم
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

        {selectedDivisionId ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الرقم
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    المرجع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الموضوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    النوع
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    من أرسل
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    الملف
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {courriers.map((courrier) => (
                  <tr
                    key={courrier.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {courrier.num}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-600">
                      {courrier.ref}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">
                      {courrier.objet}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {courrier.type === "entrant" ? "وارد":"صادر"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {courrier.created_by}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      <a
                        href={courrier.fichier_path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <FiFile className="w-4 h-4" />
                        <FiChevronLeft className="w-3 h-3" /> {/* Adjusted icon for RTL */}
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {courriers.length === 0 && !isLoading && (
              <div className="text-center py-8 text-gray-500">
                لا توجد مراسلات للقسم المحدد
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            يرجى اختيار قسم لعرض المراسلات
          </div>
        )}
      </div>
    </div>
  );
};
