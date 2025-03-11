import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PrescriptionForm from "./prescription-form";

const PrescriptionModal = ({ activeTab, patient }) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [prescriptionImage, setPrescriptionImage] = useState(null);

  // ✅ Correct useEffect to track `activeTab`
  useEffect(() => {
    setOpen(activeTab === "prescription");
  }, [activeTab]);

  return (
    open && (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-800">Prescriptions</h2>

        <Button 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          onClick={() => setOpenForm(true)}
        >
          Upload Prescription
        </Button>

        <div className="mt-4 flex justify-center">
          {prescriptionImage ? (
            <img 
              src={prescriptionImage} 
              alt="Prescription" 
              className="max-w-full h-auto rounded-lg shadow-md border border-gray-300"
            />
          ) : (
            <p className="text-green-700 text-center">No prescription uploaded.</p>
          )}
        </div>

        {openForm && <PrescriptionForm open={openForm} setOpen={setOpenForm} setPrescriptionImage={setPrescriptionImage} />}
      </div>
    )
  );
};

export default PrescriptionModal;
