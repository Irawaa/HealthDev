import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";
import Step6 from "./Steps/Step6";

const MedicalRecordDialog = ({ patient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [step, setStep] = useState(1);

  const { data, setData, post, processing, reset, errors } = useForm({
    patient_id: patient?.patient_id || null,
    school_nurse_id: 1,
    school_physician_id: 2,

    // ✅ Review of Systems
    review_of_systems: [],
    others: "",

    // ✅ Deformities
    deformities: [],

    // ✅ Vital Signs
    bp: "",
    rr: "",
    hr: "",
    temperature: "",
    weight: "",
    height: "",

    // ✅ Past Medical Histories
    past_medical_histories: [],
    other_condition: "",

    // ✅ OB/Gyne History
    menstruation: "",
    duration: "",
    dysmenorrhea: false,
    pregnant_before: false,
    num_of_pregnancies: "",
    last_menstrual_period: "",

    // ✅ Personal & Social History
    alcoholic_drinker: "",
    smoker: false,
    sticks_per_day: "",
    years_smoking: "",
    illicit_drugs: false,
    eye_glasses: false,
    contact_lens: false,
    eye_disorder_no: false,

    // ✅ Family Histories
    family_histories: [
      { condition: "Bronchial Asthma", Father: "", Mother: "", Sister: [""], Brother: [""], remarks: "" },
      { condition: "Cancer", Father: "", Mother: "", Sister: [""], Brother: [""], remarks: "" },
      { condition: "Diabetes Mellitus", Father: "", Mother: "", Sister: [""], Brother: [""], remarks: "" },
      { condition: "Kidney Disease", Father: "", Mother: "", Sister: [""], Brother: [""], remarks: "" },
      { condition: "Heart Disease", Father: "", Mother: "", Sister: [""], Brother: [""], remarks: "" },
      { condition: "Hypertension", Father: "", Mother: "", Sister: [""], Brother: [""], remarks: "" },
      { condition: "Mental Illness", Father: "", Mother: "", Sister: [""], Brother: [""], remarks: "" },
    ],

    // ✅ Physical Examinations
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

    // ✅ Medical Record Details 🔥

    // ✅ Chief Complaint
    chief_complaint: "",

    // ✅ Present Illness
    present_illness: "",

    // ✅ Medication
    medication: "",

    // ✅ Hospitalized?
    hospitalized: false,
    hospitalized_reason: "",

    // ✅ Previous Surgery?
    previous_surgeries: false,
    surgery_reason: "",

    // ✅ X-Ray Image
    chest_xray: null, // Image File (Binary)

    // ✅ Vaccination Status
    vaccination_status: "",

    // ✅ Laboratory Fields
    blood_chemistry: "",
    fbs: "",
    uric_acid: "",
    triglycerides: "",
    t_cholesterol: "",
    creatinine: "",

    final_evaluation: "",
    plan_recommendation: "",
  });

  const handleCreateNew = () => {
    reset();
    setSelectedRecord(null);
    setIsOpen(true);
    setStep(1);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record);
    setIsOpen(true);
    setStep(1);
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        // Step 1: Review of Systems
        // If "Others" is checked, input must not be empty
        if (data.review_of_systems.includes("Others") && !data.others.trim()) {
          toast.error("Please specify the other symptom.");
          focusInvalidField();
          return false;
        }
        break;

      case 2:
        // Step 2: Vital Signs
        if (!data.bp.trim() || !data.rr.trim() || !data.hr.trim() || !data.temperature.trim()) {
          toast.error("All Vital Signs are required.");
          focusInvalidField();
          return false;
        }

        // Deformities Mandatory if Checked
        if (data.deformity && data.deformities.length === 0) {
          toast.error("Please select at least one deformity if Deformities is checked.");
          focusInvalidField();
          return false;
        }
        break;

      case 3:
        // Step 3: Hospitalized & Surgery Reason
        if (data.hospitalized && !data.hospitalized_reason.trim()) {
          toast.error("Hospitalized Reason is required.");
          focusInvalidField();
          return false;
        }

        if (data.previous_surgeries && !data.surgery_reason.trim()) {
          toast.error("Surgery Reason is required.");
          focusInvalidField();
          return false;
        }

        if (data.past_medical_histories.includes("Others") && !data.other_condition.trim()) {
          toast.error("Please specify the Other Condition.");
          focusInvalidField();
          return false;
        }

        // Female Patients OB/Gyne Validation 🔥
        if (patient.gender !== 1) {
          if (!data.obGyneHistory) {
            toast.error("OB/Gyne History is required for Female Patients.");
            return false;
          }

          if (
            data.obGyneHistory &&
            (!data.menstruation || !data.duration || !data.last_menstrual_period.trim())
          ) {
            toast.error("Please complete all OB/Gyne History fields.");
            focusInvalidField();
            return false;
          }

          if (data.pregnant_before && !data.num_of_pregnancies) {
            toast.error("Number of Pregnancies is required.");
            focusInvalidField();
            return false;
          }
        }
        break;

      case 4:
        // ✅ Chief Complaint Validation
        if (!data.chief_complaint.trim()) {
          toast.error("Chief Complaint is required.");
          focusInvalidField();
          return false;
        }

        // ✅ Present Illness Validation
        if (!data.present_illness.trim()) {
          toast.error("Present Illness is required.");
          focusInvalidField();
          return false;
        }

        // ✅ Hospitalization Reason
        if (data.hospitalized && !data.hospitalized_reason.trim()) {
          toast.error("Please provide a reason for hospitalization.");
          focusInvalidField();
          return false;
        }

        // ✅ Surgery Reason
        if (data.previous_surgeries && !data.surgery_reason.trim()) {
          toast.error("Please provide a reason for previous surgeries.");
          focusInvalidField();
          return false;
        }

        // ✅ Smoker Validation
        if (data.smoker && (!data.sticks_per_day.trim() || !data.years_smoking.trim())) {
          toast.error("Please complete Smoking History (Sticks per Day and Years Smoking).");
          focusInvalidField();
          return false;
        }

        // ✅ Alcoholic Drinker Validation
        if (!data.alcoholic_drinker) {
          toast.error("Please select Alcoholic Drinker status.");
          focusInvalidField();
          return false;
        }

        // ✅ Illicit Drugs
        if (data.illicit_drugs === "") {
          toast.error("Please select Illicit Drugs status.");
          focusInvalidField();
          return false;
        }

        // ✅ Eye Disorder Validation
        if (data.eye_disorder_no && (data.eye_glasses || data.contact_lens)) {
          toast.error("You cannot select Eye Glasses or Contact Lens if No Eye Disorder is selected.");
          return false;
        }

        break;

      case 5:
        // ✅ Physical Examination Validation
        const hasInvalidExam = data.physical_examinations.some(
          (exam) => exam.result === "Abnormal" && !exam.remarks.trim()
        );

        if (hasInvalidExam) {
          toast.error("Please provide remarks for Abnormal Physical Examinations.");
          focusInvalidField();
          return false;
        }

        break;


      case 6:
        // 🔥 Chest X-Ray File Validation (Optional but if selected, must be valid)
        if (data.chest_xray && !(data.chest_xray.type.includes("image") || data.chest_xray.type.includes("pdf"))) {
          toast.error("Invalid file type for Chest X-Ray. Only images or PDFs are allowed.");
          focusInvalidField();
          return false;
        }

        // ✅ Laboratory Test Validation (Only Numeric Fields)
        const numericTests = ["fbs", "uric_acid", "triglycerides", "t_cholesterol", "creatinine"];

        for (let test of numericTests) {
          if (data[test] && isNaN(Number(data[test]))) {
            toast.error(`Invalid input for ${test.replace("_", " ")}. Please enter a numeric value.`);
            focusInvalidField();
            return false;
          }
        }

        // 🔥 Final Evaluation (Required)
        if (!data.final_evaluation.trim()) {
          toast.error("Final Evaluation is required.");
          focusInvalidField();
          return false;
        }

        // 🔥 Plan Recommendation (Required)
        if (!data.plan_recommendation.trim()) {
          toast.error("Plan/Recommendation is required.");
          focusInvalidField();
          return false;
        }

        return true;

      default:
        return true;
    }

    return true; // ✅ Passed
  };

  const focusInvalidField = () => {
    const invalidInput = document.querySelector("input:invalid");
    if (invalidInput) {
      invalidInput.scrollIntoView({ behavior: "smooth", block: "center" }); // Smooth scroll
      invalidInput.focus();
    }
  };


  const handleSave = async () => {
    // 🔥 Run Final Validation
    if (!validateStep()) {
      toast.error("Please complete all required fields before submission.");
      focusInvalidField();
      return; // Stop Submission if Validation Fails
    }

    // Confirm Submission
    const confirmed = window.confirm("Are you sure you want to submit this Medical Record?");
    if (!confirmed) return;

    data.family_histories = data.family_histories.map((history) => ({
      condition: history.condition,
      Father: history.Father,
      Mother: history.Mother,
      Sister: history.Sister.filter((s) => s.trim() !== ""),
      Brother: history.Brother.filter((b) => b.trim() !== ""),
      remarks: history.remarks,
    }));

    data.physical_examinations = data.physical_examinations.map((exam) => ({
      name: exam.name,
      result: exam.result,
      remarks: exam.remarks,
    }));

    post(route("medical-records.store"), {
      onSuccess: () => {
        toast.success("✅ Medical record saved successfully!");

        if (!selectedRecord) {
          setRecords([{ id: Date.now(), ...data }, ...records]);
        } else {
          const updated = records.map((r) =>
            r.id === selectedRecord.id ? { ...data } : r
          );
          setRecords(updated);
        }
        reset();
        setIsOpen(false);
      },
      onError: () => {
        toast.error("❌ Failed to save medical record.");
      },
    });
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this record?")) {
      setRecords(records.filter((r) => r.id !== id));
      toast.success("Record deleted successfully.");
    }
  };

  const nextStep = () => {
    if (!validateStep()) {
      focusInvalidField(); // Auto Focus on the First Invalid Input
      return; // Stop from going to the next step
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold text-green-700">Medical Records</h2>

      <Button onClick={handleCreateNew} className="mb-4 bg-blue-500 text-white">
        Create New Medical Record
      </Button>

      {records.length > 0 ? (
        records.map((record) => (
          <div key={record.id} className="p-4 bg-white shadow-md rounded-lg flex justify-between">
            <div>
              <p>
                <strong>Created by:</strong> {record.createdBy}
              </p>
              <p>
                <strong>Date:</strong> {record.date}
              </p>
            </div>
            <div className="space-x-2">
              <Button onClick={() => handleEdit(record)} className="bg-green-600 text-white">
                Edit
              </Button>
              <Button onClick={() => handleDelete(record.id)} className="bg-red-600 text-white">
                Delete
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-700 mt-4">No medical records available.</p>
      )}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex flex-col max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-semibold text-green-700">
                {selectedRecord ? "Edit Medical Record" : "New Medical Record"}
              </h2>
              <Button onClick={() => setIsOpen(false)} className="bg-gray-500">
                Close
              </Button>
            </div>

            {step === 1 && <Step1 formData={data} setFormData={setData} />}
            {step === 2 && <Step2 formData={data} setFormData={setData} />}
            {step === 3 && <Step3 formData={data} setFormData={setData} patient={patient} />}
            {step === 4 && <Step4 formData={data} setFormData={setData} />}
            {step === 5 && <Step5 formData={data} setFormData={setData} />}
            {step === 6 && <Step6 formData={data} setFormData={setData} />}

            <div className="mt-4 flex justify-between">
              {step > 1 && (
                <Button onClick={prevStep} className="bg-gray-400">
                  Back
                </Button>
              )}
              {step < 6 ? (
                <Button onClick={nextStep} className="bg-green-600">
                  Next
                </Button>
              ) : (
                <Button onClick={handleSave} className="bg-blue-600">
                  {processing ? "Saving..." : "Submit"}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordDialog;
