import React, { useState } from 'react';
import Modal from './Modal';
import Button from './Button';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (email: string) => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({
  isOpen,
  onClose,
  onSubmit
}) => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(email);
    setEmail('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center space-y-8">
        <div>
          <h2 className="text-2xl font-bold text-black mb-2">
            VividVue
          </h2>
          <h3 className="text-xl font-bold text-black mb-4">
            Forgot Password
          </h3>
          <p className="text-gray-700 leading-relaxed">
            Enter your email to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-dark-blue-900 focus:border-dark-blue-900 transition-colors bg-white"
          />

          <Button
            type="submit"
            size="lg"
            fullWidth
            className="rounded-2xl"
          >
            Reset Password
          </Button>
        </form>
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;