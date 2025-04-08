import { useState, useEffect } from "react";
import { useForm, router } from "@inertiajs/react";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import Step1 from "../Steps/Step1";
import Step2 from "../Steps/Step2";
import Step3 from "../Steps/Step3";

const PreParticipatoryForm = ({ open, setOpen, onSave, selectedEvaluation, patient, interviewQuestions }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  console.log(selectedEvaluation);

  // Initialize form with default values
  const { data, setData, put, post, processing, reset } = useForm({
    patient_id: patient?.patient_id || "",
    school_physician_id: "",

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
    if (selectedEvaluation) {
      const record = selectedEvaluation; // Get the first record

      console.log("Loading school_physician_id:", record.school_physician_id);

      setData({
        // ✅ Patient & Physician
        patient_id: record.patient_id || "",
        school_physician_id: record.school_physician_id || "",

        // ✅ Final Evaluation Fields
        final_evaluation: String(record.final_evaluation ?? "0"),
        further_evaluation: record.further_evaluation ?? "",
        not_cleared_for: record.not_cleared_for ?? "",
        activity_specification: record.activity_specification ?? "",

        // ✅ Vital Signs
        bp: record.vital_signs?.bp || "",
        rr: record.vital_signs?.rr || "",
        hr: record.vital_signs?.hr || "",
        temperature: record.vital_signs?.temperature || "",
        weight: record.vital_signs?.weight || "",
        height: record.vital_signs?.height || "",

        // ✅ Past Medical Histories
        past_medical_histories: record.past_medical_histories?.map((history) => history.condition_name) || [],
        other_condition: record.past_medical_histories?.find(history => history.condition_name === "Others")?.pivot?.custom_condition || "",

        // ✅ Physical Examinations
        physical_examinations: record.physical_examinations?.map((exam) => ({
          id: exam.id,
          name: exam.name,
          result: exam.pivot?.result ?? "Normal",
          remarks: exam.pivot?.remarks ?? "",
        })) || [],

        // ✅ Interview Answers
        interview_questions: record.interview?.map((answer) => ({
          question_id: answer.question_id,
          response: answer.response,
          remarks: answer.remarks,
        })) || [],
      });
    }
  }, [selectedEvaluation]);

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
    if (!validateStep()) return; // Step validation before saving

    // Ensure interview_questions exists before mapping
    const interviewData = (data.interview_questions || []).map((answer) => ({
      question_id: answer?.question_id,
      response: answer?.response,
      remarks: answer?.remarks,
    }));

    // Determine whether to create or update based on selectedEvaluation
    const isUpdating = !!selectedEvaluation;

    // Data payload to send in the request
    const payload = {
      ...data,
      interview_questions: interviewData, // Make sure interview data is included
    };

    // If updating, use `put`, otherwise `post`
    if (isUpdating) {
      // Perform update (PUT)
      put(route("pre-participatory.update", { id: selectedEvaluation.id }), {
        data: payload,
        onSuccess: () => {
          toast.success("Form updated successfully!");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to update the form. Please try again.");
        },
      });
    } else {
      // Perform create (POST)
      post(route("pre-participatory.store"), {
        data: payload,
        onSuccess: () => {
          toast.success("Form saved successfully!");
          setOpen(false);
        },
        onError: () => {
          toast.error("Failed to save the form. Please try again.");
        },
      });
    }
  };

  // Prevent rendering if modal is closed
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white w-full max-w-3xl h-[85vh] p-6 rounded-lg shadow-lg flex flex-col overflow-y-auto">

        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-4">
          <h2 className="text-lg font-semibold text-green-700">
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
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg"
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
