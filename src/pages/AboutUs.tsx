
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { useLanguage } from '@/context/LanguageContext';

const AboutUs = () => {
  const { t } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">{t.about.title}</h1>
            
            <div className="mb-10">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                alt="Team working together" 
                className="w-full h-72 object-cover rounded-lg mb-6"
              />
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">{t.about.story.title}</h2>
              <p>{t.about.story.text1}</p>
              <p className="mt-4">{t.about.story.text2}</p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">{t.about.mission.title}</h2>
              <p>{t.about.mission.text1}</p>
              <p className="mt-4">{t.about.mission.text2}</p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">{t.about.unique.title}</h2>
              <ul className="list-disc pl-6 space-y-2">
                {t.about.unique.items.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
              
              <div className="bg-gray-50 p-6 rounded-lg mt-10">
                <h3 className="text-xl font-semibold mb-4">{t.about.cta.title}</h3>
                <p className="mb-6">{t.about.cta.text}</p>
                <a 
                  href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  {t.about.cta.button}
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

export default AboutUs;
