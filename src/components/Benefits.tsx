
import React from 'react';
import { 
  DollarSign, Zap, PlayCircle, Clock, Globe, ArrowUpRight 
} from 'lucide-react';

const Benefits = () => {
  // Default French benefits
  const defaultBenefits = [
    {
      title: "Rentabilité",
      icon: DollarSign,
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Productivité accrue",
      icon: Zap,
      color: "bg-yellow-50 text-yellow-600"
    },
    {
      title: "Automatisation simple",
      icon: PlayCircle,
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Support 24/7",
      icon: Clock,
      color: "bg-purple-50 text-purple-600"
    },
    {
      title: "Engagement multi-canal",
      icon: Globe,
      color: "bg-indigo-50 text-indigo-600"
    },
    {
      title: "Infiniment évolutif",
      icon: ArrowUpRight,
      color: "bg-red-50 text-red-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
      {defaultBenefits.map((benefit, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center text-center p-4 hover-lift"
        >
          <div className={`rounded-full w-16 h-16 flex items-center justify-center mb-4 ${benefit.color}`}>
            <benefit.icon className="h-8 w-8" />
          </div>
          <h3 className="text-gray-900 font-medium">{benefit.title}</h3>
        </div>
      ))}
    </div>
  );
};

export default Benefits;
