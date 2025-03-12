import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import PreParticipatoryForm from "@/components/Pre-Participatory/pre-participatory-form"; // Ensure this is correctly imported

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

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h2 className="text-green-700 font-bold text-lg">Pre-Participatory Medical Evaluations</h2>

      {/* Create Evaluation Button */}
      <Button className="bg-blue-600 text-white px-4 py-2 rounded mt-2" onClick={() => setShowForm(true)}>
        Create New Evaluation
      </Button>

      {/* Show Form Component When Needed */}
      {showForm && <PreParticipatoryForm open={showForm} setOpen={setShowForm} onSave={handleCreate} />}

      {/* List of Evaluations */}
      <div className="mt-4">
        {evaluations.length > 0 ? (
          evaluations.map((evalItem) => (
            <div key={evalItem.id} className="bg-white p-4 rounded-lg shadow my-2 flex justify-between items-center">
              <div>
                <p className="text-gray-800">
                  <strong>Participant:</strong> {evalItem.participant} | <strong>Sport:</strong> {evalItem.sport}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Status:</strong> {evalItem.status || "Pending"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-gray-600 text-white px-3 py-1 rounded" onClick={() => setSelectedEvaluation(evalItem)}>
                  View
                </Button>
                <Button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(evalItem.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No evaluations available.</p>
        )}
      </div>

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
