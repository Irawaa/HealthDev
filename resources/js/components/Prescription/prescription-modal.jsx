import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "../ui/button";
import { Eye, ChevronDown, ChevronUp } from "lucide-react";
import PrescriptionForm from "./prescription-form"; // Ensure this is correctly imported

const formatDateTime = (dateTime) => {
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  };
  return new Date(dateTime).toLocaleDateString("en-US", options);
};

const PrescriptionModal = ({ activeTab, patient }) => {
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    setOpen(activeTab === "prescription");
  }, [activeTab]);

  const toggleDropdown = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const openImageModal = (imageSrc) => {
    setSelectedImage(imageSrc);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
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

        <div className="mt-4 space-y-3">
          {Array.isArray(patient.prescriptions) && patient.prescriptions.length > 0 ? (
            patient.prescriptions.map((prescription, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-xl border border-green-300 transition hover:shadow-2xl"
              >
                <div className="flex justify-between items-center cursor-pointer" onClick={() => toggleDropdown(index)}>
                  <div>
                    <h3 className="text-lg font-semibold text-green-600">
                      Prescription #{prescription.prescription_number}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Recorded: {formatDateTime(prescription.created_at)}
                    </p>
                  </div>
                  <button className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white rounded-lg shadow-md hover:bg-gradient-to-r hover:from-green-500 hover:via-green-600 hover:to-green-700 transition">
                    {expandedIndex === index ? (
                      <ChevronUp size={20} className="text-white" />
                    ) : (
                      <ChevronDown size={20} className="text-white" />
                    )}
                    {expandedIndex === index ? "Collapse" : "Expand"}
                  </button>
                </div>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{
                    height: expandedIndex === index ? "auto" : 0,
                    opacity: expandedIndex === index ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden mt-3"
                >
                  <div className="space-y-3 bg-green-50 p-4 rounded-md shadow-sm">
                    <div className="flex justify-center">
                      <img
                        src={`/prescriptions/${prescription.prescription_number}/image`}
                        alt={`Prescription ${prescription.prescription_number}`}
                        className="w-32 h-32 object-cover rounded-lg shadow-md border border-green-200 cursor-pointer"
                      />
                    </div>

                    <div className="border-t border-green-200 mt-3 pt-3">
                      <div className="flex justify-end gap-3 mt-3">
                        <button
                          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
                          onClick={() => openImageModal(`/prescriptions/${prescription.prescription_number}/image`)}
                        >
                          <Eye size={18} />
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ))
          ) : (
            <p className="text-green-700 text-center">No prescriptions uploaded.</p>
          )}
        </div>

        {openForm && (
          <PrescriptionForm open={openForm} setOpen={setOpenForm} patient={patient} />
        )}

        {/* Image Modal */}
        {isModalOpen && selectedImage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg max-w-3xl w-full relative">
              <button
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full"
                onClick={closeImageModal}
              >
                X
              </button>
              <img
                src={selectedImage}
                alt="Prescription Image"
                className="w-full max-h-[80vh] object-contain"
              />
            </div>
          </div>
        )}
      </div>
    )
  );
};

export default PrescriptionModal;
