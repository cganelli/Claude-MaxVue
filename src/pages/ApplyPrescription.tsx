import React, { useState } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import Button from '../components/Button';

const ApplyPrescription = () => {
  const [prescriptionData, setPrescriptionData] = useState({
    sphereOD: '',
    sphereOS: '',
    cylinderOD: '',
    cylinderOS: '',
    axis: ''
  });

  const handleInputChange = (field: string, value: string) => {
    setPrescriptionData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Save prescription data
    console.log('Saving prescription:', prescriptionData);
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <Link to="/welcome" className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <div className="text-center flex-1">
              <span className="text-3xl font-bold text-black whitespace-nowrap">Enter Prescription</span>
            </div>
            <div className="w-10"></div>
          </div>

          {/* Input Fields */}
          <div className="space-y-6">
            {/* Sphere (OD / OS) */}
            <div>
              <label className="block text-lg font-medium text-black mb-3">
                Sphere (OD / OS)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={prescriptionData.sphereOD}
                  onChange={(e) => handleInputChange('sphereOD', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="-1.00"
                />
                <input
                  type="text"
                  value={prescriptionData.sphereOS}
                  onChange={(e) => handleInputChange('sphereOS', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="-1.25"
                />
              </div>
            </div>

            {/* Cylinder (optional) */}
            <div>
              <label className="block text-lg font-medium text-black mb-3">
                Cylinder (optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={prescriptionData.cylinderOD}
                  onChange={(e) => handleInputChange('cylinderOD', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="-0.50"
                />
                <input
                  type="text"
                  value={prescriptionData.cylinderOS}
                  onChange={(e) => handleInputChange('cylinderOS', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="180"
                />
              </div>
            </div>

            {/* Axis (optional) with Save button */}
            <div>
              <label className="block text-lg font-medium text-black mb-3">
                Axis (optional)
              </label>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  value={prescriptionData.axis}
                  onChange={(e) => handleInputChange('axis', e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-lg text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                  placeholder="180"
                />
                <Button
                  onClick={handleSave}
                  size="lg"
                  fullWidth
                  className="rounded-2xl"
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />
    </div>
  );
};

export default ApplyPrescription;