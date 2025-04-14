
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Building, Users, Award, Target } from 'lucide-react';

const Company = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Our Company</h1>
            
            <div className="prose max-w-none">
              <p className="text-lg mb-6">
                GenerativSchool is a leading provider of AI-driven solutions designed to transform how businesses operate. 
                Founded in 2024, we're on a mission to help organizations leverage the power of artificial intelligence 
                to streamline operations, enhance customer experiences, and drive growth.
              </p>
              
              <div className="grid gap-8 md:grid-cols-2 my-12">
                <div className="flex flex-col p-6 bg-gray-50 rounded-lg">
                  <div className="mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Building className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our Vision</h3>
                  <p>
                    To create a world where AI employees seamlessly integrate with human teams, 
                    enhancing productivity and enabling businesses to focus on what truly matters.
                  </p>
                </div>
                
                <div className="flex flex-col p-6 bg-gray-50 rounded-lg">
                  <div className="mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our People</h3>
                  <p>
                    We're a diverse team of AI specialists, engineers, and business experts 
                    united by our passion for creating intelligent solutions that make a difference.
                  </p>
                </div>
                
                <div className="flex flex-col p-6 bg-gray-50 rounded-lg">
                  <div className="mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Award className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our Values</h3>
                  <p>
                    Innovation, ethical AI development, customer-centricity, and continuous improvement 
                    are at the core of everything we do.
                  </p>
                </div>
                
                <div className="flex flex-col p-6 bg-gray-50 rounded-lg">
                  <div className="mb-4 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Target className="w-6 h-6 text-indigo-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Our Approach</h3>
                  <p>
                    We collaborate closely with our clients to create tailor-made AI solutions 
                    that address their specific challenges and opportunities.
                  </p>
                </div>
              </div>
              
              <h2 className="text-2xl font-semibold mt-12 mb-4">Company Information</h2>
              <p>
                <strong>Company Name:</strong> GENERATIVSCHOOL<br />
                <strong>Legal Form:</strong> SAS, société par actions simplifiée<br />
                <strong>SIREN:</strong> 938 422 896<br />
                <strong>SIRET:</strong> 938 422 896 00010<br />
                <strong>VAT Number:</strong> FR64 938 422 896<br />
                <strong>Main Activity (NAF/APE):</strong> Autres enseignements (85.59B)<br />
                <strong>Address:</strong> 60 RUE FRANCOIS IER 75008 PARIS<br />
                <strong>Date of Creation:</strong> 10/12/2024
              </p>
              
              <div className="flex justify-center mt-12">
                <a 
                  href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Contact Us Today
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Company;
