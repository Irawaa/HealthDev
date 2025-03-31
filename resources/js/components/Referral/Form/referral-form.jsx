import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import LaboratoryForm from "@/components/Referral/Form/laboratory-form";
import GeneralReferralForm from "@/components/Referral/Form/general-referral-form";

const ReferralForm = ({ open, setOpen, patient, referral }) => {
  // Determine the type of referral being edited
  const isLabExamEdit = referral && patient?.laboratory_exam_referrals?.some((r) => r.id === referral.id);
  const isGeneralEdit = referral && patient?.general_referrals?.some((r) => r.id === referral.id);

  // Set active tab based on the referral type being edited
  const [activeTab, setActiveTab] = useState(isLabExamEdit ? "laboratory" : "general");

  useEffect(() => {
    if (isLabExamEdit) setActiveTab("laboratory");
    if (isGeneralEdit) setActiveTab("general");
  }, [isLabExamEdit, isGeneralEdit]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-green-500 w-full max-w-3xl h-[80vh] flex flex-col">
        {/* Tabs */}
        <div className="flex border-b mb-4">
          {/* General Referral Tab (Disabled if editing Lab Exam) */}
          <button
            className={`py-2 px-4 w-1/2 ${
              activeTab === "general" ? "border-b-2 border-green-500 font-bold text-green-700" : "text-gray-500"
            } ${isLabExamEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isLabExamEdit && setActiveTab("general")}
            disabled={isLabExamEdit}
          >
            General Referral
          </button>

          {/* Laboratory Referral Tab (Disabled if editing General) */}
          <button
            className={`py-2 px-4 w-1/2 ${
              activeTab === "laboratory" ? "border-b-2 border-green-500 font-bold text-green-700" : "text-gray-500"
            } ${isGeneralEdit ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !isGeneralEdit && setActiveTab("laboratory")}
            disabled={isGeneralEdit}
          >
            Laboratory Referral
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-2">
          {activeTab === "general" ? (
            <GeneralReferralForm patient={patient} setOpen={setOpen} referral={referral} />
          ) : (
            <LaboratoryForm patient={patient} setOpen={setOpen} referral={referral} />
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
