import React, { useState } from 'react';
import { ArrowLeft, Check, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';

const SelectPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState('pro'); // Default to Pro

  const features = [
    { name: 'Manual Rx Input', free: true, pro: true },
    { name: 'One-Tap Correction', free: true, pro: true },
    { name: 'Email/Web/Camera Filters', free: true, pro: true },
    { name: 'Simulated Eye Test', free: false, pro: true },
    { name: 'Profile Saving & Switching', free: false, pro: true },
    { name: 'Photo Gallery Correction', free: false, pro: true },
    { name: 'Day/Night Auto Brightness', free: false, pro: true },
    { name: 'App-Specific Correction', free: false, pro: true } // Changed from "Overrides"
  ];

  const handleContinue = () => {
    console.log('Continuing with plan:', selectedPlan);
    // Handle plan selection logic here
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/settings" className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-black">Select a Plan</h1>
            <div className="w-10"></div>
          </div>

          {/* Plan Toggle - Removed hover effects */}
          <div className="mb-6">
            <div className="bg-gray-200 rounded-2xl p-1 flex">
              <button
                onClick={() => setSelectedPlan('free')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                  selectedPlan === 'free'
                    ? 'bg-vivid-blue-500 text-white'
                    : 'bg-white text-black'
                }`}
              >
                <div className="text-lg">Free</div>
              </button>
              <button
                onClick={() => setSelectedPlan('pro')}
                className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                  selectedPlan === 'pro'
                    ? 'bg-vivid-blue-500 text-white'
                    : 'bg-white text-black'
                }`}
              >
                <div>
                  <div className="text-lg">Pro</div>
                  <div className="text-sm font-normal">$4.99/mo</div>
                </div>
              </button>
            </div>
          </div>

          {/* Features Table - Compact design */}
          <div className="mb-6 bg-white rounded-3xl p-4 shadow-lg">
            {/* Table Header */}
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-gray-200">
              <h3 className="text-lg font-bold text-black">Feature</h3>
              <h3 className="text-lg font-bold text-black">Check</h3>
            </div>
            
            {/* Features List - Reduced spacing */}
            <div className="space-y-2">
              {features.map((feature, index) => {
                const isIncluded = selectedPlan === 'free' ? feature.free : feature.pro;
                return (
                  <div key={index} className="flex justify-between items-center py-1">
                    <span className="text-gray-700 text-sm font-medium">{feature.name}</span>
                    <div className="flex items-center justify-center">
                      {isIncluded ? (
                        <Check className="h-5 w-5 text-green-600" />
                      ) : (
                        <X className="h-5 w-5 text-red-600" />
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Button - Fixed colors */}
          <button
            onClick={handleContinue}
            className="w-full bg-vivid-blue-500 text-white py-4 px-6 rounded-2xl text-lg font-semibold hover:bg-dark-blue-900 active:bg-dark-blue-900 transition-colors"
          >
            Continue
          </button>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default SelectPlan;