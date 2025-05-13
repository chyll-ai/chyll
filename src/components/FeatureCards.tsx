
import React from 'react';
import { 
  Search, Settings, ClipboardList, RefreshCcw, DollarSign, TrendingUp, Compass, Shield
} from 'lucide-react';

const features = [
  {
    title: "Recherche LinkedIn",
    starWarsName: "PROSPECTION AUTOMATISÉE",
    description: "L'agent identifie automatiquement les bons profils à contacter en fonction de ton secteur.",
    icon: Search,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Enrichissement de données",
    starWarsName: "DONNÉES ENRICHIES",
    description: "Obtiens emails professionnels, téléphones et informations essentielles de chaque prospect.",
    icon: Settings,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Interface simplifiée",
    starWarsName: "GESTION SIMPLE",
    description: "Interface claire pour suivre chaque contact : statut, actions passées, prochaines étapes.",
    icon: ClipboardList,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    title: "Automatisation complète",
    starWarsName: "ZÉRO TÂCHE MANUELLE",
    description: "Tu ne passes plus des heures à chercher ou organiser. Tout est automatisé de A à Z.",
    icon: RefreshCcw,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Coût optimisé",
    starWarsName: "ÉCONOMIES",
    description: "Leads qualifiés à un coût bien inférieur à une prospection manuelle ou équipe SDR classique.",
    icon: DollarSign,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Scalabilité immédiate",
    starWarsName: "VOLUME ADAPTABLE",
    description: "Ajuste le volume de leads sans délai, sans recrutement, sans friction.",
    icon: TrendingUp,
    color: "bg-red-50 text-red-600"
  }
];

const FeatureCards = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {features.map((feature, index) => (
        <div 
          key={index} 
          className="feature-card hover-lift"
        >
          <div className={`rounded-full w-12 h-12 flex items-center justify-center mb-4 ${feature.color}`}>
            <feature.icon className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {feature.starWarsName}
          </h3>
          <p className="text-gray-600">{feature.description}</p>
        </div>
      ))}
    </div>
  );
};

export default FeatureCards;
