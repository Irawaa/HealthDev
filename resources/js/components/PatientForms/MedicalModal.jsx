// components/PatientForm/MedicalModal.jsx
import { useState } from "react";
import MedicalTabs from "./MedicalTabs";
import { Button } from "@/components/ui/button";

const MedicalModal = ({ onClose, record, onSave, onDelete }) => {
  const [formData, setFormData] = useState(record || { createdBy: "Dr. John Doe", date: new Date().toISOString().split("T")[0] });
  const [isEditing, setIsEditing] = useState(!record); // If no record, start in edit mode

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative flex flex-col max-h-[90vh] overflow-hidden">
        {/* Close Button */}
        <button className="absolute top-3 right-4 text-gray-600 hover:text-red-500" onClick={onClose}>
          ✖
        </button>

        {/* Header */}
        <div className="px-6 py-4 border-b bg-green-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-green-700">
            {record ? "Edit Medical Record" : "New Medical Record"}
          </h2>
          <p className="text-sm text-gray-600">Created by: {formData.createdBy} on {formData.date}</p>
        </div>

        {/* Content Area - Scrollable Form */}
        <div className="px-6 py-4 overflow-auto flex-1">
          <MedicalTabs formData={formData} setFormData={setFormData} isEditing={isEditing} />
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          {isEditing ? (
            <Button onClick={handleSave} className="bg-green-600 text-white">Save</Button>
          ) : (
            <>
              <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white">Edit</Button>
              <Button onClick={() => onDelete(record.id)} className="bg-red-500 text-white">Delete</Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalModal;
