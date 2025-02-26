// components/PatientForm/FormStep3.jsx
const FormStep3 = () => {
    return (
      <div>
        <h3>Past Medical History</h3>
        <label><input type="checkbox" /> Allergy</label>
        <label><input type="checkbox" /> Hypertension</label>
        <label><input type="checkbox" /> Surgery</label>
        <input type="text" placeholder="Others" />
      </div>
    );
  };
  
  export default FormStep3;
  