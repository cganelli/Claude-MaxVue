import React from "react";
import Modal from "./Modal";
import Button from "./Button";

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-black mb-4">Delete Account</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Are you sure you want to delete your account? This action cannot be
            undone.
          </p>
        </div>

        <div className="flex space-x-4">
          <Button
            onClick={onClose}
            variant="outline"
            size="lg"
            className="flex-1 rounded-2xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            size="lg"
            className="flex-1 rounded-2xl bg-red-600 hover:bg-red-700"
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteAccountModal;
