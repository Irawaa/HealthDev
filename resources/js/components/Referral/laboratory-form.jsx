import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"; // UI Select

const schoolNurses = ["Nurse Alice", "Nurse Bob", "Nurse Charlie"];
const schoolPhysicians = ["Dr. Smith", "Dr. Johnson", "Dr. Lee"];

const LaboratoryForm = ({ onSave }) => {
  const [formData, setFormData] = useState({
    tests: [],
    magic8: [],
    others: "",
    schoolNurse: "",
    schoolPhysician: "",
  });

  const handleCheckboxChange = (category, value) => {
    setFormData((prev) => {
      const updated = prev[category].includes(value)
        ? prev[category].filter((item) => item !== value) // Remove if unchecked
        : [...prev[category], value]; // Add if checked
      return { ...prev, [category]: updated };
    });
  };

  const handleSelectChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    window.print(); // Simple print functionality
  };

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-green-500 w-full max-w-2xl mx-auto">
      <h2 className="text-green-700 font-bold text-xl text-center">Laboratory Referral Form</h2>

      {/* Standard Tests */}
      <div>
        <label className="font-bold text-green-700">Select Tests:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-gray-700">
          {["X-ray", "CBC", "Urinalysis", "Fecalysis", "Physical Examination", "Dental", "Hepatitis B Screening", "Pregnancy Test", "Drug Test"].map(
            (test) => (
              <label key={test} className="flex items-center">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={formData.tests.includes(test)}
                  onChange={() => handleCheckboxChange("tests", test)}
                />
                {test}
              </label>
            )
          )}
        </div>
      </div>

      {/* Magic 8 Tests */}
      <div>
        <label className="font-bold text-green-700">Magic 8:</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-gray-700">
          {["FBS", "Lipid Profile", "BUN", "BUA", "Creatine", "SGPT", "SGOT", "Others"].map((test) => (
            <label key={test} className="flex items-center">
              <input
                type="checkbox"
                className="mr-2"
                checked={formData.magic8.includes(test)}
                onChange={() => handleCheckboxChange("magic8", test)}
              />
              {test}
            </label>
          ))}
        </div>

        {/* "Others" input field (shows only when "Others" is checked) */}
        {formData.magic8.includes("Others") && (
          <input
            type="text"
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            placeholder="Specify other tests..."
            value={formData.others}
            onChange={(e) => setFormData((prev) => ({ ...prev, others: e.target.value }))}
          />
        )}
      </div>

      {/* School Nurse Dropdown */}
      <div>
        <label className="font-bold text-green-700">School Nurse:</label>
        <Select onValueChange={(value) => handleSelectChange("schoolNurse", value)}>
          <SelectTrigger className="mt-2 border border-gray-300 rounded p-2 w-full">
            <SelectValue placeholder="Select Nurse" />
          </SelectTrigger>
          <SelectContent>
            {schoolNurses.map((nurse) => (
              <SelectItem key={nurse} value={nurse}>
                {nurse}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* School Physician Dropdown */}
      <div>
        <label className="font-bold text-green-700">School Physician:</label>
        <Select onValueChange={(value) => handleSelectChange("schoolPhysician", value)}>
          <SelectTrigger className="mt-2 border border-gray-300 rounded p-2 w-full">
            <SelectValue placeholder="Select Physician" />
          </SelectTrigger>
          <SelectContent>
            {schoolPhysicians.map((physician) => (
              <SelectItem key={physician} value={physician}>
                {physician}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Action Buttons (Save & Print) */}
      <div className="flex flex-col sm:flex-row gap-3 mt-4">
        <Button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto" onClick={() => onSave(formData)}>
          Save
        </Button>
        <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto" onClick={handlePrint}>
          Print
        </Button>
      </div>
    </div>
  );
};

export default LaboratoryForm;
