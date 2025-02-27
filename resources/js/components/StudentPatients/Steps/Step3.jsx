import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step3({ data, setData }) {
    return (
        <div className="max-w-screen-lg mx-auto p-6 bg-green-50 rounded-lg shadow-md">
            {/* Address Fields Section */}
            <div className="border-b border-green-400 pb-2 mb-4">
                <h2 className="text-lg font-semibold text-green-700">Address Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Full-Width House Address */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                    <Label className="text-green-700">House Address</Label>
                    <Input 
                        type="text" 
                        value={data.address_house} 
                        onChange={(e) => setData("address_house", e.target.value)} 
                        className="border-green-500 focus:ring-green-500 w-full"
                    />
                </div>

                <div>
                    <Label className="text-green-700">Barangay</Label>
                    <Input 
                        type="text" 
                        value={data.address_brgy} 
                        onChange={(e) => setData("address_brgy", e.target.value)} 
                        className="border-green-500 focus:ring-green-500 w-full"
                    />
                </div>

                <div>
                    <Label className="text-green-700">City/Town</Label>
                    <Input 
                        type="text" 
                        value={data.address_citytown} 
                        onChange={(e) => setData("address_citytown", e.target.value)} 
                        className="border-green-500 focus:ring-green-500 w-full"
                    />
                </div>

                <div>
                    <Label className="text-green-700">Province</Label>
                    <Input 
                        type="text" 
                        value={data.address_province} 
                        onChange={(e) => setData("address_province", e.target.value)} 
                        className="border-green-500 focus:ring-green-500 w-full"
                    />
                </div>

                {/* Full-Width Zip Code on Small Screens */}
                <div className="col-span-1 md:col-span-2 lg:col-span-1">
                    <Label className="text-green-700">Zip Code</Label>
                    <Input 
                        type="text" 
                        value={data.address_zipcode} 
                        onChange={(e) => setData("address_zipcode", e.target.value)} 
                        className="border-green-500 focus:ring-green-500 w-full"
                    />
                </div>
            </div>
        </div>
    );
}
