import React, { useState } from "react";
import { Check, X } from "lucide-react";
import Button from "../components/Button";
import PlanUpgradeModal from "../components/PlanUpgradeModal";

const NewSelectPlan = () => {
  const [selectedPlan, setSelectedPlan] = useState("free");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const features = [
    { name: "Manual Rx Input", free: true, pro: true },
    { name: "One-Tap Correction", free: true, pro: true },
    { name: "Email/Web/Camera Filters", free: true, pro: true },
    { name: "Simulated Eye Test", free: true, pro: true },
    { name: "Profile Saving & Switching", free: false, pro: true },
    { name: "Photo Gallery Correction", free: false, pro: true },
    { name: "Day/Night Auto Brightness", free: false, pro: true },
    { name: "App-Specific Overrides", free: false, pro: true },
  ];

  const handleContinue = () => {
    if (selectedPlan === "pro") {
      setShowUpgradeModal(true);
    } else {
      console.log("Continuing with free plan");
    }
  };

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-black">Select a Plan</h1>
        </div>

        {/* Plan Toggle */}
        <div className="mb-8">
          <div className="bg-gray-100 rounded-2xl p-1 flex">
            <button
              onClick={() => setSelectedPlan("free")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                selectedPlan === "free"
                  ? "bg-gray-600 text-white"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Free
            </button>
            <button
              onClick={() => setSelectedPlan("pro")}
              className={`flex-1 py-3 px-4 rounded-xl font-semibold transition-colors ${
                selectedPlan === "pro"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div>
                <div>Pro</div>
                <div className="text-sm font-normal">$4.99/mo</div>
                <div className="text-sm font-normal">$39.99/yr</div>
              </div>
            </button>
          </div>
        </div>

        {/* Features List */}
        <div className="mb-8 bg-white rounded-3xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-black">Feature</h3>
            <h3 className="text-lg font-bold text-black">Check</h3>
          </div>

          <div className="space-y-3">
            {features.map((feature, index) => {
              const isIncluded =
                selectedPlan === "free" ? feature.free : feature.pro;
              return (
                <div
                  key={index}
                  className="flex justify-between items-center py-2"
                >
                  <span className="text-gray-700 text-sm">{feature.name}</span>
                  <div className="w-6 h-6 rounded bg-gray-600 flex items-center justify-center">
                    {isIncluded ? (
                      <Check className="h-4 w-4 text-white" />
                    ) : (
                      <X className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Continue Button */}
        <Button
          onClick={handleContinue}
          size="lg"
          fullWidth
          className="rounded-2xl"
        >
          Continue
        </Button>
      </div>

      <PlanUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />
    </div>
  );
};

export default NewSelectPlan;
