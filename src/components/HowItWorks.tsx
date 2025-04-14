
import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: t('step_1'),
      title: t('choose_ai_employee'),
      description: "Select from our diverse range of AI employees designed for specific business functions.",
      icon: "👥"
    },
    {
      number: t('step_2'),
      title: t('plug_workflow'),
      description: "Connect your AI employee to existing tools and customize their behavior.",
      icon: "🔌"
    },
    {
      number: t('step_3'),
      title: t('productivity_skyrocket'),
      description: "Sit back as your AI employee handles tasks 24/7, increasing efficiency and revenue.",
      icon: "🚀"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((step, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="mb-4 flex justify-between items-center">
            <span className="bg-brand-blue/10 text-brand-blue font-medium px-3 py-1 rounded-md text-sm">
              {step.number}
            </span>
            <div className="text-3xl">{step.icon}</div>
          </div>
          <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HowItWorks;
