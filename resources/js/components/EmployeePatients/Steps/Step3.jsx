import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step3({ data, setData }) {
    return (
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Family Information Section */}
            <div className="col-span-1 md:col-span-3 border-b pb-2 mt-4">
                <h2 className="text-lg font-semibold">Family Information</h2>
            </div>

            {/* Father's Details */}
            <div>
                <Label>Father's Name</Label>
                <Input type="text" value={data.father_name} onChange={(e) => setData("father_name", e.target.value)} />
            </div>
            
            {/* Mother's Details */}
            <div>
                <Label>Mother's Name</Label>
                <Input type="text" value={data.mother_name} onChange={(e) => setData("mother_name", e.target.value)} />
            </div>

            {/* Spouse Details */}
            <div>
                <Label>Spouse's Name</Label>
                <Input type="text" value={data.spouse_name} onChange={(e) => setData("spouse_name", e.target.value)} />
            </div>
            <div>
                <Label>Spouse's Occupation</Label>
                <Input type="text" value={data.spouse_occupation} onChange={(e) => setData("spouse_occupation", e.target.value)} />
            </div>

            {/* Emergency Contact */}
            <div className="col-span-1 md:col-span-3 border-b pb-2 mt-4">
                <h2 className="text-lg font-semibold">Emergency Contact</h2>
            </div>

            <div>
                <Label>Emergency Contact Person</Label>
                <Input type="text" value={data.emergency_contact_person} onChange={(e) => setData("emergency_contact_person", e.target.value)} />
            </div>
            <div>
                <Label>Emergency Contact Number</Label>
                <Input type="text" value={data.emergency_contact_number} onChange={(e) => setData("emergency_contact_number", e.target.value)} />
            </div>
        </div>
    );
}