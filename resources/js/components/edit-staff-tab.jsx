import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent
} from '@/components/ui/tabs';

const EditStaffTab = ({ open, setOpen, title, description, infoContent, accountContent }) => {
  return (
    <Dialog open={open} onOpenChange={(val) => setOpen(val)}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        {/* Centering the Tabs */}
        <div className="flex justify-center">
          <Tabs defaultValue="information" className="w-[400px]">
            <TabsList className="mb-4 grid w-full grid-cols-2">
              <TabsTrigger value="information">Information</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>

            <TabsContent value="information">
              {infoContent}
            </TabsContent>

            <TabsContent value="account">
              {accountContent}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditStaffTab;
