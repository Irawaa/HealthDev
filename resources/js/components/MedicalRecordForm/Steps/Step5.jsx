import { useState, useEffect } from "react";
import Cookies from "js-cookie";

// Constants
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
  "General Survey",
  "Eyes/Ear/Nose/Throat",
  "Hearing",
  "Vision",
  "Lymph Nodes",
  "Heart",
  "Lungs",
  "Abdomen",
  "Skin",
  "Extremities",
];

const Step5 = ({ formData, setFormData }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [siblingToDelete, setSiblingToDelete] = useState(null);
  useEffect(() => {
    if (!formData?.family_histories || !formData?.physical_examinations) {
      setFormData((prev) => ({
        ...prev,
        family_histories: prev?.family_histories?.length > 0 ? prev.family_histories : [],
        physical_examinations: prev?.physical_examinations?.length > 0
          ? prev.physical_examinations  // ✅ Use retrieved data if available
          : bodyParts.map((part) => ({
            name: part,
            result: "Normal",
            remarks: "",
          })),
      }));
    }
  }, [formData, setFormData]);

  useEffect(() => {
    const savedData = Cookies.get("medical_form");
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, [setFormData]);

  useEffect(() => {
    if (formData) {
      Cookies.set("medical_form", JSON.stringify(formData), { expires: 7 });
    }
  }, [formData]); // ✅ Runs only when formData updates

  // Toggle Section Expansion
  const toggleSection = (condition) => {
    setExpandedSections((prev) => ({
      ...prev,
      [condition]: !prev[condition],
    }));
  };

  // Handle Remarks Change
  const handleInputChange = (e, index, member, subIndex = null) => {
    const { value } = e.target;
    setFormData((prev) => {
      const updatedHistories = [...prev.family_histories];
      if (subIndex !== null) {
        updatedHistories[index][member][subIndex] = value;
      } else {
        updatedHistories[index][member] = value;
      }
      const updatedData = { ...prev, family_histories: updatedHistories };
      Cookies.set("medical_form", JSON.stringify(updatedData), { expires: 7 }); // Save to cookies
      return updatedData;
    });
  };

  const handleExamChange = (e, part, field) => {
    const { value } = e.target;

    setFormData((prev) => {
      const updatedExaminations = prev.physical_examinations.map((exam) =>
        exam.name === part ? { ...exam, [field]: value } : exam
      );

      const updatedData = { ...prev, physical_examinations: updatedExaminations };
      Cookies.set("medical_form", JSON.stringify(updatedData), { expires: 7 }); // Save to cookies
      return updatedData;
    });
  };


  // Add sibling
  const addSibling = (index, member) => {
    setFormData((prev) => {
      const updatedHistories = [...prev.family_histories];
      updatedHistories[index][member].push("");
      const updatedData = { ...prev, family_histories: updatedHistories };
      Cookies.set("medical_form", JSON.stringify(updatedData), { expires: 7 }); // Save to cookies
      return updatedData;
    });
  };


  // Delete sibling
  const deleteSibling = () => {
    if (siblingToDelete) {
      setFormData((prev) => {
        const updatedHistories = prev.family_histories.map((history) => {
          if (history.condition === siblingToDelete.condition) {
            return {
              ...history,
              [siblingToDelete.member]: history[siblingToDelete.member].filter(
                (_, i) => i !== siblingToDelete.index
              ),
            };
          }
          return history;
        });

        const updatedData = { ...prev, family_histories: updatedHistories };
        Cookies.set("medical_form", JSON.stringify(updatedData), { expires: 7 }); // Save to cookies
        return updatedData;
      });
      setSiblingToDelete(null);
    }
  };


  const removeSibling = (index, member, subIndex) => {
    setFormData((prev) => {
      const updatedHistories = [...prev.family_histories];
      updatedHistories[index][member] = updatedHistories[index][member].filter(
        (_, i) => i !== subIndex
      );
      const updatedData = { ...prev, family_histories: updatedHistories };
      Cookies.set("medical_form", JSON.stringify(updatedData), { expires: 7 }); // Save to cookies
      return updatedData;
    });
  };


  return (
    <div className="p-4">
      {/* Family History Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4">
        Family History
      </h3>
      <div className="space-y-4">
        {formData.family_histories?.map((history, index) => (
          <CollapsibleSection
            key={history.condition}
            title={history.condition}
            toggle={() => toggleSection(history.condition)}
            expanded={expandedSections[history.condition]}
          >
            <div
              className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${expandedSections[history.condition]
                ? "max-h-[500px]"
                : "max-h-0"
                }`}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4">
                {/* Father & Mother Inputs */}
                {["Father", "Mother"].map((member) => (
                  <TextInput
                    key={`${history.condition}-${member}`}
                    label={member}
                    value={history[member]}
                    onChange={(e) => handleInputChange(e, index, member)}
                  />
                ))}

                {/* Brother & Sister Inputs with Dynamic Add/Remove */}
                {["Brother", "Sister"].map((member) => (
                  <div key={`${history.condition}-${member}`}>
                    {history[member].map((sibling, subIndex) => (
                      <div key={subIndex} className="flex items-center gap-2">
                        <TextInput
                          label={`${member} ${subIndex + 1}`}
                          value={sibling}
                          onChange={(e) =>
                            handleInputChange(e, index, member, subIndex)
                          }
                        />
                        <DeleteButton
                          text="❌"
                          onClick={() => removeSibling(index, member, subIndex)}
                        />
                      </div>
                    ))}
                    <AddButton
                      text={`+ Add ${member}`}
                      onClick={() => addSibling(index, member)}
                    />
                  </div>
                ))}

                {/* Overall Remarks Input */}
                <TextInput
                  label="Overall Remarks"
                  value={history.remarks}
                  onChange={(e) => handleInputChange(e, index, "remarks")}
                />
              </div>
            </div>
          </CollapsibleSection>
        ))}
      </div>

      {/* Delete Sibling Confirmation */}
      {siblingToDelete && (
        <DeleteConfirmation
          sibling={siblingToDelete}
          onDelete={deleteSibling}
          onCancel={() => setSiblingToDelete(null)}
        />
      )}

      {/* Separator */}
      <hr className="border-t-2 border-green-400 my-6" />

      {/* Physical Examination Section */}

      <CollapsibleSection
        title="Physical Examination"
        toggle={() => toggleSection("PhysicalExam")}
        expanded={expandedSections["PhysicalExam"]}
      >
        <div
          className={`transition-[max-height] duration-300 ease-in-out overflow-hidden ${expandedSections["PhysicalExam"] ? "max-h-[1000px]" : "max-h-0"
            }`}
        >
          <div className="overflow-x-auto mt-4 p-4">
            <table className="min-w-full bg-white border border-green-300 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-green-200 text-green-900">
                  <th className="border border-green-300 px-4 py-2 text-left">
                    Body Part
                  </th>
                  <th className="border border-green-300 px-4 py-2 text-left">
                    Normal / Abnormal
                  </th>
                  <th className="border border-green-300 px-4 py-2 text-left">
                    Remarks
                  </th>
                </tr>
              </thead>
              <tbody>
                {bodyParts.map((part) => {
                  const exam = formData.physical_examinations.find(
                    (exam) => exam.name === part
                  );

                  return (
                    <tr key={part} className="border-t border-green-300">
                      <td className="border border-green-300 px-4 py-2 font-semibold text-green-800">
                        {part}
                      </td>

                      {/* Radio buttons for Normal/Abnormal */}
                      <td className="border border-green-300 px-4 py-2">
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`${part}-result`}
                              value="Normal"
                              checked={exam?.result === "Normal"}
                              onChange={(e) =>
                                handleExamChange(e, part, "result")
                              }
                              className="form-radio text-green-600"
                            />
                            <span className="text-green-800">Normal</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`${part}-result`}
                              value="Abnormal"
                              checked={exam?.result === "Abnormal"}
                              onChange={(e) =>
                                handleExamChange(e, part, "result")
                              }
                              className="form-radio text-red-600"
                            />
                            <span className="text-red-800">Abnormal</span>
                          </label>
                        </div>
                      </td>

                      {/* Remarks field always visible */}
                      <td className="border border-green-300 px-4 py-2">
                        <TextInput
                          value={exam?.remarks || ""}
                          onChange={(e) => handleExamChange(e, part, "remarks")}
                          placeholder={
                            exam?.result === "Abnormal"
                              ? "Abnormal Condition Remarks"
                              : "Remarks"
                          }
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </CollapsibleSection>
    </div>
  );
};

