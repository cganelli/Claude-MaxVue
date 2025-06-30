import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Check, X, Loader2 } from 'lucide-react';
import Button from '../components/Button';

interface PasswordRequirement {
  label: string;
  test: (password: string) => boolean;
}

const passwordRequirements: PasswordRequirement[] = [
  {
    label: 'At least 8 characters',
    test: (password: string) => password.length >= 8
  },
  {
    label: 'One uppercase letter',
    test: (password: string) => /[A-Z]/.test(password)
  },
  {
    label: 'One lowercase letter',
    test: (password: string) => /[a-z]/.test(password)
  },
  {
    label: 'One number',
    test: (password: string) => /\d/.test(password)
  },
  {
    label: 'One special character (!@#$%^&*)',
    test: (password: string) => /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }
];

const Register = () => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorState, setErrorState] = useState<"userExists" | "unknown" | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const isPasswordValid = () => {
    return passwordRequirements.every(req => req.test(password));
  };

  const handleChange = () => {
    if (errorState) {
      setErrorState(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isPasswordValid()) {
      setErrorState("unknown");
      return;
    }
    
    if (password !== confirmPassword) {
      setErrorState("unknown");
      return;
    }
    
    setIsLoading(true);
    setErrorState(null);

    try {
      const result = await register(firstName, lastName, email, password);
      
      if (result.success) {
        console.log('✅ Registration successful, navigation will be handled by routing logic');
        // Navigation will be handled automatically by the routing logic in App.tsx
      } else {
        console.log('❌ Registration failed:', result.error);
        
        // Handle the error from the register function result
        const errorMessage = result.error || '';
        const lowerMessage = errorMessage.toLowerCase();

        if (
          lowerMessage.includes("already") &&
          lowerMessage.includes("email")
        ) {
          setErrorState("userExists");
        } else if (
          lowerMessage.includes("user already registered")
        ) {
          setErrorState("userExists");
        } else if (
          lowerMessage.includes("already exists")
        ) {
          setErrorState("userExists");
        } else {
          setErrorState("unknown");
        }
      }
    } catch (err) {
      console.error('❌ Registration error:', err);
      setErrorState("unknown");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] flex items-center justify-center px-6 py-12 font-garamond">
      <div className="max-w-md w-full space-y-6">
        {/* Logo and Header Combined */}
        <div className="text-center">
          <img 
            src="/maxvue_logo_transparent_bg.png" 
            alt="MaxVue" 
            className="h-24 w-auto mx-auto mb-2"
          />
          <p className="text-3xl text-black leading-relaxed font-bold">
            Sign up to ditch your glasses!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  handleChange();
                  setFirstName(e.target.value);
                }}
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
                placeholder="First name"
              />
            </div>
            <div>
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  handleChange();
                  setLastName(e.target.value);
                }}
                required
                className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
                placeholder="Last name"
              />
            </div>
          </div>

          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => {
                handleChange();
                setEmail(e.target.value);
              }}
              required
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
              placeholder="Email address"
            />
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => {
                handleChange();
                setPassword(e.target.value);
              }}
              required
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
              placeholder="Password"
            />
            
            {/* Password Requirements */}
            {password && (
              <div className="mt-3 space-y-2">
                {passwordRequirements.map((requirement, index) => {
                  const isMet = requirement.test(password);
                  return (
                    <div key={index} className="flex items-center space-x-2">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                        isMet ? 'bg-green-500' : 'bg-gray-300'
                      }`}>
                        {isMet ? (
                          <Check className="w-3 h-3 text-white" />
                        ) : (
                          <X className="w-3 h-3 text-gray-500" />
                        )}
                      </div>
                      <span className={`text-sm ${
                        isMet ? 'text-green-600' : 'text-gray-600'
                      }`}>
                        {requirement.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => {
                handleChange();
                setConfirmPassword(e.target.value);
              }}
              required
              className="w-full px-6 py-4 border-2 border-gray-300 rounded-full text-lg placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white"
              placeholder="Confirm password"
            />
          </div>

          {/* Error Messages */}
          {errorState === "userExists" && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
              <p className="text-red-800 text-sm font-medium">
                An account with this email already exists. Please{' '}
                <Link 
                  to="/login" 
                  className="font-semibold text-blue-600 underline hover:text-blue-800 transition-colors"
                >
                  log in
                </Link>{' '}
                instead.
              </p>
            </div>
          )}

          {errorState === "unknown" && (
            <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 shadow-sm">
              <p className="text-red-800 text-sm font-medium">
                Something went wrong. Please try again.
              </p>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading || !isPasswordValid()}
            size="lg"
            fullWidth
            className="rounded-full"
            icon={isLoading ? Loader2 : undefined}
          >
            {isLoading ? 'Creating Account...' : 'Sign up'}
          </Button>
        </form>

        {/* Terms */}
        <div className="text-center">
          <p className="text-gray-600 text-sm leading-relaxed">
            By signing up, you agree to our{' '}
            <Link to="/privacy" className="text-dark-blue-900 underline hover:text-vivid-blue-500">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link to="/terms" className="text-dark-blue-900 underline hover:text-vivid-blue-500">
              Terms of Service
            </Link>
            .
          </p>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-900 text-lg">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-dark-blue-900 underline hover:text-vivid-blue-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;