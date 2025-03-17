import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast"; // ✅ Import React Hot Toast
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { usePhysicianStaff } from "@/Pages/Patients/ProfilePage";

const PrescriptionForm = ({ open, setOpen, patient }) => {
  const physicianStaff = usePhysicianStaff();
  console.log(physicianStaff);
  const [preview, setPreview] = useState(null);
  const [pageLoading, setPageLoading] = useState(false); // ✅ Add loading state

  const { data, setData, post, processing, errors, reset } = useForm({
    patient_id: patient?.patient_id || "",
    prescription_image: null,
    school_physician_id: "",
  });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      setData("prescription_image", file);
    }
  };

  const handleChange = (e) => {
    setData(e.target.name, e.target.value || "");
  };

  const handleSubmit = () => {
    setPageLoading(true); // ✅ Start loading
    post("/prescriptions", {
      onSuccess: () => {
        setPageLoading(false); // ✅ Stop loading
        setOpen(false);
        toast.success("Prescription uploaded successfully!"); // ✅ Success toast
        reset();
      },
      onError: (errors) => {
        setPageLoading(false); // ✅ Stop loading
        console.error(errors);
        toast.error("Failed to upload prescription. Please try again."); // ❌ Error toast
      },
      preserveState: true,
    });
  };

  return (
    <>
      {/* ✅ Loading Overlay */}
      {pageLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="relative flex flex-col items-center"
          >
            {/* Smooth Spinning Loader */}
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-transparent border-t-green-500 border-l-green-400 border-r-green-300 border-b-green-200"></div>
            <p className="mt-4 text-green-300 text-lg font-semibold animate-pulse">
              Saving, please wait...
            </p>
          </motion.div>
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.3 }}
        >
          <DialogContent className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full mx-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-green-700">
                Upload Prescription
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Upload Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select an image:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="border border-gray-300 rounded p-2 w-full"
                />
                {errors.prescription_image && (
                  <div className="text-red-500 text-sm">
                    {errors.prescription_image}
                  </div>
                )}
              </div>

              {/* Image Preview */}
              {preview && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="flex justify-center mt-4"
                >
                  <img
                    src={preview}
                    alt="Prescription Preview"
                    className="w-32 h-32 object-cover rounded-lg shadow-md border border-gray-300"
                  />
                </motion.div>
              )}

              {/* School Physician Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  School Physician:
                </label>
                <select
                  name="school_physician_id"
                  value={data.school_physician_id || ""}
                  onChange={handleChange}
                  className="border border-gray-300 rounded p-2 w-full"
                  required
                >
                  <option value="">Select Physician</option>
                  {physicianStaff && physicianStaff.length > 0 ? (
                    physicianStaff.map((physician) => (
                      <option key={physician.staff_id} value={physician.staff_id}>
                        {physician.lname}, {physician.fname} {physician.mname || ""}
                        (Lic: {physician.license_no})
                      </option>
                    ))
                  ) : (
                    <option disabled>No physicians available</option>
                  )}
                </select>
                {errors.school_physician_id && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.school_physician_id}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="mt-4 flex justify-between">
              <Button
                onClick={() => setOpen(false)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
                disabled={processing}
              >
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </motion.div>
      </Dialog>
    </>
  );
};

export default PrescriptionForm;
