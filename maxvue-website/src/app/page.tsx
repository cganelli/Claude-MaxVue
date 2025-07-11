import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Eye,
  Smartphone,
  Zap,
  Shield,
  Star,
  Download,
  Play,
  Monitor,
  Globe,
  Camera,
  Image,
  Mic,
  Check,
  Glasses,
  Gauge,
  ScanLine,
  Users,
  ChevronRight,
} from "lucide-react";
import NextImage from "next/image";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#eaf1fd]">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <NextImage
                src="/maxvue_logo_transparent_bg.png"
                alt="MaxVue Logo"
                width={270}
                height={90}
                className="h-24 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/faq"
                className="text-gray-700 hover:text-[#3399FF] transition-colors"
              >
                FAQs
              </a>
              <Button className="bg-[#3399FF] hover:bg-[#1D4262] text-white px-6 py-2 rounded-lg transition-colors text-lg">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-[#eaf1fd] py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="text-center lg:text-left">
              {/* App icons row */}
              <div className="flex justify-center lg:justify-start items-center space-x-3 mb-8">
                <Eye className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <Smartphone
                  className="w-8 h-8 text-[#3399FF]"
                  strokeWidth={1.5}
                />
                <Monitor className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <Globe className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <Camera className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <Image className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[#1e1e1e] mb-6 leading-tight">
                <div className="whitespace-nowrap">Ditch the Glasses.</div>
                <div className="whitespace-nowrap text-[#3399FF]">Real Vision Correction,</div>
                <div className="whitespace-nowrap">Not Just Magnification.</div>
              </h1>

              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                MaxVue applies actual prescription-strength optical correction to your entire phone screen. 
                Like wearing glasses, but built into your device. Works across email, web, photos, camera, 
                and apps automatically.
              </p>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="bg-[#3399FF] hover:bg-[#1D4262] text-white px-8 py-6 text-lg rounded-xl flex items-center space-x-2 transition-all">
                  <Download className="w-6 h-6" />
                  <span>Download for iOS</span>
                </Button>
                <Button
                  variant="outline"
                  className="border-[#3399FF] text-[#3399FF] hover:bg-[#3399FF] hover:text-white px-8 py-6 text-lg rounded-xl flex items-center space-x-2 transition-all"
                >
                  <Download className="w-6 h-6" />
                  <span>Download for Android</span>
                </Button>
              </div>
            </div>

            {/* Right content - Phone mockup with embedded HTML */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone frame */}
                <div className="w-80 h-[630px] bg-black rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative">
                    <iframe
                      src="/maxvue-homepage-embed.html"
                      className="w-full h-full border-0 rounded-[2.5rem]"
                      title="MaxVue App Demo"
                      loading="lazy"
                      style={{
                        width: "100%",
                        height: "100%",
                        aspectRatio: "9/16",
                        transform: "scale(1.2) translateY(15px)",
                        transformOrigin: "center center",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Competitive Differentiation Section */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">
              Why Not Just Use Built-In Zoom or Magnifier Apps?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* MaxVue Advantage */}
            <div className="bg-[#1D4262] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                <Eye className="w-8 h-8 mr-3" />
                MaxVue Advantage
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-[#3399FF] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-xl text-white">Applies real optical correction like prescription lenses</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-[#3399FF] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-xl text-white">Works automatically across all phone content without layout distortion</span>
                </li>
                <li className="flex items-start">
                  <Check className="w-6 h-6 text-[#3399FF] mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-xl text-white">Always available - your phone becomes your glasses</span>
                </li>
              </ul>
            </div>

            {/* Other Solutions */}
            <div className="bg-[#eaf1fd] rounded-2xl p-8">
              <h3 className="text-2xl font-bold text-[#1e1e1e] mb-6 flex items-center">
                <Smartphone className="w-8 h-8 mr-3 text-gray-600" />
                Other Solutions
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <ChevronRight className="w-6 h-6 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-xl text-gray-700">Phone zoom makes text bigger but doesn't fix blurry focus</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-6 h-6 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-xl text-gray-700">Accessibility features and magnifier apps cause text to fall off the page and need constant adjustment</span>
                </li>
                <li className="flex items-start">
                  <ChevronRight className="w-6 h-6 text-gray-500 mt-0.5 mr-3 flex-shrink-0" />
                  <span className="text-xl text-gray-700">Reading glasses you forget, lose, or don't have when needed</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-[#eaf1fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">
              How MaxVue Works
            </h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              MaxVue uses advanced diopter-based lens correction (+0.00D to +3.5D) with real-time image processing. 
              Unlike simple magnification, it simulates actual prescription lenses to fix blurry focus.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#3399FF] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1e1e1e] mb-4">
                Calibrate Your Vision
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our interactive vision test uses real-time blur adjustment to find your optimal 
                correction strength. Covers the full presbyopia range from +0.00D to +3.50D. Or, skip the test by 
                entering your existing prescription if known.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#3399FF] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1e1e1e] mb-4">
                Apply Real Lens Correction
              </h3>
              <p className="text-gray-700 leading-relaxed">
                MaxVue calculates the precise diopter correction needed and applies mathematical lens simulation 
                to your screen
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-[#3399FF] rounded-full flex items-center justify-center mb-6">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-2xl font-bold text-[#1e1e1e] mb-4">
                System-Wide Enhancement
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Correction works across ALL apps - email, camera, web, photos - with one toggle. No app-by-app 
                setup required
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Real Optical Technology Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">
              Real Optical Technology
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#3399FF] rounded-lg flex items-center justify-center flex-shrink-0">
                <Glasses className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#1e1e1e] mb-2">
                  Prescription-Strength Correction
                </h3>
                <p className="text-lg text-gray-700">
                  0.00D to +3.5D range covering full presbyopia spectrum
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#3399FF] rounded-lg flex items-center justify-center flex-shrink-0">
                <ScanLine className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#1e1e1e] mb-2">
                  Advanced Image Processing
                </h3>
                <p className="text-lg text-gray-700">
                  Edge enhancement and clarity optimization algorithms
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#3399FF] rounded-lg flex items-center justify-center flex-shrink-0">
                <Monitor className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#1e1e1e] mb-2">
                  System-Wide Overlay
                </h3>
                <p className="text-lg text-gray-700">
                  Preserves app layouts while correcting vision
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#3399FF] rounded-lg flex items-center justify-center flex-shrink-0">
                <Eye className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#1e1e1e] mb-2">
                  Multiple Vision Conditions
                </h3>
                <p className="text-lg text-gray-700">
                  Works with presbyopia, myopia, and mild astigmatism
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#3399FF] rounded-lg flex items-center justify-center flex-shrink-0">
                <Gauge className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#1e1e1e] mb-2">
                  60+ FPS Performance
                </h3>
                <p className="text-lg text-gray-700">
                  Real-time processing without lag or battery drain
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-[#3399FF] rounded-lg flex items-center justify-center flex-shrink-0">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-[#1e1e1e] mb-2">
                  Universal App Support
                </h3>
                <p className="text-lg text-gray-700">
                  Works across all apps without individual setup
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-16 bg-[#eaf1fd]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">
              Perfect For
            </h2>
          </div>

          <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Users className="w-6 h-6 text-[#3399FF] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                      Adults 40+ with Presbyopia
                    </h3>
                    <p className="text-lg text-gray-700">
                      Struggling with age-related farsightedness that makes phone text blurry
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Eye className="w-6 h-6 text-[#3399FF] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                      Mild Prescription Wearers
                    </h3>
                    <p className="text-lg text-gray-700">
                      Anyone with mild prescriptions who doesn't want to wear glasses for phone use
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Glasses className="w-6 h-6 text-[#3399FF] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                      Forgetful Glass Wearers
                    </h3>
                    <p className="text-lg text-gray-700">
                      People who lose reading glasses or don't have them when needed
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Smartphone className="w-6 h-6 text-[#3399FF] mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold text-[#1e1e1e] mb-2">
                      Zoom Fatigue Sufferers
                    </h3>
                    <p className="text-lg text-gray-700">
                      Anyone tired of constantly zooming and adjusting text size
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-4">
              What <span className="text-[#3399FF]">MaxVue fans</span> say
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#3399FF] fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "Finally, I can read emails without constantly searching for
                    my reading glasses. MaxVue has transformed how I use my
                    phone."
                  </p>
                </div>
                <div>
                  <div className="font-bold text-[#1e1e1e]">
                    Andrew B., Greenwich, CT
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#3399FF] fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "I love when my kids send me texts with their photos. I love
                    it even more that I can see them without glasses."
                  </p>
                </div>
                <div>
                  <div className="font-bold text-[#1e1e1e]">
                    Viviana G.,
                    <br />
                    North Miami, FL
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 text-[#3399FF] fill-current"
                      />
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "MaxVue makes doing the NY Times Crossword puzzle on my
                    phone so much easier. The clarity is perfect for my
                    presbyopia."
                  </p>
                </div>
                <div>
                  <div className="font-bold text-[#1e1e1e]">
                    Kristen L., Scarsdale, NY
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <a
                    href="/faq"
                    className="text-white hover:text-[#3399FF] transition-colors font-bold"
                  >
                    FAQs
                  </a>
                </li>
                <li>
                  <a
                    href="/legal#privacy-policy"
                    className="text-white hover:text-[#3399FF] transition-colors font-bold"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="/legal#terms-of-use"
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
