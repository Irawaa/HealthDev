import { Label } from "@/components/ui/label";

export default function Step4({ data }) {
    return (
        <div className="max-w-screen-lg mx-auto p-6 bg-green-50 rounded-lg shadow-md">
            {/* Review Information Header */}
            <div className="border-b border-green-400 pb-2 mb-4">
                <h2 className="text-lg font-semibold text-green-700">Review Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[60vh] overflow-y-auto p-2">
                {Object.entries(data).map(([key, value]) => (
                    <div key={key} className="flex flex-col">
                        <Label className="text-sm font-semibold text-green-700">
                            {key.replace(/_/g, " ").toUpperCase()}
                        </Label>
                        <p className="border border-green-400 p-2 rounded bg-green-100 text-sm break-words text-green-900">
                            {value || "N/A"}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
