
"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from '@/context/LanguageContext';

export function FAQSection() {
  const { language, t } = useLanguage();
  
  // Default FAQ items for the homepage
  const defaultFaqItems = [
    {
      question: "📈 Quel type de résultats puis-je attendre ?",
      answer: "Nos utilisateurs constatent en moyenne : Un temps de prospection divisé par 5, une baisse significative du coût par lead, une meilleure priorisation des prospects réellement activables."
    },
    {
      question: "🔍 Comment utiliser efficacement les personas LinkedIn ?",
      answer: "Nos personas vous permettent de définir précisément votre cible idéale selon le poste, l'industrie, la taille d'entreprise et d'autres critères pertinents. Vous pouvez créer autant de personas que nécessaire pour vos différentes campagnes."
    },
    {
      question: "📱 Comment sont actualisées les données de contact ?",
      answer: "Selon votre forfait, nous mettons à jour les informations quotidiennement ou en temps réel, garantissant que vous travaillez toujours avec les contacts les plus récents et précis pour votre prospection."
    },
    {
      question: "🤖 Est-ce que c'est un chatbot ou un outil de messagerie ?",
      answer: "Non. chyll n'écrit pas aux leads à votre place. C'est un outil d'aide à la prospection, pas un outil d'email automation. Il vous fournit des leads enrichis, organisés, et suivis — à vous de décider comment les contacter."
    },
    {
      question: "👥 À qui s'adresse chyll ?",
      answer: "chyll est conçu pour : Les fondateurs de startups, les freelances en B2B, les commerciaux en PME ou agences, les équipes marketing/growth qui veulent gagner du temps et scaler sans recruter."
    },
    {
      question: "💼 Combien de contacts puis-je générer par mois ?",
      answer: "Le volume dépend de votre forfait : 50 contacts par mois avec Starter, 100 avec Growth et 200 avec Scale. Chaque contact comprend à la fois un email vérifié et un numéro de téléphone direct."
    },
    {
      question: "🔐 Mes données sont-elles sécurisées ?",
      answer: "Oui. Votre espace est isolé, protégé, et aucune donnée n'est partagée ou exposée à des tiers. Vous gardez le contrôle complet sur vos contacts."
    },
    {
      question: "💳 Comment s'abonner ?",
      answer: "Il vous suffit de démarrer l'essai gratuit de 14 jours. Notre équipe vous accompagnera dans la configuration de vos personas et la mise en place de votre interface CRM personnalisée."
    }
  ];
  
  // Use the default FAQ items
  const faqItems = defaultFaqItems;
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-0">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
            <AccordionTrigger className="text-base sm:text-lg font-medium text-gray-800 hover:text-brand-blue py-4 sm:py-5 text-left">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-4 sm:pb-5">
              <div className="text-sm sm:text-base">{item.answer}</div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
