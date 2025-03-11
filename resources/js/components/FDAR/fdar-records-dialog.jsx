import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast"; // ✅ Import toast
import FDARForm from "./FDARSteps/FDARForm";

const FDARModal = ({ patient }) => {
  const [open, setOpen] = useState(false);

  // ✅ Initialize Inertia form
  const { data, setData, post, processing, reset } = useForm({
    patient_id: patient?.patient_id || null,
    school_nurse_id: "", // ✅ To be filled dynamically if needed
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
  });

  // ✅ Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(name, value);
  };

  // ✅ Handle form submission using Inertia.js
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form Data before submission:", data); // ✅ Log form data

    post(route("fdar-forms.store"), {
      onSuccess: () => {
        toast.success("FDAR Record Saved Successfully"); // ✅ Show success toast
        console.log("FDAR Record Saved Successfully");
        setOpen(false);
        reset();
      },
      onError: (errors) => {
        toast.error("Failed to save FDAR record"); // ✅ Show error toast
        console.error("Form submission errors:", errors);
      },
    });
  };

  // ✅ Open modal for creating a new FDAR record
  const openCreateModal = () => {
    reset(); // Clear form
    setOpen(true);
  };

  return (
    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
      <h2 className="text-xl font-semibold text-green-800">FDAR Records</h2>

      {/* ✅ Button to Open Create Form */}
      <Button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
        onClick={openCreateModal}
      >
        Create New FDAR Record
      </Button>

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

            {/* ✅ Render Single Combined Form */}
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
    </div>
  );
};

export default FDARModal;
