
import React from 'react';
import { 
  Phone, MessageSquare, Star, FileText, Workflow, LineChart 
} from 'lucide-react';

const features = [
  {
    title: "Voice AI",
    starWarsName: "OBI",
    description: "Never miss a call with 24/7 automated phone reception",
    icon: Phone,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Conversation AI",
    starWarsName: "LEIA",
    description: "Natural live chat across SMS, web, and social media",
    icon: MessageSquare,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Reviews AI",
    starWarsName: "LUKE",
    description: "Reputation management and review automation",
    icon: Star,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    title: "Content AI",
    starWarsName: "YODA",
    description: "Generate blogs, social posts, emails, and images",
    icon: FileText,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Workflow AI Assistant",
    starWarsName: "R2D2",
    description: "Build and master business automation workflows",
    icon: Workflow,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Funnel AI",
    starWarsName: "HAN",
    description: "Create high-converting pages and funnels quickly",
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
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {feature.starWarsName}, THE {feature.title.toUpperCase()}
          </h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
