import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step3({ data, setData }) {
    return (
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Address Fields */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3">
                <Label>Barangay</Label>
                <Input type="text" value={data.res_brgy} onChange={(e) => setData("res_brgy", e.target.value)} />
            </div>
            <div>
                <Label>City/Town</Label>
                <Input type="text" value={data.res_city} onChange={(e) => setData("res_city", e.target.value)} />
            </div>
            <div>
                <Label>Province</Label>
                <Input type="text" value={data.res_prov} onChange={(e) => setData("res_prov", e.target.value)} />
            </div>
            <div>
                <Label>Region</Label>
                <Input type="text" value={data.res_region} onChange={(e) => setData("res_region", e.target.value)} />
            </div>
            {/* Make Zip Code Full Width on Small Screens */}
            <div className="col-span-1 md:col-span-2 lg:col-span-1">
                <Label>Zip Code</Label>
                <Input type="text" value={data.res_zipcode} onChange={(e) => setData("res_zipcode", e.target.value)} />
            </div>
        </div>
    );
}
