import { Label } from "@/components/ui/label";

export default function Step4({ data }) {
    return (
        <div className="grid grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-2">
            {Object.entries(data).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                    <Label className="text-sm font-semibold">{key.replace(/_/g, " ").toUpperCase()}</Label>
                    <p className="border p-2 rounded bg-gray-100 text-sm break-words">{value || "N/A"}</p>
                </div>
            ))}
        </div>
    );
}
