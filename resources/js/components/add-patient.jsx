import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert } from "@/components/ui/alert"; // Assuming an Alert component exists

const AddPatient = ({ open, onClose, onSubmit }) => {
    const initialFormState = {
        firstName: "",
        middleInitial: "",
        lastName: "",
        suffix: "",
        birthday: "",
        age: "",
        department: "",
        program: "",
        type: "",
        gender: "",
        studentNumber: ""
    };

    const [formData, setFormData] = useState(initialFormState);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (open) {
            setFormData(initialFormState);
            setErrors({});
        }
    }, [open]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (["firstName", "middleInitial", "lastName"].includes(name)) {
            if (/[^a-zA-Z]/.test(value)) {
                setErrors((prev) => ({ ...prev, [name]: "Only letters are allowed." }));
            } else {
                setErrors((prev) => ({ ...prev, [name]: "" }));
            }
        }
        
        setFormData({ ...formData, [name]: value });

        if (name === "birthday") {
            calculateAge(value);
        }
    };

    const calculateAge = (birthday) => {
        if (!birthday) {
            setFormData((prev) => ({ ...prev, age: "" }));
            return;
        }

        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }

        setFormData((prev) => ({ ...prev, age: age.toString() }));
    };

    const handleTypeChange = (type) => {
        setFormData({ ...initialFormState, type });
    };

    const handleGenderChange = (gender) => {
        setFormData((prev) => ({ ...prev, gender }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add New Patient</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="font-semibold">Patient Type:</label>
                        <div className="flex gap-4">
                            {["Student", "Staff", "Non-Personnel"].map((type) => (
                                <label key={type} className="flex items-center space-x-2">
                                    <Checkbox checked={formData.type === type} onCheckedChange={() => handleTypeChange(type)} />
                                    <span>{type}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {!formData.type && (
                        <Alert variant="destructive" className="text-red-500 text-sm">
                            Please select a patient type first.
                        </Alert>
                    )}

                    {formData.type && (
                        <>
                            <div className="grid grid-cols-2 gap-2">
                                <Input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} required />
                                {errors.firstName && <span className="text-red-500 text-sm">{errors.firstName}</span>}
                                <Input type="text" name="middleInitial" placeholder="Middle Initial" maxLength="1" value={formData.middleInitial} onChange={handleChange} />
                                <Input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} required />
                                {errors.lastName && <span className="text-red-500 text-sm">{errors.lastName}</span>}
                                <Input type="text" name="suffix" placeholder="Suffix (Jr, Sr, III, etc.)" value={formData.suffix} onChange={handleChange} />
                            </div>

                            <div className="space-y-2">
                                <label className="font-semibold">Gender:</label>
                                <div className="flex gap-4">
                                    {["Male", "Female", "Intersex"].map((gender) => (
                                        <label key={gender} className="flex items-center space-x-2">
                                            <Checkbox checked={formData.gender === gender} onCheckedChange={() => handleGenderChange(gender)} />
                                            <span>{gender}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <Input type="date" name="birthday" placeholder="Birthday" value={formData.birthday} onChange={handleChange} required />
                                <Input type="text" name="age" placeholder="Age" value={formData.age} readOnly className="bg-gray-200 cursor-not-allowed" />
                            </div>

                            {formData.type !== "Non-Personnel" && (
                                <Input type="text" name="department" placeholder="Department" value={formData.department} onChange={handleChange} required />
                            )}
                            {formData.type === "Student" && (
                                <>
                                    <Input type="text" name="program" placeholder="Program" value={formData.program} onChange={handleChange} required />
                                    <Input type="text" name="studentNumber" placeholder="Student Number" value={formData.studentNumber} onChange={handleChange} required />
                                </>
                            )}
                        </>
                    )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={!formData.type}>Save</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default AddPatient;
