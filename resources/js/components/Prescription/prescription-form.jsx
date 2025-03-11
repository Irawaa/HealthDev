import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const PrescriptionForm = ({ open, setOpen, setPrescriptionImage }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedImage) {
      setPrescriptionImage(preview);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="bg-white shadow-xl rounded-lg p-6 max-w-md w-full mx-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-700">Upload Prescription</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Upload Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Select an image:</label>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="border border-gray-300 rounded p-2 w-full" />
          </div>

          {/* Image Preview */}
          {preview && (
            <div className="flex justify-center mt-4">
              <img src={preview} alt="Prescription Preview" className="max-w-full h-auto rounded-lg shadow-md border border-gray-300" />
            </div>
          )}
        </div>

        <DialogFooter className="mt-4 flex justify-between">
          <Button onClick={() => setOpen(false)} className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-800">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PrescriptionForm;
