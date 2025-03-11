import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button"; // Import Button component

const schoolNurses = ["Nurse Alice", "Nurse Bob", "Nurse Charlie"];
const schoolPhysicians = ["Dr. Smith", "Dr. Johnson", "Dr. Lee"];

const GeneralReferralForm = ({ formData, setFormData, onSave }) => {
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handlePrint = () => {
    if (!formData.to || !formData.examinedOn) {
      alert("Please fill in required fields before printing.");
      return;
    }
    window.print();
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-green-500 max-w-2xl mx-auto">
      <h2 className="text-green-700 font-bold text-2xl text-center mb-4">General Referral Form</h2>

      {/* Form Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* To */}
        <div className="col-span-2">
          <label className="font-semibold text-green-700">To:</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            placeholder="Enter recipient name..."
            value={formData.to}
            onChange={(e) => handleChange("to", e.target.value)}
          />
        </div>

        {/* Address */}
        <div className="col-span-2">
          <label className="font-semibold text-green-700">Address:</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            placeholder="Enter address..."
            value={formData.address}
            onChange={(e) => handleChange("address", e.target.value)}
          />
        </div>

        {/* Examined On */}
        <div>
          <label className="font-semibold text-green-700">Examined On:</label>
          <input
            type="date"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            value={formData.examinedOn}
            onChange={(e) => handleChange("examinedOn", e.target.value)}
          />
        </div>

        {/* Examined Due To */}
        <div>
          <label className="font-semibold text-green-700">Examined Due To:</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            placeholder="Reason for examination..."
            value={formData.examinedDueTo}
            onChange={(e) => handleChange("examinedDueTo", e.target.value)}
          />
        </div>

        {/* Duration of Days */}
        <div>
          <label className="font-semibold text-green-700">Duration of Days:</label>
          <input
            type="number"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            min="1"
            placeholder="Enter number of days..."
            value={formData.duration}
            onChange={(e) => handleChange("duration", e.target.value)}
          />
        </div>

        {/* With the Impression Of */}
        <div>
          <label className="font-semibold text-green-700">With the Impression Of:</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            placeholder="Enter impression..."
            value={formData.impression}
            onChange={(e) => handleChange("impression", e.target.value)}
          />
        </div>

        {/* School Nurse Dropdown */}
        <div>
          <label className="font-semibold text-green-700">School Nurse:</label>
          <Select onValueChange={(value) => handleChange("schoolNurse", value)}>
            <SelectTrigger className="mt-1 border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-green-500">
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
          <label className="font-semibold text-green-700">School Physician:</label>
          <Select onValueChange={(value) => handleChange("schoolPhysician", value)}>
            <SelectTrigger className="mt-1 border border-gray-300 rounded p-2 w-full focus:ring-2 focus:ring-green-500">
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
      </div>

      {/* Save & Print Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-6">
        <Button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded w-full sm:w-auto transition-all"
          onClick={() => onSave?.(formData)}
        >
          Save
        </Button>
        <Button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto transition-all"
          onClick={handlePrint}
        >
          Print
        </Button>
      </div>
    </div>
  );
};

export default GeneralReferralForm;
