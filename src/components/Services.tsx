import React from "react";
import { Eye, Glasses, Contact, Zap, Shield, Clock } from "lucide-react";

const services = [
  {
    icon: Zap,
    title: "LASIK Surgery",
    description:
      "Advanced bladeless LASIK with precise corneal reshaping for permanent vision correction.",
    features: [
      "15-minute procedure",
      "No glasses needed",
      "99.5% success rate",
    ],
    price: "Starting at $1,999/eye",
  },
  {
    icon: Eye,
    title: "PRK Surgery",
    description:
      "Perfect for thin corneas or active lifestyles with surface-based laser correction.",
    features: ["No corneal flap", "Ideal for athletes", "Long-term stability"],
    price: "Starting at $1,799/eye",
  },
  {
    icon: Glasses,
    title: "Designer Eyewear",
    description:
      "Premium frames and lenses with the latest in lens technology and style.",
    features: ["Blue light filtering", "Progressive lenses", "Designer brands"],
    price: "Starting at $199",
  },
  {
    icon: Contact,
    title: "Contact Lenses",
    description:
      "Daily, weekly, and monthly options including specialty lenses for complex prescriptions.",
    features: [
      "Daily disposables",
      "Toric for astigmatism",
      "Multifocal options",
    ],
    price: "Starting at $25/month",
  },
  {
    icon: Shield,
    title: "Comprehensive Exams",
    description:
      "Thorough eye health evaluations using the latest diagnostic technology.",
    features: ["Retinal imaging", "Glaucoma screening", "Dry eye assessment"],
    price: "Starting at $149",
  },
  {
    icon: Clock,
    title: "Emergency Care",
    description:
      "24/7 emergency eye care for urgent vision problems and eye injuries.",
    features: ["Same-day appointments", "24/7 hotline", "Insurance accepted"],
    price: "Insurance covered",
  },
];

const Services = () => {
  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Complete Vision Care Solutions
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From routine eye exams to advanced surgical procedures, we offer
            comprehensive vision care services tailored to your unique needs and
            lifestyle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 group"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-600 transition-colors">
                <service.icon className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {service.title}
              </h3>
              <p className="text-gray-600 mb-4">{service.description}</p>

              <div className="space-y-2 mb-4">
                {service.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    className="flex items-center space-x-2"
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-blue-600">
                    {service.price}
                  </span>
                  <button className="text-blue-600 hover:text-blue-700 font-medium">
                    Learn More →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
