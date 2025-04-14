
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer-translated';
import { useTranslation } from '@/contexts/TranslationContext';
import { useLocation } from 'react-router-dom';

interface AboutSectionProps {
  title: string;
  children: React.ReactNode;
}

const AboutSection: React.FC<AboutSectionProps> = ({ title, children }) => (
  <>
    <h2 className="text-2xl font-semibold mt-8 mb-4">{title}</h2>
    {children}
  </>
);

const CallToAction: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <div className="bg-gray-50 p-6 rounded-lg mt-10">
      <h3 className="text-xl font-semibold mb-4">
        {t('ready_to_transform')}
      </h3>
      <p className="mb-6">
        {t('schedule_demo_text')}
      </p>
      <a 
        href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" 
        target="_blank" 
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
      >
        {t('book_demo')}
      </a>
    </div>
  );
};

const FeatureList: React.FC = () => (
  <ul className="list-disc pl-6 space-y-2">
    <li><strong>No-code platform:</strong> Our solutions don't require technical expertise to implement or manage.</li>
    <li><strong>Seamless integration:</strong> Our AI employees work with your existing systems and tools.</li>
    <li><strong>Continuous learning:</strong> Our AI improves over time, adapting to your specific business needs.</li>
    <li><strong>Human-centric approach:</strong> We design our AI to complement human teams, not replace them.</li>
    <li><strong>Ethical AI development:</strong> We adhere to strict ethical guidelines in all our AI development.</li>
  </ul>
);

const AboutUs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath={location.pathname} />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">{t('about_us')}</h1>
            
            <div className="prose max-w-none">
              <div className="mb-10">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                  alt="Team working together" 
                  className="w-full h-72 object-cover rounded-lg mb-6"
                  loading="lazy"
                />
              </div>
              
              <AboutSection title="Our Story">
                <p>
                  Founded in 2024, GenerativSchool was born from a simple yet powerful idea: what if businesses could have AI employees that work alongside human teams? Our founders, having worked in the AI industry for years, saw firsthand how fragmented and complex implementing AI solutions could be for most companies.
                </p>
                <p className="mt-4">
                  We set out to build a platform that would make AI implementation straightforward and accessible, allowing businesses of all sizes to benefit from the advances in artificial intelligence without requiring specialized technical knowledge.
                </p>
              </AboutSection>
              
              <AboutSection title="Our Mission">
                <p>
                  At GenerativSchool, our mission is to democratize access to AI-powered automation and enable businesses to deploy AI employees that transform how they operate, serve customers, and grow their operations.
                </p>
                <p className="mt-4">
                  We believe that by making AI accessible and practical, we can help businesses become more efficient, innovative, and customer-focused, allowing them to thrive in an increasingly digital world.
                </p>
              </AboutSection>
              
              <AboutSection title="What Sets Us Apart">
                <FeatureList />
              </AboutSection>
              
              <CallToAction />
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default AboutUs;
