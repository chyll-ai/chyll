
import {
  Phone,
  MessageSquare,
  Users,
  Mail,
  FileText,
  LineChart
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";
import { useLanguage } from '@/context/LanguageContext';

function BentoDemo() {
  const { language } = useLanguage();
  
  const features = [
    {
      Icon: LineChart,
      name: "NAPOLEON — L'Agent Commercial IA",
      description: "Prospection acharnée, entièrement automatisée. Napoleon chasse les leads, les qualifie, fait le suivi et remplit votre pipeline commercial — comme un soldat commercial infatigable.",
      href: "/",
      cta: "Déployer NAPOLEON",
      background: <div className="absolute -right-20 -top-20 bg-blue-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
    },
    {
      Icon: Users,
      name: "TALIE — La Recruteuse Révolutionnaire",
      description: "Trouvez les meilleurs talents, plus rapidement que jamais. Talie déniche des candidats exceptionnels, envoie des messages personnalisés et fait une sélection selon vos critères — recrutement en pilote automatique.",
      href: "/",
      cta: "Déployer Talie",
      background: <div className="absolute -right-20 -top-20 bg-purple-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: MessageSquare,
      name: "JULIENNE — L'Experte en Communauté",
      description: "Engagement et modération 24/7. Julienne gère vos communautés en ligne, répond aux commentaires, publie des mises à jour et maintient la conversation — avec grâce et cohérence.",
      href: "/",
      cta: "Déployer Julienne",
      background: <div className="absolute -right-20 -top-20 bg-yellow-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: Phone,
      name: "BASTIEN — L'Agent Vocal",
      description: "Ne ratez plus jamais un appel. Bastien répond aux appels téléphoniques comme un réceptionniste virtuel, collecte les informations clés, planifie les rendez-vous et qualifie les appelants en langage naturel.",
      href: "/",
      cta: "Déployer Bastien",
      background: <div className="absolute -right-20 -top-20 bg-green-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Mail,
      name: "LAFAYETTE — Le Stratège Email",
      description: "Des emails qui convertissent — sans avoir besoin de rédacteur. Lafayette rédige des emails de prospection et de relance convaincants, personnalise chaque message et les déclenche au bon moment.",
      href: "/",
      cta: "Déployer Lafayette",
      background: <div className="absolute -right-20 -top-20 bg-indigo-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: FileText,
      name: "VOLTAIRE — L'Architecte de Contenu",
      description: "Du contenu intelligent, dans votre ton et votre style. Voltaire rédige vos articles de blog, légendes de réseaux sociaux, campagnes email et visuels — transformant vos idées en actifs magnifiquement conçus.",
      href: "/",
      cta: "Déployer Voltaire",
      background: <div className="absolute -right-20 -top-20 bg-red-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4",
    },
  ];

  return (
    <BentoGrid className="lg:grid-rows-3">
      {features.map((feature) => (
        <BentoCard key={feature.name} {...feature} />
      ))}
    </BentoGrid>
  );
}

export { BentoDemo };
