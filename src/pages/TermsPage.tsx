import React from "react";
import {
  ArrowLeft,
  FileText,
  AlertTriangle,
  CreditCard,
  Shield,
} from "lucide-react";
import { Link } from "react-router-dom";

const TermsPage = () => {
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
          <h1 className="text-4xl font-bold text-[#1e1e1e] mb-6">
            Terms of Use
          </h1>
          <p className="text-xl text-gray-600">
            Please read these terms carefully before using MaxVue.
          </p>
          <p className="text-sm text-gray-500 mt-4">
            Last updated: December 28, 2025
          </p>
        </div>

        {/* Key Points */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <FileText className="h-8 w-8 text-blue-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#1e1e1e] mb-2">Agreement</h3>
            <p className="text-sm text-gray-600">
              By using MaxVue, you agree to these terms
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <AlertTriangle className="h-8 w-8 text-orange-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#1e1e1e] mb-2">Not Medical</h3>
            <p className="text-sm text-gray-600">
              MaxVue is not a medical device
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <CreditCard className="h-8 w-8 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#1e1e1e] mb-2">Subscriptions</h3>
            <p className="text-sm text-gray-600">
              Auto-renewing unless cancelled
            </p>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
            <Shield className="h-8 w-8 text-purple-500 mx-auto mb-3" />
            <h3 className="font-bold text-[#1e1e1e] mb-2">
              Intellectual Property
            </h3>
            <p className="text-sm text-gray-600">
              All content belongs to MaxVue
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-8">
              By using MaxVue, you agree to be bound by these Terms of Use.
              Please read them carefully. If you do not agree to these terms,
              please do not use our service.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                By accessing or using MaxVue, you acknowledge that you have
                read, understood, and agree to be bound by these Terms of Use
                and our Privacy Policy. These terms constitute a legally binding
                agreement between you and MaxVue.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              2. Description of Service
            </h2>
            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    MaxVue is a vision enhancement tool and{" "}
                    <strong>not a medical device</strong>.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    The app provides digital screen filters to help improve
                    visual clarity.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    MaxVue is not a substitute for professional eye care or
                    medical advice.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-[#3399FF] rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Results may vary and are not guaranteed.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              3. Eligibility
            </h2>
            <div className="bg-yellow-50 rounded-xl p-6 mb-8">
              <ul className="space-y-2">
                <li className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-gray-700">
                    You must be 18 years or older to use MaxVue.
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-gray-700">
                    Users under 18 must have parent or guardian consent.
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="text-gray-700">
                    You must provide accurate and complete information.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              4. Subscription and Billing
            </h2>
            <div className="bg-green-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-[#1e1e1e] mb-3">
                Subscription Plans
              </h3>
              <ul className="space-y-3 mb-6">
                <li className="flex items-start space-x-3">
                  <CreditCard className="h-4 w-4 text-green-600 mt-1" />
                  <span className="text-gray-700">
                    <strong>Free Plan:</strong> Basic features at no cost.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <CreditCard className="h-4 w-4 text-green-600 mt-1" />
                  <span className="text-gray-700">
                    <strong>Pro Plan:</strong> Monthly ($4.99), Annual ($39.99),
                    or Lifetime ($99.99).
                  </span>
                </li>
              </ul>

              <h3 className="text-lg font-semibold text-[#1e1e1e] mb-3">
                Billing Terms
              </h3>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Subscriptions automatically renew unless cancelled.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    You will be charged at the beginning of each billing period.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Cancel anytime through your app store account or web
                    dashboard.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Access continues until the end of your current billing
                    period.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              5. Refunds and Cancellation
            </h2>
            <div className="bg-red-50 rounded-xl p-6 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Refunds are not automatically provided for unused
                    subscription time.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    If you experience technical issues, contact us at{" "}
                    <a
                      href="mailto:contact@maxvue.app"
                      className="text-[#3399FF] underline"
                    >
                      contact@maxvue.app
                    </a>
                    .
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Refund requests will be considered on a case-by-case basis.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Payment failures will result in suspension of premium
                    features.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              6. Intellectual Property
            </h2>
            <div className="bg-purple-50 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                All content, features, and functionality of MaxVue, including
                but not limited to text, graphics, logos, icons, images, audio
                clips, and software, are the exclusive property of MaxVue and
                are protected by copyright, trademark, and other intellectual
                property laws.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">
                    You may not reproduce, distribute, or create derivative
                    works.
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">
                    You may not reverse engineer or attempt to extract source
                    code.
                  </span>
                </li>
                <li className="flex items-center space-x-3">
                  <Shield className="h-4 w-4 text-purple-600" />
                  <span className="text-gray-700">
                    All rights not expressly granted are reserved by MaxVue.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              7. User Conduct
            </h2>
            <div className="bg-orange-50 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="space-y-2">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Use MaxVue for any unlawful purpose or in violation of these
                    terms.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Attempt to gain unauthorized access to our systems or other
                    users' accounts.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Interfere with or disrupt the service or servers.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-orange-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Share your account credentials with others.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              8. Disclaimer of Warranties
            </h2>
            <div className="bg-gray-100 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                MaxVue is provided "as is" and "as available" without warranties
                of any kind, either express or implied. We do not warrant that
                the service will be uninterrupted, secure, or error-free. Your
                use of MaxVue is at your own risk.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              9. Limitation of Liability
            </h2>
            <div className="bg-gray-100 rounded-xl p-6 mb-8">
              <p className="text-gray-700 leading-relaxed">
                To the maximum extent permitted by law, MaxVue shall not be
                liable for any indirect, incidental, special, consequential, or
                punitive damages, including but not limited to loss of profits,
                data, or use, arising out of or relating to your use of the
                service.
              </p>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              10. Modifications to Service and Terms
            </h2>
            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <ul className="space-y-3">
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    We reserve the right to modify or discontinue MaxVue at any
                    time.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    We may update these terms from time to time.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    Continued use after changes constitutes acceptance of new
                    terms.
                  </span>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <span className="text-gray-700">
                    We will notify users of significant changes via email or app
                    notification.
                  </span>
                </li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              11. Governing Law
            </h2>
            <p className="text-gray-700 leading-relaxed mb-8">
              These Terms of Use shall be governed by and construed in
              accordance with the laws of the jurisdiction where MaxVue is
              headquartered, without regard to conflict of law principles.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4">
              12. Contact Information
            </h2>
            <div className="bg-[#3399FF] rounded-xl p-6 text-white">
              <p className="mb-4">
                If you have any questions about these Terms of Use, please
                contact us:
              </p>
              <div className="space-y-2">
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:legal@maxvue.app"
                    className="underline hover:text-blue-200"
                  >
                    legal@maxvue.app
                  </a>
                </p>
                <p>
                  <strong>General Support:</strong>{" "}
                  <a
                    href="mailto:contact@maxvue.app"
                    className="underline hover:text-blue-200"
                  >
                    contact@maxvue.app
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
