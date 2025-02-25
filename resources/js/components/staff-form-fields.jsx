// StaffFormFields.jsx
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const StaffFormFields = ({ data, setData }) => {
  return (
    <>
      <div>
        <Label>First Name</Label>
        <Input value={data.fname} onChange={(e) => setData("fname", e.target.value)} required />
      </div>
      <div>
        <Label>Last Name</Label>
        <Input value={data.lname} onChange={(e) => setData("lname", e.target.value)} required />
      </div>
      <div>
        <Label>Middle Name</Label>
        <Input value={data.mname} onChange={(e) => setData("mname", e.target.value)} />
      </div>
      <div>
        <Label>Extension</Label>
        <Input value={data.ext} placeholder="e.g., Jr., Sr., III" onChange={(e) => setData("ext", e.target.value)} />
      </div>
      <div>
        <Label>Role</Label>
        <Select value={data.role} onValueChange={(value) => setData("role", value)} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="School Physician">School Physician</SelectItem>
            <SelectItem value="School Dentist">School Dentist</SelectItem>
            <SelectItem value="School Nurse">School Nurse</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>License No.</Label>
        <Input value={data.license_no} onChange={(e) => setData("license_no", e.target.value)} required />
      </div>
      <div>
        <Label>PTR No.</Label>
        <Input value={data.ptr_no} onChange={(e) => setData("ptr_no", e.target.value)} required />
      </div>
      <div>
        <Label>Email</Label>
        <Input type="email" value={data.email} onChange={(e) => setData("email", e.target.value)} required />
      </div>
      <div className="col-span-2">
        <Label>Contact No.</Label>
        <Input value={data.contact_no} onChange={(e) => setData("contact_no", e.target.value)} />
      </div>
    </>
  );
};

export default StaffFormFields;
