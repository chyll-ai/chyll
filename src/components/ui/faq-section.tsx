
"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQSection() {
  const faqItems = [
    {
      question: "🎯 Comment chyll révolutionne-t-il la gestion commerciale ?",
      answer: "chyll est le CRM du futur qui utilise le langage naturel. Plus besoin d'apprendre des interfaces complexes : vous parlez à chyll comme à un assistant humain pour gérer vos prospects, enrichir vos données, et organiser votre pipeline commercial."
    },
    {
      question: "🤖 Qu'est-ce qui rend chyll différent des CRM traditionnels ?",
      answer: "Contrairement aux CRM classiques avec leurs interfaces rigides, chyll comprend le langage naturel. Dites simplement 'Trouve-moi des directeurs marketing dans la fintech parisienne' et chyll s'exécute. C'est la gestion commerciale réinventée pour l'ère de l'IA."
    },
    {
      question: "⚡ En combien de temps puis-je maîtriser chyll ?",
      answer: "Immédiatement ! Avec chyll, plus besoin de formation complexe. Vous lui parlez naturellement en français, comme vous le feriez avec un collègue. L'interface s'adapte à votre façon de travailler, pas l'inverse."
    },
    {
      question: "📊 Comment chyll enrichit-il mes données prospects ?",
      answer: "chyll enrichit automatiquement vos prospects avec des données premium : coordonnées vérifiées, informations professionnelles, données d'entreprise, le tout organisé intelligemment et accessible via des commandes en langage naturel."
    },
    {
      question: "🎨 Puis-je personnaliser chyll selon mes besoins ?",
      answer: "Absolument ! chyll apprend de vos préférences et s'adapte à votre workflow commercial. Plus vous l'utilisez, plus il comprend vos habitudes et personnalise l'expérience selon votre méthode de prospection unique."
    },
    {
      question: "📈 Quel impact chyll a-t-il sur ma productivité commerciale ?",
      answer: "Nos clients rapportent une productivité multipliée par 10 : recherche de prospects instantanée, enrichissement automatique, gestion simplifiée. chyll élimine la friction entre vous et vos données pour vous concentrer sur la vente."
    },
    {
      question: "🔐 Mes données sont-elles sécurisées avec chyll ?",
      answer: "Totalement. chyll utilise un chiffrement de niveau bancaire et respecte le RGPD. Vos données prospects restent privées et sécurisées dans votre espace personnel, accessible uniquement par vous et votre équipe."
    },
    {
      question: "💼 chyll peut-il remplacer complètement mon CRM actuel ?",
      answer: "Oui ! chyll est conçu pour être votre CRM principal du futur. Plus besoin de jongler entre plusieurs outils : prospection, enrichissement, suivi, analyses - tout est centralisé dans une interface conversationnelle intuitive."
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
