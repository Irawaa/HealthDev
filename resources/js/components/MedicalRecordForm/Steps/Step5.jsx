import { useState, useEffect } from "react";


const Step5 = ({ formData, setFormData }) => {
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


  const [expandedSections, setExpandedSections] = useState({});


  // 🛠️ Ensure formData is initialized
  useEffect(() => {
    if (!formData.familyHistory) {
      setFormData((prev) => ({
        ...prev,
        familyHistory: { Father: {}, Mother: {} },
        physicalExam: prev.physicalExam || {},
      }));
    }
  }, [formData, setFormData]);


  const toggleSection = (member) => {
    setExpandedSections((prev) => ({
      ...prev,
      [member]: !prev[member],
    }));
  };


  const handleSicknessChange = (e, member, sickness) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [member]: {
          ...prev.familyHistory?.[member],
          sicknesses: { ...prev.familyHistory?.[member]?.sicknesses, [sickness]: value },
        },
      },
    }));
  };


  const handleRemarksChange = (e, member) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [member]: { ...prev.familyHistory?.[member], remarks: value },
      },
    }));
  };


  const handleExamChange = (e, part, type) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      physicalExam: {
        ...prev.physicalExam,
        [part]: { ...prev.physicalExam?.[part], [type]: value },
      },
    }));
  };


  const addSibling = (gender) => {
    const siblings = Object.keys(formData.familyHistory || {}).filter((key) =>
      key.startsWith(gender)
    ).length + 1;


    setFormData((prev) => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [`${gender} ${siblings}`]: { sicknesses: {}, remarks: "" },
      },
    }));
  };


  return (
    <div className="p-4">
      {/* 🏥 Family History Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4">Family History</h3>


      <div className="space-y-4">
        {["Father", "Mother", ...Object.keys(formData.familyHistory || {}).filter((key) => key.startsWith("Brother") || key.startsWith("Sister"))].map(
          (member) => (
            <div key={member} className="border border-gray-300 rounded-lg shadow-sm bg-white">
              <button
                className="w-full flex justify-between p-4 bg-green-100 text-green-800 font-semibold"
                onClick={() => toggleSection(member)}
              >
                {member}
                <span>{expandedSections[member] ? "▲" : "▼"}</span>
              </button>


              {expandedSections[member] && (
                <div className="p-4">
                  {/* List of Sicknesses */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {illnesses.map((sickness) => (
                      <div key={sickness} className="flex flex-col">
                        <label className="text-sm font-medium text-gray-700">{sickness}</label>
                        <input
                          type="text"
                          value={formData.familyHistory?.[member]?.sicknesses?.[sickness] || ""}
                          onChange={(e) => handleSicknessChange(e, member, sickness)}
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
                      className="border border-gray-300 rounded p-2 w-full focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter remarks"
                    />
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>


      {/* Add Siblings */}
      <div className="flex space-x-4 mt-4">
        <button
          onClick={() => addSibling("Brother")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Brother
        </button>
        <button
          onClick={() => addSibling("Sister")}
          className="bg-pink-600 text-white px-4 py-2 rounded hover:bg-pink-700"
        >
          + Add Sister
        </button>
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


export default Step5;



