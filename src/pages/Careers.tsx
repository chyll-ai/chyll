
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import { ArrowRight, Coffee, Zap, Heart, Globe } from 'lucide-react';

const JobListing = ({ title, department, location, type }: {
  title: string;
  department: string;
  location: string;
  type: string;
}) => (
  <div className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 hover:shadow-md transition-all">
    <div className="flex flex-col md:flex-row md:items-center justify-between">
      <div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-gray-600 mt-1">{department}</p>
      </div>
      <div className="mt-3 md:mt-0 md:ml-4">
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-sm rounded-full">{location}</span>
          <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-sm rounded-full">{type}</span>
        </div>
      </div>
    </div>
    <div className="mt-4 flex justify-end">
      <a 
        href="#" 
        className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium"
      >
        View Details <ArrowRight size={16} className="ml-1" />
      </a>
    </div>
  </div>
);

const Careers = () => {
  const openPositions = [
    {
      title: "Senior AI Engineer",
      department: "Engineering",
      location: "Paris, France",
      type: "Full-time"
    },
    {
      title: "Machine Learning Researcher",
      department: "AI Research",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "Customer Success Manager",
      department: "Customer Success",
      location: "Paris, France",
      type: "Full-time"
    },
    {
      title: "Front-end Developer",
      department: "Engineering",
      location: "Remote",
      type: "Full-time"
    },
    {
      title: "AI Product Manager",
      department: "Product",
      location: "Paris, France",
      type: "Full-time"
    },
    {
      title: "Sales Development Representative",
      department: "Sales",
      location: "London, UK",
      type: "Full-time"
    }
  ];

  const benefits = [
    {
      icon: <Coffee className="w-6 h-6 text-indigo-600" />,
      title: "Flexible Working",
      description: "Work from home or our office, with flexible hours to ensure work-life balance."
    },
    {
      icon: <Zap className="w-6 h-6 text-indigo-600" />,
      title: "Continuous Learning",
      description: "Personal development budget for courses, books, and conferences."
    },
    {
      icon: <Heart className="w-6 h-6 text-indigo-600" />,
      title: "Health & Wellness",
      description: "Comprehensive health insurance and wellness programs to keep you at your best."
    },
    {
      icon: <Globe className="w-6 h-6 text-indigo-600" />,
      title: "Global Impact",
      description: "Work on AI solutions that are transforming businesses around the world."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-6">Join Our Team</h1>
            <p className="text-lg text-gray-700 mb-8">
              Help us build the future of business automation with AI. We're looking for talented individuals 
              who are passionate about creating impactful technology solutions.
            </p>
            <a 
              href="#open-positions" 
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              View Open Positions
            </a>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Why Work With Us?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {benefits.map((benefit, index) => (
                <div key={index} className="p-6 bg-white rounded-lg shadow-sm">
                  <div className="mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
            
            <div className="mb-16">
              <img 
                src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200" 
                alt="Team working together" 
                className="w-full h-80 object-cover rounded-lg"
              />
            </div>
            
            <div id="open-positions">
              <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center">Open Positions</h2>
              <div className="space-y-4">
                {openPositions.map((position, index) => (
                  <JobListing key={index} {...position} />
                ))}
              </div>
            </div>
            
            <div className="mt-16 bg-gray-50 p-8 rounded-lg text-center">
              <h3 className="text-xl font-semibold mb-4">Don't see the right position?</h3>
              <p className="text-gray-600 mb-6">
                We're always looking for talented individuals to join our team. Send your resume to our hiring team.
              </p>
              <a 
                href="mailto:contact@generativschool.com" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                Contact Our Hiring Team
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default Careers;
