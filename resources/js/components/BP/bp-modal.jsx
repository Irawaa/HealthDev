import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { router } from "@inertiajs/react";
import PdfModal from "../react-pdf";
import ConfirmationModal from "../confirmation-modal";
import BPFormList from "@/components/BP/List/bp-form-list"; // Import the new BPFormList component
import AddBPTable from "@/components/BP/add-bp-table";
import EditBPTable from "@/components/BP/edit-bp-table";

const BPModal = ({ patient }) => {
  const [openForm, setOpenForm] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);
  const [bpForms, setBpForms] = useState([]);
  const [expandedForms, setExpandedForms] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [selectedBPId, setSelectedBPId] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  useEffect(() => {
    if (patient?.bp_forms) {
      setBpForms(patient.bp_forms);
    }
  }, [patient]);

  const toggleForm = (formId) => {
    setExpandedForms((prev) => ({
      ...prev,
      [formId]: !prev[formId],
    }));
  };

  const handleEditClick = (form) => {
    setIsEditing(true);
    setViewRecord({ ...form, reading: null });
    setOpenForm(true);
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
    setPreviewUrl(`/bp-forms/${id}/pdf`);
  };

  const onPreview = (id) => {
    const printWindow = window.open(`/bp-forms/preview/${id}`, "_blank");
    if (printWindow) {
      printWindow.onload = () => {
        printWindow.focus();
        printWindow.print();
      };
    }
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-800">BP Records</h2>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
        <Button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
          onClick={() => {
            setIsEditing(false);
            setViewRecord(null);
            setOpenForm(true);
          }}
        >
          Create New BP Record
        </Button>
      </motion.div>

      <BPFormList
        bpForms={bpForms}
        expandedForms={expandedForms}
        toggleForm={toggleForm}
        onView={onView}
        onPreview={onPreview}
        handleEditClick={handleEditClick}
        handleDeleteClick={handleDeleteClick}
      />

      <PdfModal isOpen={previewUrl !== null} onClose={() => setPreviewUrl(null)} pdfUrl={previewUrl} />

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
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-red-500 border-l-red-400 border-r-red-300 border-b-red-200"></div>
            <p className="mt-4 text-red-300 text-lg font-semibold animate-pulse">Deleting, please wait...</p>
          </motion.div>
        </div>
      )}

      {openForm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
          {isEditing ? (
            <EditBPTable open={openForm} setOpen={setOpenForm} patient={patient} record={viewRecord} />
          ) : (
            <AddBPTable open={openForm} setOpen={setOpenForm} patient={patient} />
          )}
        </motion.div>
      )}
    </div>
  );
};

export default BPModal;
