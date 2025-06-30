import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

const FAQPage = () => {
  const faqs = [
    {
      question: "What is MaxVue?",
      answer: "MaxVue is a digital vision support app that helps you see clearly by applying custom visual filters based on your personal prescription or in-app eye test."
    },
    {
      question: "How does MaxVue improve my vision?",
      answer: "MaxVue applies dynamic screen filters tailored to your eyes. Think of it like adjusting contrast and sharpness — but based on your real prescription."
    },
    {
      question: "Can this replace a visit to the eye doctor?",
      answer: "No. MaxVue is not a substitute for a comprehensive eye exam. It's a tool to help you see more clearly in digital environments."
    },
    {
      question: "What vision conditions does MaxVue support?",
      answer: "Myopia, hyperopia, astigmatism, and presbyopia. More filters may be added in future updates."
    },
    {
      question: "Is MaxVue safe for people with astigmatism?",
      answer: "Yes — MaxVue includes filters designed to support astigmatism. Stop using if discomfort occurs and consult an eye care provider."
    },
    {
      question: "How accurate is the MaxVue eye test?",
      answer: "It uses subjective blur calibration designed to optimize your screen — not for medical diagnosis."
    },
    {
      question: "Can I manually enter my prescription?",
      answer: "Yes. Enter your prescription in the Rx Settings tab."
    },
    {
      question: "What if I don't know my prescription?",
      answer: "Use the in-app eye test to calibrate your vision based on what looks clearest to you."
    },
    {
      question: "How is my vision data used?",
      answer: "It is used only to personalize your experience. We do not sell or share your data."
    },
    {
      question: "What devices can I use MaxVue on?",
      answer: "Currently Android and web. iOS and desktop are coming soon."
    },
    {
      question: "Does MaxVue work in Gmail or Outlook?",
      answer: "Yes, it includes optional integrations to apply clarity filters to your emails."
    },
    {
      question: "How do I activate or deactivate the filter?",
      answer: "Use the app toggle or widget. Voice command is also supported."
    },
    {
      question: "Will this work in dark mode?",
      answer: "Yes, MaxVue auto-adjusts brightness and contrast using your light sensor."
    },
    {
      question: "Is my prescription data secure?",
      answer: "Yes, stored securely with encryption and row-level access control."
    },
    {
      question: "Who has access to my information?",
      answer: "You do. MaxVue does not sell or share data with advertisers."
    },
    {
      question: "Can I delete my data?",
      answer: "Yes, from the Settings screen inside the app."
    },
    {
      question: "How much does MaxVue cost?",
      answer: "MaxVue offers a FREE Basic plan and a Pro plan with premium features. You can subscribe to the Pro plan monthly ($4.99/month), annually ($39.99/year), or as a lifetime purchase ($99.99)."
    },
    {
      question: "How do I cancel my subscription?",
      answer: "Through your app store account or the web dashboard. Access continues until the current period ends."
    },
    {
      question: "Can I get a refund?",
      answer: "Refunds aren't automatic, but reach out to contact@maxvue.app if there's a problem."
    },
    {
      question: "What happens if my payment fails?",
      answer: "Your subscription will pause and premium features will be disabled until billing info is updated."
    }
  ];

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center py-4">
            <Link to="/" className="flex items-center space-x-2 mr-8">
              <ArrowLeft className="h-5 w-5 text-gray-600" />
              <span className="text-gray-600">Back to Home</span>
            </Link>
            <img 
              src="/maxvue_logo_transparent_bg.png" 
              alt="MaxVue" 
              className="h-10 w-auto"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-[#1e1e1e] mb-6">Frequently Asked Questions</h1>
          <p className="text-xl text-gray-600">Everything you need to know about MaxVue</p>
        </div>

        <div className="space-y-8">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
              <h2 className="text-xl font-bold text-[#1e1e1e] mb-4 flex items-start">
                <span className="text-[#3399FF] mr-3">{index + 1}.</span>
                {faq.question}
              </h2>
              <p className="text-gray-700 leading-relaxed pl-8">{faq.answer}</p>
            </div>
          ))}
        </div>

        {/* Pricing Visual */}
        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-[#1e1e1e] mb-6 text-center">MaxVue Pricing Plans</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="border-2 border-gray-200 rounded-xl p-6">
              <h4 className="text-xl font-bold text-[#1e1e1e] mb-4">Free</h4>
              <div className="text-3xl font-bold text-[#1e1e1e] mb-4">$0<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Manual Rx Input</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">One-Tap Correction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Email/Web/Camera Filters</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Simulated Eye Test</span>
                </li>
              </ul>
            </div>

            {/* Pro Plan */}
            <div className="border-2 border-[#3399FF] rounded-xl p-6 bg-blue-50">
              <h4 className="text-xl font-bold text-[#1e1e1e] mb-4">Pro</h4>
              <div className="text-3xl font-bold text-[#1e1e1e] mb-4">$4.99<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-2">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Everything in Free</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Profile Saving & Switching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Photo Gallery Correction</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Day/Night Auto Brightness</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">App-Specific Overrides</span>
                </li>
              </ul>
            </div>
          </div>
          <p className="text-center text-sm text-gray-600 mt-6">
            *MaxVue Pro is available as an in-app purchase.*
          </p>
        </div>

        {/* Contact Section */}
        <div className="mt-16 text-center bg-[#3399FF] rounded-2xl p-8 text-white">
          <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
          <p className="mb-6">We're here to help! Reach out to our support team.</p>
          <a 
            href="mailto:contact@maxvue.app"
            className="bg-white text-[#3399FF] px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-block"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
};

export default FAQPage;