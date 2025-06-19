
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
  
  // Updated FAQ items focused on chyll as the future CRM with natural language
  const defaultFaqItems = [
    {
      question: "🎯 Comment chyll révolutionne-t-il la gestion de prospects ?",
      answer: "chyll est le CRM du futur qui utilise le langage naturel. Plus besoin d'apprendre des interfaces complexes : vous parlez à chyll comme à un assistant humain pour gérer vos prospects, lancer des recherches, et organiser votre pipeline commercial."
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
      question: "📊 Comment chyll organise-t-il mes données prospects ?",
      answer: "chyll structure automatiquement toutes vos données dans un CRM intelligent. Prospects enrichis, historique des interactions, statuts de suivi - tout est organisé de manière logique et accessible via des commandes en langage naturel."
    },
    {
      question: "🎨 Puis-je personnaliser chyll selon mes besoins ?",
      answer: "Absolument ! chyll apprend de vos préférences et s'adapte à votre workflow. Plus vous l'utilisez, plus il comprend vos habitudes et personnalise l'expérience selon votre méthode de prospection unique."
    },
    {
      question: "📈 Quel impact chyll a-t-il sur ma productivité commerciale ?",
      answer: "Nos clients rapportent une productivité multipliée par 10 : recherche de prospects instantanée, gestion simplifiée, suivi automatisé. chyll élimine la friction entre vous et vos données pour vous concentrer sur la vente."
    },
    {
      question: "🔐 Mes données sont-elles sécurisées avec chyll ?",
      answer: "Totalement. chyll utilise un chiffrement de niveau bancaire et respecte le RGPD. Vos données prospects restent privées et sécurisées dans votre espace personnel, accessible uniquement par vous et votre équipe."
    },
    {
      question: "💼 chyll peut-il remplacer complètement mon CRM actuel ?",
      answer: "Oui ! chyll est conçu pour être votre CRM principal. Plus besoin de jongler entre plusieurs outils : prospection, enrichissement, suivi, analyses - tout est centralisé dans une interface conversationnelle intuitive."
    }
  ];
  
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
