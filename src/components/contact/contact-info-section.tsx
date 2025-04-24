
import React from 'react';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { ContactInfoItem } from './contact-info-item';

export const ContactInfoSection = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
      
      <div className="space-y-8 mb-10">
        <ContactInfoItem 
          icon={<MapPin className="w-6 h-6 text-indigo-600" />}
          title="Our Location"
          details={
            <p>
              60 RUE FRANCOIS IER<br />
              75008 PARIS<br />
              France
            </p>
          }
        />
        
        <ContactInfoItem 
          icon={<Phone className="w-6 h-6 text-indigo-600" />}
          title="Toll-Free Phone Number"
          details={
            <a href="tel:+18445942399" className="hover:text-indigo-600 transition-colors">
              +1 (844) 594-2399 (Toll Free)
            </a>
          }
        />
        
        <ContactInfoItem 
          icon={<Mail className="w-6 h-6 text-indigo-600" />}
          title="Email Address"
          details={
            <a href="mailto:contact@generativschool.com" className="hover:text-indigo-600 transition-colors">
              contact@generativschool.com
            </a>
          }
        />
        
        <ContactInfoItem 
          icon={<Clock className="w-6 h-6 text-indigo-600" />}
          title="Office Hours"
          details={
            <p>
              Monday - Friday: 9:00 AM - 6:00 PM<br />
              Saturday & Sunday: Closed
            </p>
          }
        />
      </div>
      
      <div className="mt-10">
        <h3 className="text-xl font-semibold mb-4">Book a Demo</h3>
        <p className="text-gray-600 mb-6">
          See our AI employees in action. Schedule a personalized demo with our team.
        </p>
        <a 
          href="https://cal.com/generativschool/30min?overlayCalendar=true" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
        >
          Book a Demo
        </a>
      </div>
    </div>
  );
};
