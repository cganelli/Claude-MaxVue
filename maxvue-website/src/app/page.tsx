import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Eye, Smartphone, Zap, Shield, Star, Download, Play, Monitor, Globe, Camera, Image, Mic } from "lucide-react";
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
              <a href="/faq" className="text-gray-700 hover:text-[#3399FF] transition-colors">
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
                <Smartphone className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <Monitor className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <Globe className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <Camera className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
                <Image className="w-8 h-8 text-[#3399FF]" strokeWidth={1.5} />
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold text-[#1e1e1e] mb-6 leading-tight">
                Ditch the Glasses.<br />
                <span className="text-[#3399FF]">See Clearly</span> with MaxVue.
              </h1>

              <p className="text-xl text-gray-700 mb-8 max-w-2xl">
                With one tap, your phone becomes crystal clear—email, web, photos, and apps—all auto-adjusted to your unique vision. No glasses. No squinting. Just clear vision.
              </p>

              {/* Download buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button className="bg-[#3399FF] hover:bg-[#1D4262] text-white px-8 py-6 text-lg rounded-xl flex items-center space-x-2 transition-all">
                  <Download className="w-6 h-6" />
                  <span>Download for iOS</span>
                </Button>
                <Button variant="outline" className="border-[#3399FF] text-[#3399FF] hover:bg-[#3399FF] hover:text-white px-8 py-6 text-lg rounded-xl flex items-center space-x-2 transition-all">
                  <Download className="w-6 h-6" />
                  <span>Download for Android</span>
                </Button>
              </div>
            </div>

            {/* Right content - Phone mockup */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative">
                {/* Phone frame */}
                <div className="w-80 h-[600px] bg-black rounded-[3rem] p-3 shadow-2xl">
                  <div className="w-full h-full bg-[#eaf1fd] rounded-[2.5rem] overflow-hidden relative">
                    {/* Status bar */}
                    <div className="flex justify-between items-center px-8 py-2 text-sm">
                      <span className="font-medium">9:41</span>
                      <div className="flex items-center space-x-1">
                        <div className="w-4 h-2 bg-[#3399FF] rounded-sm"></div>
                        <div className="w-6 h-3 border border-gray-400 rounded-sm">
                          <div className="w-4 h-1.5 bg-green-500 rounded-xs m-0.5"></div>
                        </div>
                      </div>
                    </div>

                    {/* App content */}
                    <div className="px-8 py-4 text-center">
                      <div className="mb-8">
                        <div className="font-logo text-3xl text-[#1e1e1e] font-bold mb-8">
                          MaxVu<span className="text-[#3399FF]">e</span>
                        </div>
                      </div>

                      {/* Toggle component */}
                      <div className="bg-white rounded-3xl p-6 mb-8 shadow-lg">
                        <div className="flex items-center justify-between">
                          <Eye className="w-8 h-8 text-gray-600" />
                          <div className="bg-[#1D4262] rounded-full p-2 w-16 h-8 flex items-center justify-end">
                            <div className="w-6 h-6 bg-white rounded-full"></div>
                          </div>
                          <span className="text-[#1e1e1e] font-semibold">On</span>
                        </div>
                      </div>

                      <h2 className="text-xl font-bold text-[#1e1e1e] mb-4">
                        Vision correction is ON
                      </h2>
                      <p className="text-gray-700 mb-8">
                        MaxVue is now active. You're free to close the app.
                      </p>

                      {/* Voice button */}
                      <div className="w-16 h-16 bg-white rounded-full shadow-lg flex items-center justify-center mx-auto mb-8">
                        <div className="w-8 h-8 bg-[#3399FF] rounded-full flex items-center justify-center">
                          <div className="w-4 h-4 bg-white rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom navigation */}
                    <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4">
                      <div className="flex justify-around">
                        <div className="text-center">
                          <div className="w-6 h-6 bg-[#3399FF] rounded mx-auto mb-1"></div>
                          <span className="text-xs text-[#3399FF] font-medium">Home</span>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 bg-gray-400 rounded mx-auto mb-1"></div>
                          <span className="text-xs text-gray-500">Rx</span>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 bg-gray-400 rounded mx-auto mb-1"></div>
                          <span className="text-xs text-gray-500">Settings</span>
                        </div>
                        <div className="text-center">
                          <div className="w-6 h-6 bg-gray-400 rounded mx-auto mb-1"></div>
                          <span className="text-xs text-gray-500">More</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is MaxVue Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">What Is MaxVue?</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              MaxVue is an AI-powered vision correction app that makes your screen match your eyesight—no reading glasses needed. Whether you're farsighted, presbyopic, or just tired of zooming in, MaxVue custom-adjusts the clarity of your content with one tap.
            </p>
          </div>
        </div>
      </section>

      {/* Powerful Features Section */}
      <section id="features" className="py-10 bg-[#eaf1fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-4">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of digital vision with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#3399FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Eye className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e1e1e] mb-4">
                  Personalized Vision Correction
                </h3>
                <p className="text-gray-600">
                  AI-powered eye test or manual Rx input creates your custom vision profile
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#3399FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e1e1e] mb-4">
                  Works Everywhere
                </h3>
                <p className="text-gray-600">
                  Clearer viewing for smartphone email, apps, photos, web, and camera
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#3399FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <div className="mb-4"></div>
                <h3 className="text-xl font-bold text-[#1e1e1e] mb-4">
                  One-Tap Clarity
                </h3>
                <p className="text-gray-600">
                  One-tap toggle to turn vision correction on or off
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-[#3399FF] rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Mic className="w-8 h-8 text-white" />
                </div>
                <div className="mb-4"></div>
                <h3 className="text-xl font-bold text-[#1e1e1e] mb-4">
                  Voice Activation
                </h3>
                <p className="text-gray-600">
                  Say "MaxVue on" or "MaxVue off" to toggle correction hands-free
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Built with Advanced Tools Section */}
      <section className="py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">Built with Advanced Tools</h2>
            <p className="text-xl text-gray-600">Powered by industry-leading technology partners</p>
          </div>

          {/* Partners logos carousel */}
          <div className="bg-white rounded-xl py-10 px-8 md:px-12 mb-6 overflow-hidden">
            <div className="relative">
              <div className="flex animate-scroll">
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/OpenAI.svg"
                    alt="OpenAI Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Cursor.svg"
                    alt="Cursor Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/VS_Code.svg"
                    alt="VS Code Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Claude.svg"
                    alt="Claude Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Bolt.svg"
                    alt="Bolt Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Eleven_Labs.svg"
                    alt="ElevenLabs Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Netlify.svg"
                    alt="Netlify Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Supabase.svg"
                    alt="Supabase Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                {/* Duplicate logos for infinite scroll effect */}
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/OpenAI.svg"
                    alt="OpenAI Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Cursor.svg"
                    alt="Cursor Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/VS_Code.svg"
                    alt="VS Code Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Claude.svg"
                    alt="Claude Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Bolt.svg"
                    alt="Bolt Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Eleven_Labs.svg"
                    alt="ElevenLabs Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Netlify.svg"
                    alt="Netlify Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
                </div>
                <div className="flex-shrink-0 w-[200px] h-[70px] flex items-center justify-center mx-4">
                  <img
                    src="/Supabase.svg"
                    alt="Supabase Logo"
                    className="h-[50px] w-[120px] object-contain opacity-80 hover:opacity-100 transition-opacity"
                    style={{ maxWidth: '100%', maxHeight: '100%' }}
                  />
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
                      <Star key={i} className="w-5 h-5 text-[#3399FF] fill-current" />
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "Finally, I can read emails without constantly searching for my reading glasses. MaxVue has transformed how I use my phone."
                  </p>
                </div>
                <div>
                  <div className="font-bold text-[#1e1e1e]">Andrew B., Greenwich, CT</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-8">
                <div className="flex items-center mb-4">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-[#3399FF] fill-current" />
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "I love when my kids send me texts with their photos. I love it even more that I can see them without glasses."
                  </p>
                </div>
                <div>
                  <div className="font-bold text-[#1e1e1e]">
                    Viviana G.,<br />
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
                      <Star key={i} className="w-5 h-5 text-[#3399FF] fill-current" />
                    ))}
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    "MaxVue makes doing the NY Times Crossword puzzle on my phone so much easier. The clarity is perfect for my presbyopia."
                  </p>
                </div>
                <div>
                  <div className="font-bold text-[#1e1e1e]">Kristen L., Scarsdale, NY</div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-10 bg-[#eaf1fd]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-4">
              Still a Little <span className="text-[#3399FF]">Blurry</span>? Let's Clear Things Up.
            </h2>
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

      {/* CTA Section */}
      <section className="py-10 bg-[#3399FF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to See Clearly?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their digital experience with MaxVue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <div className="bg-[#3399FF] hover:bg-[#1D4262] text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all cursor-pointer shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-2xl">🍎</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-200">Download on the</span>
                <span className="text-lg font-semibold">App Store</span>
              </div>
            </div>
            <div className="bg-[#3399FF] hover:bg-[#1D4262] text-white px-6 py-3 rounded-xl flex items-center space-x-3 transition-all cursor-pointer shadow-lg">
              <div className="flex flex-col items-center">
                <span className="text-2xl">▶️</span>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs text-gray-200">GET IT ON</span>
                <span className="text-lg font-semibold">Google Play</span>
              </div>
            </div>
          </div>
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
                <li><a href="/faq" className="text-white hover:text-[#3399FF] transition-colors font-bold">FAQs</a></li>
                <li><a href="/legal#privacy-policy" className="text-white hover:text-[#3399FF] transition-colors font-bold">Privacy Policy</a></li>
                <li><a href="/legal#terms-of-use" className="text-white hover:text-[#3399FF] transition-colors font-bold">Terms of Use</a></li>

              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-white font-bold">© 2025 MaxVue. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
