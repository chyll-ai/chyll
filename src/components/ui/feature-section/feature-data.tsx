
import { 
  Search,
  Settings,
  ClipboardList,
  RefreshCcw, 
  DollarSign,
  TrendingUp,
  Compass,
  Shield
} from "lucide-react";
import React from "react";
import { useLanguage } from "@/context/LanguageContext";

export interface FeatureItem {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export const useFeatureItems = (): FeatureItem[] => {
  const { language } = useLanguage();
  
  // French feature items
  const features: FeatureItem[] = [
    {
      title: "Prospection automatisée et ciblée",
      description:
        "L'agent identifie automatiquement les bons profils à contacter en fonction de ton secteur, de tes mots-clés ou des entreprises que tu vises.",
      icon: <Search className="w-6 h-6" />,
    },
    {
      title: "Données enrichies instantanément",
      description:
        "Pour chaque prospect, tu obtiens les informations essentielles : email pro, téléphone, rôle actuel, entreprise — prêtes à l'emploi.",
      icon: <Settings className="w-6 h-6" />,
    },
    {
      title: "Interface de gestion simplifiée",
      description:
        "Tu accèdes à une interface claire pour suivre chaque contact : statut commercial, actions passées, prochaines étapes.",
      icon: <ClipboardList className="w-6 h-6" />,
    },
    {
      title: "Zéro tâche manuelle",
      description: "Tu ne passes plus des heures à chercher, copier-coller ou organiser. Tout est automatisé, du ciblage jusqu'au suivi.",
      icon: <RefreshCcw className="w-6 h-6" />,
    },
    {
      title: "Gain de temps & baisse du coût par lead",
      description: "Tu obtiens des leads qualifiés à un coût bien inférieur à une prospection manuelle ou à une équipe SDR classique.",
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: "Scalable dès le premier jour",
      description:
        "Tu veux 50, 100 ou 500 leads par mois ? Tu ajustes le volume sans délai, sans recrutement, sans friction.",
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: "Suivi commercial intégré",
      description:
        "Chaque lead est suivi dans le temps, avec des statuts clairs et un historique d'actions. Tu ne laisses plus passer aucune opportunité.",
      icon: <Compass className="w-6 h-6" />,
    },
    {
      title: "Confidentialité garantie",
      description: "Toutes les données restent confidentielles et sécurisées. Tu gardes la main sur tes prospects, sans exposition extérieure.",
      icon: <Shield className="w-6 h-6" />,
    },
  ];
  
  return features;
};
