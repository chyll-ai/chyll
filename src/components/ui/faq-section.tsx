
"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useLanguage } from '@/context/LanguageContext';

// FAQ items for English
const enFaqItems = [
  {
    question: "What is GenerativSchool and how can it help my business?",
    answer: "GenerativSchool is an AI-powered automation platform that helps businesses streamline workflows, handle customer communications, and scale operations. It combines advanced AI with intuitive tools to handle repetitive tasks, engage with customers, and provide data-driven insights."
  },
  {
    question: "Do I need technical skills to use GenerativSchool?",
    answer: "No technical skills required! GenerativSchool is designed to be user-friendly with a simple interface. Our onboarding team will help you set up your workflows and automations, and our documentation provides step-by-step guidance."
  },
  {
    question: "How long does it take to implement GenerativSchool?",
    answer: "Most businesses can get up and running with GenerativSchool in just a few days. The exact timeline depends on your specific needs, but our white-glove onboarding ensures a smooth and efficient implementation process."
  },
  {
    question: "Can GenerativSchool integrate with my existing tools and systems?",
    answer: "Yes! GenerativSchool seamlessly integrates with most popular business tools including CRMs, marketing platforms, payment processors, and communication tools. Our team can assist with custom integrations if needed."
  },
  {
    question: "What kind of support does GenerativSchool provide?",
    answer: "We offer multiple levels of support depending on your plan. All customers receive email support, while our Professional and Expert plans include faster response times, priority support, and scheduled strategy calls."
  },
  {
    question: "Is my data secure with GenerativSchool?",
    answer: "Absolutely. We take data security very seriously. GenerativSchool employs enterprise-grade encryption, regular security audits, and follows best practices for data protection. Our Expert plan includes additional security features like SSO authentication."
  }
];

// FAQ items for French
const frFaqItems = [
  {
    question: "Qu'est-ce que GenerativSchool et comment peut-il aider mon entreprise ?",
    answer: "GenerativSchool est une plateforme d'automatisation alimentée par l'IA qui aide les entreprises à rationaliser les flux de travail, à gérer les communications clients et à développer leurs opérations. Elle combine l'IA avancée avec des outils intuitifs pour gérer les tâches répétitives, interagir avec les clients et fournir des analyses basées sur les données."
  },
  {
    question: "Ai-je besoin de compétences techniques pour utiliser GenerativSchool ?",
    answer: "Aucune compétence technique n'est requise ! GenerativSchool est conçu pour être convivial avec une interface simple. Notre équipe d'intégration vous aidera à configurer vos flux de travail et vos automatisations, et notre documentation fournit des conseils étape par étape."
  },
  {
    question: "Combien de temps faut-il pour mettre en œuvre GenerativSchool ?",
    answer: "La plupart des entreprises peuvent commencer à utiliser GenerativSchool en quelques jours seulement. Le délai exact dépend de vos besoins spécifiques, mais notre processus d'intégration sur mesure garantit une mise en œuvre fluide et efficace."
  },
  {
    question: "GenerativSchool peut-il s'intégrer à mes outils et systèmes existants ?",
    answer: "Oui ! GenerativSchool s'intègre parfaitement à la plupart des outils commerciaux populaires, notamment les CRM, les plateformes marketing, les processeurs de paiement et les outils de communication. Notre équipe peut vous aider avec des intégrations personnalisées si nécessaire."
  },
  {
    question: "Quel type de support GenerativSchool fournit-il ?",
    answer: "Nous proposons plusieurs niveaux de support selon votre forfait. Tous les clients bénéficient d'un support par e-mail, tandis que nos forfaits Professionnel et Expert incluent des temps de réponse plus rapides, un support prioritaire et des appels stratégiques programmés."
  },
  {
    question: "Mes données sont-elles sécurisées avec GenerativSchool ?",
    answer: "Absolument. Nous prenons la sécurité des données très au sérieux. GenerativSchool utilise un chiffrement de niveau entreprise, des audits de sécurité réguliers et suit les meilleures pratiques en matière de protection des données. Notre forfait Expert comprend des fonctionnalités de sécurité supplémentaires comme l'authentification SSO."
  }
];

export function FAQSection() {
  const { language } = useLanguage();
  const faqItems = language === 'fr' ? frFaqItems : enFaqItems;
  
  return (
    <div className="w-full max-w-4xl mx-auto">
      <Accordion type="single" collapsible className="w-full">
        {faqItems.map((item, index) => (
          <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
            <AccordionTrigger className="text-lg font-medium text-gray-800 hover:text-brand-blue py-5">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="text-gray-600 pb-5">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
