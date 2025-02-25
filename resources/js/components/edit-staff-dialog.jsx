import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useForm } from '@inertiajs/react';
import StaffFormFields from './staff-form-fields';

const EditStaffDialog = ({ staff, onClose }) => {
  const { data, setData, put, processing, reset } = useForm({
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

  useEffect(() => {
    if (staff) {
      setData({
        lname: staff.lname || '',
        fname: staff.fname || '',
        mname: staff.mname || '',
        ext: staff.ext || '',
        role: staff.role || '',
        license_no: staff.license_no || '',
        ptr_no: staff.ptr_no || '',
        email: staff.email || '',
        contact_no: staff.contact_no || '',
      });
    } else {
      reset();
    }
  }, [staff]);

  const handleSubmit = (e) => {
    e.preventDefault();
    put(`/clinic-staff/${staff.staff_id}`, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: onClose,
    });
  };

  return (
    <form onSubmit={handleSubmit} className='grid grid-cols-2 gap-4'>
      <StaffFormFields data={data} setData={setData} />
      <div className='col-span-2 flex justify-end gap-2'>
        <Button type='button' variant='secondary' onClick={onClose}>Cancel</Button>
        <Button type='submit' disabled={processing}>Update</Button>
      </div>
    </form>
  );
};

export default EditStaffDialog;
