import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm, router } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import FDARForm from "./FDARSteps/add-fdar-forms";
import FDARRecords from "./fdar-records"; // ✅ Import the new component
import ConfirmationModal from "../confirmation-modal";

const FDARModal = ({ patient, refreshPatientData }) => {
  const [open, setOpen] = useState(false);
  const [fdarForms, setFdarForms] = useState([]);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedFDARId, setSelectedFDARId] = useState(null);

  const { data, setData, post, processing, reset, errors } = useForm({
    patient_id: patient?.patient_id || null,
    school_nurse_id: "",
    data: "",
    action: "",
    response: "",
    weight: "",
    height: "",
    blood_pressure: "",
    cardiac_rate: "",
    respiratory_rate: "",
    temperature: "",
    oxygen_saturation: "",
    last_menstrual_period: "",
    common_disease_ids: [],
    custom_diseases: [],
  });

  useEffect(() => {
    if (patient?.fdar_forms) {
      setFdarForms(patient.fdar_forms);
      console.log("FDAR Forms:", patient.fdar_forms);
    }
  }, [patient]);

  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    post(route("fdar-forms.store"), {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        toast.success("✅ FDAR Record Saved Successfully!");
        setOpen(false);
        reset();
        if (refreshPatientData) {
          refreshPatientData(); // 🔄 Reload patient data
        }
      },
      onError: (errors) => {
        console.error("Validation Errors:", errors);
        Object.entries(errors).forEach(([key, messages]) => {
          if (Array.isArray(messages)) {
            messages.forEach((message) => toast.error(`❌ ${message}`));
          }
        });
      },
    });
  };

  const handleDeleteClick = (fdarId) => {
    setSelectedFDARId(fdarId);
    setConfirmOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!selectedFDARId) return;

    router.delete(route("fdar-forms.destroy", selectedFDARId), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success("✅ FDAR record deleted successfully!");
        setFdarForms((prevForms) => prevForms.filter((form) => form.id !== selectedFDARId));
        if (refreshPatientData) {
          refreshPatientData(); // Refresh patient data after deletion
        }
      },
      onError: (errors) => {
        toast.error("❌ Failed to delete FDAR record.");
        console.error(errors);
      },
      onFinish: () => {
        setConfirmOpen(false);
        setSelectedFDARId(null);
      },
    });
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h2 className="text-xl font-semibold text-green-800">FDAR Records</h2>

      {/* ✅ Button to Open Create Form */}
      <Button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
        onClick={() => setOpen(true)}
      >
        Create New FDAR Record
      </Button>

      {/* ✅ Render FDAR Records Component */}
      <FDARRecords fdarForms={fdarForms} onDelete={handleDeleteClick} />

      {/* ✅ FDAR Form Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="bg-white shadow-xl rounded-lg p-8 max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col overflow-hidden">
          <div className="bg-green-100 px-6 py-4 flex justify-between items-center border-b shadow-md sticky top-0 z-10">
            <h2 className="text-lg font-semibold text-green-700">New FDAR Record</h2>
          </div>

          {/* ✅ Scrollable Content */}
          <div className="flex-1 overflow-y-auto">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-transparent select-none">‎</DialogTitle>
            </DialogHeader>

            {/* ✅ Render FDAR Form */}
            <FDARForm formData={data} handleChange={handleChange} />
          </div>

          {/* ✅ Footer Controls */}
          <DialogFooter className="bg-white px-8 py-6 border-t shadow-md flex justify-between">
            <Button onClick={() => setOpen(false)} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={processing}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
            >
              {processing ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmationModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete FDAR Record"
        message="Are you sure you want to delete this FDAR record? This action cannot be undone."
        actionType="Remove"
      />
    </div>
  );
};

export default FDARModal;
