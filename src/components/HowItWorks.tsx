
import React from 'react';
import { Bot, Zap, TrendingUp } from 'lucide-react';

const steps = [
  {
    title: "Choose Your AI Employee",
    description: "Select from our wide range of AI capabilities to match your business needs.",
    icon: Bot,
    color: "bg-brand-blue/10 text-brand-blue"
  },
  {
    title: "Plug Into Your Workflow",
    description: "Seamlessly integrate with your existing tools and processes with minimal setup.",
    icon: Zap,
    color: "bg-indigo-100 text-indigo-600"
  },
  {
    title: "Watch Productivity Skyrocket",
    description: "See immediate results as your AI Employee handles tasks around the clock.",
    icon: TrendingUp,
    color: "bg-green-100 text-green-600"
  }
];

const HowItWorks = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
      {steps.map((step, index) => (
        <div 
          key={index} 
          className="flex flex-col items-center text-center relative"
        >
          {/* Number indicator */}
          <div className="absolute -top-6 font-bold text-5xl text-gray-100 select-none">
            {index + 1}
          </div>
          
          {/* Icon */}
          <div className={`relative z-10 rounded-full w-20 h-20 flex items-center justify-center mb-4 ${step.color}`}>
            <step.icon className="h-10 w-10" />
          </div>
          
          {/* Connected line (for desktop) */}
          {index < steps.length - 1 && (
            <div className="hidden md:block absolute top-10 left-[60%] w-[80%] h-0.5 bg-gray-200" />
          )}
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
          <p className="text-gray-600">{step.description}</p>
        </div>
      ))}
    </div>
  );
};

export default HowItWorks;
