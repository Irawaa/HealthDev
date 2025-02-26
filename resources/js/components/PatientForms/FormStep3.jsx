// components/PatientForm/FormStep3.jsx
const FormStep3 = ({ formData, setFormData, isEditing }) => {
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setFormData({ ...formData, [name]: checked });
    };
  
    const handleTextChange = (e) => {
      setFormData({ ...formData, othersMedicalHistory: e.target.value });
    };
  
    return (
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Past Medical History</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="allergy"
              checked={formData.allergy || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Allergy</span>
          </label>
  
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="hypertension"
              checked={formData.hypertension || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Hypertension</span>
          </label>
  
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="surgery"
              checked={formData.surgery || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Surgery</span>
          </label>
        </div>
  
        <div className="flex flex-col">
          <label className="font-medium text-green-700">Others:</label>
          <input
            type="text"
            name="othersMedicalHistory"
            value={formData.othersMedicalHistory || ""}
            onChange={handleTextChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
            placeholder="Specify other medical history"
          />
        </div>
      </div>
    );
  };
  
  export default FormStep3;
  