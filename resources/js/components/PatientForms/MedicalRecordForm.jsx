// components/PatientForm/MedicalRecordForm.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

const MedicalRecordForm = ({ record, setRecords }) => {
  const [formData, setFormData] = useState(record || { createdBy: "Dr. John Doe", date: new Date().toISOString().split("T")[0], data: "" });
  const [isEditing, setIsEditing] = useState(!record); // If no record, start in edit mode

  const handleChange = (e) => {
    setFormData({ ...formData, data: e.target.value });
  };

  const handleSave = () => {
    if (!record) {
      setRecords((prev) => [{ id: Date.now(), ...formData }, ...prev]);
    } else {
      setRecords((prev) => prev.map((r) => (r.id === record.id ? formData : r)));
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    setRecords((prev) => prev.filter((r) => r.id !== record.id));
  };

  return (
    <div>
      <h2 className="text-lg font-semibold text-green-700">{record ? "Edit Medical Record" : "New Medical Record"}</h2>
      <p>Created by: {formData.createdBy} on {formData.date}</p>

      {isEditing ? (
        <textarea value={formData.data} onChange={handleChange} className="w-full h-32 p-2 border rounded"></textarea>
      ) : (
        <p className="p-2 border rounded">{formData.data}</p>
      )}

      <div className="flex justify-between mt-4">
        {isEditing ? (
          <>
            <Button onClick={() => setIsEditing(false)} className="bg-gray-300">Cancel</Button>
            <Button onClick={handleSave} className="bg-green-600 text-white">Save</Button>
          </>
        ) : (
          <>
            <Button onClick={() => setIsEditing(true)} className="bg-blue-500 text-white">Edit</Button>
            <Button onClick={handleDelete} className="bg-red-500 text-white">Delete</Button>
          </>
        )}
      </div>
    </div>
  );
};

export default MedicalRecordForm;
