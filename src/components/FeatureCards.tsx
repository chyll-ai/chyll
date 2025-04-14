
import React from 'react';
import { 
  Phone, MessageSquare, Star, FileText, Workflow, LineChart 
} from 'lucide-react';

const features = [
  {
    title: "Voice AI",
    description: "Human-like phone calls that handle customers automatically",
    icon: Phone,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Conversation AI",
    description: "AI chat across web, SMS, and social",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Reviews AI",
    description: "Request and manage reviews automatically",
    icon: Star,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    title: "Content AI",
    description: "Auto-generate posts, emails, and client messages",
    icon: FileText,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Workflow AI Assistant",
    description: "Automate operations and task handling",
    icon: Workflow,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Funnel AI",
    description: "Smarter lead capture and conversion workflows",
    icon: LineChart,
    color: "bg-red-50 text-red-600"
  }
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="feature-card hover-lift"
        >
          <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${feature.color}`}>
            <feature.icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
