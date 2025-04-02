import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Step1 from "../Steps/Step1";
import Step2 from "../Steps/Step2";
import Step3 from "../Steps/Step3";

const PreParticipatoryForm = ({ open, setOpen, onSave, existingData = null, patient, interviewQuestions }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  // Initialize form with default values
  const { data, setData, post, processing, reset } = useForm({
    patient_id: patient?.patient_id || "",
    school_physician_id: 1, // Required

    // New Fields: Final Evaluation, Further Evaluation, etc.
    final_evaluation: "", // 0: Fit, 1: Evaluation Needed, 2: Not Cleared
    further_evaluation: "",
    not_cleared_for: "", // Options: All sports, Certain sports, Activity
    activity_specification: "",

    // Vital Signs
    bp: "",
    rr: "",
    hr: "",
    temperature: "",
    weight: "",
    height: "",

    // Past Medical Histories
    past_medical_histories: [],
    other_condition: "",

    physical_examinations: [
      { name: "General Survey", result: "Normal", remarks: "" },
      { name: "Eyes/Ear/Nose/Throat", result: "Normal", remarks: "" },
      { name: "Hearing", result: "Normal", remarks: "" },
      { name: "Vision", result: "Normal", remarks: "" },
      { name: "Lymph Nodes", result: "Normal", remarks: "" },
      { name: "Heart", result: "Normal", remarks: "" },
      { name: "Lungs", result: "Normal", remarks: "" },
      { name: "Abdomen", result: "Normal", remarks: "" },
      { name: "Skin", result: "Normal", remarks: "" },
      { name: "Extremities", result: "Normal", remarks: "" },
    ],

    // Interview Answers (Array initialized with interview questions)
    interview_questions: interviewQuestions?.map((question) => ({
      question_id: question.id,
      response: "",
      remarks: "",
    })) || [],
  });

  // Load existing data if provided
  useEffect(() => {
    if (existingData) {
      setData(existingData);
    }
  }, [existingData]);

  // Validate each step before proceeding
  const validateStep = () => {
    switch (step) {
      case 1:
        if (!data.weight || !data.height || !data.bp) {
          toast.error("Weight, Height, and Blood Pressure are required.");
          return false;
        }
        break;
      case 2:
        if (!data.temperature || !data.rr || !data.hr) {
          toast.error("Temperature, Respiratory Rate, and Heart Rate are required.");
          return false;
        }
        break;
      case 3:
        // Ensure all interview responses are valid (Yes/No and remarks)
        const invalidInterviewResponses = data.interview_questions.some(
          (answer) => !answer.response || !["Yes", "No"].includes(answer.response)
        );
        if (invalidInterviewResponses) {
          toast.error("Please answer all interview questions with 'Yes' or 'No'.");
          return false;
        }

        // Assuming the field is related to physical exams
        const hasInvalidExam = data.physical_examinations?.some(
          (exam) => exam.result === "Abnormal" && !exam.remarks?.trim()
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

  // Step Navigation
  const nextStep = () => {
    if (!validateStep()) return;
    setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Handle Form Submission
  const handleSave = () => {
    if (!validateStep()) return;

    // Format the interviewAnswers data before submission
    const interviewData = data.interview_questions.map((answer) => ({
      question_id: answer.question_id,
      response: answer.response,
      remarks: answer.remarks,
    }));

    // Submit data
    post(route("pre-participatory.store"), {
      data: {
        ...data,
        interview_questions: interviewData,
      },
      onSuccess: () => {
        toast.success("Form saved successfully!");
        setOpen(false);
      },
      onError: () => {
        toast.error("Failed to save the form. Please try again.");
      },
    });
  };

  // Prevent rendering if modal is closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-green-500 w-full max-w-3xl h-[85vh] flex flex-col">
        {/* Step Indicator */}
        <div className="text-center mb-4">
          <h2 className="text-green-700 font-bold text-xl">
            Step {step} of {totalSteps}
          </h2>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto px-4">
          {step === 1 && <Step1 formData={data} setFormData={setData} />}
          {step === 2 && <Step2 formData={data} setFormData={setData} />}
          {step === 3 && (
            <Step3
              formData={data}
              setFormData={setData}
              interviewQuestions={interviewQuestions}
            />
          )}
        </div>

        {/* Sticky Footer with Buttons */}
        <div className="sticky bottom-0 bg-white py-4 border-t border-gray-300 flex justify-between px-4">
          <Button
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            onClick={() => setOpen(false)}
          >
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
