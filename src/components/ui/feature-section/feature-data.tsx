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
  
  // Check if French translations are available for benefits
  const hasFrenchFeatures = t.home?.benefits?.items !== undefined;
  
  // French feature items
  const frenchFeatures: FeatureItem[] = [
    {
      title: "Disponibilité 24/7",
      description:
        "Votre employé IA ne dort jamais, assurant un service continu pour vos clients dans tous les fuseaux horaires.",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      title: "Efficacité des coûts",
      description:
        "Réduisez les coûts opérationnels tout en augmentant la productivité. Pas d'avantages sociaux, de pauses ou d'heures supplémentaires requis.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Support client instantané",
      description:
        "Fournissez des réponses immédiates aux demandes des clients, améliorant la satisfaction et les taux de fidélisation.",
      icon: <Headphones className="w-6 h-6" />,
    },
    {
      title: "Solutions évolutives",
      description: "Adaptez facilement votre main-d'œuvre IA à la hausse ou à la baisse en fonction de la demande, sans délais d'embauche ou de formation.",
      icon: <ArrowUpRight className="w-6 h-6" />,
    },
    {
      title: "Interactions naturelles",
      description: "Nos employés IA communiquent naturellement, faisant en sorte que vos clients se sentent valorisés et compris.",
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: "Sécurité des données",
      description:
        "Des protocoles de sécurité de niveau entreprise garantissent que toutes les données et interactions des clients restent protégées.",
      icon: <ShieldCheck className="w-6 h-6" />,
    },
    {
      title: "Performance constante",
      description:
        "Éliminez les erreurs humaines et les sautes d'humeur. Votre employé IA offre une qualité constante à chaque fois.",
      icon: <Bot className="w-6 h-6" />,
    },
    {
      title: "Potentiel illimité",
      description: "À mesure que la technologie IA évolue, votre employé GenerativSchool s'améliore continuellement, apprenant automatiquement de nouvelles compétences.",
      icon: <Zap className="w-6 h-6" />,
    },
  ];

  // If we have French translations from the benefits section, use those instead
  if (hasFrenchFeatures && Array.isArray(t.home?.benefits?.items)) {
    // Map icons in the same order as the French version
    const icons = [Clock, TrendingUp, Headphones, ArrowUpRight, Users, ShieldCheck, Bot, Zap];
    
    // Make sure we have exactly 8 items by using all items from the French translation
    return t.home?.benefits?.items.map((item, index) => ({
      title: item.title,
      description: item.description,
      icon: <React.Fragment>{React.createElement(icons[index], { className: "w-6 h-6" })}</React.Fragment>
    }));
  }
  
  // Otherwise return the French features
  return frenchFeatures;
};
