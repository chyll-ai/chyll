import { 
  Zap,
  Clock,
  Headphones,
  ShieldCheck,
  Users,
  TrendingUp,
  Bot,
  ArrowUpRight
} from "lucide-react";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const useFeatureItems = (): FeatureItem[] => {
  const { language, t } = useLanguage();
  
  // Check if French translations are available
  const hasFrenchFeatures = language === 'fr' && t.home?.benefits?.items !== undefined;
  
  // Default feature items (English)
  const defaultFeatures: FeatureItem[] = [
    {
      title: "24/7 Availability",
      description:
        "Your AI employee never sleeps, ensuring round-the-clock service for your customers across all time zones.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Cost Efficiency",
      description:
        "Reduce operational costs while increasing productivity. No benefits, breaks, or overtime pay required.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Instant Customer Support",
      description:
        "Provide immediate responses to customer inquiries, improving satisfaction and retention rates.",
      icon: <Headphones className="w-6 h-6" />,
    },
    {
      title: "Scalable Solutions",
      description: "Easily scale your AI workforce up or down based on demand, without hiring or training delays.",
      icon: <ArrowUpRight className="w-6 h-6" />,
    },
    {
      title: "Human-like Interactions",
      description: "Our AI employees communicate naturally, making your customers feel valued and understood.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Data Security",
      description:
        "Enterprise-grade security protocols ensure all customer data and interactions remain protected.",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: "Consistent Performance",
      description:
        "Eliminate human error and mood swings. Your AI employee delivers consistent quality every time.",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      title: "Unlimited Potential",
      description: "As AI technology evolves, your GenerativSchool employee continuously improves, learning new skills automatically.",
      icon: <Zap className="w-6 h-6" />,
    },
  ];

  // If we have French translations, return those instead
  if (hasFrenchFeatures && Array.isArray(t.home?.benefits?.items)) {
    // Map icons to the translated content
    const icons = [Clock, TrendingUp, Headphones, ArrowUpRight, Users, ShieldCheck, Bot, Zap];
    
    return t.home?.benefits?.items.map((item, index) => ({
      title: item.title,
      description: item.description,
      // Use the corresponding icon or default to first icon if we run out
      icon: <React.Fragment>{icons[index % icons.length] && React.createElement(icons[index % icons.length], { className: "w-6 h-6" })}</React.Fragment>
    }));
  }
  
  // Otherwise return the default English features
  return defaultFeatures;
};
