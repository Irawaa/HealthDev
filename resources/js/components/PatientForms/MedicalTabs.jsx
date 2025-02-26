// components/PatientForm/MedicalTabs.jsx
import { useState } from "react";
import FormStep1 from "./FormStep1";
import FormStep2 from "./FormStep2";
import FormStep3 from "./FormStep3";
import FormStep4 from "./FormStep4";
import FormStep5 from "./FormStep5";
import FormStep6 from "./FormStep6";

const MedicalTabs = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 6));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  return (
    <div>
      {step === 1 && <FormStep1 />}
      {step === 2 && <FormStep2 />}
      {step === 3 && <FormStep3 />}
      {step === 4 && <FormStep4 />}
      {step === 5 && <FormStep5 />}
      {step === 6 && <FormStep6 />}

      <div className="nav-buttons">
        {step > 1 && <button onClick={prevStep}>Back</button>}
        {step < 6 && <button onClick={nextStep}>Next</button>}
      </div>
    </div>
  );
};

export default MedicalTabs;
