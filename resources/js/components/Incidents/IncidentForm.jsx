import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const IncidentForm = ({ open, setOpen, selectedIncident, handleSave }) => {
  const [incidentData, setIncidentData] = useState(
    selectedIncident || {
      history: "",
      nature: "",
      date: "",
      time: "",
      description: "",
      treatedInClinic: false,
      referredToHospital: false,
      hospitalName: "",
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setIncidentData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = () => {
    handleSave(incidentData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-700">
            {selectedIncident ? "Edit" : "New"} Incident Report
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* History */}
          <div>
            <label className="block text-sm font-medium text-gray-700">History:</label>
            <input
              type="text"
              name="history"
              value={incidentData.history}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Enter history"
            />
          </div>

          {/* Nature of Incident */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Nature of Incident:</label>
            <input
              type="text"
              name="nature"
              value={incidentData.nature}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
              placeholder="Describe the nature of the incident"
            />
          </div>

          {/* Date of Incident */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Date of Incident:</label>
            <input
              type="date"
              name="date"
              value={incidentData.date}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Time of Incident */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Time of Incident:</label>
            <input
              type="time"
              name="time"
              value={incidentData.time}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
            />
          </div>

          {/* Description of Injury */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description of Injury Sustained:</label>
            <textarea
              name="description"
              value={incidentData.description}
              onChange={handleChange}
              className="border border-gray-300 rounded p-2 w-full"
              rows="3"
              placeholder="Describe the injury"
            ></textarea>
          </div>

          {/* Separator */}
          <hr className="border-gray-300 my-4" />

          {/* Management Section */}
          <div>
            <label className="block text-lg font-medium text-gray-900">Management:</label>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                name="treatedInClinic"
                checked={incidentData.treatedInClinic}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Treated in Pamantasan ng Cabuyao Clinic</label>
            </div>
            <div className="flex items-center space-x-2 mt-2">
              <input
                type="checkbox"
                name="referredToHospital"
                checked={incidentData.referredToHospital}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 border-gray-300 rounded"
              />
              <label className="text-sm text-gray-700">Referred to Hospital, please specify:</label>
            </div>
            {incidentData.referredToHospital && (
              <input
                type="text"
                name="hospitalName"
                value={incidentData.hospitalName}
                onChange={handleChange}
                className="border border-gray-300 rounded p-2 w-full mt-2"
                placeholder="Enter hospital name"
              />
            )}
          </div>
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <Button onClick={() => setOpen(false)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default IncidentForm;
