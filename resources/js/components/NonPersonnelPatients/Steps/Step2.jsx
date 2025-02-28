import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step2({ data, setData }) {
    return (
        <div className="max-w-screen-lg mx-auto p-6 bg-green-50 rounded-lg shadow-md">
            {/* Family Information Section */}
            <div className="border-b border-green-400 pb-2 mb-4">
                <h2 className="text-lg font-semibold text-green-700">Family Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Father's Details */}
                <div>
                    <Label className="text-green-700">Father's Name</Label>
                    <Input type="text" value={data.father_name} onChange={(e) => setData("father_name", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                
                {/* Mother's Details */}
                <div>
                    <Label className="text-green-700">Mother's Name</Label>
                    <Input type="text" value={data.mother_name} onChange={(e) => setData("mother_name", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>

                {/* Spouse Details */}
                <div>
                    <Label className="text-green-700">Spouse's Name</Label>
                    <Input type="text" value={data.spouse_name} onChange={(e) => setData("spouse_name", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Spouse's Occupation</Label>
                    <Input type="text" value={data.spouse_occupation} onChange={(e) => setData("spouse_occupation", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
            </div>

            {/* Emergency Contact Section */}
            <div className="border-b border-green-400 pb-2 mt-6 mb-4">
                <h2 className="text-lg font-semibold text-green-700">Emergency Contact</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <Label className="text-green-700">Emergency Contact Person</Label>
                    <Input type="text" value={data.emergency_contact_person} onChange={(e) => setData("emergency_contact_person", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Emergency Contact Number</Label>
                    <Input type="text" value={data.emergency_contact_number} onChange={(e) => setData("emergency_contact_number", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
            </div>
        </div>
    );
}