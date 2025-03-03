import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import FDARStepOne from "./FDARSteps/FDARStepOne";
import FDARStepTwo from "./FDARSteps/FDARStepTwo";

const FDARFormModal = ({ open, setOpen }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    focus: "",
    data: "",
    action: "",
    response: "",
    weight: "",
    height: "",
    bloodPressure: "",
    cr: "",
    rr: "",
    temp: "",
    o2Sat: "",
    lmp: "",
    savedBy: "John Doe",
    savedAt: format(new Date(), "yyyy-MM-dd HH:mm:ss"),
  });

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const nextStep = () => {
    if (step === 1 && (!formData.focus || !formData.data || !formData.action || !formData.response)) {
      alert("Please complete all fields before proceeding.");
      return;
    }
    setStep(2);
  };

  const handleSubmit = () => {
    console.log("Saving Data:", formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white shadow-xl rounded-lg p-8 max-w-4xl w-full mx-auto max-h-[90vh] flex flex-col overflow-hidden">
        {/* ✅ Fixed Green Header Inside Modal */}
        <div className="bg-green-100 px-6 py-4 flex justify-between items-center border-b shadow-md sticky top-0 z-10">
          <h2 className="text-lg font-semibold text-green-700">New FDAR Record</h2>
          <p className="text-sm text-gray-600">
            Created by: Dr. John Doe on {new Date().toISOString().split("T")[0]}
          </p>
        </div>

        {/* ✅ Scrollable Content Below Header */}
        <div className="flex-1 overflow-y-auto">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-transparent select-none">‎</DialogTitle> {/* Invisible title for spacing */}
          </DialogHeader>

          {/* ✅ Render Steps */}
          {step === 1 ? (
            <FDARStepOne formData={formData} handleChange={handleChange} />
          ) : (
            <FDARStepTwo formData={formData} handleChange={handleChange} />
          )}
        </div>

        {/* ✅ Footer Controls Inside Modal */}
        <DialogFooter className="bg-white px-8 py-6 border-t shadow-md flex justify-between">
          <Button onClick={() => setOpen(false)} className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600">
            Cancel
          </Button>

          <div className="flex space-x-2">
            {step > 1 && (
              <Button
                onClick={() => setStep(1)}
                className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
              >
                ← Back
              </Button>
            )}
            {step === 1 ? (
              <Button
                onClick={nextStep}
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
              >
                Next →
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800"
              >
                Save
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default FDARFormModal;
