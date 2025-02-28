import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

export default function Step1({ data, setData }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-green-50 rounded-lg shadow-md">
            {/* Employee Information */}
            <div className="md:col-span-2 border-b border-green-400 pb-2">
                <h2 className="text-lg font-semibold text-green-700">Employee Information</h2>
            </div>

            <div>
                <Label className="text-green-700">First Name</Label>
                <Input type="text" value={data.fname} onChange={(e) => setData("fname", e.target.value)} required className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            <div>
                <Label className="text-green-700">Middle Name</Label>
                <Input type="text" value={data.mname} onChange={(e) => setData("mname", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            <div>
                <Label className="text-green-700">Last Name</Label>
                <Input type="text" value={data.lname} onChange={(e) => setData("lname", e.target.value)} required className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            <div>
                <Label className="text-green-700">Extension</Label>
                <Input type="text" value={data.ext} onChange={(e) => setData("ext", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            <div>
                <Label className="text-green-700">Birthdate</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start border-green-500 text-green-700 hover:bg-green-100">
                            {data.birthdate ? format(new Date(data.birthdate), "yyyy-MM-dd") : "Select Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-green-50 border-green-400">
                        <Calendar mode="single" selected={data.birthdate ? new Date(data.birthdate) : null} onSelect={(date) => setData("birthdate", date ? date.toISOString().split("T")[0] : "")} />
                    </PopoverContent>
                </Popover>
            </div>

            <div>
                <Label className="text-green-700">Date Hired</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start border-green-500 text-green-700 hover:bg-green-100">
                            {data.date_hired ? format(new Date(data.date_hired), "yyyy-MM-dd") : "Select Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-green-50 border-green-400">
                        <Calendar mode="single" selected={data.date_hired ? new Date(data.date_hired) : null} onSelect={(date) => setData("date_hired", date ? date.toISOString().split("T")[0] : "")} />
                    </PopoverContent>
                </Popover>
            </div>

            <div>
                <Label className="text-green-700">Gender</Label>
                <Select value={data.gender} onValueChange={(value) => setData("gender", value)}>
                    <SelectTrigger className="border-green-500 focus:ring-green-500 w-full">
                        <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-50 border-green-400">
                        <SelectItem value="1">Male</SelectItem>
                        <SelectItem value="0">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-green-700">Civil Status</Label>
                <Select value={data.civil_status} onValueChange={(value) => setData("civil_status", value)}>
                    <SelectTrigger className="border-green-500 focus:ring-green-500 w-full">
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-50 border-green-400">
                        <SelectItem value="0">Single</SelectItem>
                        <SelectItem value="1">Married</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label className="text-green-700">Email</Label>
                <Input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            <div>
                <Label className="text-green-700">Mobile Number</Label>
                <Input type="text" value={data.mobile} onChange={(e) => setData("mobile", e.target.value)} required className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            <div>
                <Label className="text-green-700">Telephone</Label>
                <Input type="text" value={data.telephone} onChange={(e) => setData("telephone", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
            </div>
        </div>
    );
}
