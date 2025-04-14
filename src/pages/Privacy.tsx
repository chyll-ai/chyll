
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                At GenerativSchool, we respect your privacy and are committed to protecting your personal data.
                This Privacy Policy will inform you about how we look after your personal data when you visit our website
                and tell you about your privacy rights and how the law protects you.
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
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Data We Collect</h2>
              <p>
                We may collect, use, store and transfer different kinds of personal data about you which we have grouped together as follows:
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Identity Data</strong> includes first name, last name, username, or similar identifier.</li>
                <li><strong>Contact Data</strong> includes billing address, delivery address, email address, and telephone numbers.</li>
                <li><strong>Technical Data</strong> includes internet protocol (IP) address, browser type and version, time zone setting, browser plug-in types and versions, operating system and platform.</li>
                <li><strong>Usage Data</strong> includes information about how you use our website, products, and services.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. How We Use Your Data</h2>
              <p>
                We will only use your personal data when the law allows us to. Most commonly, we will use your personal data in the following circumstances:
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>To provide and improve our services to you.</li>
                <li>To manage our relationship with you.</li>
                <li>To administer and protect our business and this website.</li>
                <li>To use data analytics to improve our website, products/services, marketing, customer relationships, and experiences.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Data Security</h2>
              <p>
                We have put in place appropriate security measures to prevent your personal data from being accidentally lost, used,
                or accessed in an unauthorized way, altered, or disclosed.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Data Retention</h2>
              <p>
                We will only retain your personal data for as long as necessary to fulfill the purposes we collected it for,
                including for the purposes of satisfying any legal, accounting, or reporting requirements.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Your Legal Rights</h2>
              <p>
                Under certain circumstances, you have rights under data protection laws in relation to your personal data, including:
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>The right to request access to your personal data.</li>
                <li>The right to request correction of your personal data.</li>
                <li>The right to request erasure of your personal data.</li>
                <li>The right to object to processing of your personal data.</li>
                <li>The right to request restriction of processing your personal data.</li>
                <li>The right to request transfer of your personal data.</li>
                <li>The right to withdraw consent.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Changes to This Privacy Policy</h2>
              <p>
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Contact Us</h2>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:<br />
                <a href="mailto:privacy@generativschool.com" className="text-brand-blue hover:underline">privacy@generativschool.com</a>
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

export default Privacy;