// Reusable UI Components (Green Theme)
const CollapsibleSection = ({ title, children, toggle, expanded }) => (
  <div className="border border-green-400 rounded-lg shadow-sm bg-green-50 mt-4">
    <button
      className="w-full flex justify-between p-4 bg-green-200 text-green-900 font-semibold"
      onClick={() => toggle(title)}
    >
      {title}
      <span>{expanded ? "▲" : "▼"}</span>
    </button>
    {expanded && <div className="p-4">{children}</div>}
  </div>
);

const TextInput = ({ label, value, onChange }) => (
  <div className="flex flex-col mb-3">
    <label className="text-sm font-medium text-green-700">{label}</label>
    <input
      type="text"
      value={value}
      onChange={onChange}
      className="border border-green-400 rounded p-2 focus:ring-0 focus:border-green-600"
    />
  </div>
);

const AddButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
  >
    {text}
  </button>
);

const DeleteButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
  >
    {text}
  </button>
);

const DeleteConfirmation = ({ sibling, onDelete, onCancel }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
      <h2 className="text-lg font-semibold text-green-700">Confirm Delete</h2>
      <p className="text-gray-600 mt-2">
        Are you sure you want to delete <strong>{sibling}</strong>?
      </p>
      <div className="mt-4 flex justify-center space-x-4">
        <DeleteButton text="Yes, Delete" onClick={onDelete} />
        <button
          onClick={onCancel}
          className="bg-green-300 px-4 py-2 rounded hover:bg-green-400"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);

export default Step5;