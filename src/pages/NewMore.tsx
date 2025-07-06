import React, { useState } from "react";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import BottomNavigation from "../components/BottomNavigation";

const NewMore = () => {
  const [photoCorrectionEnabled, setPhotoCorrectionEnabled] = useState(false);
  const [voiceCommandsEnabled, setVoiceCommandsEnabled] = useState(true);

  const menuItems = [
    {
      title: "Photo Correction",
      description: "Applying correction to all photos in your gallery.",
      hasToggle: true,
      enabled: photoCorrectionEnabled,
      onToggle: () => setPhotoCorrectionEnabled(!photoCorrectionEnabled),
    },
    {
      title: "Voice Commands",
      description: 'Say "VividVue off" to disable vision correction.',
      hasToggle: true,
      enabled: voiceCommandsEnabled,
      onToggle: () => setVoiceCommandsEnabled(!voiceCommandsEnabled),
    },
    {
      title: "Support",
      description: null,
      hasToggle: false,
      enabled: false,
      onToggle: () => {},
    },
    {
      title: "FAQs",
      description: null,
      hasToggle: false,
      enabled: false,
      onToggle: () => {},
    },
  ];

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-center mb-8 relative">
            <Link
              to="/welcome"
              className="absolute left-0 p-2 hover:bg-white/50 rounded-full transition-colors"
            >
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-black">More</h1>
          </div>

          {/* Menu Items */}
          <div className="space-y-0">
            {menuItems.map((item, index) => (
              <div
                key={index}
                className={`bg-white p-6 border-b border-gray-200 ${
                  index === 0 ? "rounded-t-3xl" : ""
                } ${
                  index === menuItems.length - 1
                    ? "rounded-b-3xl border-b-0"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-black mb-1">
                      {item.title}
                    </h3>
                    {item.description && (
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="ml-4">
                    {item.hasToggle ? (
                      <button
                        onClick={item.onToggle}
                        className="w-12 h-6 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors"
                      >
                        {item.enabled ? (
                          <Plus className="h-4 w-4 text-gray-600" />
                        ) : (
                          <Minus className="h-4 w-4 text-gray-600" />
                        )}
                      </button>
                    ) : (
                      <button className="w-12 h-6 bg-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-300 transition-colors">
                        <Plus className="h-4 w-4 text-gray-600" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
};

export default NewMore;
