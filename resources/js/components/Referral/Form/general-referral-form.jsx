import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { usePhysicianStaff } from "@/Pages/Patients/ProfilePage";

const GeneralReferralForm = ({ setOpen, patient, referral }) => {
  const physicianStaff = usePhysicianStaff();
  const isEditMode = !!referral;

  const { data, setData, post, put, processing } = useForm({
    patient_id: patient?.patient_id || null,
    to: referral?.to || "",
    address: referral?.address || "",
    examined_on: referral?.examined_on || "",
    examined_due_to: referral?.examined_due_to || "",
    duration: referral?.duration || "",
    impression: referral?.impression || "",
    school_physician_id: referral?.school_physician_id || "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditMode) {
      put(route("general-referrals.update", referral.id), {
        data,
        onSuccess: () => {
          toast.success("General referral updated successfully!");
          setOpen(false);
        },
      });
    } else {
      post(route("general-referrals.store"), {
        data,
        onSuccess: () => {
          toast.success("General referral created successfully!");
          setOpen(false);
        },
      });
    }
  };

  return (
    <div className="bg-white p-6 max-w-2xl mx-auto">
      <h2 className="text-green-700 font-bold text-2xl text-center mb-4">
        {isEditMode ? "Edit General Referral" : "New General Referral"}
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="font-semibold text-green-700">To:</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            placeholder="Enter recipient name..."
            value={data.to}
            onChange={(e) => setData("to", e.target.value)}
          />
        </div>

        <div className="col-span-2">
          <label className="font-semibold text-green-700">Address:</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            placeholder="Enter address..."
            value={data.address}
            onChange={(e) => setData("address", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-green-700">Examined On:</label>
          <input
            type="date"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            value={data.examined_on}
            onChange={(e) => setData("examined_on", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-green-700">Examined Due To:</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            placeholder="Reason for examination..."
            value={data.examined_due_to}
            onChange={(e) => setData("examined_due_to", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-green-700">Duration of Days:</label>
          <input
            type="number"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            min="1"
            placeholder="Enter number of days..."
            value={data.duration}
            onChange={(e) => setData("duration", e.target.value)}
          />
        </div>

        <div>
          <label className="font-semibold text-green-700">With the Impression Of:</label>
          <input
            type="text"
            className="mt-1 p-2 border border-gray-300 rounded w-full focus:ring-2 focus:ring-green-500"
            placeholder="Enter impression..."
            value={data.impression}
            onChange={(e) => setData("impression", e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">School Physician:</label>
          <select
            name="school_physician_id"
            value={data.school_physician_id || ""}
            onChange={(e) => setData("school_physician_id", e.target.value)}
            className="border border-gray-300 rounded p-2 w-full"
            required
          >
            <option value="">Select Physician</option>
            {physicianStaff && physicianStaff.length > 0 ? (
              physicianStaff.map((physician) => (
                <option key={physician.staff_id} value={physician.staff_id}>
                  {physician.lname}, {physician.fname} {physician.mname || ""} (Lic: {physician.license_no})
                </option>
              ))
            ) : (
              <option disabled>No physicians available</option>
            )}
          </select>
        </div>

        <div className="col-span-2 flex justify-end mt-6">
          <Button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition-all"
            disabled={processing}
          >
            {processing ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default GeneralReferralForm;
