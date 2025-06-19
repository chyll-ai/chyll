
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
  
  // Updated FAQ items focused on chyll's B2B prospecting automation
  const defaultFaqItems = [
    {
      question: "🎯 Comment chyll automatise-t-il ma prospection B2B ?",
      answer: "chyll utilise l'IA pour identifier automatiquement les prospects qualifiés selon vos critères (secteur, taille d'entreprise, fonction). Il enrichit ensuite ces profils avec des emails professionnels vérifiés et des numéros de téléphone directs, puis synchronise tout dans votre CRM personnalisé."
    },
    {
      question: "📊 Quelles données puis-je obtenir sur mes prospects ?",
      answer: "Pour chaque prospect, chyll vous fournit : coordonnées complètes (email + téléphone), informations professionnelles détaillées, données sur l'entreprise, profils sociaux, historique professionnel, compétences, et bien plus - le tout enrichi automatiquement."
    },
    {
      question: "⚡ En combien de temps puis-je avoir mes premiers prospects ?",
      answer: "Votre assistant chyll est opérationnel en 48h maximum. Une fois configuré selon vos personas et critères, il commence immédiatement à identifier et enrichir vos prospects. Vous pouvez voir les premiers résultats dès les premières heures."
    },
    {
      question: "🔄 Comment fonctionne l'intégration avec mon CRM ?",
      answer: "chyll s'intègre nativement avec Airtable et peut se connecter à la plupart des CRM populaires. Tous vos prospects enrichis sont automatiquement organisés dans une interface claire, accessible 24/7, que vous pouvez partager avec votre équipe."
    },
    {
      question: "🎨 Puis-je personnaliser mes critères de recherche ?",
      answer: "Absolument ! Vous définissez précisément vos personas : secteurs d'activité, taille d'entreprise, fonctions ciblées, localisation, mots-clés spécifiques, etc. chyll s'adapte parfaitement à vos besoins de prospection spécifiques."
    },
    {
      question: "📈 Quel ROI puis-je espérer avec chyll ?",
      answer: "Nos clients constatent en moyenne : temps de prospection divisé par 5, taux de conversion augmenté de 40%, coût par lead réduit de 60%, et plus de temps pour se concentrer sur les conversations qui comptent vraiment."
    },
    {
      question: "🔐 Mes données prospects sont-elles sécurisées ?",
      answer: "Oui, totalement. Votre espace chyll est isolé et protégé. Aucune donnée n'est partagée avec des tiers. Vous gardez le contrôle complet sur vos prospects et pouvez exporter toutes vos données à tout moment."
    },
    {
      question: "💼 chyll remplace-t-il mon équipe commerciale ?",
      answer: "Non ! chyll automatise uniquement les tâches chronophages de recherche et d'enrichissement. Vous restez maître de la relation client : c'est vous qui décidez comment et quand contacter vos prospects. chyll vous fait gagner du temps, pas remplacer vos compétences."
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
