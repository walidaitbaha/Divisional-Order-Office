import React, { useState, useEffect } from "react";
import { FiFile, FiX, FiArrowDown, FiSave } from "react-icons/fi";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Button } from "../UI/Button";
import { updateMessage } from "../../services/messageService";
import { Notification } from "../Layout/Notification";
import { getDesExp } from "../../services/ExpDesServices";

export const EditMessage = ({ message, onClose, onSave }) => {
  const initialFormState = {
    num: "",
    ref: "",
    objet: "",
    type: "entrant",
    date_reception: "",
    date_envoi: "",
    exp_des_id: "",
    fichier_path: null,
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState();
  const [expDesList, setExpDesList] = useState([]);

  // Initialize form with message data
  useEffect(() => {
    if (message) {
      setForm({
        num: message.num,
        ref: message.ref,
        objet: message.objet,
        type: message.type || "entrant",
        date_reception: message.date_reception?.split(" ").join("T"),
        date_envoi: message.date_envoi?.split(" ").join("T"),
        exp_des_id: message.exp_des_id,
        fichier_path: message.fichier_path,
      });
    }
  }, [message]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setNotification(null);

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
      formData.append("_method", "PUT");

      const formFields = [
        "num",
        "ref",
        "objet",
        "type",
        "date_reception",
        "date_envoi",
        "exp_des_id",
      ];

      // Dynamically append form fields
      formFields.forEach((field) => {
        formData.append(field, form[field]);
      });

      // Check if fichier_path exists and is a file (not a string)
      if (form.fichier_path && typeof form.fichier_path !== "string") {
        formData.append("fichier_path", form.fichier_path);
      }

      // Update message on the server
      const response = await updateMessage(message.id, formData);
      console.log("response", response.data);
      setNotification({ message: response.data.message, type: "success" });
      setTimeout(() => {
        onSave();
        onClose();
      }, 3000);
    } catch (err) {
      setNotification({ type: "error", message: err.response?.data?.errors });
    } finally {
      setLoading(false);
    }
  };
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

  if (!message) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-100 transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            تعديل الرسالة #{message.num}
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
            {/* Keep similar fields as AddMessage but with existing values */}
            <div className="space-y-1">
              <Label text="الرقم *" />
              <Input
                type="text"
                name="num"
                value={form.num}
                onChange={handleChange}
                readOnly // Assuming num shouldn't be modified
              />
            </div>

            <div className="space-y-1">
              <Label text="المرجع" />
              <Input
                type="text"
                name="ref"
                value={form.ref}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label text="الموضوع *" />
              <Input
                type="text"
                name="objet"
                value={form.objet}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label text="النوع *" />
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                >
                  <option value="entrant">وارد</option>
                  <option value="sortant">صادر</option>
                </select>
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FiArrowDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label text="تاريخ الإرسال" />
              <Input
                type="date"
                name="date_envoi"
                value={form.date_envoi}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label text="تاريخ الاستلام" />
              <Input
                type="date"
                name="date_reception"
                value={form.date_reception}
                onChange={handleChange}
              />
            </div>

            <div className="space-y-1">
              <Label
                text={message.type === "entrant" ? "المرسل *" : "المستلم *"}
              />
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
                  <FiArrowDown className="w-4 h-4" />
                </div>
              </div>
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
                      {form.fichier_path?.name ||
                        (typeof form.fichier_path === "string"
                          ? "الملف الحالي: " +
                            form.fichier_path.split("/").pop()
                          : "اسحب الملف أو انقر لتحميله")}
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
              type="button"
              className="text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg border border-gray-300 transition-colors"
            />
            <Button
              text={loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
              type="submit"
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              icon={
                loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <FiSave className="w-4 h-4" />
                )
              }
            />
          </div>
          {notification && (
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
