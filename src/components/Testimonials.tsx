import React from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Jennifer Williams",
    location: "San Francisco, CA",
    procedure: "LASIK Surgery",
    rating: 5,
    text: "Life-changing experience! After 20 years of glasses, I can now see perfectly without any aids. The team at VividVue made the entire process comfortable and stress-free. I wish I had done this sooner!",
    result: "20/15 vision achieved",
  },
  {
    name: "Robert Chen",
    location: "Los Angeles, CA",
    procedure: "PRK Surgery",
    rating: 5,
    text: "As a professional athlete, I needed a vision correction solution that wouldn't interfere with my active lifestyle. PRK was perfect, and the results exceeded my expectations. No more contact lens issues during competitions!",
    result: "Perfect vision for sports",
  },
  {
    name: "Maria Rodriguez",
    location: "Seattle, WA",
    procedure: "Comprehensive Eye Care",
    rating: 5,
    text: "The thoroughness of their eye exams caught early signs of glaucoma that my previous doctor missed. Their preventive care approach and advanced technology literally saved my sight. Truly grateful for their expertise.",
    result: "Early detection saved vision",
  },
  {
    name: "David Kim",
    location: "Portland, OR",
    procedure: "Designer Eyewear",
    rating: 5,
    text: "Finding the perfect prescription progressive lenses was challenging until I came to VividVue. Their optometrists took the time to understand my needs, and now I have glasses that work perfectly for both work and leisure.",
    result: "Perfect progressive lenses",
  },
];

const Testimonials = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Real Stories, Real Results
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how VividVue has transformed the lives of thousands of
            patients with our expert care and advanced vision correction
            solutions.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="flex items-center mb-4">
                <div className="flex space-x-1">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 text-yellow-400 fill-current"
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">
                  {testimonial.rating}.0
                </span>
              </div>

              <div className="relative mb-6">
                <Quote className="h-8 w-8 text-blue-600 opacity-50 absolute -top-2 -left-2" />
                <p className="text-gray-700 leading-relaxed pl-6">
                  {testimonial.text}
                </p>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-900">
                    Result: {testimonial.result}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {testimonial.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-blue-600">
                    {testimonial.procedure}
                  </p>
                  <p className="text-xs text-gray-500">Verified Patient</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="bg-blue-600 text-white rounded-2xl p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4">
              Join Thousands of Satisfied Patients
            </h3>
            <p className="mb-6 text-blue-100">
              Experience the VividVue difference with personalized care and
              exceptional results.
            </p>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg hover:bg-gray-100 transition-colors font-semibold">
              Schedule Your Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
