
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';

const Cookies = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Cookie Policy</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Introduction</h2>
              <p>
                This Cookie Policy explains how GenerativSchool uses cookies and similar technologies to recognize you when you visit our website.
                It explains what these technologies are and why we use them, as well as your rights to control our use of them.
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
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. What Are Cookies?</h2>
              <p>
                Cookies are small data files that are placed on your computer or mobile device when you visit a website.
                Cookies are widely used by website owners in order to make their websites work, or to work more efficiently,
                as well as to provide reporting information.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Types of Cookies We Use</h2>
              <p>
                We use the following types of cookies:
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Essential Cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems.</li>
                <li><strong>Performance Cookies:</strong> These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site.</li>
                <li><strong>Functionality Cookies:</strong> These cookies enable the website to provide enhanced functionality and personalization.</li>
                <li><strong>Targeting Cookies:</strong> These cookies may be set through our site by our advertising partners to build a profile of your interests.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. How to Control Cookies</h2>
              <p>
                You can set or amend your web browser controls to accept or refuse cookies. If you choose to reject cookies, you may still use our website though your access to some functionality and areas of our website may be restricted.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Third-Party Cookies</h2>
              <p>
                In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the website and deliver advertisements on and through the website.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Changes to This Cookie Policy</h2>
              <p>
                We may update this Cookie Policy from time to time in order to reflect changes to the cookies we use or for other operational, legal, or regulatory reasons.
                Please therefore re-visit this Cookie Policy regularly to stay informed about our use of cookies and related technologies.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact Us</h2>
              <p>
                If you have any questions about our use of cookies or other technologies, please contact us at:<br />
                <a href="mailto:cookies@generativschool.com" className="text-brand-blue hover:underline">cookies@generativschool.com</a>
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

export default Cookies;
