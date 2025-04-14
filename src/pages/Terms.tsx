
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to GenerativSchool. These Terms of Service govern your use of our website, products, and services.
                By accessing or using our services, you agree to be bound by these Terms.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Company Information</h2>
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
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Services</h2>
              <p>
                GenerativSchool provides AI-driven automation solutions for businesses. Our services include but are not limited to
                AI employees for customer service, content creation, and business process automation.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. User Accounts</h2>
              <p>
                To access certain features of our services, you may be required to create an account. You are responsible for
                maintaining the confidentiality of your account information and for all activities that occur under your account.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Payment Terms</h2>
              <p>
                Payment details and terms for our services are specified on our pricing page. All payments are processed securely.
                Subscription fees are non-refundable except as required by law.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Intellectual Property</h2>
              <p>
                All content, features, and functionality of our services, including but not limited to text, graphics, logos,
                and software, are the exclusive property of GenerativSchool and are protected by copyright and other intellectual property laws.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Limitation of Liability</h2>
              <p>
                To the maximum extent permitted by law, GenerativSchool shall not be liable for any indirect, incidental, special,
                consequential, or punitive damages, or any loss of profits or revenue.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. Any changes will be effective immediately upon posting
                to our website. Your continued use of our services after any such changes constitutes your acceptance of the new Terms.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about these Terms, please contact us at:<br />
                <a href="mailto:contact@generativschool.com" className="text-brand-blue hover:underline">contact@generativschool.com</a>
              </p>
              
              <p className="text-sm mt-12">Last updated: April 14, 2025</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Terms;
