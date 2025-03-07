import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PerscriptionForm from "./PerscriptionForm";

const PerscriptionModal = ({ activeTab, patient }) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [perscriptionImage, setPerscriptionImage] = useState(null);

  // ✅ Correct useEffect to track `activeTab`
  useEffect(() => {
    setOpen(activeTab === "perscription");
  }, [activeTab]);

  return (
    open && (
      <div className="bg-green-50 p-6 rounded-lg border border-green-200">
        <h2 className="text-xl font-semibold text-green-800">Perscriptions</h2>

        <Button 
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          onClick={() => setOpenForm(true)}
        >
          Upload Perscription
        </Button>

        <div className="mt-4 flex justify-center">
          {perscriptionImage ? (
            <img 
              src={perscriptionImage} 
              alt="Perscription" 
              className="max-w-full h-auto rounded-lg shadow-md border border-gray-300"
            />
          ) : (
            <p className="text-green-700 text-center">No perscription uploaded.</p>
          )}
        </div>

        {openForm && <PerscriptionForm open={openForm} setOpen={setOpenForm} setPerscriptionImage={setPerscriptionImage} />}
      </div>
    )
  );
};

export default PerscriptionModal;
