
"use client";

import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// FAQ items
const faqItems = [
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

export function FAQSection() {
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
