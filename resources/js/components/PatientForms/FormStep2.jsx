// components/PatientForm/FormStep2.jsx
const FormStep2 = ({ formData, setFormData, isEditing }) => {
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
        <h3 className="text-xl font-semibold text-green-700 mb-4">Deformities</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="cleftLip"
              checked={formData.cleftLip || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Cleft Lip</span>
          </label>
  
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="scoliosis"
              checked={formData.scoliosis || false}
              onChange={handleCheckboxChange}
              disabled={!isEditing}
              className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500"
            />
            <span>Scoliosis</span>
          </label>
        </div>
  
        <h3 className="text-xl font-semibold text-green-700 mb-4">Vital Signs</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-green-700">BP (mmHg):</label>
            <input
              type="text"
              name="bp"
              value={formData.bp || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="120/80"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">RR (cpm):</label>
            <input
              type="text"
              name="rr"
              value={formData.rr || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Respiratory Rate"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">HR (bpm):</label>
            <input
              type="text"
              name="hr"
              value={formData.hr || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Heart Rate"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Temperature (°C):</label>
            <input
              type="text"
              name="temperature"
              value={formData.temperature || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Body Temperature"
            />
          </div>
        </div>
      </div>
    );
  };
  
  export default FormStep2;
  