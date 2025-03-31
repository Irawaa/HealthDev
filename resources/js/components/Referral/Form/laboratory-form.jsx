import { useEffect, useState } from "react";
import { useForm } from "@inertiajs/react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { usePhysicianStaff } from "@/Pages/Patients/ProfilePage";
import { motion } from "framer-motion";

const LaboratoryForm = ({ setOpen, patient, referral }) => {
  const physicianStaff = usePhysicianStaff();
  const [originalDate, setOriginalDate] = useState("");

  const isEditMode = !!referral; // Check if editing or creating

  const { data, setData, post, put, processing } = useForm({
    patient_id: patient?.patient_id || null,
    school_physician_id: "",
    x_ray: false,
    cbc: false,
    urinalysis: false,
    fecalysis: false,
    physical_examination: false,
    dental: false,
    hepatitis_b_screening: false,
    pregnancy_test: false,
    drug_test: false,
    fbs: false,
    lipid_profile: false,
    bun: false,
    bua: false,
    creatine: false,
    sgpt: false,
    sgot: false,
    others: "",
  });

  useEffect(() => {
    if (isEditMode) {
      setOriginalDate(referral.advised_medication_rest || "");
      setData({
        patient_id: referral.patient_id || "",
        school_physician_id: referral.school_physician_id?.toString() || "",
        x_ray: referral.x_ray || false,
        cbc: referral.cbc || false,
        urinalysis: referral.urinalysis || false,
        fecalysis: referral.fecalysis || false,
        physical_examination: referral.physical_examination || false,
        dental: referral.dental || false,
        hepatitis_b_screening: referral.hepatitis_b_screening || false,
        pregnancy_test: referral.pregnancy_test || false,
        drug_test: referral.drug_test || false,
        fbs: referral.fbs || false,
        lipid_profile: referral.lipid_profile || false,
        bun: referral.bun || false,
        bua: referral.bua || false,
        creatine: referral.creatine || false,
        sgpt: referral.sgpt || false,
        sgot: referral.sgot || false,
        others: referral.others || "",
      });
    }
  }, [referral]);

  const handleCheckboxChange = (field) => {
    setData(field, !data[field]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditMode) {
      put(route("laboratory-exam-referrals.update", referral.id), {
        data,
        onSuccess: () => {
          toast.success("Laboratory referral updated successfully!");
          setOpen(false);
        },
      });
    } else {
      post(route("laboratory-exam-referrals.store"), {
        data,
        onSuccess: () => {
          toast.success("Laboratory referral created successfully!");
          setOpen(false);
        },
      });
    }
  };

  return (
    <motion.div className="space-y-4 p-4 bg-white rounded-lg shadow-md border border-green-500 w-full max-w-2xl mx-auto">
      <h2 className="text-green-700 font-bold text-xl text-center">
        {isEditMode ? "Edit Laboratory Referral" : "New Laboratory Referral"}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="font-bold text-green-700">Select Tests:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-gray-700">
            {[
              { key: "x_ray", label: "X-ray" },
              { key: "cbc", label: "CBC" },
              { key: "urinalysis", label: "Urinalysis" },
              { key: "fecalysis", label: "Fecalysis" },
              { key: "physical_examination", label: "Physical Examination" },
              { key: "dental", label: "Dental" },
              { key: "hepatitis_b_screening", label: "Hepatitis B Screening" },
              { key: "pregnancy_test", label: "Pregnancy Test" },
              { key: "drug_test", label: "Drug Test" },
            ].map((test) => (
              <label key={test.key} className="flex items-center">
                <Checkbox
                  checked={!!data[test.key]}
                  onCheckedChange={() => handleCheckboxChange(test.key)}
                />
                <span className="ml-2">{test.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-bold text-green-700">Magic 8 Tests:</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-2 text-gray-700">
            {[
              { key: "fbs", label: "FBS" },
              { key: "lipid_profile", label: "Lipid Profile" },
              { key: "bun", label: "BUN" },
              { key: "bua", label: "BUA" },
              { key: "creatine", label: "Creatine" },
              { key: "sgpt", label: "SGPT" },
              { key: "sgot", label: "SGOT" },
            ].map((test) => (
              <label key={test.key} className="flex items-center">
                <Checkbox
                  checked={!!data[test.key]}
                  onCheckedChange={() => handleCheckboxChange(test.key)}
                />
                <span className="ml-2">{test.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <label className="font-bold text-green-700">Other Tests:</label>
          <motion.input
            type="text"
            className="mt-2 p-2 border border-gray-300 rounded w-full"
            placeholder="Specify other tests..."
            value={data.others}
            onChange={(e) => setData("others", e.target.value)}
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

        <div className="flex justify-end mt-4">
          <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded">
            {processing ? (isEditMode ? "Updating..." : "Saving...") : isEditMode ? "Update" : "Save"}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default LaboratoryForm;
