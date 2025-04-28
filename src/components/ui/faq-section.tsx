
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
  
  // Use the translations from the language context
  const faqItems = language === 'fr' 
    ? t.faq.general.items 
    : [
        {
          question: "What are AI Employees and how can they help my business?",
          answer: "AI Employees are artificial intelligence assistants that can automate repetitive tasks, handle customer communications, analyze data, and more. They help you save time and resources while improving operational efficiency."
        },
        {
          question: "Do I need technical skills to use AI Employees?",
          answer: "No technical skills are required. Our platform is designed to be user-friendly with an intuitive interface. Our onboarding team will guide you through the setup process."
        },
        {
          question: "How quickly can I implement an AI Employee?",
          answer: "Implementing an AI Employee typically only takes a few days. We handle the setup and integration for you, ensuring a fast and hassle-free deployment."
        },
        {
          question: "Can AI Employees integrate with my existing tools and systems?",
          answer: "Yes, our AI Employees seamlessly integrate with most popular business tools, including CRMs, marketing platforms, ticketing systems, and other business software."
        },
        {
          question: "What kind of support do you provide for AI Employees?",
          answer: "We offer comprehensive support, including onboarding, training, ongoing technical assistance, and regular optimizations to ensure your AI Employee is operating at peak performance."
        },
        {
          question: "How secure are AI Employees with my business data?",
          answer: "Absolutely secure. We take security very seriously with enterprise-grade encryption, regular security audits, and strict compliance with data protection regulations."
        }
      ];
  
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
