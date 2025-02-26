// components/PatientForm/FormStep4.jsx
const FormStep4 = ({ formData, setFormData, isEditing }) => {
    const handleCheckboxChange = (e) => {
      const { name, checked } = e.target;
      setFormData({ ...formData, [name]: checked });
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    return (
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Personal & Social History</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {/* Smoker Checkbox */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="smoker"
              checked={formData.smoker || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Smoker</span>
          </label>
  
          {/* Sticks per day Input */}
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Sticks per day:</label>
            <input
              type="text"
              name="sticksPerDay"
              value={formData.sticksPerDay || ""}
              onChange={handleInputChange}
              disabled={!isEditing || !formData.smoker} // Only editable if smoker is checked
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
              placeholder="Enter sticks per day"
            />
          </div>
  
          {/* Alcohol Drinker Checkbox */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="alcoholDrinker"
              checked={formData.alcoholDrinker || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Alcohol Drinker</span>
          </label>
  
          {/* Illicit Drug Use Checkbox */}
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="illicitDrugUse"
              checked={formData.illicitDrugUse || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Illicit Drug Use</span>
          </label>
        </div>
      </div>
    );
  };
  
  export default FormStep4;
  