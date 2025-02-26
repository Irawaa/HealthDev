// components/PatientForm/FormStep6.jsx
const FormStep6 = () => {
    return (
      <div>
        <h3>Vaccination Status</h3>
        <input type="text" placeholder="Vaccination Details" />
  
        <h3>Final Evaluation</h3>
        <label><input type="radio" name="evaluation" /> Class A (Physically Fit)</label>
        <label><input type="radio" name="evaluation" /> Class B (Fit with Minor Illness)</label>
        <label><input type="radio" name="evaluation" /> Pending (Needs Clearance)</label>
  
        <h3>Plan/Recommendation</h3>
        <textarea placeholder="Enter plan/recommendation"></textarea>
      </div>
    );
  };
  
  export default FormStep6;
  