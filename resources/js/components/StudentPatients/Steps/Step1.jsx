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
        const numCollegeId = Number(collegeId);
        setData("college_id", numCollegeId);
        setData("program_id", "");

        const selectedCollege = colleges.find(col => col.college_id === numCollegeId);

        const uniquePrograms = selectedCollege
            ? [...new Map(selectedCollege.programs.map(program => [program.program_id, program])).values()]
            : [];

        setFilteredPrograms(uniquePrograms);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-green-50 rounded-lg shadow-md w-full">
            {/* Student Information */}
            <div className="col-span-1 md:col-span-2 border-b border-green-400 pb-2">
                <h2 className="text-lg font-semibold text-green-700">Student Information</h2>
            </div>

            <div className="w-full">
                <Label className="text-green-700">Student ID</Label>
                <Input
                    type="text"
                    value={data.stud_id}
                    onChange={(e) => setData("stud_id", e.target.value)}
                    required
                    className="border-green-500 focus:ring-green-500 w-full"
                />
            </div>

            <div className="w-full">
                <Label className="text-green-700">First Name</Label>
                <Input type="text" value={data.fname} onChange={(e) => setData("fname", e.target.value)} required className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            <div className="w-full">
                <Label className="text-green-700">Middle Name</Label>
                <Input type="text" value={data.mname} onChange={(e) => setData("mname", e.target.value)} className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            <div className="w-full">
                <Label className="text-green-700">Last Name</Label>
                <Input type="text" value={data.lname} onChange={(e) => setData("lname", e.target.value)} required className="border-green-500 focus:ring-green-500 w-full" />
            </div>

            {/* Mobile Number */}
            <div className="w-full">
                <Label className="text-green-700">Mobile Number</Label>
                <Input
                    type="tel"
                    value={data.mobile}
                    onChange={(e) => setData("mobile", e.target.value)}
                    placeholder="e.g., 09123456789"
                    required
                    className="border-green-500 focus:ring-green-500 w-full"
                />
            </div>

            <div className="w-full">
                <Label className="text-green-700">Birthdate</Label>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start border-green-500 text-green-700 hover:bg-green-100">
                            {data.birthdate ? format(new Date(data.birthdate), "yyyy-MM-dd") : "Select Date"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-green-50 border-green-400">
                        <Calendar
                            mode="single"
                            selected={data.birthdate ? new Date(data.birthdate) : null}
                            onSelect={(date) => setData("birthdate", date ? date.toISOString().split("T")[0] : "")}
                        />
                    </PopoverContent>
                </Popover>
            </div>

            <div className="w-full">
                <Label className="text-green-700">Gender</Label>
                <Select value={data.gender} onValueChange={(value) => setData("gender", value)}>
                    <SelectTrigger className="border-green-500 focus:ring-green-500 w-full"><SelectValue placeholder="Select Gender" /></SelectTrigger>
                    <SelectContent className="bg-green-50 border-green-400">
                        <SelectItem value="1">Male</SelectItem>
                        <SelectItem value="0">Female</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Civil Status */}
            <div className="w-full">
                <Label className="text-green-700">Civil Status</Label>
                <Select
                    value={data.civil_status !== undefined ? String(data.civil_status) : ""}
                    onValueChange={(value) => setData("civil_status", Number(value))}
                >
                    <SelectTrigger className="border-green-500 focus:ring-green-500 w-full">
                        <SelectValue placeholder="Select Civil Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-green-50 border-green-400">
                        <SelectItem value="0">Single</SelectItem>
                        <SelectItem value="1">Married</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Academic Information */}
            <div className="col-span-1 md:col-span-2 border-b border-green-400 pb-2">
                <h2 className="text-lg font-semibold text-green-700">Academic Information</h2>
            </div>

            <div className="w-full">
                <Label htmlFor="college" className="text-green-700">College</Label>
                <select
                    id="college"
                    value={data.college_id || ""}
                    onChange={(e) => handleCollegeChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 bg-green-50"
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

            <div className="w-full">
                <Label htmlFor="program" className="text-green-700">Program</Label>
                <select
                    id="program"
                    value={data.program_id || ""}
                    onChange={(e) => setData("program_id", Number(e.target.value))}
                    disabled={!data.college_id}
                    className="w-full px-3 py-2 text-sm border border-green-500 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 bg-green-50"
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
