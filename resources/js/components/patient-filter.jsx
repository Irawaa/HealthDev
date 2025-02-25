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
                    {["department", "program", "type", "medicalStatus"].map((category) => (
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
                                        category === "department" && ["Cardiology", "Neurology", "Pediatrics"],
                                        category === "program" && ["Child Health", "Surgical Training"],
                                        category === "type" && ["Student", "Staff", "Non-Personnel"],
                                        category === "medicalStatus" && ["Stable", "Critical", "Recovering"]
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
