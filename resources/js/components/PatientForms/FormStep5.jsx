// components/PatientForm/FormStep5.jsx
const FormStep5 = ({ formData, setFormData, isEditing }) => {
    const handleSelectChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleFileChange = (e) => {
      setFormData({ ...formData, chestXRay: e.target.files[0] });
    };
  
    return (
      <div className="p-4">
        <h3 className="text-xl font-semibold text-green-700 mb-4">Physical Examination</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div className="flex flex-col">
            <label className="font-medium text-green-700">General Survey:</label>
            <select
              name="generalSurvey"
              value={formData.generalSurvey || "Normal"}
              onChange={handleSelectChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full bg-white focus:ring-green-500 focus:border-green-500"
            >
              <option>Normal</option>
              <option>Abnormal</option>
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Eyes/Ears/Nose/Throat:</label>
            <select
              name="eent"
              value={formData.eent || "Normal"}
              onChange={handleSelectChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full bg-white focus:ring-green-500 focus:border-green-500"
            >
              <option>Normal</option>
              <option>Abnormal</option>
            </select>
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Hearing:</label>
            <select
              name="hearing"
              value={formData.hearing || "Normal"}
              onChange={handleSelectChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full bg-white focus:ring-green-500 focus:border-green-500"
            >
              <option>Normal</option>
              <option>Abnormal</option>
            </select>
          </div>
        </div>
  
        <h3 className="text-xl font-semibold text-green-700 mb-4">Lab Tests</h3>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Blood Chemistry:</label>
            <input
              type="text"
              name="bloodChemistry"
              value={formData.bloodChemistry || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Enter result"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Triglycerides:</label>
            <input
              type="text"
              name="triglycerides"
              value={formData.triglycerides || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Enter result"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">FBS:</label>
            <input
              type="text"
              name="fbs"
              value={formData.fbs || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Enter result"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Total Cholesterol:</label>
            <input
              type="text"
              name="totalCholesterol"
              value={formData.totalCholesterol || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Enter result"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Uric Acid:</label>
            <input
              type="text"
              name="uricAcid"
              value={formData.uricAcid || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Enter result"
            />
          </div>
  
          <div className="flex flex-col">
            <label className="font-medium text-green-700">Creatinine:</label>
            <input
              type="text"
              name="creatinine"
              value={formData.creatinine || ""}
              onChange={handleInputChange}
              disabled={!isEditing}
              className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
              placeholder="Enter result"
            />
          </div>
        </div>
  
        <h3 className="text-xl font-semibold text-green-700 mt-6">Chest X-Ray</h3>
  
        <div className="flex flex-col mt-2">
          <input
            type="file"
            name="chestXRay"
            onChange={handleFileChange}
            disabled={!isEditing}
            className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500 file:bg-green-100 file:border file:border-gray-300 file:rounded-lg file:px-3 file:py-2 file:cursor-pointer"
          />
        </div>
      </div>
    );
  };
  
  export default FormStep5;
  