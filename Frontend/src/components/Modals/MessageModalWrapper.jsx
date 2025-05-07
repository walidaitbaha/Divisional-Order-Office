
import React, { useState } from "react";
import { AddMessage } from "./AddMessage";

export const MessageModalWrapper = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState("choice"); // "choice" | "form"
  const [type, setType] = useState("entrant");

  const handleChoice = (selectedType) => {
    setType(selectedType);
    setStep("form");
  };

  const handleClose = () => {
    setStep("choice");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      {step === "choice" ? (
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md text-center space-y-4 animate-fade-in">
          <h2 className="text-lg font-bold text-gray-800">نوع الرسالة</h2>
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={() => handleChoice("entrant")}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition"
            >
              رسالة واردة
            </button>
            <button
              onClick={() => handleChoice("sortant")}
              className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
            >
              رسالة صادرة
            </button>
          </div>
          <button onClick={handleClose} className="text-gray-500 text-sm mt-4 hover:underline">إلغاء</button>
        </div>
      ) : (
        <AddMessage
          isOpen={true}
          onClose={handleClose}
          onSuccess={onSuccess}
          selectedType={type}
        />
      )}
    </div>
  );
};
