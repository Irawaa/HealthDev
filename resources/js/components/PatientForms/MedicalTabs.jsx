// components/PatientForm/MedicalTabs.jsx
import { useState } from "react";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import FormStep4 from "./FormStep4";
import FormStep5 from "./FormStep5";
import FormStep6 from "./FormStep6";

const MedicalTabs = ({ formData, setFormData, isEditing }) => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      {step === 1 && <FormStep1 formData={formData} setFormData={setFormData} isEditing={isEditing} />}
      {step === 2 && <FormStep2 formData={formData} setFormData={setFormData} isEditing={isEditing} />}
      {step === 3 && <FormStep3 formData={formData} setFormData={setFormData} isEditing={isEditing} />}
      {step === 4 && <FormStep4 formData={formData} setFormData={setFormData} isEditing={isEditing} />}
      {step === 5 && <FormStep5 formData={formData} setFormData={setFormData} isEditing={isEditing} />}
      {step === 6 && <FormStep6 formData={formData} setFormData={setFormData} isEditing={isEditing} />}

      <div className="flex justify-between mt-4">
        {step > 1 && <button onClick={prevStep} className="bg-gray-400 px-4 py-2 rounded">Back</button>}
        {step < 6 && <button onClick={nextStep} className="bg-green-600 text-white px-4 py-2 rounded">Next</button>}
      </div>
    </div>
  );
};

export default MedicalTabs;
