import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step4({ data, setData }) {
    return (
        <div className="max-w-screen-lg mx-auto p-6 bg-green-50 rounded-lg shadow-md">
            {/* Employment Information Section */}
            <div className="border-b border-green-400 pb-2 mb-4">
                <h2 className="text-lg font-semibold text-green-700">Non-Personnel Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Physical Attributes */}
                <div>
                    <Label className="text-green-700">Height (cm)</Label>
                    <Input type="text" value={data.height} onChange={(e) => setData("height", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Weight (kg)</Label>
                    <Input type="text" value={data.weight} onChange={(e) => setData("weight", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Blood Type</Label>
                    <Input type="text" value={data.blood_type} onChange={(e) => setData("blood_type", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
            </div>
        </div>
    );
}
