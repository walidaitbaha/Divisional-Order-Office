import React, { useEffect, useState } from "react";
import { FiFile, FiX } from "react-icons/fi";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Button } from "../UI/Button";
import { addMessages } from "../../services/messageService";
import { Notification } from "../Layout/Notification";
import { getDesExp } from "../../services/ExpDesServices";

export const AddMessage = ({ isOpen, onClose, onSuccess, selectedType }) => {
  const initialFormState = {
    num: "",
    ref: "",
    objet: "",
    type: selectedType,
    date_reception: "",
    date_envoi: "",
    exp_des_id: "",
    fichier_path: null,
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState({ message: "", type: "" });
  const [expDesList, setExpDesList] = useState([]);
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setErrors({});

    if (name === "fichier_path") {
      setForm({ ...form, [name]: files?.[0] || null });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("num", form.num);
      formData.append("ref", form.ref);
      formData.append("objet", form.objet);
      formData.append("type", form.type);
      if (form.date_reception)
        formData.append("date_reception", form.date_reception);
      if (form.date_envoi) formData.append("date_envoi", form.date_envoi);
      if (form.exp_des_id) formData.append("exp_des_id", form.exp_des_id);
      if (form.fichier_path) formData.append("fichier_path", form.fichier_path);

      await addMessages(formData);
      setForm(initialFormState);
      setNotification({ message: "تم إرسال الرسالة بنجاح!", type: "success" });
      onSuccess();
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch {
        setNotification({ message: "حدث خطأ أثناء الإرسال", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (notification.message) {
      const timer = setTimeout(() => {
        setNotification({ message: "", type: "" });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [notification.message]);

  useEffect(() => {
    const fetchExpDes = async () => {
      try {
        const response = await getDesExp();
        setExpDesList(response.data.exp_des);
      } catch (error) {
        console.error("Error fetching exp_des list", error);
      }
    };
    fetchExpDes();
  }, []);

  if (!isOpen) return null;

  return (
    <div
      dir="rtl"
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-100 transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
          رسالة جديدة
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-lg hover:bg-gray-50"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <Label text="الرقم *" />
              <Input
                type="text"
                name="num"
                value={form.num}
                onChange={handleChange}
                error={errors.num}
              />
            </div>

            <div className="space-y-1">
              <Label text="المرجع" />
              <Input
                type="text"
                name="ref"
                value={form.ref}
                onChange={handleChange}
                error={errors.ref}
              />
            </div>

            <div className="space-y-1">
              <Label text="الموضوع *" />
              <Input
                type="text"
                name="objet"
                value={form.objet}
                onChange={handleChange}
                error={errors.objet}
              />
            </div>

            <div className="space-y-1">
              <Label text="تاريخ الإرسال" />
              <Input
                type="date"
                name="date_envoi"
                value={form.date_envoi}
                onChange={handleChange}
                error={errors.date_envoi}
              />
            </div>

            <div className="space-y-1">
              <Label text="تاريخ الاستلام" />
              <Input
                type="date"
                name="date_reception"
                value={form.date_reception}
                onChange={handleChange}
                error={errors.date_reception}
              />
            </div>

            <div className="space-y-1">
              {form.type === "entrant"? (
                <Label text="المرسل *" />
              ) : (
                <Label text="المستلم *" />
              )}
              <div className="relative">
                <select
                  name="exp_des_id"
                  value={form.exp_des_id}
                  onChange={handleChange}
                  className="block w-full appearance-none bg-white border border-gray-300 text-gray-800 px-4 py-2 pr-8 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                >
                  <option value="">اختر</option>
                  {Array.isArray(expDesList) &&
                    expDesList.map((item) => (
                      <option key={item.id} value={item.id}>
                        {item.name}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center px-2 text-gray-400">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
              {errors.exp_des_id && (
                <p className="text-red-500 text-sm mt-1">{errors.exp_des_id}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <Label text="الملف المرفق" />
              <div className="flex items-center gap-4">
                <label className="block w-full cursor-pointer">
                  <input
                    type="file"
                    name="fichier_path"
                    onChange={handleChange}
                    className="sr-only"
                    id="file-upload"
                  />
                  <div className="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors flex items-center justify-center gap-2">
                    <FiFile className="w-5 h-5 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {form.fichier_path
                        ? form.fichier_path.name
                        : "اسحب الملف هنا أو انقر للتحميل"}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Button
              text="إلغاء"
              onClick={onClose}
              className="text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg border border-gray-300 transition-colors"
            />
            <Button
              text={loading ? "جاري الإرسال..." : "إرسال الرسالة"}
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              icon={
                loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiFile className="w-4 h-4" />
                )
              }
            />
          </div>
          {notification.message && (
            <Notification
              message={notification.message}
              type={notification.type}
            />
          )}
        </form>
      </div>
    </div>
  );
};
