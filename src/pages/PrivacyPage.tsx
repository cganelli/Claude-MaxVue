import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const PrivacyPage = () => {
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
          <h1 className="text-4xl font-bold text-[#1e1e1e] mb-6">Privacy Policy</h1>
          <p className="text-xl text-gray-600">Your privacy is our priority. Here's how we protect your data.</p>
          <p className="text-sm text-gray-500 mt-4">Last updated: December 28, 2025</p>
        </div>

        {/* Privacy Highlights */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Shield className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#1e1e1e] mb-2">Secure Storage</h3>
            <p className="text-sm text-gray-600">All data encrypted and stored securely</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Lock className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#1e1e1e] mb-2">No Sharing</h3>
            <p className="text-sm text-gray-600">We never sell or share your data</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Eye className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#1e1e1e] mb-2">Transparent</h3>
            <p className="text-sm text-gray-600">Clear about what we collect and why</p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Trash2 className="h-8 w-8 text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#1e1e1e] mb-2">Your Control</h3>
            <p className="text-sm text-gray-600">Delete your data anytime</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              MaxVue respects your privacy and is committed to protecting your personal information. 
              This Privacy Policy describes how we collect, use, and safeguard your information when 
              you use our vision correction application.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">Information We Collect</h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <div>
                    <strong className="text-[#1e1e1e]">Account Information:</strong>
                    <span className="text-gray-700"> First name, last name, and email address for account creation and management.</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <div>
                    <strong className="text-[#1e1e1e]">Vision Data:</strong>
                    <span className="text-gray-700"> Prescription information and eye test results (optional, only if you choose to provide it).</span>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <div>
                    <strong className="text-[#1e1e1e]">Usage Data:</strong>
                    <span className="text-gray-700"> App usage patterns and preferences to improve your experience.</span>
                  </div>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">How We Use Your Information</h2>
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Personalization:</strong> To provide customized vision correction services tailored to your needs.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Synchronization:</strong> To sync your settings and preferences across multiple devices.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Communication:</strong> To send important updates about your account and the service.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Improvement:</strong> To enhance our app features and user experience.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">Data Security</h2>
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">End-to-end encryption for all data transmission</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Secure cloud storage with Supabase</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Row-level security and access controls</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-green-600" />
                  <span className="text-gray-700">Regular security audits and updates</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">Data Sharing</h2>
            <div className="bg-red-50 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                <strong>We do not sell, trade, or share your personal information with third parties.</strong> 
                Your vision data and personal information remain private and are used solely to provide 
                and improve our services to you.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">Your Rights and Control</h2>
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Access:</strong> View and download your personal data at any time.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Correction:</strong> Update or correct your information through the app settings.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Deletion:</strong> Delete your account and all associated data from the Settings screen.</span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <span className="text-gray-700"><strong>Consent:</strong> Withdraw consent for data processing at any time.</span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">Cookies and Tracking</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              MaxVue uses minimal cookies and tracking technologies solely for essential app functionality 
              and user authentication. We do not use cookies for advertising or tracking purposes.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              MaxVue is not intended for children under 13 years of age. We do not knowingly collect 
              personal information from children under 13. If you are a parent or guardian and believe 
              your child has provided us with personal information, please contact us.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              We may update this Privacy Policy from time to time. We will notify you of any changes 
              by posting the new Privacy Policy on this page and updating the "Last updated" date. 
              Your continued use of MaxVue after any changes constitutes acceptance of the new policy.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">Contact Us</h2>
            <div className="bg-[#3399FF] rounded-xl p-6 text-white">
              <p className="mb-4">
                If you have any questions about this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="space-y-2">
                <p><strong>Email:</strong> <a href="mailto:privacy@maxvue.app" className="underline hover:text-blue-200">privacy@maxvue.app</a></p>
                <p><strong>General Support:</strong> <a href="mailto:contact@maxvue.app" className="underline hover:text-blue-200">contact@maxvue.app</a></p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;