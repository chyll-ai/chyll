
import React from 'react';
import { 
  Search, Mail, CreditCard, LineChart, Users, Database
} from 'lucide-react';

const features = [
  {
    title: "Recherche LinkedIn",
    starWarsName: "RECHERCHE AUTOMATISÉE",
    description: "Trouve les prospects sur LinkedIn via mots-clés ou entreprises ciblées",
    icon: Search,
    color: "bg-blue-50 text-blue-600"
  },
  {
    title: "Enrichissement de données",
    starWarsName: "ENRICHISSEMENT",
    description: "Obtiens emails professionnels et numéros des prospects identifiés",
    icon: Mail,
    color: "bg-purple-50 text-purple-600"
  },
  {
    title: "Mise à jour CRM",
    starWarsName: "CRM SIMPLE",
    description: "Interface Airtable personnalisée et automatiquement mise à jour",
    icon: Database,
    color: "bg-yellow-50 text-yellow-600"
  },
  {
    title: "Sans code",
    starWarsName: "ZÉRO CODE",
    description: "Aucune compétence technique requise, prêt en 48h",
    icon: CreditCard,
    color: "bg-green-50 text-green-600"
  },
  {
    title: "Support continu",
    starWarsName: "SUPPORT DÉDIÉ",
    description: "Une équipe pour t'accompagner et optimiser ton agent",
    icon: Users,
    color: "bg-indigo-50 text-indigo-600"
  },
  {
    title: "Analytics B2B",
    starWarsName: "ANALYTICS",
    description: "Mesure et optimise tes performances de prospection",
    icon: LineChart,
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
