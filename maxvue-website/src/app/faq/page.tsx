import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Eye, Smartphone, Monitor, Globe, Camera } from "lucide-react";
import NextImage from "next/image";
import Link from "next/link";

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-[#eaf1fd]">
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
            <nav className="flex items-center space-x-8">
              <Link href="/faq" className="text-[#3399FF] font-semibold">
                FAQs
              </Link>
              <Link
                href="#"
                className="bg-[#3399FF] text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-medium"
              >
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* FAQ Section */}
      <section className="py-16 bg-[#eaf1fd]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-[#1e1e1e] mb-6">
              MaxVue <span className="text-[#3399FF]">FAQs</span>
            </h1>
          </div>

          {/* Section Headers */}
          <div className="mb-8 mt-12">
            <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4 flex items-center space-x-3">
              <Smartphone
                className="w-8 h-8 text-[#3399FF]"
                strokeWidth={1.5}
              />
              <span>About the App</span>
            </h2>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            {/* Section 1: About the App */}
            <AccordionItem
              value="item-1"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  1. What is MaxVue?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  MaxVue is a digital vision support app that helps you see
                  clearly by applying custom visual filters based on your
                  personal prescription. It includes text filtering (like
                  blue-light filtering), visual enhancements, and visual support
                  tools specifically engineered to reduce blur, sharpen text,
                  and improve visual comfort — no special equipment required.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-2"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  2. How does MaxVue improve my vision?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  MaxVue applies dynamic screen filters tuned to your eyes.
                  Think of it like adjusting contrast and sharpness — but based
                  on your real prescription. It can stimulate clarity for
                  myopia, hyperopia, astigmatism, and presbyopia.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-3"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  3. Can this replace a visit to the eye doctor?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  No. MaxVue is not a substitute for a comprehensive eye exam.
                  It's a tool to help you see more clearly in digital
                  environments — not a medical device or diagnostic tool.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-4"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  4. What vision conditions does MaxVue support?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <div className="text-lg text-gray-700 leading-relaxed">
                  <p className="mb-4">The app is designed to assist with:</p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <span>Nearsightedness (myopia)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <span>Farsightedness (hyperopia)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <span>Astigmatism</span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <span>Presbyopia</span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    More filter types may be added in future updates.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-5"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  5. Is MaxVue safe for people with astigmatism or other eye
                  conditions?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Yes — the app includes filter calibration options for
                  astigmatism and other common refractive errors. However, if
                  you experience discomfort, stop using the filter and consult
                  an eye care provider.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-6"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  6. Why Built-In Accessibility Settings Aren't Enough
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <div className="text-lg text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    Most smartphones offer basic accessibility features—such as
                    zoom, magnifier, or text scaling—but these have major
                    limitations for people with presbyopia:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>They don't correct for visual focus:</strong>{" "}
                        Magnification increases size, but it does not help a
                        user focus the text without glasses.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>Distorts Content:</strong> Built-in smartphone
                        accessibility tools often distort layouts or clip
                        content. MaxVue selectively only the areas that
                        matter—like text and visual elements—while keeping the
                        content intact.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>Disruptive and Inefficient:</strong> Built-in
                        tools require repeated gestures (like pinch-to-zoom)
                        that interrupt the reading experience. MaxVue applies
                        corrections automatically and stays out of your way.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>They require vision to set up:</strong>{" "}
                        Ironically, activating accessibility options often
                        requires navigating tiny menus—something hard to do if
                        you can't see clearly.
                      </div>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Section 2: Eye Test + Prescription */}
            <div className="mb-8 mt-24">
              <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4 flex items-center space-x-3">
                <Eye className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <span>Eye Test + Prescription</span>
              </h2>
            </div>
            <AccordionItem
              value="item-7"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  7. How accurate is the MaxVue eye test?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  The in-app eye test calibration and is designed for screen
                  optimization — not for diagnosis. For medical-grade results,
                  see a licensed optometrist.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-8"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  8. Can I manually enter my prescription instead of taking the
                  test?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Yes. If you already have a prescription, you can enter it
                  directly in the app under Rx Settings.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-9"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  9. What if I don't know my prescription?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  You can use the guided eye test in the app to calibrate a
                  filter based on your visual clarity. It takes just a few
                  minutes and doesn't require any equipment.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-10"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  10. How is my vision data used?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Your prescription and blur calibration data are used solely to
                  personalize your MaxVue experience. We never sell or share
                  your data for advertising.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Section 3: Setup + Usage */}
            <div className="mb-8 mt-24">
              <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4 flex items-center space-x-3">
                <Monitor className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <span>Setup + Usage</span>
              </h2>
            </div>
            <AccordionItem
              value="item-11"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  11. What devices can I use MaxVue on?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Currently, MaxVue supports Android devices and web browsers.
                  iOS and desktop support are planned for future releases.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-12"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  12. Does MaxVue work in Gmail or Outlook?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Yes. MaxVue includes optional Gmail and Outlook integrations
                  so you can apply visual clarity filters while reading emails.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-13"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  13. How do I activate or deactivate the filter?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Use the toggle in the app or browser widget to turn the filter
                  on or off. You can also enable hands-free control using voice
                  commands.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-14"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  14. Will this work in dark mode?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Yes. MaxVue is optimized for both light and dark modes, and
                  adjusts filter settings automatically based on ambient light
                  if enabled.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Section 4: Privacy + Data */}
            <div className="mb-8 mt-24">
              <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4 flex items-center space-x-3">
                <Globe className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <span>Privacy + Data</span>
              </h2>
            </div>
            <AccordionItem
              value="item-15"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  15. Is my prescription data secure?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Yes. Your data is encrypted and stored securely using modern
                  cloud infrastructure. Only you can access your personal vision
                  profile.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-16"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  16. Who has access to my information?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Only you — and the systems required to deliver the app's core
                  features. We do not sell, rent, or use your data for
                  third-party advertising.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-17"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  17. Can I delete my data?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Yes. You can permanently delete your account (and all
                  associated data) anytime from the app's Settings &gt; Delete
                  Account option.
                </p>
              </AccordionContent>
            </AccordionItem>

            {/* Section 5: Billing & Subscription */}
            <div className="mb-8 mt-24">
              <h2 className="text-2xl font-bold text-[#1e1e1e] mb-4 flex items-center space-x-3">
                <Camera className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <span>Billing & Subscription</span>
              </h2>
            </div>

            <AccordionItem
              value="item-18"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  18. How much does MaxVue cost?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <div className="text-lg text-gray-700 leading-relaxed">
                  <p className="mb-4">
                    MaxVue offers flexible pricing options:
                  </p>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <span>
                        <strong>Basic Plan:</strong> Free - includes manual
                        prescription input, one-tap correction, and basic
                        email/web/camera filters
                      </span>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <span>
                        <strong>Pro Plan:</strong> $4.99/month or $39.99/year or
                        $99 lifetime - includes vision calibration test, profile
                        saving, photo gallery correction, app-specific
                        correction, and day/night auto brightness
                      </span>
                    </li>
                  </ul>
                  <p className="mt-4">
                    All plans include secure data encryption and cross-device
                    syncing.
                  </p>
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-19"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  19. Can I cancel my subscription anytime?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Yes, you can cancel your Pro subscription at any time through
                  your device's app store settings (iOS App Store or Google Play
                  Store). Your subscription will remain active until the end of
                  your current billing period, and you'll retain Pro features
                  until then.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-20"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  20. Can I get a refund if I cancel?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  We do not offer partial refunds for unused time after
                  cancellation. However, if you experience technical issues,
                  please contact us at <strong>contact@MaxVue.app</strong> and
                  we'll work to make it right.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem
              value="item-21"
              className="bg-white rounded-lg border-none shadow-lg"
            >
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">
                  21. What happens if my payment fails?
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  If we're unable to process your payment, your subscription
                  will be paused and premium features may become unavailable.
                  You can update your billing info in the app at any time to
                  restore access.
                </p>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

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
                  <Link
                    href="/legal#privacy-policy"
                    className="text-white hover:text-[#3399FF] transition-colors font-bold"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/legal#terms-of-use"
                    className="text-white hover:text-[#3399FF] transition-colors font-bold"
                  >
                    Terms of Use
                  </Link>
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
