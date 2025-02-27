import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Step2({ data, setData }) {
    return (
        <div className="max-w-screen-lg mx-auto p-6 bg-green-50 rounded-lg shadow-md">
            {/* Parent Information Section */}
            <div className="border-b border-green-400 pb-2 mb-4">
                <h2 className="text-lg font-semibold text-green-700">Parent's Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Father's Details */}
                <div>
                    <Label className="text-green-700">Father Name</Label>
                    <Input type="text" value={data.father_name} onChange={(e) => setData("father_name", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Birthdate</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left border-green-500 text-green-700 hover:bg-green-100">
                                {data.father_birthdate ? format(new Date(data.father_birthdate), "yyyy-MM-dd") : "Select Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-green-50 border-green-400">
                            <Calendar 
                                mode="single" 
                                selected={data.father_birthdate ? new Date(data.father_birthdate) : null} 
                                onSelect={(date) => setData("father_birthdate", date ? date.toISOString().split("T")[0] : "")} 
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label className="text-green-700">Occupation</Label>
                    <Input type="text" value={data.father_occupation} onChange={(e) => setData("father_occupation", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>

                {/* Mother's Details */}
                <div>
                    <Label className="text-green-700">Mother Name</Label>
                    <Input type="text" value={data.mother_name} onChange={(e) => setData("mother_name", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Birthdate</Label>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left border-green-500 text-green-700 hover:bg-green-100">
                                {data.mother_birthdate ? format(new Date(data.mother_birthdate), "yyyy-MM-dd") : "Select Date"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-green-50 border-green-400">
                            <Calendar 
                                mode="single" 
                                selected={data.mother_birthdate ? new Date(data.mother_birthdate) : null} 
                                onSelect={(date) => setData("mother_birthdate", date ? date.toISOString().split("T")[0] : "")} 
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div>
                    <Label className="text-green-700">Occupation</Label>
                    <Input type="text" value={data.mother_occupation} onChange={(e) => setData("mother_occupation", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
            </div>

            {/* Guardian & Emergency Contact Section */}
            <div className="border-b border-green-400 pb-2 mt-6 mb-4">
                <h2 className="text-lg font-semibold text-green-700">Guardian & Emergency Contact</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Guardian's Details */}
                <div>
                    <Label className="text-green-700">Guardian Name</Label>
                    <Input type="text" value={data.guardian_name} onChange={(e) => setData("guardian_name", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Relation</Label>
                    <Input type="text" value={data.guardian_relation} onChange={(e) => setData("guardian_relation", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Contact Number</Label>
                    <Input type="text" value={data.guardian_contactno} onChange={(e) => setData("guardian_contactno", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>

                {/* Emergency Contact */}
                <div>
                    <Label className="text-green-700">Emergency Contact Name</Label>
                    <Input type="text" value={data.emergency_contact_name} onChange={(e) => setData("emergency_contact_name", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div>
                    <Label className="text-green-700">Contact Number</Label>
                    <Input type="text" value={data.emergency_contact_no} onChange={(e) => setData("emergency_contact_no", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
                </div>
                <div></div> {/* Empty div for spacing alignment */}
            </div>
        </div>
    );
}
