import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import Step1 from "./Steps/Step1";
import Step2 from "./Steps/Step2";
import Step3 from "./Steps/Step3";
import Step4 from "./Steps/Step4";
import Step5 from "./Steps/Step5";
import Step6 from "./Steps/Step6";
import MedicalRecordsList from "./List/medical-records-list";
import useMedicalRecordValidation from "./hooks/useMedicalRecordValidation";


const MedicalRecordDialog = ({ patient }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [records, setRecords] = useState(patient?.medical_records || []);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [step, setStep] = useState(1);
  const { data, setData, post, put, processing, reset, errors } = useForm({
    patient_id: patient?.patient_id || null,
    school_physician_id: 1,

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
      {
        condition: "Bronchial Asthma",
        Father: "",
        Mother: "",
        Sister: [""],
        Brother: [""],
        remarks: "",
      },
      {
        condition: "Cancer",
        Father: "",
        Mother: "",
        Sister: [""],
        Brother: [""],
        remarks: "",
      },
      {
        condition: "Diabetes Mellitus",
        Father: "",
        Mother: "",
        Sister: [""],
        Brother: [""],
        remarks: "",
      },
      {
        condition: "Kidney Disease",
        Father: "",
        Mother: "",
        Sister: [""],
        Brother: [""],
        remarks: "",
      },
      {
        condition: "Heart Disease",
        Father: "",
        Mother: "",
        Sister: [""],
        Brother: [""],
        remarks: "",
      },
      {
        condition: "Hypertension",
        Father: "",
        Mother: "",
        Sister: [""],
        Brother: [""],
        remarks: "",
      },
      {
        condition: "Mental Illness",
        Father: "",
        Mother: "",
        Sister: [""],
        Brother: [""],
        remarks: "",
      },
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

  const { validateStep } = useMedicalRecordValidation(data, patient);

  const handleSave = async () => {
    if (!validateStep(step)) {
      toast.error("Please complete all required fields before submission.");
      return;
    }

    const confirmed = window.confirm(
      selectedRecord
        ? "Are you sure you want to update this Medical Record?"
        : "Are you sure you want to create this Medical Record?"
    );
    if (!confirmed) return;

    // 🔥 Clean data before submission
    const formattedData = {
      ...data,
      family_histories: data.family_histories.map((history) => ({
        condition: history.condition,
        Father: history.Father,
        Mother: history.Mother,
        Sister: history.Sister.filter((s) => s.trim() !== ""),
        Brother: history.Brother.filter((b) => b.trim() !== ""),
        remarks: history.remarks,
      })),
      physical_examinations: data.physical_examinations.map((exam) => ({
        name: exam.name,
        result: exam.result,
        remarks: exam.remarks,
      })),
    };

    console.log("Submitting Data:", formattedData);

    if (selectedRecord) {
      const formData = new FormData();

      // Append all non-file fields
      Object.keys(data).forEach((key) => {
        if (Array.isArray(data[key])) {
          formData.append(key, JSON.stringify(data[key])); // Convert arrays to JSON
        } else {
          formData.append(key, data[key]);
        }
      });

      // Append file separately
      if (data.chest_xray instanceof File) {
        formData.append("chest_xray", data.chest_xray);
      }

      console.log("Submitting FormData for update:", formData);

      // 🔄 Edit Mode (Update Existing Record)
      post(route("medical-records.update", selectedRecord.id), {
        data: formattedData,
        method: "post",
        preserveScroll: true,
        onSuccess: () => {
          console.log("Record Updated:", formattedData);
          toast.success("✅ Medical record updated successfully!");
          setRecords((prev) =>
            prev.map((record) =>
              record.id === selectedRecord.id ? { ...formattedData, id: record.id } : record
            )
          );
          reset();
          setSelectedRecord(null);
          setIsOpen(false);
        },
        onError: handleFormErrors,
      });
    } else {
      // ➕ Create Mode (New Record)
      post(route("medical-records.store"), {
        data: formattedData,
        method: "post",
        preserveScroll: true,
        onSuccess: () => {
          console.log("New Record Added:", formattedData);
          toast.success("✅ Medical record created successfully!");
          setRecords([{ id: Date.now(), ...formattedData }, ...records]); // Add new record to list
          reset();
          setIsOpen(false);
        },
        onError: handleFormErrors,
      });
    }
  };

  // 🔥 Handle form errors
  const handleFormErrors = (errors) => {
    console.error("Validation Errors:", errors);
    Object.entries(errors).forEach(([key, messages]) => {
      toast.error(Array.isArray(messages) ? messages.join(", ") : messages);
    });
  };

  const handleCreateNew = () => {
    reset();
    setSelectedRecord(null);
    setIsOpen(true);
    setStep(1);
  };

  const handleEditClick = (record) => {
    setSelectedRecord(record);

    setData({
      patient_id: record.patient_id || "",
      school_physician_id: record.school_physician_id || 1,

      // ✅ Review of Systems (Extract Symptoms)
      review_of_systems: record.review_of_systems?.map((symptom) => symptom.symptom) || [],
      others: record.review_of_systems?.find(symptom => symptom.symptom === "Others")?.pivot?.custom_symptom || "",

      // ✅ Deformities
      deformities: record.deformities?.map((deformity) => deformity.symptom) || [],

      // ✅ Vital Signs (From `vital_signs`)
      bp: record.vital_signs?.bp || "",
      rr: record.vital_signs?.rr || "",
      hr: record.vital_signs?.hr || "",
      temperature: record.vital_signs?.temperature || "",
      weight: record.vital_signs?.weight || "",
      height: record.vital_signs?.height || "",

      // ✅ Past Medical Histories (Extract Condition Names)
      past_medical_histories: record.past_medical_histories?.map((history) => history.condition_name) || [],
      other_condition: record.past_medical_histories?.find(history => history.condition_name === "Others")?.pivot?.custom_condition || "",

      // ✅ OB/Gyne History (Handle `null` values)
      menstruation: record.ob_gyne_history?.menstruation || "",
      duration: record.ob_gyne_history?.duration || "",
      dysmenorrhea: record.ob_gyne_history?.dysmenorrhea || false,
      pregnant_before: record.ob_gyne_history?.pregnant_before || false,
      num_of_pregnancies: record.ob_gyne_history?.num_of_pregnancies || "",
      last_menstrual_period: record.ob_gyne_history?.last_menstrual_period || "",

      // ✅ Personal & Social History
      alcoholic_drinker: record.personal_social_history?.alcoholic_drinker || "",
      smoker: Boolean(record.personal_social_history?.smoker),
      sticks_per_day: record.personal_social_history?.sticks_per_day || "",
      years_smoking: record.personal_social_history?.years_smoking || "",
      illicit_drugs: Boolean(record.personal_social_history?.illicit_drugs),
      eye_glasses: record.personal_social_history?.eye_glasses || false,
      contact_lens: record.personal_social_history?.contact_lens || false,
      eye_disorder_no: record.personal_social_history?.eye_disorder_no || false,

      // ✅ Family History
      family_histories: (() => {
        const familyHistoryMap = {};

        // Initialize with default structure
        [
          "Bronchial Asthma",
          "Cancer",
          "Diabetes Mellitus",
          "Kidney Disease",
          "Heart Disease",
          "Hypertension",
          "Mental Illness",
        ].forEach(condition => {
          familyHistoryMap[condition] = {
            condition,
            Father: "",
            Mother: "",
            Sister: [],
            Brother: [],
            remarks: "",
          };
        });

        // Populate from record data
        record.family_histories?.forEach(fh => {
          const condition = fh.condition;
          const member = fh.pivot.family_member;
          const remarks = fh.pivot.family_history_remarks || "";  // Correctly get remarks
          const overallRemarks = fh.pivot.overall_remarks || "";

          if (familyHistoryMap[condition]) {
            if (member.includes("Sister")) {
              familyHistoryMap[condition].Sister.push(remarks);
            } else if (member.includes("Brother")) {
              familyHistoryMap[condition].Brother.push(remarks);
            } else {
              familyHistoryMap[condition][member] = remarks; // Assign remarks to Father & Mother
            }
            familyHistoryMap[condition].remarks = overallRemarks;
          }
        });


        return Object.values(familyHistoryMap);
      })(),

      // ✅ Physical Examinations (Extract Names & Results)
      physical_examinations: record.physical_examinations?.map((exam) => ({
        id: exam.id, // Store ID to ensure correct updates
        name: exam.name,
        result: exam.pivot?.result ?? "Normal", // Ensure result is not undefined
        remarks: exam.pivot?.remarks ?? "", // Ensure remarks are properly initialized
      })) || [],

      // ✅ Medical Record Details
      chief_complaint: record.medical_record_detail?.chief_complaint || "",
      present_illness: record.medical_record_detail?.present_illness || "",
      medication: record.medical_record_detail?.medication || "",
      hospitalized: record.medical_record_detail?.hospitalized || false,
      hospitalized_reason: record.medical_record_detail?.hospitalized_reason || "",
      previous_surgeries: record.medical_record_detail?.previous_surgeries || false,
      surgery_reason: record.medical_record_detail?.surgery_reason || "",

      medical_record: record.medical_record_detail?.id,

      // ✅ Vaccination Status
      vaccination_status: record.medical_record_detail?.vaccination_status || "",

      // ✅ Laboratory Fields
      blood_chemistry: record.medical_record_detail?.blood_chemistry || "",
      fbs: record.medical_record_detail?.fbs || "",
      uric_acid: record.medical_record_detail?.uric_acid || "",
      triglycerides: record.medical_record_detail?.triglycerides || "",
      t_cholesterol: record.medical_record_detail?.t_cholesterol || "",
      creatinine: record.medical_record_detail?.creatinine || "",

      // ✅ Final Evaluation & Plan
      final_evaluation: record.final_evaluation || "",
      plan_recommendation: record.plan_recommendation || "",

      chest_xray: record.medical_record_detail?.chest_xray || "",
    });

    setIsOpen(true);
    setStep(1);
  };

  useEffect(() => {
    if (selectedRecord) {
      handleEditClick(selectedRecord);
    }
  }, [selectedRecord]);

  useEffect(() => {
    setRecords(patient?.medical_records || []);
  }, [patient?.medical_records]);

  const nextStep = () => {
    console.log("Data before next step:", data);

    if (selectedRecord.medical_record_detail?.chest_xray instanceof File) {
      console.log("This is a file:", record.medical_record_detail.chest_xray.name);
    } else {
      console.log("This is not a file.");
    }


    if (!validateStep(step)) {
      return;
    }
    setStep((prev) => Math.min(prev + 1, 6));
  };

  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-800">Medical Records</h2>

      <Button onClick={handleCreateNew} className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition">
        Create New Medical Record
      </Button>


      {/* Use the new MedicalRecordsList component */}
      <MedicalRecordsList
        patient={patient}
        onEdit={handleEditClick}
      />

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white w-full h-full p-6 overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-lg font-semibold text-green-700">
                {selectedRecord ? "Edit Medical Record" : "New Medical Record"}
              </h2>
              <Button onClick={() => setIsOpen(false)} className="bg-gray-500">
                Close
              </Button>
            </div>

            {/* Render steps conditionally */}
            {step === 1 && <Step1 formData={data} setFormData={setData} />}
            {step === 2 && <Step2 formData={data} setFormData={setData} />}
            {step === 3 && (
              <Step3 formData={data} setFormData={setData} patient={patient} />
            )}
            {step === 4 && <Step4 formData={data} setFormData={setData} />}
            {step === 5 && <Step5 formData={data} setFormData={setData} />}
            {step === 6 && <Step6 formData={data} setFormData={setData} />}

            {/* Navigation buttons */}
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
