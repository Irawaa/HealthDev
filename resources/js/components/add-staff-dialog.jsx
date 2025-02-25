// AddStaffDialog.jsx
import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import StaffFormFields from './staff-form-fields';

const AddStaffDialog = ({ open, setOpen }) => {
  const { data, setData, post, processing, reset } = useForm({
    lname: '',
    fname: '',
    mname: '',
    ext: '',
    role: '',
    license_no: '',
    ptr_no: '',
    email: '',
    contact_no: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post('/clinic-staff', {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setOpen(false);
        reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { setOpen(val); if (!val) reset(); }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Clinic Staff</DialogTitle>
          <DialogDescription>Fill in the details below to add a new clinic staff member.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
          <StaffFormFields data={data} setData={setData} />
          <DialogFooter className='col-span-2 flex justify-end gap-2'>
            <Button type='button' variant='secondary' onClick={() => setOpen(false)}>Cancel</Button>
            <Button type='submit' disabled={processing}>Add</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddStaffDialog;