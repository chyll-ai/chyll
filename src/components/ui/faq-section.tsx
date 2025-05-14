
"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  // FAQ items en français
  const faqItems = [
    {
      question: "📈 Quel type de résultats puis-je attendre ?",
      answer: "Nos utilisateurs constatent en moyenne : Un temps de prospection divisé par 5, une baisse significative du coût par lead, une meilleure priorisation des prospects réellement activables."
    },
    {
      question: "🔄 Est-ce que les leads sont mis à jour automatiquement ?",
      answer: "Oui. chyll.ai met à jour votre base chaque semaine, en évitant les doublons, en détectant les nouveaux contacts intéressants, et en maintenant un suivi à jour."
    },
    {
      question: "🤖 Est-ce que c'est un chatbot ou un outil de messagerie ?",
      answer: "Non. chyll.ai n'écrit pas aux leads à votre place. C'est un outil d'aide à la prospection, pas un outil d'email automation. Il vous fournit des leads enrichis, organisés, et suivis — à vous de décider comment les contacter."
    },
    {
      question: "👥 À qui s'adresse chyll.ai ?",
      answer: "chyll.ai est conçu pour : Les fondateurs de startups, les freelances en B2B, les commerciaux en PME ou agences, les équipes marketing/growth qui veulent gagner du temps et scaler sans recruter."
    },
    {
      question: "💼 Combien de leads puis-je recevoir par mois ?",
      answer: "Le volume dépend de votre plan. Nos offres commencent à 50 leads enrichis/mois, et sont adaptables à vos besoins selon votre rythme de prospection."
    },
    {
      question: "🔐 Mes données sont-elles sécurisées ?",
      answer: "Oui. Votre espace est isolé, protégé, et aucune donnée n'est partagée ou exposée à des tiers. Vous gardez le contrôle complet sur vos contacts."
    },
    {
      question: "💳 Comment s'abonner ?",
      answer: "Il vous suffit de remplir notre formulaire de qualification pour vérifier votre éligibilité. Une fois validé, vous accédez à votre espace personnalisé et commencez à recevoir vos leads."
    }
  ];
  
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
