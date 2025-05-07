import React, { useEffect, useState } from "react";
import { getDevisions } from "../../services/devisionServices";
import { format } from "date-fns";
import { AddDevision } from "../../components/Modals/AddDevision";
import { EditDevision } from "../../components/Modals/EditDevision";
import { DeleteDevision } from "../../components/Modals/DeleteDevision";
import { FiEdit, FiTrash2 } from "react-icons/fi";

export const Devisions = () => {
  const [divisions, setDivisions] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const getDevisions_FUNCTION = async () => {
    try {
      const response = await getDevisions();
      setDivisions(response.data.Devisions);
    } catch (error) {
      console.error("Error fetching divisions:", error);
    }
  };

  useEffect(() => {
    getDevisions_FUNCTION();
  }, []);

  return (
    <div dir="rtl" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">إدارة المصالح</h1>
          <p className="mt-2 text-sm text-gray-500">
            قائمة بجميع المصالح التنظيمية
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          إضافة مصلحة جديدة
        </button>
      </div>

      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 text-right">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                الاسم
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                الوصف
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                تاريخ الإضافة
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                الإجراءات
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {divisions.map((division) => (
              <tr key={division.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {division.name}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                  {division.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {format(new Date(division.created_at), "yyyy/MM/dd")}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => {
                      setSelectedDivision(division);
                      setShowEditModal(true);
                    }}
                    className="text-blue-600 hover:text-blue-900 ml-4"
                  >
                    <FiEdit />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedDivision(division);
                      setShowDeleteModal(true);
                    }}
                    className="text-red-600 hover:text-red-900"
                  >
                     <FiTrash2 />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {divisions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            لا توجد مصالح. أضف مصلحة للبدء.
          </div>
        )}
      </div>

      {showAddModal && (
        <AddDevision
          onClose={() => setShowAddModal(false)}
          refreshData={getDevisions_FUNCTION}
        />
      )}
      {showEditModal && (
        <EditDevision
          onClose={() => {
            setShowEditModal(false);
            setSelectedDivision(null);
          }}
          refreshData={getDevisions_FUNCTION}
          division={selectedDivision}
        />
      )}
      {showDeleteModal && (
        <DeleteDevision
          onClose={() => {
            setShowDeleteModal(false);
            setSelectedDivision(null);
          }}
          refreshData={getDevisions_FUNCTION}
          divisionId={selectedDivision?.id}
        />
      )}
    </div>
  );
};
