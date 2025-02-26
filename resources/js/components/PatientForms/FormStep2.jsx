// components/PatientForm/FormStep2.jsx
const FormStep2 = () => {
    return (
      <div>
        <h3>Deformities</h3>
        <label><input type="checkbox" /> Cleft Lip</label>
        <label><input type="checkbox" /> Scoliosis</label>
  
        <h3>Vital Signs</h3>
        <input type="text" placeholder="BP (mmHg)" />
        <input type="text" placeholder="RR (cpm)" />
        <input type="text" placeholder="HR (bpm)" />
        <input type="text" placeholder="Temp (°C)" />
      </div>
    );
  };
  
  export default FormStep2;
  