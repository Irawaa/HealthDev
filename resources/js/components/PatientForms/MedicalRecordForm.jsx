import { useState } from "react";
import { Button } from "@/components/ui/button";

const MedicalRecordForm = ({ record, setRecords }) => {
  const isNewRecord = !record; // Determine if it's a new record
  const [formData, setFormData] = useState(
    record || {
      id: Date.now(),
      createdBy: "Dr. John Doe",
      date: new Date().toISOString().split("T")[0],
      status: "draft",
      data: "",
    }
  );

  const [isEditing, setIsEditing] = useState(isNewRecord); // Start in edit mode for new records

  const handleChange = (e) => {
    setFormData({ ...formData, data: e.target.value });
  };

  const handleSave = () => {
    setRecords((prev) =>
      isNewRecord ? [{ ...formData, status: "saved" }, ...prev] : prev.map((r) => (r.id === record.id ? { ...formData, status: "saved" } : r))
    );
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRecords((prev) => prev.filter((r) => r.id !== record.id));
    }
  };

  return (
    <div className="p-4 bg-white shadow-md rounded-lg">
      <h2 className="text-lg font-semibold text-green-700">{isNewRecord ? "New Medical Record" : "Edit Medical Record"}</h2>
      <p className="text-sm text-gray-600">
        Created by: {formData.createdBy} on {formData.date}
      </p>

      {isEditing ? (
        <textarea
          value={formData.data}
          onChange={handleChange}
          className="w-full h-32 p-2 mt-2 border rounded"
          placeholder="Enter medical details..."
        />
      ) : (
        <p className="p-2 mt-2 border rounded">{formData.data || "No data available."}</p>
      )}

      <div className="flex justify-end mt-4 space-x-2">
        {isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)} className="bg-gray-400 text-white">
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-green-600 text-white">
              Save
            </Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white">
              Edit
            </Button>
            <Button onClick={handleDelete} className="bg-red-600 text-white">
              Delete
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordForm;
