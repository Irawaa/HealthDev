import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import IncidentRecords from "./incident-reports-records";
import AddIncidentForm from "./incident-reports-add-form";


const IncidentModal = ({ activeTab, patient }) => {
  console.log(patient);
  const [open, setOpen] = useState(false);
  const [openForm, setOpenForm] = useState(false);

  useEffect(() => {
    setOpen(activeTab === "incident");
  }, [activeTab]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="bg-gray-50 p-6 rounded-lg border border-gray-200"
        >
          <h2 className="text-xl font-semibold text-gray-800">Incident Reports</h2>

          {/* ✅ Button to Open Create Form */}
          <Button
            className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
            onClick={() => setOpenForm(true)}
          >
            + Add Incident Report
          </Button>

          {/* ✅ Incident Records List */}
          <IncidentRecords patient={patient} />

          {/* ✅ Modal for Creating an Incident Report */}
          <AnimatePresence>
            {openForm && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <AddIncidentForm open={openForm} setOpen={setOpenForm} patient={patient}/>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default IncidentModal;
