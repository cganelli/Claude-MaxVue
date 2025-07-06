import React from "react";
import { Award, Users, Clock, Shield } from "lucide-react";

const stats = [
  { icon: Users, label: "Patients Served", value: "50,000+" },
  { icon: Clock, label: "Years of Experience", value: "25+" },
  { icon: Award, label: "Success Rate", value: "99.5%" },
  { icon: Shield, label: "Procedures Performed", value: "30,000+" },
];

const team = [
  {
    name: "Dr. Sarah Chen",
    role: "Chief of Ophthalmology",
    specialty: "LASIK & Refractive Surgery",
    experience: "15 years",
    education: "Harvard Medical School",
  },
  {
    name: "Dr. Michael Rodriguez",
    role: "Senior Optometrist",
    specialty: "Pediatric Eye Care",
    experience: "12 years",
    education: "UC Berkeley School of Optometry",
  },
  {
    name: "Dr. Emily Johnson",
    role: "Retinal Specialist",
    specialty: "Diabetic Retinopathy",
    experience: "18 years",
    education: "Johns Hopkins University",
  },
];

const About = () => {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Leading Vision Care Excellence
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            For over 25 years, VividVue has been at the forefront of vision
            correction technology, helping patients achieve perfect sight with
            compassionate care and cutting-edge treatments.
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 group-hover:bg-blue-600 transition-colors">
                <stat.icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
          <div className="space-y-6">
            <h3 className="text-3xl font-bold text-gray-900">
              Why Choose VividVue?
            </h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Advanced Technology
                  </h4>
                  <p className="text-gray-600">
                    Latest FDA-approved equipment and surgical techniques for
                    optimal results.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">Expert Team</h4>
                  <p className="text-gray-600">
                    Board-certified specialists with extensive experience in
                    vision correction.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Personalized Care
                  </h4>
                  <p className="text-gray-600">
                    Customized treatment plans tailored to your unique vision
                    needs and lifestyle.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-3"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    Lifetime Support
                  </h4>
                  <p className="text-gray-600">
                    Comprehensive aftercare and lifetime vision guarantee for
                    peace of mind.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8">
            <div className="bg-white rounded-xl p-6 shadow-lg">
              <h4 className="text-xl font-bold text-gray-900 mb-4">
                Our Accreditations
              </h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    American Academy of Ophthalmology
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    Joint Commission Accredited
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    FDA Center of Excellence
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <Award className="h-5 w-5 text-blue-600" />
                  <span className="text-gray-700">
                    Better Business Bureau A+
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Meet Our Expert Team
          </h3>
          <p className="text-xl text-gray-600">
            Board-certified specialists dedicated to your vision health
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {team.map((doctor, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
            >
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center text-white text-2xl font-bold">
                {doctor.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-1">
                {doctor.name}
              </h4>
              <p className="text-blue-600 font-semibold mb-2">{doctor.role}</p>
              <p className="text-gray-600 mb-2">{doctor.specialty}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>{doctor.experience} experience</p>
                <p>{doctor.education}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
