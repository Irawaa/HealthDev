import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

export default function Step2({ data, setData }) {
    return (
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Parent Information Section */}
            <div className="col-span-1 md:col-span-3 border-b pb-2 mt-4">
                <h2 className="text-lg font-semibold">Parent's Information</h2>
            </div>

            {/* Father's Details */}
            <div>
                <Label>Father Name</Label>
                <Input type="text" value={data.father_name} onChange={(e) => setData("father_name", e.target.value)} />
            </div>
            <div>
                <Label>Birthdate</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left py-2">
                            {data.father_birthdate ? format(new Date(data.father_birthdate), "yyyy-MM-dd") : "Select Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar 
                            mode="single" 
                            selected={data.father_birthdate ? new Date(data.father_birthdate) : null} 
                            onSelect={(date) => setData("father_birthdate", date ? date.toISOString().split("T")[0] : "")} 
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Label>Occupation</Label>
                <Input type="text" value={data.father_occupation} onChange={(e) => setData("father_occupation", e.target.value)} />
            </div>

            {/* Mother's Details */}
            <div>
                <Label>Mother Name</Label>
                <Input type="text" value={data.mother_name} onChange={(e) => setData("mother_name", e.target.value)} />
            </div>
            <div>
                <Label>Birthdate</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left py-2">
                            {data.mother_birthdate ? format(new Date(data.mother_birthdate), "yyyy-MM-dd") : "Select Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar 
                            mode="single" 
                            selected={data.mother_birthdate ? new Date(data.mother_birthdate) : null} 
                            onSelect={(date) => setData("mother_birthdate", date ? date.toISOString().split("T")[0] : "")} 
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Label>Occupation</Label>
                <Input type="text" value={data.mother_occupation} onChange={(e) => setData("mother_occupation", e.target.value)} />
            </div>

            {/* Guardian & Emergency Contact */}
            <div className="col-span-1 md:col-span-3 border-b pb-2 mt-4">
                <h2 className="text-lg font-semibold">Guardian & Emergency Contact</h2>
            </div>

            {/* Guardian's Details */}
            <div>
                <Label>Guardian Name</Label>
                <Input type="text" value={data.guardian_name} onChange={(e) => setData("guardian_name", e.target.value)} />
            </div>
            <div>
                <Label>Relation</Label>
                <Input type="text" value={data.guardian_relation} onChange={(e) => setData("guardian_relation", e.target.value)} />
            </div>
            <div>
                <Label>Contact Number</Label>
                <Input type="text" value={data.guardian_contactno} onChange={(e) => setData("guardian_contactno", e.target.value)} />
            </div>

            {/* Emergency Contact */}
            <div>
                <Label>Emergency Contact Name</Label>
                <Input type="text" value={data.emergency_contact_name} onChange={(e) => setData("emergency_contact_name", e.target.value)} />
            </div>
            <div>
                <Label>Contact Number</Label>
                <Input type="text" value={data.emergency_contact_no} onChange={(e) => setData("emergency_contact_no", e.target.value)} />
            </div>
            <div></div> {/* Empty div for spacing alignment */}
        </div>
    );
}
