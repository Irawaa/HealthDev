const FormStep5 = ({ formData, setFormData, isEditing }) => {
  const familyMembers = ["Father", "Mother", "Sister", "Brother"];
  const illnesses = [
    "Bronchial Asthma",
    "Cancer",
    "Diabetes Mellitus",
    "Kidney Disease",
    "Heart Disease",
    "Hypertension",
    "Mental Illness",
  ];
  const bodyParts = [
    "Eyes/Ears/Nose/Throat",
    "Hearing",
    "Vision",
    "Lymph Nodes",
    "Heart",
    "Lungs",
    "Abdomen",
    "Skin",
    "Extremities",
  ];

  // Handle Sickness Input Change
  const handleSicknessChange = (e, member, sickness) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      familyHistory: {
        ...formData.familyHistory,
        [member]: {
          ...formData.familyHistory?.[member],
          sicknesses: { ...formData.familyHistory?.[member]?.sicknesses, [sickness]: value },
        },
      },
    });
  };

  // Handle Remarks Change
  const handleRemarksChange = (e, member) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      familyHistory: {
        ...formData.familyHistory,
        [member]: { ...formData.familyHistory?.[member], remarks: value },
      },
    });
  };

  return (
    <div className="p-4">
      {/* 🏥 Family History Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4">Family History</h3>

      <div className="space-y-6">
        {familyMembers.map((member) => (
          <div key={member} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white">
            <h4 className="text-lg font-semibold text-green-800 mb-2">{member}</h4>

            {/* List of Sicknesses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {illnesses.map((sickness) => (
                <div key={sickness} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700">{sickness}</label>
                  <input
                    type="text"
                    value={formData.familyHistory?.[member]?.sicknesses?.[sickness] || ""}
                    onChange={(e) => handleSicknessChange(e, member, sickness)}
                    disabled={!isEditing}
                    className="border border-gray-300 rounded p-2 focus:ring-green-500 focus:border-green-500"
                    placeholder="Type or leave blank"
                  />
                </div>
              ))}
            </div>

            {/* Remarks */}
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700">Remarks</label>
              <input
                type="text"
                value={formData.familyHistory?.[member]?.remarks || ""}
                onChange={(e) => handleRemarksChange(e, member)}
                disabled={!isEditing}
                className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
                placeholder="Enter remarks"
              />
            </div>
          </div>
        ))}
      </div>

      {/* 🔹 Separator */}
      <div className="border-t-2 border-gray-300 my-6"></div>

      {/* 🩺 Physical Examination Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4">Physical Examination</h3>
      <table className="w-full border-collapse border border-gray-300 mb-6">
        <thead>
          <tr className="bg-green-100 text-green-800">
            <th className="border border-gray-300 p-2">Body Part</th>
            <th className="border border-gray-300 p-2">Normal</th>
            <th className="border border-gray-300 p-2">Abnormal</th>
          </tr>
        </thead>
        <tbody>
          {bodyParts.map((part) => (
            <tr key={part} className="text-center">
              <td className="border border-gray-300 p-2 font-medium">{part}</td>

              {/* Normal Input Field */}
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={formData.physicalExam?.[part]?.normal || ""}
                  onChange={(e) => handleExamChange(e, part, "normal")}
                  disabled={!isEditing}
                  className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter normal status"
                />
              </td>

              {/* Abnormal Input Field */}
              <td className="border border-gray-300 p-2">
                <input
                  type="text"
                  value={formData.physicalExam?.[part]?.abnormal || ""}
                  onChange={(e) => handleExamChange(e, part, "abnormal")}
                  disabled={!isEditing}
                  className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter abnormal status"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FormStep5;
