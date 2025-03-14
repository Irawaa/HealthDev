import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import AddBPTable from "@/components/BP/add-bp-table";
import EditBPTable from "@/components/BP/edit-bp-table";
import { ChevronDown, ChevronUp, Eye, Printer, Pencil, Trash2 } from "lucide-react";
import ConfirmationModal from "../confirmation-modal";
import { router } from "@inertiajs/react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const BPModal = ({ patient }) => {
  const [openForm, setOpenForm] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [bpForms, setBpForms] = useState([]);
  const [expandedForms, setExpandedForms] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // Track if form is in edit mode
  const [editingReading, setEditingReading] = useState(null); // Track the reading being edited
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedBPId, setSelectedBPId] = useState(null);

  // ✅ Load BP Forms & Readings Nested
  useEffect(() => {
    if (patient?.bp_forms) {
      setBpForms(patient.bp_forms);
    }
  }, [patient]);

  const toggleForm = (formId) => {
    setExpandedForms((prev) => ({
      ...prev,
      [formId]: !prev[formId], // Toggle form expansion
    }));
  };

  const handleEditClick = (form) => {
    setIsEditing(true); // Enable editing for the form
    setViewRecord({ ...form, reading: null }); // Edit the BP form itself
    setOpenForm(true); // Open the form modal
  };

  const handleDelete = (id) => {
    setBpForms(bpForms.filter((form) => form.id !== id));
  };

  const handleEditReading = (form, reading) => {
    setEditingReading(reading.id); // Set the reading as being edited
    setViewRecord({ ...form, reading }); // Set the selected BP reading for editing
    setOpenForm(true); // Open the form modal for reading
  };

  const handleDeleteClick = (id) => {
    setSelectedBPId(id);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedBPId) return;

    setPageLoading(true);

    router.delete(route("bp-forms.destroy", selectedBPId), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("BP Form deleted successfully!");
      },
      onError: (errors) => {
        toast.error("Failed to delete the BP Form.");
        console.error("Delete Error:", errors);
      },
      onFinish: () => {
        setConfirmOpen(false);
        setSelectedBPId(null);
        setPageLoading(false);
      },
    });
  };

  const onView = (id) => {
    window.open(`/bp-forms/${id}/pdf`, "_blank");
  };

  const onPreview = (id) => {
    const printWindow = window.open(`/bp-forms/preview/${id}`, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus(); // Ensure it's in focus
        printWindow.print(); // Auto-trigger print dialog
      };
    }
  };


  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h2 className="text-xl font-semibold text-green-800">BP Records</h2>

      {/* ✅ Create New BP Record Button with Animation */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          onClick={() => {
            setIsEditing(false); // Set to add mode
            setViewRecord(null); // Clear any existing record
            setOpenForm(true); // Open the form modal for adding
          }}
        >
          Create New BP Record
        </Button>
      </motion.div>

      {/* ✅ BP Forms with Readings in Collapsible Cards */}
      <div className="mt-4 space-y-3">
        {bpForms.length > 0 ? (
          bpForms.map((form) => (
            <motion.div
              key={form.id}
              className="bg-white p-4 rounded-lg shadow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {/* Form Header - View, Print, Edit, Delete Buttons */}
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">
                    <span className="font-semibold">Status:</span> {form.status}
                  </p>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
                    onClick={() => onView(form.id)}
                    whileHover={{ scale: 1.1 }} // Scale effect on hover
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Eye size={18} />
                    View
                  </motion.button>

                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition"
                    onClick={() => onPreview(form.id)}
                    whileHover={{ scale: 1.1 }} // Scale effect on hover
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Printer size={18} />
                    Print
                  </motion.button>

                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
                    onClick={() => handleEditClick(form)} // Trigger edit for the form
                    whileHover={{ scale: 1.1 }} // Scale effect on hover
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Pencil size={18} />
                    Edit
                  </motion.button>

                  <motion.button
                    className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
                    onClick={() => handleDeleteClick(form.id)}
                    whileHover={{ scale: 1.1 }} // Scale effect on hover
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Trash2 size={18} />
                    Delete
                  </motion.button>
                </div>
              </div>

              {/* ✅ Nested BP Readings - Show only when expanded */}
              <div
                className="flex justify-between items-center cursor-pointer mt-2"
                onClick={() => toggleForm(form.id)}
              >
                {expandedForms[form.id] ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>

              {expandedForms[form.id] && (
                <motion.div
                  className="mt-3 space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {form.readings.length > 0 ? (
                    form.readings.map((reading) => (
                      <div
                        key={reading.id}
                        className="bg-gray-100 p-2 rounded-md flex justify-between"
                      >
                        <p className="text-gray-700">
                          <span className="font-semibold">Date:</span> {reading.date} |
                          <span className="font-semibold"> Time:</span> {reading.time}
                        </p>
                        <p className="text-gray-700">
                          <span className="font-semibold">BP:</span> {reading.blood_pressure} |
                          <span className="font-semibold"> Remarks:</span> {reading.remarks || "None"}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500">No readings recorded.</p>
                  )}
                </motion.div>
              )}
            </motion.div>
          ))
        ) : (
          <p className="text-green-700 text-center">No BP forms found.</p>
        )}
      </div>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete BP Form"
        message="Are you sure you want to delete this BP Form? This action cannot be undone."
        actionType="Remove"
      />

      {pageLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative flex flex-col items-center"
          >
            {/* Smooth Spinning Loader */}
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-red-500 border-l-red-400 border-r-red-300 border-b-red-200"></div>
            <p className="mt-4 text-red-300 text-lg font-semibold animate-pulse">
              Deleting, please wait...
            </p>
          </motion.div>
        </div>
      )}


      {/* ✅ BP Form Modal with Animation */}
      {openForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {isEditing ? (
            <EditBPTable
              open={openForm}
              setOpen={setOpenForm}
              patient={patient}
              record={viewRecord} // Pass the selected record to the BPTable component for editing
            />
          ) : (
            <AddBPTable
              open={openForm}
              setOpen={setOpenForm}
              patient={patient}
            />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BPModal;
