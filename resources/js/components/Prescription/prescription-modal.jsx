import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import PrescriptionForm from "./prescription-form";

const PrescriptionModal = ({ activeTab, patient }) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    setOpen(activeTab === "prescription");
  }, [activeTab]);

  const toggleDropdown = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    open && (
      <div className="p-4 bg-green-50 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-green-800">Prescriptions</h2>

        <Button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          onClick={() => setOpenForm(true)}
        >
          Upload Prescription
        </Button>

        <div className="mt-4 space-y-4">
          {/* ✅ Safe Check for patient.prescriptions */}
          {Array.isArray(patient.prescriptions) && patient.prescriptions.length > 0 ? (
            patient.prescriptions.map((prescription, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md border border-gray-300 cursor-pointer"
                onClick={() => toggleDropdown(index)}
              >
                {/* Prescription Header */}
                <div className="flex justify-between items-center">
                  <p className="text-gray-800 font-medium">
                    Prescription #{prescription.prescription_number}
                  </p>
                  {expandedIndex === index ? (
                    <ChevronUp size={20} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={20} className="text-gray-500" />
                  )}
                </div>

                {/* Expandable Content */}
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: expandedIndex === index ? "auto" : 0,
                    opacity: expandedIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 flex justify-center">
                    <img
                      src={`/prescriptions/${prescription.prescription_number}/image`}
                      alt={`Prescription ${prescription.prescription_number}`}
                      className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-300"
                    />
                  </div>
                </motion.div>
              </div>
            ))
          ) : (
            <p className="text-green-700 text-center">No prescriptions uploaded.</p>
          )}
        </div>

        {openForm && (
          <PrescriptionForm open={openForm} setOpen={setOpenForm} patient={patient} />
        )}
      </div>
    )
  );
};

export default PrescriptionModal;
