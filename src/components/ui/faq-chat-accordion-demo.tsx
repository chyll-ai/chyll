
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { useLanguage } from "@/context/LanguageContext";

function DefaultDemo() {
  const { language, t } = useLanguage();
  
  const defaultData = [
    {
      answer: "Our AI Employees are advanced, specialized digital workers designed to handle specific business tasks 24/7. Each AI Employee is trained to perform unique roles like customer service, content creation, sales support, and more - transforming how businesses operate by providing constant, high-quality support.",
      icon: "🤖",
      iconPosition: "right" as const,
      id: 1,
      question: "What are AI Employees and how can they help my business?",
    },
    {
      answer: "Absolutely not! Our AI Employees are designed to be user-friendly and intuitive. They seamlessly integrate into your existing workflows, requiring minimal technical expertise. Our team provides comprehensive onboarding and support to help you maximize their potential.",
      id: 2,
      question: "Do I need technical skills to use AI Employees?",
    },
    {
      answer: "Most businesses can onboard their first AI Employee within days. We provide a white-glove implementation process, working closely with you to understand your specific needs and customize the AI Employee's capabilities accordingly.",
      id: 3,
      question: "How quickly can I implement an AI Employee?",
    },
    {
      answer: "Yes! Our AI Employees are built to integrate smoothly with popular business tools including CRMs, communication platforms, project management systems, and more. Custom integrations are also available to ensure a perfect fit for your business ecosystem.",
      icon: "⚙️",
      iconPosition: "left" as const,
      id: 4,
      question: "Can AI Employees integrate with my existing tools and systems?",
    },
    {
      answer: "We offer comprehensive support across different plans. This includes initial setup, ongoing training, performance optimization, and dedicated support channels. Our goal is to ensure your AI Employees continuously improve and deliver maximum value.",
      id: 5,
      question: "What kind of support do you provide for AI Employees?",
    },
    {
      answer: "Data security is our top priority. Each AI Employee operates with enterprise-grade encryption, follows strict data protection protocols, and is designed with multiple layers of security. We provide transparency in data handling and can customize security measures to meet your specific compliance requirements.",
      icon: "🔒",
      iconPosition: "right" as const,
      id: 6,
      question: "How secure are AI Employees with my business data?",
    },
  ];
  
  // Check if French FAQ translations are available
  const hasFrenchFaqItems = language === 'fr' && t.faq && 'aiEmployees' in t.faq && t.faq.aiEmployees && 'items' in t.faq.aiEmployees;
  
  // Use French translations if available
  const frenchItems = hasFrenchFaqItems 
    ? t.faq.aiEmployees.items.map((item, index) => ({
        answer: item.answer,
        icon: index === 0 ? "🤖" : index === 3 ? "⚙️" : index === 5 ? "🔒" : undefined,
        iconPosition: index === 0 || index === 5 ? "right" as const : index === 3 ? "left" as const : undefined,
        id: index + 1,
        question: item.question,
      }))
    : defaultData;

  return (
    <FaqAccordion 
      data={frenchItems || defaultData}
      className="max-w-[700px]"
      timestamp={language === 'fr' ? "Dernière mise à jour : Avril 2025" : "Last updated: April 2025"}
    />
  );
}

function CustomStyleDemo() {
  return (
    <FaqAccordion 
      data={defaultData}
      className="max-w-[700px]"
      questionClassName="bg-secondary hover:bg-secondary/80"
      answerClassName="bg-secondary text-secondary-foreground"
      timestamp="Updated daily at 12:00 PM"
    />
  );
}

export { DefaultDemo, CustomStyleDemo };

// Default data for reference
const defaultData = [
  {
    answer: "Our AI Employees are advanced, specialized digital workers designed to handle specific business tasks 24/7. Each AI Employee is trained to perform unique roles like customer service, content creation, sales support, and more - transforming how businesses operate by providing constant, high-quality support.",
    icon: "🤖",
    iconPosition: "right" as const,
    id: 1,
    question: "What are AI Employees and how can they help my business?",
  },
  {
    answer: "Absolutely not! Our AI Employees are designed to be user-friendly and intuitive. They seamlessly integrate into your existing workflows, requiring minimal technical expertise. Our team provides comprehensive onboarding and support to help you maximize their potential.",
    id: 2,
    question: "Do I need technical skills to use AI Employees?",
  },
  {
    answer: "Most businesses can onboard their first AI Employee within days. We provide a white-glove implementation process, working closely with you to understand your specific needs and customize the AI Employee's capabilities accordingly.",
    id: 3,
    question: "How quickly can I implement an AI Employee?",
  },
  {
    answer: "Yes! Our AI Employees are built to integrate smoothly with popular business tools including CRMs, communication platforms, project management systems, and more. Custom integrations are also available to ensure a perfect fit for your business ecosystem.",
    icon: "⚙️",
    iconPosition: "left" as const,
    id: 4,
    question: "Can AI Employees integrate with my existing tools and systems?",
  },
  {
    answer: "We offer comprehensive support across different plans. This includes initial setup, ongoing training, performance optimization, and dedicated support channels. Our goal is to ensure your AI Employees continuously improve and deliver maximum value.",
    id: 5,
    question: "What kind of support do you provide for AI Employees?",
  },
  {
    answer: "Data security is our top priority. Each AI Employee operates with enterprise-grade encryption, follows strict data protection protocols, and is designed with multiple layers of security. We provide transparency in data handling and can customize security measures to meet your specific compliance requirements.",
    icon: "🔒",
    iconPosition: "right" as const,
    id: 6,
    question: "How secure are AI Employees with my business data?",
  },
];
