
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { useLanguage } from "@/context/LanguageContext";

function DefaultDemo() {
  const { language, t } = useLanguage();
  
  // Updated data focused on chyll's AI prospecting capabilities
  const defaultData = [
    {
      answer: "chyll utilise des algorithmes d'IA avancés pour scanner LinkedIn et d'autres sources de données professionnelles. Il identifie automatiquement les profils correspondant à vos personas et critères de ciblage, puis enrichit ces données avec des informations de contact vérifiées.",
      icon: "🤖",
      iconPosition: "right" as const,
      id: 1,
      question: "Comment l'IA de chyll trouve-t-elle des prospects qualifiés ?",
    },
    {
      answer: "chyll utilise plusieurs sources de données premium pour enrichir vos prospects : bases de données B2B, APIs de validation d'emails, réseaux sociaux professionnels, et données publiques d'entreprises. Tout est vérifié en temps réel pour garantir la qualité.",
      id: 2,
      question: "D'où proviennent les données d'enrichissement ?",
    },
    {
      answer: "Votre interface CRM personnalisée est accessible 24/7 via un tableau de bord sécurisé. Vous pouvez filtrer, trier, exporter vos prospects, suivre leur statut, et partager l'accès avec votre équipe. L'interface est intuitive et ne nécessite aucune formation technique.",
      id: 3,
      question: "Comment accéder à mes données prospects enrichies ?",
    },
    {
      answer: "chyll s'intègre nativement avec Airtable pour le CRM. Nous proposons aussi des connexions avec Salesforce, HubSpot, Pipedrive, et d'autres CRM populaires. Des intégrations personnalisées sont possibles selon vos besoins spécifiques.",
      icon: "⚙️",
      iconPosition: "left" as const,
      id: 4,
      question: "Quelles intégrations CRM sont disponibles ?",
    },
    {
      answer: "Nous offrons un support complet incluant : configuration initiale personnalisée, formation de l'équipe, optimisation continue des performances, support technique réactif, et un accompagnement dédié pour maximiser votre ROI avec chyll.",
      id: 5,
      question: "Quel accompagnement proposez-vous ?",
    },
    {
      answer: "Oui ! Vous pouvez cibler précisément par : secteur d'activité, taille d'entreprise (CA, nombre d'employés), fonction/titre, localisation géographique, technologies utilisées, mots-clés LinkedIn, et bien d'autres critères selon vos besoins.",
      icon: "🔒",
      iconPosition: "right" as const,
      id: 6,
      question: "Puis-je personnaliser finement mes critères de ciblage ?",
    },
  ];
  
  // Check if French FAQ translations are available
  const hasFrenchFaqItems = language === 'fr' && t.faq?.aiEmployees?.items !== undefined;
  
  // Use French translations if available, otherwise use updated default data
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
    : "Dernière mise à jour : Juin 2025";

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

// Updated default data for chyll's B2B prospecting focus
const defaultData = [
  {
    answer: "chyll's AI prospecting system automatically identifies and enriches qualified B2B leads based on your specific criteria. It scans professional networks, validates contact information, and organizes everything in your personalized CRM - transforming how businesses approach lead generation.",
    icon: "🤖",
    iconPosition: "right" as const,
    id: 1,
    question: "How does chyll's AI prospecting work for my business?",
  },
  {
    answer: "Not at all! chyll is designed to be user-friendly and integrates seamlessly into your existing sales workflow. Our team provides comprehensive setup and training to help you maximize lead generation results from day one.",
    id: 2,
    question: "Do I need technical skills to use chyll's prospecting tools?",
  },
  {
    answer: "Most businesses can have their chyll AI assistant operational within 48 hours. We handle the complete setup process, including persona configuration and CRM integration, so you can start generating qualified leads immediately.",
    id: 3,
    question: "How quickly can I start generating leads with chyll?",
  },
  {
    answer: "Yes! chyll integrates natively with Airtable and connects with popular CRMs like Salesforce, HubSpot, and Pipedrive. Custom integrations are available to ensure perfect alignment with your existing sales tech stack.",
    icon: "⚙️",
    iconPosition: "left" as const,
    id: 4,
    question: "Does chyll integrate with my existing CRM and sales tools?",
  },
  {
    answer: "We provide comprehensive support including initial setup, persona optimization, performance monitoring, and dedicated account management. Our goal is to ensure chyll continuously delivers high-quality prospects and maximizes your sales ROI.",
    id: 5,
    question: "What support do you provide for lead generation optimization?",
  },
  {
    answer: "Data security is paramount. Your prospect data is completely isolated and protected with enterprise-grade encryption. We follow strict data protection protocols and you maintain full control over your leads with export capabilities at any time.",
    icon: "🔒",
    iconPosition: "right" as const,
    id: 6,
    question: "How secure is my prospect data with chyll?",
  },
];
