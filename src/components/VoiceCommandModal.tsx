import React from "react";
import { Mic } from "lucide-react";
import Modal from "./Modal";

interface VoiceCommandModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceCommandModal: React.FC<VoiceCommandModalProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} className="py-16">
      <div className="text-center space-y-8">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-gray-600 rounded-full flex items-center justify-center">
            <Mic className="h-10 w-10 text-white" />
          </div>
        </div>

        <p className="text-xl font-medium text-gray-900">Listening...</p>
      </div>
    </Modal>
  );
};

export default VoiceCommandModal;
