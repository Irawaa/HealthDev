import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Step2({ data, setData, departments = [], colleges = [] }) {
    const handleDepartmentChange = (value) => {
        setData("dept_id", value);
        setData("college_id", ""); // Reset college selection when department changes
    };

    const handleCollegeChange = (value) => {
        setData("college_id", value);
    };

    return (
        <div className="max-w-screen-lg mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Employment Information Section */}
            <div className="col-span-1 md:col-span-3 border-b pb-2 mt-4">
                <h2 className="text-lg font-semibold">Employment Details</h2>
            </div>
            
            {/* Employee Number */}
            <div>
                <Label>Employee Number</Label>
                <Input type="text" value={data.employee_no} onChange={(e) => setData("employee_no", e.target.value)} />
            </div>

            {/* Date Hired */}
            <div>
                <Label>Date Hired</Label>
                <Input type="date" value={data.date_hired} onChange={(e) => setData("date_hired", e.target.value)} />
            </div>

            {/* Employment Status */}
            <div>
                <Label>Active Status</Label>
                <Input type="text" value={data.is_active} onChange={(e) => setData("is_active", e.target.value)} />
            </div>

            {/* Physical Attributes */}
            <div>
                <Label>Height (cm)</Label>
                <Input type="text" value={data.height} onChange={(e) => setData("height", e.target.value)} />
            </div>
            <div>
                <Label>Weight (kg)</Label>
                <Input type="text" value={data.weight} onChange={(e) => setData("weight", e.target.value)} />
            </div>
            <div>
                <Label>Blood Type</Label>
                <Input type="text" value={data.blood_type} onChange={(e) => setData("blood_type", e.target.value)} />
            </div>

            {/* Department Information Section */}
            <div className="col-span-1 md:col-span-3 border-b pb-2 mt-4">
                <h2 className="text-lg font-semibold">Department Information</h2>
            </div>
            
            {/* Department Selection */}
            <div>
                <Label htmlFor="department">Department</Label>
                <select
                    id="department"
                    value={data.dept_id || ""}
                    onChange={(e) => handleDepartmentChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="" disabled>Select Department</option>
                    {departments.length > 0 ? (
                        departments.map((department) => (
                            <option key={`dept-${String(department.dept_id)}`} value={String(department.dept_id)}>
                                {department.dept_description} ({department.dept_code})
                            </option>
                        ))
                    ) : (
                        <option key="no-dept-placeholder" disabled>No departments available</option>
                    )}
                </select>
            </div>
            
            {/* College Selection (Disabled unless Department is selected) */}
            <div>
                <Label htmlFor="college">College</Label>
                <select
                    id="college"
                    value={data.college_id || ""}
                    onChange={(e) => handleCollegeChange(e.target.value)}
                    className="w-full px-3 py-2 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
                    disabled={!data.dept_id}
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
        </div>
    );
}
