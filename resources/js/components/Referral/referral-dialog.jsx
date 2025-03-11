import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReferralForm from "@/components/Referral/referral-form";

const ReferralModal = ({ activeTab, patient }) => {
  const [referrals, setReferrals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedReferral, setSelectedReferral] = useState(null); // Stores the referral to view

  // Reset modal when switching tabs
  useEffect(() => {
    setShowForm(false);
  }, [activeTab]);

  if (activeTab !== "referrals") return null;

  const handleCreate = (newReferral) => {
    setReferrals([...referrals, { ...newReferral, id: Date.now() }]);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    setReferrals(referrals.filter((ref) => ref.id !== id));
  };

  return (
    <div className="p-4 bg-blue-50 rounded-lg">
      <h2 className="text-green-700 font-bold text-lg">Referrals</h2>

      {/* Create Referral Button */}
      <Button className="bg-blue-600 text-white px-4 py-2 rounded mt-2" onClick={() => setShowForm(true)}>
        Create New Referral
      </Button>

      {/* Show Form Component When Needed */}
      <ReferralForm open={showForm} setOpen={setShowForm} onSave={handleCreate} />

      {/* List of Referrals */}
      <div className="mt-4">
        {referrals.length > 0 ? (
          referrals.map((ref) => (
            <div key={ref.id} className="bg-white p-4 rounded-lg shadow my-2 flex justify-between items-center">
              <div>
                <p className="text-gray-800">
                  <strong>Doctor:</strong> {ref.doctor} | <strong>Specialty:</strong> {ref.specialty}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Reason:</strong> {ref.reason || "No reason provided"}
                </p>
              </div>
              <div className="flex gap-2">
                <Button className="bg-gray-600 text-white px-3 py-1 rounded" onClick={() => setSelectedReferral(ref)}>
                  View
                </Button>
                <Button className="bg-red-600 text-white px-3 py-1 rounded" onClick={() => handleDelete(ref.id)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-2">No referrals available.</p>
        )}
      </div>

      {/* View Referral Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-green-700 font-bold text-lg mb-4">Referral Details</h2>
            <p className="text-gray-800">
              <strong>Doctor:</strong> {selectedReferral.doctor}
            </p>
            <p className="text-gray-800">
              <strong>Specialty:</strong> {selectedReferral.specialty}
            </p>
            <p className="text-gray-800">
              <strong>Reason:</strong> {selectedReferral.reason || "No reason provided"}
            </p>
            <div className="flex justify-end mt-4">
              <Button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setSelectedReferral(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralModal;
