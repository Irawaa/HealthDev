import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PreParticipatoryForm from "@/components/Pre-Participatory/Form/pre-participatory-form"; // Ensure this is correctly imported
import PreParticipatoryList from "@/components/Pre-Participatory/List/pre-participatory-list"; // Import the new List component

const PreParticipatoryModal = ({ activeTab, patient }) => {
  const [evaluations, setEvaluations] = useState([]); // Stores evaluations
  const [showForm, setShowForm] = useState(false);
  const [selectedEvaluation, setSelectedEvaluation] = useState(null); // Stores the evaluation to view

  // Log the active tab to debug
  console.log("Active Tab:", activeTab);

  // Reset modal when switching tabs
  useEffect(() => {
    setShowForm(false);
  }, [activeTab]);

  if (activeTab !== "pre-participatory") return null; // Ensure tab is matched correctly

  // If patient is missing, avoid crashing
  if (!patient) return <p className="text-red-500">No patient data available</p>;

  const handleCreate = (newEvaluation) => {
    setEvaluations([...evaluations, { ...newEvaluation, id: Date.now() }]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setEvaluations(evaluations.filter((evalItem) => evalItem.id !== id));
  };

  const handleSelectEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-800">Pre-Participatory Medical Evaluations</h2>

      {/* Create Evaluation Button */}
      <Button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
        onClick={() => setShowForm(true)}
      >
        Create New Evaluation
      </Button>

      {/* Show Form Component When Needed */}
      {showForm && <PreParticipatoryForm open={showForm} setOpen={setShowForm} onSave={handleCreate} patient={patient} />}

      {/* List of Evaluations */}
      <PreParticipatoryList evaluations={evaluations} onDelete={handleDelete} onSelect={handleSelectEvaluation} patient={patient} />

      {/* View Evaluation Modal */}
      {selectedEvaluation && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-green-700 font-bold text-lg mb-4">Evaluation Details</h2>
            <p className="text-gray-800">
              <strong>Participant:</strong> {selectedEvaluation.participant}
            </p>
            <p className="text-gray-800">
              <strong>Sport:</strong> {selectedEvaluation.sport}
            </p>
            <p className="text-gray-800">
              <strong>Status:</strong> {selectedEvaluation.status || "Pending"}
            </p>
            <div className="flex justify-end mt-4">
              <Button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setSelectedEvaluation(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PreParticipatoryModal;
