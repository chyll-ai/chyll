
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { useLanguage } from "@/context/LanguageContext";

function DefaultDemo() {
  const { language, t } = useLanguage();
  
  const defaultData = [
    {
      answer: "chyll.ai trouve les bons prospects, les enrichit, et met à jour ton CRM pendant que tu bosses sur autre chose. Il identifie automatiquement les bons profils à contacter en fonction de ton secteur, de tes mots-clés ou des entreprises que tu vises.",
      icon: "🤖",
      iconPosition: "right" as const,
      id: 1,
      question: "Comment chyll.ai trouve-t-il des prospects ?",
    },
    {
      answer: "Une fois les prospects identifiés, chyll.ai utilise des technologies avancées pour enrichir les profils avec des emails professionnels, des numéros de téléphone et d'autres informations pertinentes, tout en respectant la réglementation sur la protection des données.",
      id: 2,
      question: "Comment se fait l'enrichissement des données ?",
    },
    {
      answer: "Toutes les données sont automatiquement organisées dans une interface CRM simple basée sur Airtable. Tu reçois un tableau de bord personnalisé, accessible à tout moment, que tu peux facilement partager avec ton équipe.",
      id: 3,
      question: "Comment puis-je accéder aux données de mes prospects ?",
    },
    {
      answer: "chyll.ai s'intègre nativement avec Airtable pour le CRM. Nous pouvons également configurer des connexions avec d'autres outils CRM populaires, des plateformes de communication, ou des systèmes de gestion de projet sur demande.",
      icon: "⚙️",
      iconPosition: "left" as const,
      id: 4,
      question: "Quelles intégrations sont disponibles ?",
    },
    {
      answer: "Nous offrons un support complet pour tous nos plans. Cela inclut la configuration initiale, des ajustements continus, et des canaux de support dédiés. Notre objectif est de garantir que ton agent chyll.ai génère un maximum de valeur pour ton entreprise.",
      id: 5,
      question: "Quel type de support est inclus ?",
    },
    {
      answer: "Oui ! Tu définis exactement les critères que tu souhaites cibler : secteurs d'activité, taille d'entreprise, fonctions, localisation, etc. L'agent s'adapte parfaitement à tes besoins spécifiques de prospection.",
      icon: "🔒",
      iconPosition: "right" as const,
      id: 6,
      question: "Puis-je personnaliser les critères de recherche ?",
    },
  ];
  
  // Check if French FAQ translations are available
  const hasFrenchFaqItems = language === 'fr' && t.faq?.aiEmployees?.items !== undefined;
  
  // Use French translations if available
  const frenchItems = hasFrenchFaqItems 
    ? t.faq?.aiEmployees?.items?.map((item, index) => ({
        answer: item.answer,
        icon: index === 0 ? "🤖" : index === 3 ? "⚙️" : index === 5 ? "🔒" : undefined,
        iconPosition: index === 0 || index === 5 ? "right" as const : index === 3 ? "left" as const : undefined,
        id: index + 1,
        question: item.question,
      }))
    : defaultData;
    
  // Get the last updated text
  const lastUpdated = language === 'fr' && t.faq?.lastUpdated 
    ? t.faq.lastUpdated 
    : "Last updated: May 2025";

  return (
    <FaqAccordion 
      data={frenchItems || defaultData}
      className="max-w-[700px]"
      timestamp={lastUpdated}
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
