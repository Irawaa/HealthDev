import { useState } from "react";
import { Button } from "@/components/ui/button";
import LaboratoryForm from "@/components/Referral/laboratory-form";
import GeneralReferralForm from "@/components/Referral/general-referral-form"; // Import General Referral Form

const ReferralForm = ({ open, setOpen }) => {
  const [activeTab, setActiveTab] = useState("general");

  // State to store form data
  const [formData, setFormData] = useState({
    to: "",
    address: "",
    examinedOn: "",
    examinedDueTo: "",
    duration: "",
    impression: "",
    schoolNurse: "",
    schoolPhysician: "",
  });

  if (!open) return null; // Prevent rendering if modal is closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-green-500 w-full max-w-3xl h-[80vh] flex flex-col">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            className={`py-2 px-4 w-1/2 ${
              activeTab === "general" ? "border-b-2 border-green-500 font-bold text-green-700" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("general")}
          >
            General Referral
          </button>
          <button
            className={`py-2 px-4 w-1/2 ${
              activeTab === "laboratory" ? "border-b-2 border-green-500 font-bold text-green-700" : "text-gray-500"
            }`}
            onClick={() => setActiveTab("laboratory")}
          >
            Laboratory Referral
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-2">
          {activeTab === "general" ? (
            <GeneralReferralForm formData={formData} setFormData={setFormData} />
          ) : (
            <LaboratoryForm formData={formData} setFormData={setFormData} />
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-end mt-4">
          <Button className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReferralForm;
