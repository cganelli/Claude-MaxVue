import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, FileText, Shield, Mail, Star, CreditCard } from 'lucide-react';
import { Link } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';

const More = () => {
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');

  const handleContactUs = () => {
    const subject = encodeURIComponent('MaxVue Support Request');
    const body = encodeURIComponent('Hello MaxVue team,\n\nI need help with:\n\n');
    window.location.href = `mailto:contact@maxvue.app?subject=${subject}&body=${body}`;
  };

  const handleBilling = () => {
    // Link to RevenueCat
    window.open('https://app.revenuecat.com', '_blank');
  };

  const handleFAQs = () => {
    window.open('https://www.maxvue.app/FAQ', '_blank');
  };

  const handleTerms = () => {
    window.open('https://www.maxvue.app/Terms', '_blank');
  };

  const handlePrivacy = () => {
    window.open('https://www.maxvue.app/Privacy', '_blank');
  };

  const handleRateApp = () => {
    setShowRatingModal(true);
  };

  const handleSubmitRating = () => {
    // Detect platform and redirect to appropriate app store
    const userAgent = navigator.userAgent || navigator.vendor;
    
    if (/android/i.test(userAgent)) {
      // Android - redirect to Google Play Store
      window.open('https://play.google.com/store/apps/details?id=com.maxvue.app', '_blank');
    } else if (/iPad|iPhone|iPod/.test(userAgent)) {
      // iOS - redirect to App Store
      window.open('https://apps.apple.com/app/maxvue/id123456789', '_blank');
    } else {
      // Default fallback
      window.open('https://www.maxvue.app/rate', '_blank');
    }
    
    setShowRatingModal(false);
    setRating(0);
    setFeedback('');
  };

  const menuItems = [
    {
      icon: HelpCircle,
      title: 'FAQs',
      description: 'Get answers to common questions',
      action: handleFAQs
    },
    {
      icon: FileText,
      title: 'Terms of Service',
      description: 'Read our terms and conditions',
      action: handleTerms
    },
    {
      icon: Shield,
      title: 'Privacy Policy',
      description: 'Learn how we protect your data',
      action: handlePrivacy
    },
    {
      icon: Mail,
      title: 'Contact Us',
      description: 'Get in touch with our team',
      action: handleContactUs
    },
    {
      icon: Star,
      title: 'Rate the App',
      description: 'Share your feedback',
      action: handleRateApp
    },
    {
      icon: CreditCard,
      title: 'Billing',
      description: 'Manage your subscription',
      action: handleBilling
    }
  ];

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond pb-20">
      <div className="px-4 py-6">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/welcome" className="p-2 hover:bg-white/50 rounded-full transition-colors">
              <ArrowLeft className="h-6 w-6 text-gray-600" />
            </Link>
            <h1 className="text-3xl font-bold text-black">More</h1>
            <div className="w-10"></div>
          </div>

          {/* Menu Items */}
          <div className="space-y-3">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              
              return (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full bg-white rounded-2xl shadow-lg p-4 hover:shadow-xl transition-all transform hover:scale-105 active:scale-95"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-vivid-blue-500" />
                    </div>
                    <div className="flex-1 text-left">
                      <h3 className="text-lg font-semibold text-black">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* App Info */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
            <div className="text-center">
              <img 
                src="/maxvue_logo_transparent_bg.png" 
                alt="MaxVue" 
                className="h-16 w-auto mx-auto mb-2"
              />
              <p className="text-gray-600 text-sm mb-2">Version 1.0.0</p>
              <p className="text-gray-500 text-xs">
                © 2025 MaxVue. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <BottomNavigation />

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={() => setShowRatingModal(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-[#eaf1fd] rounded-3xl shadow-2xl p-8 mx-4 max-w-sm w-full">
            <div className="text-center space-y-6">
              <h2 className="text-2xl font-bold text-black">Rate MaxVue</h2>
              
              {/* Star Rating */}
              <div className="flex justify-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className="transition-colors"
                  >
                    <Star 
                      className={`h-8 w-8 ${
                        star <= rating 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'
                      }`} 
                    />
                  </button>
                ))}
              </div>
              
              {/* Feedback Text Box */}
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Tell us what you think..."
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-2xl text-sm placeholder-gray-500 focus:outline-none focus:border-dark-blue-900 transition-colors bg-white resize-none"
                rows={4}
              />
              
              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowRatingModal(false)}
                  className="flex-1 bg-white text-black py-3 px-6 rounded-2xl font-semibold hover:bg-gray-100 transition-colors border border-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitRating}
                  disabled={rating === 0}
                  className="flex-1 bg-vivid-blue-500 text-white py-3 px-6 rounded-2xl font-semibold hover:bg-dark-blue-900 active:bg-dark-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default More;