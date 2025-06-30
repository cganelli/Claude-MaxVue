import React from 'react';
import Modal from './Modal';
import Button from './Button';

interface PlanUpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PlanUpgradeModal: React.FC<PlanUpgradeModalProps> = ({
  isOpen,
  onClose
}) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-black mb-4">
            Plan Upgraded
          </h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            You've successfully upgraded to Pro.
          </p>
        </div>

        <Button
          onClick={onClose}
          size="lg"
          fullWidth
          className="rounded-2xl"
        >
          OK
        </Button>
      </div>
    </Modal>
  );
};

export default PlanUpgradeModal;