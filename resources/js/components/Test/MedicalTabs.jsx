import { useState } from "react";
import { useForm } from "@inertiajs/react"; // Import useForm
import FormStep1 from "../MedicalRecordForm/Steps/Step1";
import FormStep2 from "../MedicalRecordForm/Steps/Step2";
import FormStep3 from "../MedicalRecordForm/Steps/Step3";
import FormStep4 from "../MedicalRecordForm/Steps/Step4";
import FormStep5 from "../MedicalRecordForm/Steps/Step5";
import FormStep6 from "../MedicalRecordForm/Steps/Step6";

const MedicalTabs = ({ record, patient }) => {
  const isNewRecord = !record; // Check if it's a new record

  // Initialize form with Inertia's useForm
  const { data, setData, post, processing } = useForm({
    patient_id: patient?.id || null,
    school_nurse_id: 1,
    school_physician_id: 2,
    recorded_by: "",
    review_of_systems: [],
    deformities: [],
  });

  const [step, setStep] = useState(1);
  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleSubmit = () => {
    console.log("Submitting data:", data);
    post(route("medical-records.store"), {
      onSuccess: () => console.log("Medical record saved!"),
    });
  };

  return (
    <div>
      {step === 1 && <FormStep1 formData={data} setFormData={setData} isEditing={true} />}
      {step === 2 && <FormStep2 formData={data} setFormData={setData} isEditing={true} />}
      {step === 3 && <FormStep3 formData={data} setFormData={setData} patient={patient} isEditing={true} />}
      {step === 4 && <FormStep4 formData={data} setFormData={setData} isEditing={true} />}
      {step === 5 && <FormStep5 formData={data} setFormData={setData} isEditing={true} />}
      {step === 6 && <FormStep6 formData={data} setFormData={setData} isEditing={true} />}

      <div className="flex justify-between mt-4">
        {step > 1 && <button onClick={prevStep} className="bg-gray-400 px-4 py-2 rounded">Back</button>}
        {step < 6 ? (
          <button onClick={nextStep} className="bg-green-600 text-white px-4 py-2 rounded">Next</button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded"
            disabled={processing}
          >
            {processing ? "Saving..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
};

export default MedicalTabs;
