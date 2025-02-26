// components/PatientForm/Medical.jsx
import { useState, useEffect } from "react";
import MedicalModal from "./MedicalModal";
import { Button } from "@/components/ui/button"; // Ensure you're using the correct UI library

const Medical = ({ activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Auto-close modal when switching tabs
  useEffect(() => {
    if (activeTab !== "medical") {
      setIsOpen(false);
    }
  }, [activeTab]);

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-green-700">Medical Records</h2>
      <p className="text-gray-700">View or update medical history for this patient.</p>

      {/* Button to trigger modal */}
      <Button onClick={() => setIsOpen(true)} className="mt-4 bg-green-600 text-white hover:bg-green-700">
        View Medical History
      </Button>

      {/* Modal */}
      {isOpen && <MedicalModal onClose={() => setIsOpen(false)} />}
    </div>
  );
};

export default Medical;
