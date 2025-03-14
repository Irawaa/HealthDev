import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const ConfirmationModal = ({ open, onClose, onConfirm, title, message, actionType }) => {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-white shadow-xl rounded-lg p-6 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
        </DialogHeader>

        <p className="text-gray-700">{message}</p>

        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500">
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className={`px-4 py-2 rounded ${
              actionType === "Remove" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {actionType}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
