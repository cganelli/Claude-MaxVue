import React from "react";
import Modal from "./Modal";

interface VisionCorrectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VisionCorrectionModal: React.FC<VisionCorrectionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-black mb-4">
            Vision Correction On
          </h2>
          <p className="text-2xl text-gray-700 leading-relaxed">
            Turn on MaxVue vision correction?
          </p>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={onConfirm}
            className="flex-1 bg-vivid-blue-500 text-white py-4 px-6 rounded-2xl text-lg font-semibold hover:bg-dark-blue-900 active:bg-dark-blue-900 transition-colors shadow-lg"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-white text-black py-4 px-6 rounded-2xl text-lg font-semibold hover:bg-dark-blue-900 hover:text-white active:bg-dark-blue-900 active:text-white transition-colors border border-gray-200 shadow-lg"
          >
            No
          </button>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <p className="text-2xl text-gray-600 leading-relaxed">
            To turn off MaxVue, visit the home page.
          </p>
        </div>
      </div>
    </Modal>
  );
};

export default VisionCorrectionModal;
