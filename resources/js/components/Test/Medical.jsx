import { useState, useEffect } from "react";
import MedicalModal from "./MedicalModal";
import { Button } from "@/components/ui/button";

// Mock Data (Replace with API Call)
const mockRecords = [
  { id: 1, createdBy: "Dr. John Doe", date: "2024-02-26", status: "saved", data: {} },
];

const Medical = ({patient}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Load Initial Data
  useEffect(() => {
    setRecords(mockRecords);
    if (mockRecords.length > 0) {
      setSelectedRecord(mockRecords[0]); // Load latest record by default
    }
  }, []);

  // Open Modal to Create New Record
  const handleCreateNew = () => {
    setSelectedRecord(null);
    setIsOpen(true);
  };

  // Open Modal to Edit Selected Record
  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsOpen(true);
  };

  // Save (New or Edited Record)
  const handleSave = (newRecord) => {
    if (!selectedRecord) {
      // New Record - Add to list
      const updatedRecords = [{ id: Date.now(), ...newRecord }, ...records];
      setRecords(updatedRecords);
    } else {
      // Editing Existing Record
      const updatedRecords = records.map((r) => (r.id === selectedRecord.id ? newRecord : r));
      setRecords(updatedRecords);
    }
    setIsOpen(false);
  };

  // Delete Record
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      const updatedRecords = records.filter((r) => r.id !== id);
      setRecords(updatedRecords);
    }
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-green-700">Medical Records</h2>

      {/* Create New Button */}
      <Button onClick={handleCreateNew} className="mb-4 bg-blue-500 text-white">
        Create New Medical Record
      </Button>

      {/* Existing Records List */}
      {records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => (
            <div key={record.id} className="p-4 bg-white shadow-md rounded-lg flex justify-between items-center">
              <div>
                <p className="text-gray-700">
                  <strong>Created by:</strong> {record.createdBy}
                </p>
                <p className="text-gray-600">
                  <strong>Date:</strong> {record.date}
                </p>
              </div>
              <div className="space-x-2">
                <Button onClick={() => handleEdit(record)} className="bg-green-600 text-white">
                  Edit
                </Button>
                <Button onClick={() => handleDelete(record.id)} className="bg-red-600 text-white">
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-700 mt-4">No medical records available.</p>
      )}

      {/* Medical Modal for Save/Edit */}
      {isOpen && (
        <MedicalModal 
          onClose={() => setIsOpen(false)}
          record={selectedRecord} 
          onSave={handleSave} 
          onDelete={handleDelete} 
          patient={patient}
        />
      )}
    </div>
  );
};

export default Medical;
