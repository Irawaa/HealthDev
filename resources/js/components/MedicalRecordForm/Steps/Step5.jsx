import { useState, useEffect } from "react";

// Constants
const illnesses = [
  "Bronchial Asthma", "Cancer", "Diabetes Mellitus", "Kidney Disease",
  "Heart Disease", "Hypertension", "Mental Illness",
];

const bodyParts = [
  "General Survey", "Eyes/Ear/Nose/Throat", "Hearing", "Vision", "Lymph Nodes",
  "Heart", "Lungs", "Abdomen", "Skin", "Extremities",
];

const Step5 = ({ formData, setFormData }) => {
  const [expandedSections, setExpandedSections] = useState({});
  const [siblingToDelete, setSiblingToDelete] = useState(null);

  useEffect(() => {
    if (!formData?.familyHistory) {
      setFormData((prev) => ({
        ...prev,
        familyHistory: { Father: {}, Mother: {} },
        physicalExam: prev?.physicalExam || {},
        physical_examinations: prev?.physical_examinations || bodyParts.map((part) => ({
          name: part,
          result: "Normal",
          remarks: "",
        })),
      }));
    }
  }, [formData, setFormData]);

  // Toggle Section Expansion
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Handle changes for family history sickness input
  const handleSicknessChange = (e, member, sickness) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [member]: {
          ...prev.familyHistory[member],
          sicknesses: { ...prev.familyHistory[member]?.sicknesses, [sickness]: value },
        },
      },
    }));
  };

  // Handle remarks input
  const handleRemarksChange = (e, member) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [member]: { ...prev.familyHistory[member], remarks: value },
      },
    }));
  };

  const handleExamChange = (e, part, field) => {
    const { value } = e.target;

    setFormData((prev) => ({
      ...prev,
      physical_examinations: prev.physical_examinations.map((exam) => {
        if (exam.name === part) {
          return { ...exam, [field]: value };
        }
        return exam;
      }),
    }));
  };

  // Add sibling
  const addSibling = (gender) => {
    const siblingCount = Object.keys(formData.familyHistory || {})
      .filter((key) => key.startsWith(gender)).length + 1;

    setFormData((prev) => ({
      ...prev,
      familyHistory: {
        ...prev.familyHistory,
        [`${gender} ${siblingCount}`]: { sicknesses: {}, remarks: "" },
      },
    }));
  };

  // Confirm sibling deletion
  const confirmDeleteSibling = (sibling) => setSiblingToDelete(sibling);

  // Delete sibling
  const deleteSibling = () => {
    if (siblingToDelete) {
      setFormData((prev) => {
        const updatedFamilyHistory = { ...prev.familyHistory };
        delete updatedFamilyHistory[siblingToDelete];
        return { ...prev, familyHistory: updatedFamilyHistory };
      });
      setSiblingToDelete(null);
    }
  };

  return (
    <div className="p-4">
      {/* Family History Section */}
      <h3 className="text-xl font-semibold text-green-700 mb-4">Family History</h3>
      <div className="space-y-4">
        {["Father", "Mother", ...Object.keys(formData.familyHistory || {}).filter((key) =>
          key.startsWith("Brother") || key.startsWith("Sister")
        )].map((member) => (
          <CollapsibleSection key={member} title={member} toggle={toggleSection} expanded={expandedSections[member]}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {illnesses.map((sickness) => (
                <TextInput
                  key={sickness}
                  label={sickness}
                  value={formData.familyHistory?.[member]?.sicknesses?.[sickness] || ""}
                  onChange={(e) => handleSicknessChange(e, member, sickness)}
                />
              ))}
            </div>
            <TextInput
              label="Remarks"
              value={formData.familyHistory?.[member]?.remarks || ""}
              onChange={(e) => handleRemarksChange(e, member)}
            />
            {(member.startsWith("Brother") || member.startsWith("Sister")) && (
              <DeleteButton text={`Delete ${member}`} onClick={() => confirmDeleteSibling(member)} />
            )}
          </CollapsibleSection>
        ))}
      </div>

      {/* Add Sibling Buttons */}
      <div className="flex space-x-4 mt-4">
        <AddButton text="+ Add Brother" onClick={() => addSibling("Brother")} />
        <AddButton text="+ Add Sister" onClick={() => addSibling("Sister")} />
      </div>

      {/* Sibling Delete Confirmation */}
      {siblingToDelete && <DeleteConfirmation sibling={siblingToDelete} onDelete={deleteSibling} onCancel={() => setSiblingToDelete(null)} />}

      {/* Separator */}
      <hr className="border-t-2 border-green-400 my-6" />

      {/* Physical Examination Section */}
      <CollapsibleSection
        title="Physical Examination"
        toggle={() => toggleSection("PhysicalExam")}
        expanded={expandedSections["PhysicalExam"]}
      >
        {expandedSections["PhysicalExam"] && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full bg-white border border-green-300 rounded-lg shadow-sm">
              <thead>
                <tr className="bg-green-200 text-green-900">
                  <th className="border border-green-300 px-4 py-2 text-left">Body Part</th>
                  <th className="border border-green-300 px-4 py-2 text-left">Normal / Abnormal</th>
                  <th className="border border-green-300 px-4 py-2 text-left">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {bodyParts.map((part) => {
                  const exam = formData.physical_examinations.find((exam) => exam.name === part);

                  return (
                    <tr key={part} className="border-t border-green-300">
                      <td className="border border-green-300 px-4 py-2 font-semibold text-green-800">{part}</td>

                      {/* Radio buttons for Normal/Abnormal */}
                      <td className="border border-green-300 px-4 py-2">
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              name={`${part}-result`}
                              value="Normal"
                              checked={exam?.result === "Normal"}
                              onChange={(e) => handleExamChange(e, part, "result")}
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
                              onChange={(e) => handleExamChange(e, part, "result")}
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
                          placeholder={exam?.result === "Abnormal" ? "Abnormal Condition Remarks" : "Remarks"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CollapsibleSection>
    </div>
  );
};

// Reusable UI Components (Green Theme)
const CollapsibleSection = ({ title, children, toggle, expanded }) => (
  <div className="border border-green-400 rounded-lg shadow-sm bg-green-50 mt-4">
    <button className="w-full flex justify-between p-4 bg-green-200 text-green-900 font-semibold" onClick={() => toggle(title)}>
      {title}
      <span>{expanded ? "▲" : "▼"}</span>
    </button>
    {expanded && <div className="p-4">{children}</div>}
  </div>
);

const TextInput = ({ label, value, onChange }) => (
  <div className="flex flex-col mb-3">
    <label className="text-sm font-medium text-green-700">{label}</label>
    <input type="text" value={value} onChange={onChange} className="border border-green-400 rounded p-2 focus:ring-green-500 focus:border-green-500" />
  </div>
);

const AddButton = ({ text, onClick }) => (
  <button onClick={onClick} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">{text}</button>
);

const DeleteButton = ({ text, onClick }) => (
  <button onClick={onClick} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">{text}</button>
);

const DeleteConfirmation = ({ sibling, onDelete, onCancel }) => (
  <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
      <h2 className="text-lg font-semibold text-green-700">Confirm Delete</h2>
      <p className="text-gray-600 mt-2">Are you sure you want to delete <strong>{sibling}</strong>?</p>
      <div className="mt-4 flex justify-center space-x-4">
        <DeleteButton text="Yes, Delete" onClick={onDelete} />
        <button onClick={onCancel} className="bg-green-300 px-4 py-2 rounded hover:bg-green-400">Cancel</button>
      </div>
    </div>
  </div>
);

export default Step5;
