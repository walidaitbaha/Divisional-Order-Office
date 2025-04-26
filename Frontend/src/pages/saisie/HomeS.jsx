import React, { useEffect, useState } from "react";
import { Button } from "../../components/UI/Button";
import { getMessages } from "../../services/messageService";
import { format } from "date-fns";
import { FiFile, FiPlus, FiInfo, FiChevronRight } from "react-icons/fi";
import { AddMessage } from "../../components/Modals/AddMessage";

export const HomeS = () => {
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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

  useEffect(() => {
    fetchMessages(page);
  }, [page]);

  const formatDate = (dateString) => {
    if (!dateString) return "Non spécifiée";
    return format(new Date(dateString), "dd MMM yyyy HH:mm");
  };

  return (
    <div className="max-w-6xl mx-auto p-4 min-h-screen">
      <AddMessage
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
              Messages du Bureau d'Ordre
            </h1>
            <span className="text-xs text-gray-500 font-medium">
              {messages.length} messages
            </span>
          </div>
        </div>

        <Button
          text="Nouveau"
          width="w-28"
          onClick={() => setShowModal(true)}
          className="h-7 px-2.5 py-0.5 text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-md transition-all ring-1 ring-indigo-100 hover:ring-indigo-200"
          icon={
            <FiPlus className="w-3 h-3 transform transition-transform group-hover:rotate-90" />
          }
        />
      </div>

      {/* Messages Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {messages.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-white rounded-xl shadow-sm border border-gray-100">
            <div className="text-gray-400 mb-4">
              <FiFile className="w-16 h-16 mx-auto" />
            </div>
            <p className="text-gray-500 text-lg">Aucun message disponible</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className="p-4 space-y-3">
                {/* Card Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-sm text-indigo-600">
                      #{msg.num}
                    </span>
                    {msg.ref && (
                      <span className="ml-2 text-sm text-gray-500">
                        ({msg.ref})
                      </span>
                    )}
                  </div>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      msg.type === "entrant"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {msg.type}
                  </span>
                </div>

                {/* Main Content */}
                <div className="space-y-2">
                  <h3 className="font-medium text-gray-900 line-clamp-2">
                    {msg.objet}
                  </h3>

                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Exp:</span>
                      <span>{msg.expediteur || "Non spécifié"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">Dest:</span>
                      <span>{msg.destinataire || "Non spécifié"}</span>
                    </div>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100"></div>

                {/* Footer */}
                <div className="pt-2">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <div className="space-y-1">
                      <p>Envoyé: {formatDate(msg.date_envoi)}</p>
                      <p>Reçu: {formatDate(msg.date_reception)}</p>
                    </div>
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
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <nav className="inline-flex rounded-md shadow-sm">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 border border-gray-300 rounded-l-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="px-4 py-2 border-t border-b border-gray-300 text-gray-700">
              Page {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 border border-gray-300 rounded-r-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Suivant
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};
