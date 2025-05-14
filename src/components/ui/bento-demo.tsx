
import {
  Phone,
  MessageSquare,
  Users,
  Mail,
  FileText,
  LineChart
} from "lucide-react";

import { BentoCard, BentoGrid } from "@/components/ui/bento-grid";

function BentoDemo() {
  const features = [
    {
      Icon: LineChart,
      name: "NAPOLEON — L'IA SDR",
      description: "Prospection automatique et sans relâche. Napoleon trouve des prospects, les qualifie, effectue le suivi et remplit votre pipeline commercial — comme un soldat commercial infatigable.",
      href: "/",
      cta: "Déployer NAPOLEON",
      background: <div className="absolute -right-20 -top-20 bg-blue-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:row-start-1 lg:row-end-3 lg:col-start-1 lg:col-end-2",
    },
    {
      Icon: Users,
      name: "TALIE — La Recruteuse Révolutionnaire",
      description: "Trouvez les meilleurs talents, plus rapidement que jamais. Talie repère des candidats exceptionnels, envoie des messages personnalisés et les présélectionne selon vos critères — recrutement en pilote automatique.",
      href: "/",
      cta: "Déployer Talie",
      background: <div className="absolute -right-20 -top-20 bg-purple-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-2 lg:col-end-3 lg:row-start-1 lg:row-end-3",
    },
    {
      Icon: MessageSquare,
      name: "JULIENNE — L'Experte en Communauté",
      description: "Engagement et modération 24/7. Julienne gère vos communautés en ligne, répond aux commentaires, publie des mises à jour et maintient la conversation fluide — avec grâce et constance.",
      href: "/",
      cta: "Déployer Julienne",
      background: <div className="absolute -right-20 -top-20 bg-yellow-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2",
    },
    {
      Icon: Phone,
      name: "BASTIEN — L'Agent Vocal",
      description: "Ne manquez plus jamais un appel. Bastien répond aux appels téléphoniques comme un réceptionniste virtuel, recueille des informations clés, planifie des rendez-vous et qualifie les appelants en langage naturel.",
      href: "/",
      cta: "Déployer Bastien",
      background: <div className="absolute -right-20 -top-20 bg-green-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: Mail,
      name: "LAFAYETTE — Le Stratège des Emails",
      description: "Des emails qui convertissent — sans rédacteur. Lafayette élabore des emails de prospection et de suivi convaincants, personnalise chaque message et les déclenche au bon moment.",
      href: "/",
      cta: "Déployer Lafayette",
      background: <div className="absolute -right-20 -top-20 bg-indigo-100 rounded-full w-64 h-64 blur-3xl opacity-40" />,
      className: "lg:col-start-2 lg:col-end-3 lg:row-start-3 lg:row-end-4",
    },
    {
      Icon: FileText,
      name: "VOLTAIRE — L'Architecte de Contenu",
      description: "Du contenu intelligent, dans votre ton et style. Voltaire rédige vos articles de blog, légendes pour les réseaux sociaux, campagnes d'emails et visuels — transformant vos idées en ressources magnifiquement élaborées.",
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
