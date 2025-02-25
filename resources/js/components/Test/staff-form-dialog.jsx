import React, { useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useForm, router } from "@inertiajs/react";

const StaffFormDialog = ({ open, setOpen, staff, isEdit }) => {
  const { data, setData, post, put, processing, reset } = useForm({
    lname: "",
    fname: "",
    mname: "",
    ext: "",
    role: "",
    license_no: "",
    ptr_no: "",
    email: "",
    contact_no: "",
  });

  // Prefill form when editing
  useEffect(() => {
    if (open && isEdit && staff) {
      setData({
        lname: staff.lname || "",
        fname: staff.fname || "",
        mname: staff.mname || "",
        ext: staff.ext || "",
        role: staff.role || "",
        license_no: staff.license_no || "",
        ptr_no: staff.ptr_no || "",
        email: staff.email || "",
        contact_no: staff.contact_no || "",
      });
    } else if (open && !isEdit) {
      reset();
    }
  }, [open, isEdit, staff]);  

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEdit) {
      put(`/clinic-staff/${staff.staff_id}`, {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setOpen(false);
          setData({
            lname: data.lname,
            fname: data.fname,
            mname: data.mname,
            ext: data.ext,
            role: data.role,
            license_no: data.license_no,
            ptr_no: data.ptr_no,
            email: data.email,
            contact_no: data.contact_no,
          });
        },
      });
    } else {
      post("/clinic-staff", {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(val) => {
      setOpen(val);
      if (!val) reset();
    }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Clinic Staff" : "Add New Clinic Staff"}</DialogTitle>
          <DialogDescription>
            Fill in the details below to {isEdit ? "update" : "add"} a clinic staff member.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
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
            <Select
              value={data.role}
              onValueChange={(value) => setData("role", value)}
              required
            >
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
          <DialogFooter className="col-span-2 flex justify-end gap-2">
            <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={processing}>
              {isEdit ? "Update" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StaffFormDialog;
