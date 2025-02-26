// components/PatientForm/FormStep1.jsx
const FormStep1 = () => {
    return (
      <div>
        <h3>Review of System</h3>
        <label><input type="checkbox" /> Abdominal Pain</label>
        <label><input type="checkbox" /> Blurring of Vision</label>
        <label><input type="checkbox" /> Chest Pain</label>
        <label><input type="checkbox" /> Cough and Colds</label>
        <label><input type="checkbox" /> Fever</label>
        <label><input type="text" placeholder="Others" /></label>
      </div>
    );
  };
  
  export default FormStep1;
  