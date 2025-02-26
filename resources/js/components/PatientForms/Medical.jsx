// components/PatientForm/Medical.jsx
import { useState, useEffect } from "react";
import MedicalModal from "./MedicalModal";
import { Button } from "@/components/ui/button";

// Mock Data (Replace with backend API)
const mockRecords = [
  { id: 1, createdBy: "Dr. John Doe", date: "2024-02-26", data: {} },
];

const Medical = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);

  useEffect(() => {
    setRecords(mockRecords);
    if (mockRecords.length > 0) {
      setSelectedRecord(mockRecords[0]); // Load latest record
    }
  }, []);

  const handleCreateNew = () => {
    setSelectedRecord(null);
    setIsOpen(true);
  };

  const handleSave = (newRecord) => {
    if (!selectedRecord) {
      const updatedRecords = [{ id: Date.now(), ...newRecord }, ...records];
      setRecords(updatedRecords);
      setSelectedRecord(updatedRecords[0]);
    } else {
      const updatedRecords = records.map((r) => (r.id === selectedRecord.id ? newRecord : r));
      setRecords(updatedRecords);
    }
    setIsOpen(false);
  };

  const handleDelete = (id) => {
    const updatedRecords = records.filter((r) => r.id !== id);
    setRecords(updatedRecords);
    setSelectedRecord(updatedRecords.length > 0 ? updatedRecords[0] : null);
    setIsOpen(false);
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-green-700">Medical Records</h2>

      {records.length === 0 ? (
        <Button onClick={handleCreateNew} className="mt-4 bg-green-600 text-white">Create New Medical Record</Button>
      ) : (
        <div>
          <p className="text-gray-700">Latest Record (Created by {selectedRecord.createdBy} on {selectedRecord.date})</p>
          <Button onClick={() => setIsOpen(true)} className="mt-4 bg-green-600 text-white">View Medical History</Button>
        </div>
      )}

      {isOpen && <MedicalModal onClose={() => setIsOpen(false)} record={selectedRecord} onSave={handleSave} onDelete={handleDelete} />}
    </div>
  );
};

export default Medical;
