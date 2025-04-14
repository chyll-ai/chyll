
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

const ContactInfo = ({ icon, title, details }: {
  icon: React.ReactNode;
  title: string;
  details: React.ReactNode;
}) => (
  <div className="flex space-x-4 items-start">
    <div className="bg-indigo-100 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <div className="text-gray-600 mt-1">{details}</div>
    </div>
  </div>
);

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Contact Us</h1>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Have questions about our AI solutions? Ready to transform your business? 
              Get in touch with our team and we'll be happy to help.
            </p>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                
                <div className="space-y-8 mb-10">
                  <ContactInfo 
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
                  
                  <ContactInfo 
                    icon={<Phone className="w-6 h-6 text-indigo-600" />}
                    title="Phone Number"
                    details={
                      <a href="tel:+33123456789" className="hover:text-indigo-600 transition-colors">
                        +33 1 23 45 67 89
                      </a>
                    }
                  />
                  
                  <ContactInfo 
                    icon={<Mail className="w-6 h-6 text-indigo-600" />}
                    title="Email Address"
                    details={
                      <a href="mailto:contact@generativschool.com" className="hover:text-indigo-600 transition-colors">
                        contact@generativschool.com
                      </a>
                    }
                  />
                  
                  <ContactInfo 
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
                    href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                  >
                    Book a Demo
                  </a>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
                <form className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="first-name" className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="first-name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="last-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="last-name"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      Company Name
                    </label>
                    <input
                      type="text"
                      id="company"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <textarea
                      id="message"
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                    ></textarea>
                  </div>
                  
                  <div>
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                      Send Message
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Contact;
