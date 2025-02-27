import { useState, useEffect } from "react";
import MedicalTabs from "./MedicalTabs";
import { Button } from "@/components/ui/button";

const MedicalModal = ({ onClose, record, onSave, onDelete, patient }) => {
  const isNewRecord = !record; // Determine if it's a new record
  const [formData, setFormData] = useState(
    record || { 
      createdBy: "Dr. John Doe", 
      date: new Date().toISOString().split("T")[0], 
      status: "draft", // Default status for new records
      data: {} 
    }
  );

  const [isEditing, setIsEditing] = useState(isNewRecord); // New records start in edit mode

  // Auto-save draft when closing without saving
  useEffect(() => {
    return () => {
      if (!isNewRecord && formData.status !== "saved") {
        console.log("Auto-saving draft...");
        onSave({ ...formData, status: "draft" });
      }
    };
  }, [onClose]);

  const handleSave = () => {
    onSave({ ...formData, status: "saved" });
    setIsEditing(false);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      onDelete(record.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 sm:p-8">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl relative flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b bg-green-100 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-green-700">
            {isNewRecord ? "New Medical Record" : "Edit Medical Record"}
          </h2>
          <p className="text-sm text-gray-600">
            Created by: {formData.createdBy} on {formData.date}
          </p>
        </div>

        {/* Content Area - Scrollable Form */}
        <div className="px-6 py-4 overflow-auto flex-1">
          <MedicalTabs formData={formData} setFormData={setFormData} isEditing={isEditing} patient={patient}/>
        </div>

        {/* Footer Buttons */}
        <div className="px-6 py-4 border-t bg-gray-50 flex justify-end space-x-3">
          <Button onClick={onClose} className="bg-gray-500 text-white hover:bg-gray-600">
            Close
          </Button>

          {isNewRecord ? (
            <Button onClick={handleSave} className="bg-green-600 text-white">
              Save
            </Button>
          ) : (
            <>
              {isEditing ? (
                <Button onClick={handleSave} className="bg-green-600 text-white">
                  Save
                </Button>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white">
                  Edit
                </Button>
              )}
              <Button onClick={handleDelete} className="bg-red-600 text-white">
                Delete
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalModal;
