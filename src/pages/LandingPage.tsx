import React from 'react';
import { Download, Eye, Smartphone, Shield, Zap, Users, Star, CheckCircle, ArrowRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const features = [
    {
      icon: Eye,
      title: 'Personalized Vision Correction',
      description: 'AI-powered eye test or manual Rx input creates your custom vision profile'
    },
    {
      icon: Smartphone,
      title: 'One-Tap Clarity',
      description: 'Instantly transform your screen clarity for email, web, photos, and apps'
    },
    {
      icon: Zap,
      title: 'Voice Activation',
      description: 'Say "MaxVue on" or "MaxVue off" to toggle correction hands-free'
    },
    {
      icon: Shield,
      title: 'Secure Sync',
      description: 'Your prescription data syncs securely across all your devices'
    }
  ];

  const stats = [
    { number: '62%', label: 'of people need reading glasses' },
    { number: '1M+', label: 'screens viewed daily' },
    { number: '99.9%', label: 'uptime reliability' },
    { number: '4.8★', label: 'average user rating' }
  ];

  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Marketing Director',
      content: 'Finally, I can read emails without constantly searching for my reading glasses. MaxVue has transformed how I use my phone.',
      rating: 5
    },
    {
      name: 'Michael Rodriguez',
      role: 'Software Engineer',
      content: 'The voice activation is incredible. I can toggle vision correction while coding without breaking my flow.',
      rating: 5
    },
    {
      name: 'Emily Johnson',
      role: 'Teacher',
      content: 'MaxVue makes grading papers on my tablet so much easier. The clarity is perfect for my presbyopia.',
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-[#eaf1fd] font-garamond">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <img 
                src="/maxvue_logo_transparent_bg.png" 
                alt="MaxVue" 
                className="h-12 w-auto"
              />
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600 transition-colors">Features</a>
              <a href="#pricing" className="text-gray-700 hover:text-blue-600 transition-colors">Pricing</a>
              <a href="#faq" className="text-gray-700 hover:text-blue-600 transition-colors">FAQ</a>
              <Link to="/register" className="bg-[#3399FF] text-white px-6 py-2 rounded-lg hover:bg-[#1D4262] transition-colors">
                Get Started
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-[#eaf1fd] to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1e1e1e] mb-6 leading-tight">
              Ditch the Glasses.<br />
              <span className="text-[#3399FF]">See Clearly</span> with MaxVue.
            </h1>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              With one tap, your phone becomes crystal clear—email, web, photos, and apps—all 
              auto-adjusted to your unique vision. No glasses. No squinting. Just clear vision.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                to="/register"
                className="bg-[#3399FF] text-white px-8 py-4 rounded-xl text-lg font-semibold hover:bg-[#1D4262] transition-all transform hover:scale-105 flex items-center space-x-2"
              >
                <Download className="h-5 w-5" />
                <span>Download the App</span>
              </Link>
              <button className="flex items-center space-x-2 text-[#3399FF] hover:text-[#1D4262] transition-colors">
                <Play className="h-5 w-5" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Hero Image/Demo */}
            <div className="relative max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-1 hover:rotate-0 transition-transform duration-300">
                <div className="bg-gradient-to-br from-[#3399FF] to-[#1D4262] rounded-xl h-80 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Eye className="h-16 w-16 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Crystal Clear Vision</h3>
                    <p className="text-blue-100">Your screen, perfectly adjusted</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-[#3399FF] mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is MaxVue Section */}
      <section className="py-20 bg-[#eaf1fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">What Is MaxVue?</h2>
            <p className="text-xl text-gray-700 max-w-4xl mx-auto leading-relaxed">
              MaxVue is an AI-powered vision correction app that makes your screen match your 
              eyesight—no reading glasses needed. Whether you're farsighted, presbyopic, or just 
              tired of zooming in, MaxVue custom-adjusts the clarity of your content with one tap.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <span className="text-gray-700">Personalized Rx correction via eye test or manual input</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <span className="text-gray-700">Clearer viewing for email, apps, web, photos, and live camera</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <span className="text-gray-700">One-tap toggle to turn vision correction on or off</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <span className="text-gray-700">Voice-enabled activation via ElevenLabs</span>
                </li>
                <li className="flex items-start space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-500 mt-1" />
                  <span className="text-gray-700">Secure Rx sync across devices using Supabase</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl font-bold text-[#1e1e1e] mb-4">Why MaxVue Matters</h3>
              <p className="text-gray-700 leading-relaxed">
                62% of people need reading glasses. Yet no phone truly adapts to the way we 
                see—until now. MaxVue is built for a screen-first world. No more misplacing your 
                glasses or enlarging text just to read a message. This is digital eyewear, made 
                possible by software.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">Powerful Features</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experience the future of digital vision with cutting-edge technology
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-[#3399FF] rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-[#1D4262] transition-colors">
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-[#1e1e1e] mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-[#eaf1fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">Built with Advanced Tools</h2>
            <p className="text-xl text-gray-600">Powered by industry-leading technology partners</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1e1e1e] mb-2">Supabase</h3>
              <p className="text-gray-600">Secure, real-time Rx profile storage with enterprise-grade encryption</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1e1e1e] mb-2">ElevenLabs</h3>
              <p className="text-gray-600">Natural voice test instructions and hands-free toggles</p>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-[#1e1e1e] mb-2">RevenueCat</h3>
              <p className="text-gray-600">Seamless subscription access to Pro features</p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Video Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">See MaxVue in Action</h2>
            <p className="text-xl text-gray-600">Watch how MaxVue transforms your digital experience</p>
          </div>

          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video flex items-center justify-center">
              <button className="w-20 h-20 bg-[#3399FF] rounded-full flex items-center justify-center hover:bg-[#1D4262] transition-colors group">
                <Play className="h-8 w-8 text-white ml-1 group-hover:scale-110 transition-transform" />
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-[#3399FF]/20 to-[#1D4262]/20"></div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-[#eaf1fd]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">What Users Say</h2>
            <p className="text-xl text-gray-600">Join thousands of satisfied users</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 mb-6 leading-relaxed">"{testimonial.content}"</p>
                <div>
                  <div className="font-bold text-[#1e1e1e]">{testimonial.name}</div>
                  <div className="text-gray-600 text-sm">{testimonial.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-[#1e1e1e] mb-6">Simple, Transparent Pricing</h2>
            <p className="text-xl text-gray-600">
              MaxVue offers a <strong>FREE Basic plan</strong> and a <strong>Pro plan</strong> with 
              premium features. Subscribe monthly, annually, or purchase lifetime access.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-gray-50 rounded-2xl p-8 border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-[#1e1e1e] mb-4">Free</h3>
              <div className="text-4xl font-bold text-[#1e1e1e] mb-6">$0<span className="text-lg text-gray-600">/month</span></div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Manual Rx Input</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>One-Tap Correction</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Email/Web/Camera Filters</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span>Simulated Eye Test</span>
                </li>
              </ul>
              <Link 
                to="/register"
                className="w-full bg-gray-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-700 transition-colors text-center block"
              >
                Get Started Free
              </Link>
            </div>

            {/* Pro Plan */}
            <div className="bg-[#3399FF] rounded-2xl p-8 border-2 border-[#3399FF] relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <span className="bg-[#1D4262] text-white px-4 py-2 rounded-full text-sm font-semibold">Most Popular</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Pro</h3>
              <div className="text-4xl font-bold text-white mb-6">$4.99<span className="text-lg text-blue-100">/month</span></div>
              <ul className="space-y-3 mb-8 text-white">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Everything in Free</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Profile Saving & Switching</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Photo Gallery Correction</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>Day/Night Auto Brightness</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-300" />
                  <span>App-Specific Overrides</span>
                </li>
              </ul>
              <Link 
                to="/register"
                className="w-full bg-white text-[#3399FF] py-3 px-6 rounded-xl font-semibold hover:bg-gray-100 transition-colors text-center block"
              >
                Start Pro Trial
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-gray-600 mt-8">
            *MaxVue Pro is available as an in-app purchase. See our{' '}
            <Link to="/faq" className="text-[#3399FF] underline hover:text-[#1D4262]">FAQ</Link> for details.*
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-[#3399FF] to-[#1D4262]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to See Clearly?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of users who have already transformed their digital experience with MaxVue.
          </p>
          <Link 
            to="/register"
            className="bg-white text-[#3399FF] px-8 py-4 rounded-xl text-lg font-semibold hover:bg-gray-100 transition-all transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <Download className="h-5 w-5" />
            <span>Download MaxVue Now</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#1e1e1e] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <img 
                src="/maxvue_logo_transparent_bg.png" 
                alt="MaxVue" 
                className="h-12 w-auto mb-4 filter brightness-0 invert"
              />
              <p className="text-gray-400 mb-4 max-w-md">
                Digital vision correction for the modern world. See clearly without glasses.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Instagram</a>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                <li><Link to="/faq" className="text-gray-400 hover:text-white transition-colors">FAQ</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Legal</h3>
              <ul className="space-y-2">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Use</Link></li>
                <li><a href="mailto:contact@maxvue.app" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 MaxVue. All rights reserved. Built with ❤️ using{' '}
              <a href="https://bolt.new" className="text-[#3399FF] hover:text-blue-300 transition-colors">Bolt.new</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;