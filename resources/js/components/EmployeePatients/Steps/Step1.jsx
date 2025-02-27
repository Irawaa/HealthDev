import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";

export default function Step1({ data, setData }) {
    return (
        <div className="grid grid-cols-2 gap-6">
            {/* Employee Information */}
            <div>
                <Label>First Name</Label>
                <Input
                    type="text"
                    value={data.fname}
                    onChange={(e) => setData("fname", e.target.value)}
                    required
                />
            </div>

            <div>
                <Label>Middle Name</Label>
                <Input
                    type="text"
                    value={data.mname}
                    onChange={(e) => setData("mname", e.target.value)}
                />
            </div>

            <div>
                <Label>Last Name</Label>
                <Input
                    type="text"
                    value={data.lname}
                    onChange={(e) => setData("lname", e.target.value)}
                    required
                />
            </div>

            <div>
                <Label>Extension</Label>
                <Input
                    type="text"
                    value={data.ext}
                    onChange={(e) => setData("ext", e.target.value)}
                />
            </div>

            <div>
                <Label>Birthdate</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                            {data.birthdate ? format(new Date(data.birthdate), "yyyy-MM-dd") : "Select Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={data.birthdate ? new Date(data.birthdate) : null}
                            onSelect={(date) =>
                                setData("birthdate", date ? date.toISOString().split("T")[0] : "")
                            }
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div>
                <Label>Date Hired</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                            {data.date_hired ? format(new Date(data.date_hired), "yyyy-MM-dd") : "Select Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                        <Calendar
                            mode="single"
                            selected={data.date_hired ? new Date(data.date_hired) : null}
                            onSelect={(date) =>
                                setData("date_hired", date ? date.toISOString().split("T")[0] : "")
                            }
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div>
                <Label>Gender</Label>
                <Select value={data.gender} onValueChange={(value) => setData("gender", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Male</SelectItem>
                        <SelectItem value="0">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Civil Status</Label>
                <Select value={data.civil_status} onValueChange={(value) => setData("civil_status", value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Single</SelectItem>
                        <SelectItem value="1">Married</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div>
                <Label>Email</Label>
                <Input
                    type="email"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                />
            </div>

            <div>
                <Label>Mobile Number</Label>
                <Input
                    type="text"
                    value={data.mobile}
                    onChange={(e) => setData("mobile", e.target.value)}
                    required
                />
            </div>

            <div>
                <Label>Telephone</Label>
                <Input
                    type="text"
                    value={data.telephone}
                    onChange={(e) => setData("telephone", e.target.value)}
                />
            </div>
        </div>
    );
}
