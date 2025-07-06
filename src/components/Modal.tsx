import React from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  showCloseButton = false,
  className = "",
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content - Updated to use Very Light Blue background */}
      <div
        className={`relative bg-[#eaf1fd] rounded-3xl shadow-2xl p-8 mx-4 max-w-sm w-full ${className}`}
      >
        {showCloseButton && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 hover:bg-white/50 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        )}
        {children}
      </div>
    </div>
  );
};

export default Modal;
