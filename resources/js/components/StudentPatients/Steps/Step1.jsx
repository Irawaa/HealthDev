import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";


export default function Step1({ data, setData, colleges = [] }) {
    const [filteredPrograms, setFilteredPrograms] = useState([]);

    const handleCollegeChange = (collegeId) => {
        const numCollegeId = Number(collegeId); // Ensure it's a number
        setData("college_id", numCollegeId);
        setData("program_id", ""); // Reset program when college changes

        const selectedCollege = colleges.find(col => col.college_id === numCollegeId);

        const uniquePrograms = selectedCollege
            ? [...new Map(selectedCollege.programs.map(program => [program.program_id, program])).values()]
            : [];

        setFilteredPrograms(uniquePrograms);
    };


    return (
        <div className="grid grid-cols-2 gap-6">

            {/* Student Information */}
            <div className="col-span-2 border-b pb-2">
                <h2 className="text-lg font-semibold">Student Information</h2>
            </div>

            <div>
                <Label>Student ID</Label>
                <Input
                    type="text"
                    value={data.stud_id}
                    onChange={(e) => setData("stud_id", e.target.value)}
                    required
                />
            </div>

            <div>
                <Label>First Name</Label>
                <Input type="text" value={data.fname} onChange={(e) => setData("fname", e.target.value)} required />
            </div>
            <div>
                <Label>Middle Name</Label>
                <Input type="text" value={data.mname} onChange={(e) => setData("mname", e.target.value)} />
            </div>
            <div>
                <Label>Last Name</Label>
                <Input type="text" value={data.lname} onChange={(e) => setData("lname", e.target.value)} required />
            </div>
            <div>
                <Label>Extension</Label>
                <Input type="text" value={data.ext} onChange={(e) => setData("ext", e.target.value)} />
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
                            onSelect={(date) => setData("birthdate", date ? date.toISOString().split("T")[0] : "")}
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div>
                <Label>Gender</Label>
                <Select value={data.gender} onValueChange={(value) => setData("gender", value)}>
                    <SelectTrigger><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">Male</SelectItem>
                        <SelectItem value="0">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Civil Status</Label>
                <Select value={data.civil_status} onValueChange={(value) => setData("civil_status", value)}>
                    <SelectTrigger><SelectValue placeholder="Select Status" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="0">Single</SelectItem>
                        <SelectItem value="1">Married</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <Label>Email</Label>
                <Input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} />
            </div>
            <div>
                <Label>Mobile Number</Label>
                <Input type="text" value={data.mobile} onChange={(e) => setData("mobile", e.target.value)} required />
            </div>
            <div>
                <Label>Telephone</Label>
                <Input type="text" value={data.telephone} onChange={(e) => setData("telephone", e.target.value)} />
            </div>

            {/* Academic Information */}
            <div className="col-span-2 border-b pb-2">
                <h2 className="text-lg font-semibold">Academic Information</h2>
            </div>

            <div>
                <Label htmlFor="college">College</Label>
                <select
                    id="college"
                    value={data.college_id || ""}
                    onChange={(e) => handleCollegeChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                    <option value="" disabled>Select College</option>
                    {colleges.length > 0 ? (
                        colleges.map((college) => (
                            <option key={`college-${String(college.college_id)}`} value={String(college.college_id)}>
                                {college.college_description} ({college.college_code})
                            </option>
                        ))
                    ) : (
                        <option key="no-college-placeholder" disabled>No colleges available</option>
                    )}
                </select>
            </div>

            <div>
                <Label htmlFor="program">Program</Label>
                <select
                    id="program"
                    value={data.program_id || ""}
                    onChange={(e) => setData("program_id", Number(e.target.value))} // Ensure it's a number
                    disabled={!data.college_id}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                >
                    <option value="" disabled>Select Program</option>
                    {filteredPrograms.length > 0 ? (
                        filteredPrograms.map((program) => (
                            <option key={`program-${String(program.program_id)}`} value={String(program.program_id)}>
                                {program.program_description} ({program.program_code})
                            </option>
                        ))
                    ) : (
                        <option key="no-program-placeholder" disabled>No programs available</option>
                    )}
                </select>
            </div>
        </div>
    );
}
