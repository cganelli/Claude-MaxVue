import NextImage from "next/image";
import Link from "next/link";

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2">
              <NextImage
                src="/maxvue_logo_transparent_bg.png"
                alt="MaxVue Logo"
                width={270}
                height={90}
                className="h-24 w-auto"
              />
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/" className="text-gray-700 hover:text-[#3399FF] transition-colors">
                Home
              </Link>
              <Link href="/faq" className="text-gray-700 hover:text-[#3399FF] transition-colors">
                FAQs
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

        {/* Privacy Policy Section */}
        <section id="privacy-policy" className="mb-16">
          <h1 className="text-4xl font-bold text-[#1e1e1e] mb-8">MaxVue Privacy Policy</h1>
          <p className="text-lg text-gray-600 mb-8"><strong>Effective Date:</strong> July 7, 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              MaxVue ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and share information when you use our app and related services ("Services").
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We collect the following types of information to provide and improve our Services:
            </p>
            <ul className="space-y-3 text-gray-700 mb-6">
              <li><strong>Account Information:</strong> When you sign up, we collect your first and last name, email address, and login credentials (via secure authentication methods).</li>
              <li><strong>Prescription Data:</strong> You may manually enter or generate your vision prescription through the app.</li>
              <li><strong>Calibration Data:</strong> During vision testing, we collect image interaction data (e.g., blur level adjustments) to personalize your visual experience.</li>
              <li><strong>Device and Usage Data:</strong> We may collect limited technical data (such as device type or usage patterns) to maintain and improve service quality.</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">2. How We Use Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-4">We use the information we collect to:</p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Provide, personalize, and improve the MaxVue experience</li>
              <li>• Save and retrieve your vision preferences</li>
              <li>• Offer technical support and troubleshoot issues</li>
              <li>• Ensure account security and prevent misuse</li>
              <li>• Comply with legal obligations and enforce our terms</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">3. Sharing Your Information</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We do <strong>not</strong> sell or rent your personal information. We may share your information with third-party service providers only to the extent necessary to operate, improve, and support the MaxVue Services. These partners are required to protect your data and act only on our instructions. Examples include secure cloud storage, login authentication providers, or analytics platforms.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">4. Data Retention</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We retain your information for as long as necessary to provide you with the Services and as required by applicable laws. You may delete your account at any time using the in-app <strong>Delete Account</strong> feature.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">5. Your Choices</h2>
            <p className="text-gray-700 leading-relaxed mb-4">You can update or delete your account information at any time.</p>
            <p className="text-gray-700 leading-relaxed mb-6">
              To delete your account, go to the Settings section of the MaxVue app and tap <strong>Delete Account</strong>. This will permanently remove your personal data from our systems, subject to any legal retention requirements.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">6. Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We use commercially reasonable safeguards to protect your data, including encrypted storage and secure authentication protocols. However, no system is 100% secure, and we cannot guarantee the absolute security of your information.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              MaxVue is not intended for users under the age of 13. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us so we can remove it.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">8. Changes to This Policy</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We may update this Privacy Policy from time to time. Material changes will be posted in the app or on our website, with an updated effective date.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">9. Contact Us</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions about this Privacy Policy or your data, please contact us at:<br />
              <strong>Email:</strong> <a href="mailto:contact@MaxVue.app" className="text-[#3399FF] hover:underline">contact@MaxVue.app</a>
            </p>
          </div>
        </section>

        {/* Terms of Use Section */}
        <section id="terms-of-use" className="border-t border-gray-200 pt-16">
          <h1 className="text-4xl font-bold text-[#1e1e1e] mb-8">MaxVue Terms of Use</h1>
          <p className="text-lg text-gray-600 mb-8"><strong>Effective Date:</strong> July 7, 2025</p>

          <div className="prose prose-lg max-w-none">
            <p className="text-gray-700 leading-relaxed mb-6">
              Welcome to MaxVue ("we," "our," or "us"). These Terms of Use ("Terms") govern your access to and use of the MaxVue app, website, and related services (the "Services"). By using MaxVue, you agree to be bound by these Terms.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you do not agree, do not use the Services.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">1. Use of the Services</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              You may use MaxVue only if you are legally allowed to do so in your jurisdiction and you agree to comply with these Terms and all applicable laws.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">You agree not to:</p>
            <ul className="space-y-2 text-gray-700 mb-6">
              <li>• Use the Services for any unlawful, harmful, or abusive purpose</li>
              <li>• Reverse-engineer, copy, or resell any part of the Services</li>
              <li>• Interfere with or disrupt the operation of the app or servers</li>
              <li>• Attempt to gain unauthorized access to any system or account</li>
            </ul>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">2. Account & Registration</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              To access certain features, you may need to register for an account using your full name, a valid email address, and secure login credentials. You are responsible for maintaining the confidentiality of your account and for all activities that occur under it.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              You agree to provide accurate information and to keep it up to date.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">3. Vision Testing & Prescription Disclaimer</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              MaxVue offers digital tools to simulate visual clarity, estimate vision prescriptions, and apply display filters. These tools are <strong>not a substitute for a professional eye exam or licensed optometric advice</strong>.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              We do not guarantee the medical accuracy of any results. You are solely responsible for consulting with a licensed provider before making any vision-related decisions.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">4. Intellectual Property</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All content, software, and visual elements in the app are owned by or licensed to MaxVue and are protected by intellectual property laws. You may not copy, modify, distribute, or create derivative works from any part of the Services without permission.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">5. Software License</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Subject to your compliance with these Terms, MaxVue grants you a limited, non-exclusive, non-transferable, revocable license to download, install, and use the MaxVue app on a personal device solely for your own non-commercial use. You may not copy, modify, distribute, sell, sublicense, reverse engineer, or otherwise exploit the app or any part of the Services except as expressly authorized in writing by MaxVue. All rights not expressly granted are reserved by MaxVue.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">6. Termination</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We reserve the right to suspend or terminate your access to the Services at any time, without notice, for behavior that violates these Terms or harms other users or the integrity of the platform.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              You may stop using the app and delete your account at any time via the Settings menu.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">7. Disclaimers</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              The Services are provided <strong>"as is"</strong> and <strong>"as available"</strong> without warranties of any kind, either express or implied. We do not guarantee that the Services will always be secure, error-free, or uninterrupted. Use of the app is at your own risk.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">8. Limitation of Liability</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              To the maximum extent allowed by law, MaxVue shall not be liable for any indirect, incidental, consequential, or punitive damages arising out of or related to your use of the Services.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">9. Changes to These Terms</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We may update these Terms from time to time. When we make changes, we'll post the revised version in the app or on our website and update the effective date.
            </p>
            <p className="text-gray-700 leading-relaxed mb-6">
              Your continued use of the Services means you accept the updated Terms.
            </p>

            <h2 className="text-2xl font-bold text-[#1e1e1e] mt-8 mb-4">10. Contact</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If you have any questions about these Terms, please contact us at:<br />
              <strong>Email:</strong> <a href="mailto:contact@MaxVue.app" className="text-[#3399FF] hover:underline">contact@MaxVue.app</a>
            </p>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="mb-4">
                <NextImage
                  src="/maxvue_logo_transparent_bg.png"
                  alt="MaxVue Logo"
                  width={270}
                  height={90}
                  className="h-24 w-auto filter brightness-0 invert"
                />
              </div>
              <p className="text-white mb-4 max-w-md font-bold">
                Digital vision correction for the modern world.
                <br />
                See clearly without glasses.
              </p>
            </div>
            <div className="flex flex-col justify-end">
              <ul className="space-y-2">
                <li>
                  <Link
                    href="/faq"
                    className="text-white hover:text-[#3399FF] transition-colors font-bold"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <a
                    href="#privacy-policy"
                    className="text-white hover:text-[#3399FF] transition-colors font-bold"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#terms-of-use"
                    className="text-white hover:text-[#3399FF] transition-colors font-bold"
                  >
                    Terms of Use
                  </a>
                </li>
              </ul>
            </div>
            <div className="flex flex-col justify-end space-y-4">
              <a href="#" className="hover:opacity-80 transition-opacity">
                <NextImage
                  src="/Apple-app-store.png"
                  alt="Download on the App Store"
                  width={150}
                  height={44}
                  className="w-[150px] h-auto"
                />
              </a>
              <a href="#" className="hover:opacity-80 transition-opacity">
                <NextImage
                  src="/Google-play-store.png"
                  alt="Get it on Google Play"
                  width={150}
                  height={44}
                  className="w-[150px] h-auto"
                />
              </a>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-white font-bold">
              © 2025 MaxVue. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
