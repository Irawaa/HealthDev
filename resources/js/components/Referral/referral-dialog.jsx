import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import ReferralForm from "@/components/Referral/Form/referral-form";
import ReferralList from "@/components/Referral/List/referral-list"; // ✅ Import new list component

const ReferralModal = ({ activeTab, patient }) => {
    const [referrals, setReferrals] = useState([]);
    const [showForm, setShowForm] = useState(false);

    // Reset modal when switching tabs
    useEffect(() => {
        setShowForm(false);
    }, [activeTab]);

    if (activeTab !== "referrals") return null;

    const handleCreate = (newReferral) => {
        setReferrals([...referrals, { ...newReferral, id: Date.now() }]);
        setShowForm(false);
    };

    return (
        <div className="p-4 bg-green-50 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-green-800">Referrals</h2>

            {/* Create Referral Button */}
            <Button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow-md hover:bg-blue-700 transition" onClick={() => setShowForm(true)}>
                Create New Referral
            </Button>

            {/* Show Form Component When Needed */}
            <ReferralForm open={showForm} setOpen={setShowForm} onSave={handleCreate} patient={patient} />

            {/* Referral List Component */}
            <ReferralList referrals={referrals} setReferrals={setReferrals} patient={patient}/>
        </div>
    );
};

export default ReferralModal;
