
import React from 'react';
import { useTranslation } from '@/contexts/TranslationContext';

interface StepProps {
  number: string;
  title: string;
  description: string;
  icon: string;
}

const Step: React.FC<StepProps> = ({ number, title, description, icon }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-gray-200">
    <div className="mb-4 flex justify-between items-center">
      <span className="bg-brand-blue/10 text-brand-blue font-medium px-3 py-1 rounded-md text-sm">
        {number}
      </span>
      <div className="text-3xl">{icon}</div>
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

const HowItWorks: React.FC = () => {
  const { t } = useTranslation();

  const steps: StepProps[] = [
    {
      number: t('step_1'),
      title: t('choose_ai_employee'),
      description: t('choose_ai_employee_desc'),
      icon: "👥"
    },
    {
      number: t('step_2'),
      title: t('plug_workflow'),
      description: t('plug_workflow_desc'),
      icon: "🔌"
    },
    {
      number: t('step_3'),
      title: t('productivity_skyrocket'),
      description: t('productivity_skyrocket_desc'),
      icon: "🚀"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {steps.map((step, index) => (
        <Step 
          key={index}
          number={step.number}
          title={step.title}
          description={step.description}
          icon={step.icon}
        />
      ))}
    </div>
  );
};

export default HowItWorks;
