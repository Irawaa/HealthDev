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
    setSelectedEvaluation(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setEvaluations(evaluations.filter((evalItem) => evalItem.id !== id));
  };

  const handleSelectEvaluation = (evaluation) => {
    setSelectedEvaluation(evaluation);
  };

  // Handle edit evaluation
  const handleEditClick = (evaluation) => {
    // Set the evaluation to edit
    setSelectedEvaluation(evaluation);
    setShowForm(true); // Show the form for editing
    console.log(evaluation);
  };

  return (
    <div className="p-4 bg-green-50 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-green-800">Pre-Participatory Medical Evaluations</h2>

      {/* Create Evaluation Button */}
      <Button
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition"
        onClick={() => {
          // When creating a new evaluation, reset selectedEvaluation
          setSelectedEvaluation(null);
          setShowForm(true);
        }}
      >
        Create New Evaluation
      </Button>

      {/* Show Form Component When Needed */}
      {showForm && <PreParticipatoryForm open={showForm} setOpen={setShowForm} onSave={handleCreate} patient={patient} selectedEvaluation={selectedEvaluation} />}

      {/* List of Evaluations */}
      <PreParticipatoryList
        evaluations={evaluations}
        onDelete={handleDelete}
        onSelect={handleSelectEvaluation}
        patient={patient}
        onEdit={handleEditClick}
      />
    </div>
  );
};

export default PreParticipatoryModal;
