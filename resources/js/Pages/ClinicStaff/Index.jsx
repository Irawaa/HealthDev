import React, { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import Layout from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useForm } from "@inertiajs/react";
import AddStaffDialog from "@/components/add-staff-dialog";
import EditStaffTab from "@/components/edit-staff-tab";
import EditStaffDialog from "@/components/edit-staff-dialog";
import UserStaffDialog from "@/components/user-staff-dialog";

const Index = () => {
  const { clinicStaffs } = usePage().props;

  // Ensure clinicStaffs has a valid structure
  const staffData = clinicStaffs?.data ?? [];
  const currentPage = clinicStaffs?.current_page ?? 1;
  const lastPage = clinicStaffs?.last_page ?? 1;

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [openDelete, setOpenDelete] = useState(false);
  const { delete: destroy } = useForm();

  const openAddDialog = () => {
    setSelectedStaff(null);
    setOpenAdd(true);
  };

  const openEditDialog = (index) => {
    setSelectedStaff(staffData[index]);
    setOpenEdit(true);
  };

  const confirmDelete = (staff) => {
    setSelectedStaff(staff);
    setOpenDelete(true);
  };

  const handleDelete = () => {
    if (selectedStaff) {
      destroy(`/clinic-staff/${selectedStaff.staff_id}`);
      setOpenDelete(false);
    }
  };

  const isOnlyAdmin = (staffId) => {
    const admins = staffData.filter(staff => staff.user_role === "admin");
    return admins.length === 1 && admins[0].staff_id === staffId;
  };

  const renderUserStatus = (userId) => {
    return userId ? (
      <span className="text-green-600">Active</span>
    ) : (
      <span className="text-red-600">Inactive</span>
    );
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-2 md:space-y-0">
          <h1 className="text-2xl md:text-3xl font-bold">Clinic Staff</h1>
          <Button onClick={openAddDialog}>Add New</Button>
        </div>

        {/* Table and Pagination Container */}
        <div className="bg-white shadow rounded-lg p-4 min-h-[500px] flex flex-col justify-between overflow-x-auto">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {staffData.length > 0 ? (
                staffData.map((staff, index) => (
                  <TableRow key={staff.staff_id}>
                    <TableCell>{staff.fname} {staff.lname}</TableCell>
                    <TableCell>{staff.role}</TableCell>
                    <TableCell>{staff.email}</TableCell>
                    <TableCell>{renderUserStatus(staff.user_id)}</TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button variant="secondary" onClick={() => openEditDialog(index)}>Edit</Button>
                      <Button
                        variant="destructive"
                        onClick={() => confirmDelete(staff)}
                        disabled={isOnlyAdmin(staff.staff_id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="5" className="text-center py-4">No clinic staff found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="flex flex-wrap justify-center space-x-2 mt-4">
              <Button variant="outline" disabled={currentPage === 1} asChild>
                <Link href={`?page=${Math.max(1, currentPage - 1)}`}>
                  Previous
                </Link>
              </Button>

              {Array.from({ length: lastPage }, (_, index) => (
                <Button
                  key={index}
                  variant={currentPage === index + 1 ? "default" : "outline"}
                  asChild
                >
                  <Link href={`?page=${index + 1}`}>
                    {index + 1}
                  </Link>
                </Button>
              ))}

              <Button variant="outline" disabled={currentPage === lastPage} asChild>
                <Link href={`?page=${Math.min(lastPage, currentPage + 1)}`}>
                  Next
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Add Staff Dialog */}
      <AddStaffDialog open={openAdd} setOpen={setOpenAdd} />

      {/* Edit Staff Tab Dialog */}
      <EditStaffTab
        open={openEdit}
        setOpen={setOpenEdit}
        title="Edit Clinic Staff"
        description="Update the details of the clinic staff member."
        infoContent={
          <EditStaffDialog
            staff={selectedStaff}
            onClose={() => setOpenEdit(false)}
          />
        }
        accountContent={<UserStaffDialog
          staff={selectedStaff}
          onClose={() => setOpenEdit(false)}
        />}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              This action cannot be undone. Are you sure you want to delete staff:
              <strong> {selectedStaff?.fname} {selectedStaff?.lname}</strong>?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="secondary" onClick={() => setOpenDelete(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Layout>
  );
};

export default Index;
