import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
              Frequently Asked <span className="text-[#3399FF]">Questions</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to the most common questions about MaxVue
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-white rounded-lg border-none shadow-lg">
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">How does MaxVue work?</span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  MaxVue uses advanced AI-powered vision correction algorithms to analyze your unique vision needs through an eye test or manual prescription input. The app then applies real-time optical correction filters to your screen content, making everything crystal clear without needing physical glasses.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-white rounded-lg border-none shadow-lg">
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">Can I use MaxVue for free?</span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  YES! MaxVue offers a free basic plan that includes manual prescription input, one-tap correction, and basic email/web/camera filters. You can upgrade to Pro for advanced features like vision calibration test if you don't know your prescription, profile saving, photo gallery correction, app-specific correction, and day/night auto brightness.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-white rounded-lg border-none shadow-lg">
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">Is MaxVue available for both iOS and Android?</span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Yes! MaxVue is available on both iOS and Android devices. Download it from the App Store or Google Play Store to get started with your vision correction journey.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-white rounded-lg border-none shadow-lg">
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">Is my prescription data secure?</span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  Absolutely. MaxVue uses enterprise-grade encryption powered by Supabase to securely store and sync your prescription data across all your devices. Your vision profile is protected with the highest security standards and is never shared with third parties.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-white rounded-lg border-none shadow-lg">
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">What makes MaxVue better than other vision apps?</span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <p className="text-lg text-gray-700 leading-relaxed">
                  MaxVue stands out with its AI-powered personalization, real-time optical correction filters, voice activation through ElevenLabs, and seamless cross-device syncing. Unlike simple magnification apps, MaxVue provides true vision correction that adapts to your specific eyesight needs for a natural viewing experience.
                </p>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-white rounded-lg border-none shadow-lg">
              <AccordionTrigger className="px-8 py-6 text-left hover:no-underline">
                <span className="text-lg font-semibold text-[#1e1e1e]">Why Built-In Accessibility Settings Aren't Enough</span>
              </AccordionTrigger>
              <AccordionContent className="px-8 pb-6">
                <div className="text-lg text-gray-700 leading-relaxed">
                  <p className="mb-4">Most smartphones offer basic accessibility features—such as zoom, magnifier, or text scaling—but these have major limitations for people with presbyopia:</p>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>They don't correct for visual focus:</strong> Magnification increases size, but it does not help a user focus the text without glasses.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>Distorts Content:</strong> Built-in smartphone accessibility tools often distort layouts or clip content. MaxVue selectively only the areas that matter—like text and visual elements—while keeping the content intact.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>Disruptive and Inefficient:</strong> Built-in tools require repeated gestures (like pinch-to-zoom) that interrupt the reading experience. MaxVue applies corrections automatically and stays out of your way.
                      </div>
                    </li>
                    <li className="flex items-start">
                      <span className="font-semibold mr-2">•</span>
                      <div>
                        <strong>They require vision to set up:</strong> Ironically, activating accessibility options often requires navigating tiny menus—something hard to do if you can't see clearly.
                      </div>
                    </li>
                  </ul>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
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
                Digital vision correction for the modern world.<br />
                See clearly without glasses.
              </p>
            </div>
            <div>
              <ul className="space-y-2">
                <li><Link href="/faq" className="text-white hover:text-[#3399FF] transition-colors font-bold">FAQs</Link></li>
                <li><Link href="/legal#privacy" className="text-white hover:text-[#3399FF] transition-colors font-bold">Privacy Policy</Link></li>
                <li><Link href="/legal#terms" className="text-white hover:text-[#3399FF] transition-colors font-bold">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400 font-bold">© 2025 MaxVue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
