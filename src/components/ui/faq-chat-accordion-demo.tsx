
import { FaqAccordion } from "@/components/ui/faq-chat-accordion";

function DefaultDemo() {
  // Données FAQ en français
  const frenchItems = [
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
  
  // Date de mise à jour
  const lastUpdated = "Dernière mise à jour : Mai 2025";

  return (
    <FaqAccordion 
      data={frenchItems}
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

// Données par défaut pour référence
const defaultData = [
  {
    answer: "Nos employés IA sont des travailleurs numériques avancés et spécialisés conçus pour gérer des tâches commerciales spécifiques 24h/24 et 7j/7. Chaque employé IA est formé pour remplir des rôles uniques comme le service client, la création de contenu, le support commercial, et plus encore - transformant ainsi le fonctionnement des entreprises en fournissant un support constant et de haute qualité.",
    icon: "🤖",
    iconPosition: "right" as const,
    id: 1,
    question: "Que sont les employés IA et comment peuvent-ils aider mon entreprise ?",
  },
  {
    answer: "Absolument pas ! Nos employés IA sont conçus pour être conviviaux et intuitifs. Ils s'intègrent parfaitement dans vos flux de travail existants, nécessitant un minimum d'expertise technique. Notre équipe fournit une intégration et un support complets pour vous aider à maximiser leur potentiel.",
    id: 2,
    question: "Ai-je besoin de compétences techniques pour utiliser les employés IA ?",
  },
  {
    answer: "La plupart des entreprises peuvent intégrer leur premier employé IA en quelques jours. Nous proposons un processus d'implémentation personnalisé, travaillant en étroite collaboration avec vous pour comprendre vos besoins spécifiques et personnaliser les capacités de l'employé IA en conséquence.",
    id: 3,
    question: "À quelle vitesse puis-je mettre en œuvre un employé IA ?",
  },
  {
    answer: "Oui ! Nos employés IA sont conçus pour s'intégrer facilement aux outils d'entreprise populaires, y compris les CRM, les plateformes de communication, les systèmes de gestion de projet, etc. Des intégrations personnalisées sont également disponibles pour garantir une adaptation parfaite à votre écosystème d'entreprise.",
    icon: "⚙️",
    iconPosition: "left" as const,
    id: 4,
    question: "Les employés IA peuvent-ils s'intégrer à mes outils et systèmes existants ?",
  },
  {
    answer: "Nous offrons un support complet pour différents forfaits. Cela comprend la configuration initiale, la formation continue, l'optimisation des performances et des canaux d'assistance dédiés. Notre objectif est de garantir que vos employés IA s'améliorent continuellement et offrent une valeur maximale.",
    id: 5,
    question: "Quel type de support fournissez-vous pour les employés IA ?",
  },
  {
    answer: "La sécurité des données est notre priorité absolue. Chaque employé IA fonctionne avec un chiffrement de niveau entreprise, suit des protocoles stricts de protection des données et est conçu avec plusieurs couches de sécurité. Nous assurons la transparence dans la gestion des données et pouvons personnaliser les mesures de sécurité pour répondre à vos exigences de conformité spécifiques.",
    icon: "🔒",
    iconPosition: "right" as const,
    id: 6,
    question: "Les employés IA sont-ils sécurisés avec mes données d'entreprise ?",
  },
];
