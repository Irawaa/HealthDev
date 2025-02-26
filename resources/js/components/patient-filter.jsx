import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, X } from "lucide-react";

const FilterDropdown = ({ filters, setFilters }) => {
    const [openDropdown, setOpenDropdown] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = (section) => {
        setOpenDropdown(openDropdown === section ? null : section);
    };

    const handleFilterChange = (category, value) => {
        setFilters((prev) => ({
            ...prev,
            [category]: prev[category].includes(value)
                ? prev[category].filter((item) => item !== value)
                : [...prev[category], value]
        }));
    };

    const clearFilter = (category, value) => {
        setFilters((prev) => ({
            ...prev,
            [category]: prev[category].filter((item) => item !== value)
        }));
    };

    const departments = {
        "College of Business, Administration and Accountancy": ["Bachelor of Science in Business Administration", "Bachelor of Science in Accountancy"],
        "Graduate School": ["Master of Arts in Education", "Master in Business Administration", "Master of Arts in Psychology"],
        "Senior High School": ["Technical Vocational Livelihood", "Science, Technology, Engineering, and Mathematics", "Accountancy, Business and Management", "General Academic Strand", "Humanities and Social Sciences"],
        "College of Computing Studies": ["Bachelor of Science in Information Technology", "Bachelor of Science in Computer Science"],
        "College of Engineering": ["Bachelor of Science in Electronics Engineering", "Bachelor of Science in Industrial Engineering", "Bachelor of Science in Computer Engineering"],
        "College of Arts and Sciences": ["Bachelor of Science in Psychology"],
        "College of Education": ["Bachelor of Elementary Education", "Bachelor of Secondary Education", "Teacher Certification Program"],
        "College of Health and Allied Sciences": ["Bachelor of Science in Nursing"]
    };

    const staffOnlyDepartments = ["Graduate School", "College of Business, Administration and Accountancy"];

    const selectedType = filters.type?.[0];
    const selectedDepartments = (selectedType === "Non-Personnel" || selectedType === "Staff")
        ? filters.department.filter(dept => !staffOnlyDepartments.includes(dept))
        : filters.department || [];
    
    const programs = selectedDepartments.length > 0 
        ? selectedDepartments.flatMap(dept => departments[dept] || [])
        : (selectedType === "Student" ? Object.values(departments).flat() : []);

    return (
        <div className="relative">
            <Button onClick={() => setIsOpen(!isOpen)}>Filters</Button>
            {isOpen && (
                <div className="absolute left-0 mt-2 w-64 border rounded-lg p-4 bg-white shadow-md z-10">
                    <h2 className="text-lg font-semibold mb-2">Filters</h2>

                    {/* Selected Filters */}
                    <div className="mb-3 flex flex-wrap gap-2">
                        {Object.keys(filters).map(category => 
                            filters[category].map(value => (
                                <div key={`${category}-${value}`} className="bg-gray-200 px-2 py-1 rounded flex items-center">
                                    <span className="text-sm mr-1">{value}</span>
                                    <X size={12} className="cursor-pointer" onClick={() => clearFilter(category, value)} />
                                </div>
                            ))
                        )}
                    </div>

                    {/* Filter Categories */}
                    {["type", "department", "program"].map((category) => (
                        <div key={category} className="relative mb-2">
                            <div 
                                className="flex justify-between items-center cursor-pointer bg-gray-100 p-2 rounded-lg"
                                onClick={() => toggleDropdown(category)}
                            >
                                <span className="font-medium capitalize">
                                    {category.replace(/([A-Z])/g, " $1")}
                                </span>
                                {openDropdown === category ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                            </div>

                            {/* Dropdown Menu */}
                            {openDropdown === category && (
                                <div className="absolute left-0 mt-1 w-full bg-white shadow-lg rounded-lg border z-10">
                                    {[
                                        category === "type" && ["Student", "Staff", "Non-Personnel"],
                                        category === "department" && (selectedType === "Non-Personnel" ? [] : Object.keys(departments)),
                                        category === "program" && programs
                                    ].filter(Boolean).flat().map(option => (
                                        <div
                                            key={option}
                                            className={`p-2 cursor-pointer hover:bg-gray-200 ${filters[category].includes(option) ? "bg-gray-300" : ""}`}
                                            onClick={() => handleFilterChange(category, option)}
                                        >
                                            {option}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}

                    {/* Apply Filters Button */}
                    <Button className="mt-4 w-full" onClick={() => setIsOpen(false)}>Apply Filters</Button>
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;
