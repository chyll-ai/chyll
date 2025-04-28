import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Headset, FileText, MessageCircle, BookOpen, Clock, Shield } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface SupportCard {
  icon: React.ReactNode;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

const SupportOption = ({ option }: { option: SupportCard }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all">
    <div className="mb-4">{option.icon}</div>
    <h3 className="text-xl font-bold mb-2">{option.title}</h3>
    <p className="text-gray-600 mb-4">{option.description}</p>
    <a 
      href={option.linkUrl} 
      className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors"
    >
      {option.linkText} →
    </a>
  </div>
);

const Support = () => {
  const { language } = useLanguage();

  const supportOptions: SupportCard[] = language === 'fr' ? [
    {
      icon: <MessageCircle className="w-8 h-8 text-indigo-600" />,
      title: "Support par chat en direct",
      description: "Connectez-vous instantanément avec notre équipe de support pour obtenir des réponses rapides à vos questions.",
      linkText: "Démarrer un chat",
      linkUrl: "#",
    },
    {
      icon: <Headset className="w-8 h-8 text-indigo-600" />,
      title: "Support téléphonique",
      description: "Parlez directement avec nos spécialistes techniques pour une assistance approfondie.",
      linkText: "Appelez +1 (844) 594-2399",
      linkUrl: "tel:+18445942399",
    },
    {
      icon: <FileText className="w-8 h-8 text-indigo-600" />,
      title: "Soumettre un ticket",
      description: "Créez un ticket de support pour les problèmes nécessitant une investigation détaillée.",
      linkText: "Ouvrir un ticket",
      linkUrl: "#",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: "Base de connaissances",
      description: "Parcourez notre documentation complète pour des guides et tutoriels.",
      linkText: "Explorer les ressources",
      linkUrl: "/documentation",
    },
  ] : [
    {
      icon: <MessageCircle className="w-8 h-8 text-indigo-600" />,
      title: "Live Chat Support",
      description: "Connect with our support team instantly for quick answers to your questions.",
      linkText: "Start a chat",
      linkUrl: "#",
    },
    {
      icon: <Headset className="w-8 h-8 text-indigo-600" />,
      title: "Phone Support",
      description: "Speak directly with our technical specialists for in-depth assistance.",
      linkText: "Call +1 (844) 594-2399",
      linkUrl: "tel:+18445942399",
    },
    {
      icon: <FileText className="w-8 h-8 text-indigo-600" />,
      title: "Submit a Ticket",
      description: "Create a support ticket for issues that require detailed investigation.",
      linkText: "Open a ticket",
      linkUrl: "#",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-indigo-600" />,
      title: "Knowledge Base",
      description: "Browse our comprehensive documentation for guides and tutorials.",
      linkText: "Explore resources",
      linkUrl: "/documentation",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              {language === 'fr' ? "Support Client" : "Customer Support"}
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              {language === 'fr' 
                ? "Nous sommes là pour vous aider à tirer le meilleur parti de GenerativSchool. Choisissez comment vous souhaitez contacter notre équipe de support."
                : "We're here to help you get the most out of GenerativSchool. Choose how you'd like to reach our support team."}
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {supportOptions.map((option, index) => (
              <SupportOption key={index} option={option} />
            ))}
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'fr' ? "Heures de support" : "Support Hours"}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">
                        {language === 'fr' ? "Support standard" : "Standard Support"}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'fr' 
                          ? "Lundi - Vendredi : 9h00 - 18h00 HE"
                          : "Monday - Friday: 9:00 AM - 6:00 PM ET"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="w-5 h-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                      <h3 className="font-medium">
                        {language === 'fr' ? "Support premium" : "Premium Support"}
                      </h3>
                      <p className="text-gray-600">
                        {language === 'fr' 
                          ? "Support 24/7 pour les clients entreprise"
                          : "24/7 support for enterprise customers"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-4">
                  {language === 'fr' ? "Garantie de support" : "Support Guarantee"}
                </h2>
                <div className="flex items-start">
                  <Shield className="w-5 h-5 text-indigo-600 mt-1 mr-3" />
                  <div>
                    <p className="text-gray-600">
                      {language === 'fr' 
                        ? "Notre engagement est de répondre à toutes les demandes de support dans les 24 heures. Les clients premium bénéficient de délais de réponse prioritaires de 4 heures ou moins."
                        : "Our commitment is to respond to all support inquiries within 24 hours. Premium support customers receive priority response times of 4 hours or less."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Support;
