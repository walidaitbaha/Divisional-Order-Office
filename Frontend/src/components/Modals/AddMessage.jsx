import React, { useState } from "react";
import { FiFile, FiX, FiArrowDown } from "react-icons/fi";
import { Input } from "../UI/Input";
import { Label } from "../UI/Label";
import { Button } from "../UI/Button";
import { addMessages } from "../../services/messageService";
import { Notification } from "../Layout/Notification";

export const AddMessage = ({ isOpen, onClose, onSuccess }) => {
  const initialFormState = {
    num: "",
    ref: "",
    objet: "",
    type: "entrant",
    date_reception: "",
    date_envoi: "",
    expediteur: "",
    destinataire: "",
    fichier_path: null,
    to_division_id: "",
  };

  const [form, setForm] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [notification, setNotification] = useState();
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
      formData.append("to_division_id", form.to_division_id);
      if (form.date_reception) formData.append("date_reception", form.date_reception);
      if (form.date_envoi) formData.append("date_envoi", form.date_envoi);
      if (form.expediteur) formData.append("expediteur", form.expediteur);
      if (form.destinataire) formData.append("destinataire", form.destinataire);
      if (form.fichier_path) formData.append("fichier_path", form.fichier_path);

      await addMessages(formData);
      setForm(initialFormState);
      onSuccess();
      onClose();
      setNotification("Message envoyé avec succès !");
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        alert("Erreur lors de l'envoi");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-gray-100 transform transition-all">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-semibold text-gray-900">
            Nouveau Message
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
              <Label text="Numéro *" />
              <Input
                type="text"
                name="num"
                value={form.num}
                onChange={handleChange}
                error={errors.num}
              />
            </div>

            <div className="space-y-1">
              <Label text="Référence" />
              <Input
                type="text"
                name="ref"
                value={form.ref}
                onChange={handleChange}
                error={errors.ref}
              />
            </div>

            <div className="space-y-1">
              <Label text="Objet *" />
              <Input
                type="text"
                name="objet"
                value={form.objet}
                onChange={handleChange}
                error={errors.objet}
              />
            </div>

            <div className="space-y-1">
              <Label text="Type *" />
              <div className="relative">
                <select
                  name="type"
                  value={form.type}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none bg-white"
                >
                  <option value="entrant">Entrant</option>
                  <option value="sortant">Sortant</option>
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                  <FiArrowDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <Label text="Date d'envoi" />
              <Input
                type="datetime-local"
                name="date_envoi"
                value={form.date_envoi}
                onChange={handleChange}
                error={errors.date_envoi}
              />
            </div>

            <div className="space-y-1">
              <Label text="Date de réception" />
              <Input
                type="datetime-local"
                name="date_reception"
                value={form.date_reception}
                onChange={handleChange}
                error={errors.date_reception}
              />
            </div>

            <div className="space-y-1">
              <Label text="Expéditeur" />
              <Input
                type="text"
                name="expediteur"
                value={form.expediteur}
                onChange={handleChange}
                error={errors.expediteur}
              />
            </div>

            <div className="space-y-1">
              <Label text="Destinataire" />
              <Input
                type="text"
                name="destinataire"
                value={form.destinataire}
                onChange={handleChange}
                error={errors.destinataire}
              />
            </div>

            <div className="space-y-1 md:col-span-2">
              <Label text="Division destinataire (ID)" />
              <Input
                type="text"
                name="to_division_id"
                value={form.to_division_id}
                onChange={handleChange}
                error={errors.to_division_id}
              />
            </div>

            <div className="md:col-span-2">
              <Label text="Fichier joint" />
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
                        : "Glissez-déposez ou cliquez pour uploader"}
                    </span>
                  </div>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
            <Button
              text="Annuler"
              onClick={onClose}
              className="text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-lg border border-gray-300 transition-colors"
            />
            <Button
              text={loading ? "Envoi en cours..." : "Envoyer le message"}
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
        </form>
        {notification && <Notification message={notification} type="success" />}
      </div>
    </div>
  );
};