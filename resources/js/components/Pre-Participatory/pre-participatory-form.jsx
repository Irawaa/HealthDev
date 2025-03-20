import { useState } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";

const PreParticipatoryForm = ({ open, setOpen, onSave, existingData = null }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3; // Adjust if more steps are added

  // ✅ Initialize form with default values
  const { data, setData, post, processing, reset } = useForm({
    weight: "",
    height: "",
    blood_pressure: "",
    cardiac_rate: "",
    respiratory_rate: "",
    temperature: "",
    oxygen_saturation: "",
    bmi: "",
    medicalHistory: [],
    otherMedicalHistory: "",
    interviewAnswers: Array(6).fill({ answer: "", remark: "" }),
    physical_examinations: [],
    final_evaluation: {
      cleared: false,
      requires_evaluation: false,
      evaluation_details: "",
      not_cleared: false,
      not_cleared_all_sports: false,
      not_cleared_certain_sports: false,
      not_cleared_activity: false,
      activity_details: "",
    },
  });

  // ✅ Load existing data if provided
  useState(() => {
    if (existingData) {
      setData(existingData);
    }
  }, [existingData]);

  // ✅ Validate each step before proceeding
  const validateStep = () => {
    switch (step) {
      case 1:
        if (!data.weight || !data.height || !data.blood_pressure) {
          toast.error("Weight, Height, and Blood Pressure are required.");
          return false;
        }
        break;
      case 2:
        if (!data.temperature || !data.oxygen_saturation || !data.cardiac_rate) {
          toast.error("Temperature, Oxygen Saturation, and Cardiac Rate are required.");
          return false;
        }
        break;
      case 3:
        const hasInvalidExam = data.physical_examinations.some(
          (exam) => exam.result === "Abnormal" && !exam.remarks.trim()
        );
        if (hasInvalidExam) {
          toast.error("Please provide remarks for Abnormal Physical Examinations.");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  // ✅ Step Navigation
  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // ✅ Save Form Data
  const handleSave = () => {
    if (!validateStep()) return;
    onSave(data); // Pass the form data to the parent
    toast.success("Form saved successfully!");
    setOpen(false);
  };

  // ✅ Prevent rendering if modal is closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-green-500 w-full max-w-3xl h-[85vh] flex flex-col">

        {/* ✅ Step Indicator */}
        <div className="text-center mb-4">
          <h2 className="text-green-700 font-bold text-xl">
            Step {step} of {totalSteps}
          </h2>
        </div>

        {/* ✅ Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {step === 1 && <Step1 formData={data} setFormData={setData} />}
          {step === 2 && <Step2 formData={data} setFormData={setData} />}
          {step === 3 && <Step3 formData={data} setFormData={setData} />}
        </div>

        {/* ✅ Sticky Footer with Buttons */}
        <div className="sticky bottom-0 bg-white py-4 border-t border-gray-300 flex justify-between px-4">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg" onClick={() => setOpen(false)}>
            Close
          </Button>

          {/* Step 1 & 2: Show Next/Back */}
          {step < totalSteps ? (
            <div className="flex gap-2">
              {step > 1 && (
                <Button
                  className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
                  onClick={prevStep}
                >
                  ← Back
                </Button>
              )}
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg"
                onClick={nextStep}
              >
                Next →
              </Button>
            </div>
          ) : (
            // Step 3: Show Back, Save, and Print
            <div className="flex gap-2">
              <Button
                className="bg-gray-400 hover:bg-gray-500 text-white px-6 py-2 rounded-lg"
                onClick={prevStep}
              >
                ← Back
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
                onClick={handleSave}
                disabled={processing}
              >
                {processing ? "Saving..." : "Save"}
              </Button>
              <Button
                className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg"
                onClick={() => window.print()}
              >
                Print
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PreParticipatoryForm;
