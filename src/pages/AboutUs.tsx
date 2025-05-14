
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import { useLanguage } from '@/context/LanguageContext';
import SEOMetadata from '@/components/SEOMetadata';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Shield, Users, Globe, Heart, Star, Sparkles, Database, Bot, Clock, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getOrganizationSchema } from '@/utils/structuredData';

const AboutUs = () => {
  const { t } = useLanguage();
  
  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <SEOMetadata 
        title="Pourquoi nous avons créé chyll"
        description="chyll est né d'un constat simple : les équipes commerciales perdent un temps précieux sur des tâches répétitives. Notre mission est d'automatiser la prospection B2B avec une solution IA intuitive, éthique et efficace."
        canonicalUrl="/about-us"
        keywords={["chyll", "à propos chyll", "histoire chyll", "mission chyll", "équipe chyll", "plateforme chyll", "assistant commercial chyll"]}
        structuredData={getOrganizationSchema()}
      />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-purple-50 to-white pt-20 pb-16">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-3xl md:text-5xl font-bold mb-6 text-gray-900"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              Pourquoi nous avons créé chyll
            </motion.h1>
            <motion.div
              className="h-1 w-20 bg-indigo-600 mx-auto mb-8"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
            <motion.p
              className="text-lg text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              La vision de chyll : révolutionner la prospection B2B grâce à l'intelligence artificielle
            </motion.p>
          </div>
        </div>
      </section>
      
      {/* Main Content */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            {/* Our Story */}
            <motion.div 
              className="mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <div className="mb-10">
                <div className="relative rounded-xl overflow-hidden shadow-xl">
                  <AspectRatio ratio={16 / 9}>
                    <img 
                      src="https://images.unsplash.com/photo-1533750516457-a7f992034fec?q=80&w=1200" 
                      alt="L'équipe fondatrice de chyll - plateforme d'assistance commerciale IA" 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">Équipe fondatrice de chyll</span>
                  </div>
                </div>
              </div>
              
              <motion.h2 
                className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900"
                variants={itemVariants}
              >
                L'histoire de chyll
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-700 mb-4"
                variants={itemVariants}
              >
                Fondé en 2023 par une équipe d'experts en IA et en développement commercial, chyll est né d'un constat simple : la prospection B2B traditionnelle est chronophage, inefficace et souvent frustrante pour les équipes de vente modernes.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-700 mb-4"
                variants={itemVariants}
              >
                Après des années passées à travailler dans le secteur de la vente B2B, nos fondateurs ont identifié un besoin crucial : celui d'un assistant commercial IA qui automatiserait intelligemment la prospection tout en s'intégrant parfaitement aux processus existants des entreprises.
              </motion.p>
              <motion.p 
                className="text-lg text-gray-700"
                variants={itemVariants}
              >
                Aujourd'hui, chyll représente l'aboutissement de cette vision : un assistant commercial IA dédié à la prospection B2B qui trouve, qualifie et enrichit les profils de prospects pertinents, permettant aux startups et PME de se concentrer sur ce qu'elles font de mieux - convertir et vendre.
              </motion.p>
            </motion.div>
            
            {/* Our Mission */}
            <motion.div 
              className="mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900"
                variants={itemVariants}
              >
                La mission de chyll
              </motion.h2>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl mb-6">
                <motion.p 
                  className="text-lg text-gray-700 mb-4"
                  variants={itemVariants}
                >
                  Chez chyll, notre mission est claire : libérer le potentiel des équipes commerciales en automatisant les tâches répétitives et chronophages de la prospection B2B.
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-700 mb-4"
                  variants={itemVariants}
                >
                  Nous croyons fermement que les commerciaux devraient consacrer leur temps et leur énergie à établir des relations significatives avec les clients, plutôt qu'à la recherche manuelle de prospects et à l'enrichissement de données.
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-700"
                  variants={itemVariants}
                >
                  Notre ambition? Faire de chyll le standard de l'assistance commerciale automatisée en Europe, en offrant une plateforme qui combine puissance technologique et facilité d'utilisation pour les startups et PME.
                </motion.p>
              </div>
            </motion.div>
            
            {/* Notre Approche */}
            <motion.div 
              className="mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900"
                variants={itemVariants}
              >
                L'approche unique de chyll
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-700 mb-8"
                variants={itemVariants}
              >
                L'approche de chyll pour la prospection B2B se distingue par sa méthodologie unique et complète, basée sur quatre piliers fondamentaux qui font de notre assistant commercial IA une solution véritablement différenciante :
              </motion.p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Target className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">Ciblage intelligent par chyll</h3>
                  </div>
                  <p className="text-gray-700">
                    La technologie chyll analyse des millions de profils professionnels pour identifier précisément les décideurs qui correspondent à votre ICP (Ideal Customer Profile). Notre assistant ne vous fournit que des prospects qualifiés qui ont une réelle probabilité d'achat.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Database className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">Enrichissement complet chyll</h3>
                  </div>
                  <p className="text-gray-700">
                    Pour chaque prospect identifié, chyll collecte et vérifie une multitude de données : email professionnel, numéro de téléphone direct, historique professionnel, signaux d'achat récents, technologies utilisées et bien plus encore.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Bot className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">Intelligence artificielle chyll</h3>
                  </div>
                  <p className="text-gray-700">
                    L'assistant chyll ne se contente pas de collecter des données - il analyse les interactions, identifie les modèles comportementaux et prédit la propension à l'achat, vous permettant de prioriser les leads avec le plus haut potentiel de conversion.
                  </p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">Automatisation continue chyll</h3>
                  </div>
                  <p className="text-gray-700">
                    Le système chyll fonctionne 24h/24, 7j/7, garantissant un flux constant de nouveaux prospects qualifiés. Chaque matin, vous découvrez de nouvelles opportunités commerciales directement dans votre CRM, prêtes à être contactées.
                  </p>
                </motion.div>
              </div>
              
              <motion.div 
                className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl"
                variants={itemVariants}
              >
                <div className="flex items-start mb-4">
                  <div className="bg-indigo-100 p-3 rounded-full mt-1">
                    <Sparkles className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium mb-2">Méthodologie chyll adaptée au B2B moderne</h3>
                    <p className="text-gray-700">
                      Le processus chyll s'inspire du modèle AIDA (Attention, Intérêt, Désir, Action) mais repensé pour le cycle de vente B2B moderne :
                    </p>
                    <ul className="mt-3 space-y-2">
                      <li className="flex items-center">
                        <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm mr-3">1</span>
                        <span><strong>Identification par chyll</strong> : Nous localisons les décideurs correspondant précisément à votre persona idéal.</span>
                      </li>
                      <li className="flex items-center">
                        <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm mr-3">2</span>
                        <span><strong>Qualification chyll</strong> : Nous analysons leur correspondance avec vos critères et leur probabilité d'intérêt.</span>
                      </li>
                      <li className="flex items-center">
                        <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm mr-3">3</span>
                        <span><strong>Enrichissement chyll</strong> : Nous collectons toutes les données pertinentes pour faciliter votre approche commerciale.</span>
                      </li>
                      <li className="flex items-center">
                        <span className="h-6 w-6 flex items-center justify-center rounded-full bg-indigo-600 text-white text-sm mr-3">4</span>
                        <span><strong>Activation chyll</strong> : Nous vous fournissons un tableau de bord CRM prêt à l'emploi pour engager la conversation.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            </motion.div>
            
            {/* What Sets Us Apart */}
            <motion.div 
              className="mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h2 
                className="text-2xl md:text-3xl font-semibold mb-8 text-gray-900"
                variants={itemVariants}
              >
                Ce Qui Différencie chyll
              </motion.h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Users className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">Service complet chyll</h3>
                  </div>
                  <p className="text-gray-600">Notre équipe chyll gère tout de A à Z : configuration, maintenance, optimisations continues. Vous n'avez qu'à utiliser les données enrichies par votre assistant.</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Globe className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">chyll respecte le RGPD</h3>
                  </div>
                  <p className="text-gray-600">L'approche chyll est 100% conforme au RGPD. Notre assistant utilise uniquement des sources publiques et professionnelles pour enrichir les données.</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Star className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">Qualité des données chyll</h3>
                  </div>
                  <p className="text-gray-600">chyll privilégie la qualité à la quantité. Chaque prospect est soigneusement vérifié pour garantir la pertinence et l'exactitude des informations fournies à nos clients.</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">Support dédié chyll</h3>
                  </div>
                  <p className="text-gray-600">Chaque client chyll bénéficie d'un support personnalisé et réactif. Notre équipe est là pour vous aider à maximiser votre ROI avec notre assistant commercial.</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow md:col-span-2"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">Tarification transparente chyll</h3>
                  </div>
                  <p className="text-gray-600">Pas de surprises désagréables avec chyll. Nos forfaits sont clairs, sans frais cachés, et vous ne payez que pour les fonctionnalités de l'assistant commercial chyll dont vous avez réellement besoin.</p>
                </motion.div>
              </div>
            </motion.div>
            
            {/* Call-to-Action */}
            <motion.div 
              className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white p-8 md:p-12 rounded-2xl shadow-xl"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h3 className="text-2xl md:text-3xl font-bold mb-4">
                Prêt à découvrir l'assistant commercial chyll?
              </h3>
              <p className="text-lg opacity-90 mb-8">
                Découvrez comment chyll peut vous aider à trouver et convertir plus de clients qualifiés, tout en réduisant la charge de travail de votre équipe commerciale.
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="font-medium"
                asChild
              >
                <a href="https://cal.com/chyll.ai/30min" target="_blank" rel="noopener noreferrer">
                  Réserver une démo gratuite de chyll
                </a>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default AboutUs;
