
"use client";

import DisplayCards from "@/components/ui/display-cards";
import { Zap, Mic, TrendingUp, Rocket, Bot, MessageCircle } from "lucide-react";

const featuresCards = [
  {
    icon: <Zap className="size-4 text-yellow-300" />,
    title: "NAPOLEON, L'AUTOMATISATION IA",
    description: "Automatisez les tâches répétitives",
    date: "Gagnez 20+ heures/semaine",
    iconClassName: "text-yellow-500",
    titleClassName: "text-yellow-500",
    className:
      "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Mic className="size-4 text-blue-300" />,
    title: "BASTIEN, LES APPELS VOCAUX",
    description: "Assistant vocal propulsé par IA",
    date: "Disponibilité 24/7",
    iconClassName: "text-blue-500",
    titleClassName: "text-blue-500",
    className:
      "[grid-area:stack] translate-x-12 translate-y-10 hover:-translate-y-1 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Rocket className="size-4 text-purple-300" />,
    title: "VOLTAIRE, LE CRÉATEUR DE FLUX",
    description: "Créez des workflows personnalisés",
    date: "Sans programmation requise",
    iconClassName: "text-purple-500",
    titleClassName: "text-purple-500",
    className:
      "[grid-area:stack] translate-x-24 translate-y-20 hover:translate-y-10",
  },
  {
    icon: <TrendingUp className="size-4 text-green-300" />,
    title: "LOUIS, L'AVANTAGE COMPÉTITIF",
    description: "Gardez une longueur d'avance",
    date: "Avantage sur le marché",
    iconClassName: "text-green-500",
    titleClassName: "text-green-500",
    className:
      "[grid-area:stack] translate-x-36 translate-y-30 hover:translate-y-20 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <Bot className="size-4 text-indigo-300" />,
    title: "MARIE, L'INTÉGRATION CHATBOT",
    description: "Solutions chatbot personnalisées",
    date: "Réponse instantanée",
    iconClassName: "text-indigo-500",
    titleClassName: "text-indigo-500",
    className:
      "[grid-area:stack] translate-x-48 translate-y-40 hover:translate-y-30 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration:700 hover:grayscale-0 before:left-0 before:top-0",
  },
  {
    icon: <MessageCircle className="size-4 text-red-300" />,
    title: "JEAN, LE SUPPORT MULTI-CANAL",
    description: "Support sur toutes plateformes",
    date: "Intégration transparente",
    iconClassName: "text-red-500",
    titleClassName: "text-red-500",
    className:
      "[grid-area:stack] translate-x-60 translate-y-50 hover:translate-y-40",
  },
];

function DisplayCardsDemo() {
  return (
    <div className="flex min-h-[500px] w-full items-center justify-center py-20">
      <div className="w-full max-w-3xl">
        <DisplayCards cards={featuresCards} />
      </div>
    </div>
  );
}

export { DisplayCardsDemo };
