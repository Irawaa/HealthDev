// components/PatientForm/FormStep5.jsx
const FormStep5 = () => {
    return (
      <div>
        <h3>Physical Examination</h3>
        <label>General Survey:</label>
        <select>
          <option>Normal</option>
          <option>Abnormal</option>
        </select>
  
        <label>Eyes/Ears/Nose/Throat:</label>
        <select>
          <option>Normal</option>
          <option>Abnormal</option>
        </select>
  
        <label>Hearing:</label>
        <select>
          <option>Normal</option>
          <option>Abnormal</option>
        </select>
  
        <h3>Lab Tests</h3>
        <input type="text" placeholder="Blood Chemistry" />
        <input type="text" placeholder="Triglycerides" />
        <input type="text" placeholder="FBS" />
        <input type="text" placeholder="Total Cholesterol" />
        <input type="text" placeholder="Uric Acid" />
        <input type="text" placeholder="Creatinine" />
  
        <h3>Chest X-Ray</h3>
        <input type="file" />
      </div>
    );
  };
  
  export default FormStep5;
  