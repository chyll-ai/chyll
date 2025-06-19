
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";
import { useLanguage } from "@/context/LanguageContext";

function DefaultDemo() {
  const { language, t } = useLanguage();
  
  // Updated data focused on chyll as the future CRM with natural language
  const defaultData = [
    {
      answer: "chyll utilise l'intelligence artificielle conversationnelle pour comprendre vos demandes en langage naturel. Dites simplement ce que vous voulez : 'Trouve des prospects dans la tech' ou 'Montre-moi les leads chauds', et chyll exécute instantanément.",
      icon: "🤖",
      iconPosition: "right" as const,
      id: 1,
      question: "Comment fonctionne le CRM en langage naturel de chyll ?",
    },
    {
      answer: "chyll enrichit automatiquement vos prospects avec des données premium : coordonnées vérifiées, informations professionnelles, données d'entreprise, tout en maintenant une base de données structurée et accessible via conversation.",
      id: 2,
      question: "Comment chyll enrichit-il les données prospects ?",
    },
    {
      answer: "Votre CRM chyll est accessible 24/7 via une interface conversationnelle. Posez des questions, lancez des recherches, consultez vos statistiques - tout se fait en parlant naturellement à votre assistant commercial IA.",
      id: 3,
      question: "Comment accéder à mes données dans chyll ?",
    },
    {
      answer: "chyll est votre CRM principal, pas une intégration. Nous avons conçu l'expérience CRM du futur : plus d'interfaces complexes, juste des conversations naturelles pour gérer votre pipeline commercial efficacement.",
      icon: "⚙️",
      iconPosition: "left" as const,
      id: 4,
      question: "chyll s'intègre-t-il à mon CRM existant ?",
    },
    {
      answer: "Nous offrons un accompagnement complet pour migrer vers chyll : transfert de données, formation à l'approche conversationnelle, optimisation de vos workflows, et support continu pour maximiser vos résultats commerciaux.",
      id: 5,
      question: "Quel accompagnement pour adopter chyll ?",
    },
    {
      answer: "chyll apprend de vos préférences et s'adapte à votre style commercial. Plus vous l'utilisez, plus il comprend vos habitudes et personnalise l'expérience selon vos besoins spécifiques de prospection.",
      icon: "🔒",
      iconPosition: "right" as const,
      id: 6,
      question: "chyll peut-il s'adapter à ma façon de travailler ?",
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

// Updated default data for chyll as the future CRM
const defaultData = [
  {
    answer: "chyll is the future of CRM - a conversational AI that understands natural language. Simply tell chyll what you need: 'Find tech prospects in Paris' or 'Show me hot leads', and it executes instantly without complex interfaces.",
    icon: "🤖",
    iconPosition: "right" as const,
    id: 1,
    question: "How does chyll's natural language CRM work?",
  },
  {
    answer: "Not at all! chyll eliminates the learning curve of traditional CRMs. You simply talk to it naturally, and it understands and executes your requests. No training, no complex menus - just conversation.",
    id: 2,
    question: "Do I need to learn complex CRM software with chyll?",
  },
  {
    answer: "Immediately! Unlike traditional CRMs that take weeks to master, chyll works from day one. Start having conversations about your prospects and sales pipeline instantly - the AI handles the complexity.",
    id: 3,
    question: "How quickly can I be productive with chyll?",
  },
  {
    answer: "chyll IS your CRM - we're not an integration, we're the replacement. We've built the next generation of customer relationship management using conversational AI instead of outdated interfaces.",
    icon: "⚙️",
    iconPosition: "left" as const,
    id: 4,
    question: "Does chyll integrate with existing CRM systems?",
  },
  {
    answer: "We provide complete migration support: data transfer from your old CRM, training on conversational workflows, and ongoing optimization to ensure chyll becomes your team's preferred way to manage prospects.",
    id: 5,
    question: "What support do you provide for CRM migration?",
  },
  {
    answer: "Absolutely. chyll learns your preferences and adapts to your sales style. The more you use it, the better it understands your workflow and personalizes the experience to match your unique approach.",
    icon: "🔒",
    iconPosition: "right" as const,
    id: 6,
    question: "Can chyll adapt to my specific sales process?",
  },
];
