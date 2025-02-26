// components/PatientForm/FormStep6.jsx
const FormStep6 = ({ formData, setFormData, isEditing }) => {
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    return (
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Vaccination Status</h3>
  
        <div className="flex flex-col mb-6">
          <label className="font-medium text-green-700">Vaccination Details:</label>
          <input
            type="text"
            name="vaccinationDetails"
            value={formData.vaccinationDetails || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
            placeholder="Enter vaccination details"
          />
        </div>
  
        <h3 className="text-xl font-semibold text-green-700 mb-4">Final Evaluation</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="finalEvaluation"
              value="Class A"
              checked={formData.finalEvaluation === "Class A"}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span>Class A (Physically Fit)</span>
          </label>
  
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="finalEvaluation"
              value="Class B"
              checked={formData.finalEvaluation === "Class B"}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span>Class B (Fit with Minor Illness)</span>
          </label>
  
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="finalEvaluation"
              value="Pending"
              checked={formData.finalEvaluation === "Pending"}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 focus:ring-green-500"
            />
            <span>Pending (Needs Clearance)</span>
          </label>
        </div>
  
        <h3 className="text-xl font-semibold text-green-700 mb-4">Plan/Recommendation</h3>
  
        <div className="flex flex-col">
          <label className="font-medium text-green-700">Plan/Recommendation:</label>
          <textarea
            name="planRecommendation"
            value={formData.planRecommendation || ""}
            onChange={handleInputChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full h-32 focus:ring-green-500 focus:border-green-500"
            placeholder="Enter plan or recommendation"
          ></textarea>
        </div>
      </div>
    );
  };
  
  export default FormStep6;
  