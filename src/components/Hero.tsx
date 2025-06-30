import React from 'react';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="pt-20 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen flex items-center">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="flex items-center space-x-2 text-blue-600">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-semibold">Trusted by 50,000+ patients</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Clear Vision,
              <span className="text-blue-600 block">Brighter Future</span>
            </h1>
            
            <p className="text-xl text-gray-600 leading-relaxed">
              Experience the latest in vision correction technology with personalized care 
              from our expert team. From comprehensive eye exams to advanced surgical procedures, 
              we're here to help you see the world clearly.
            </p>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">FDA-approved LASIK technology</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Board-certified ophthalmologists</span>
              </div>
              <div className="flex items-center space-x-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="text-gray-700">Lifetime vision guarantee</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 flex items-center justify-center space-x-2 text-lg font-semibold">
                <span>Schedule Free Consultation</span>
                <ArrowRight className="h-5 w-5" />
              </button>
              <button className="border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-lg hover:bg-blue-50 transition-colors text-lg font-semibold">
                Take Vision Test
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 transform rotate-2 hover:rotate-0 transition-transform duration-300">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl h-80 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <div className="w-16 h-16 border-4 border-white rounded-full flex items-center justify-center">
                      <div className="w-8 h-8 bg-white rounded-full"></div>
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Perfect Vision</h3>
                  <p className="text-blue-100">20/20 or better guaranteed</p>
                </div>
              </div>
            </div>
            
            <div className="absolute -bottom-4 -left-4 bg-green-500 text-white p-4 rounded-lg shadow-lg">
              <div className="flex items-center space-x-2">
                <Star className="h-5 w-5 fill-current" />
                <span className="font-bold">4.9/5 Rating</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;