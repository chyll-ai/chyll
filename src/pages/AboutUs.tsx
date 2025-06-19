
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
  const { language } = useLanguage();
  
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
                      src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1200&auto=format&fit=crop"
                      alt="L'équipe chyll travaillant sur l'innovation IA"
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                </div>
              </div>
              
              <motion.div variants={itemVariants}>
                <h2 className="text-3xl font-bold mb-6">Notre histoire</h2>
                <div className="prose prose-lg max-w-none">
                  <p>
                    chyll est né d'un constat simple : les équipes commerciales perdent un temps précieux sur des tâches répétitives. 
                    Recherche de prospects, enrichissement de données, suivi manuel... Ces activités, bien qu'essentielles, 
                    éloignent les commerciaux de leur cœur de métier : la vente.
                  </p>
                  <p>
                    En 2024, notre équipe de passionnés d'IA et de vente B2B s'est donnée pour mission de créer l'assistant commercial 
                    du futur. Un outil qui ne se contente pas d'automatiser, mais qui comprend, apprend et s'adapte aux besoins 
                    spécifiques de chaque entreprise.
                  </p>
                </div>
              </motion.div>
            </motion.div>

            {/* Our Values */}
            <motion.div 
              className="mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-center">
                Nos valeurs
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  { icon: Bot, title: "Innovation IA", description: "Nous repoussons les limites de l'intelligence artificielle pour créer des solutions commerciales révolutionnaires." },
                  { icon: Shield, title: "Éthique & Transparence", description: "Nous respectons la vie privée et garantissons une utilisation éthique des données." },
                  { icon: Users, title: "Centrés sur l'humain", description: "L'IA augmente les capacités humaines, elle ne les remplace pas." },
                  { icon: Clock, title: "Efficacité maximale", description: "Chaque fonctionnalité est conçue pour faire gagner du temps à nos utilisateurs." },
                  { icon: Target, title: "Résultats mesurables", description: "Nous nous concentrons sur l'impact concret sur votre pipeline commercial." },
                  { icon: Globe, title: "Accessibilité", description: "Nos solutions sont accessibles aux entreprises de toutes tailles." }
                ].map((value, index) => (
                  <motion.div
                    key={index}
                    variants={itemVariants}
                    className="bg-gray-50 p-6 rounded-xl text-center hover:shadow-md transition-shadow"
                  >
                    <value.icon className="w-12 h-12 text-indigo-600 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Our Mission */}
            <motion.div 
              className="mb-16 bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-xl"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6 text-center">
                Notre mission
              </motion.h2>
              <motion.div variants={itemVariants} className="prose prose-lg max-w-none text-center">
                <p className="text-xl leading-relaxed">
                  Démocratiser l'accès à l'intelligence artificielle commerciale pour permettre à chaque entreprise, 
                  quelle que soit sa taille, de disposer d'un assistant commercial IA performant, éthique et facile à utiliser.
                </p>
              </motion.div>
            </motion.div>

            {/* Team Section */}
            <motion.div 
              className="mb-16"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-8 text-center">
                L'équipe derrière chyll
              </motion.h2>
              <motion.div variants={itemVariants} className="prose prose-lg max-w-none">
                <p>
                  Notre équipe combine une expertise approfondie en intelligence artificielle, en vente B2B et en expérience utilisateur. 
                  Nous sommes des entrepreneurs, des ingénieurs et des commerciaux qui ont vécu les défis quotidiens de la prospection.
                </p>
                <p>
                  Cette expérience terrain nous permet de créer des solutions qui répondent aux vrais besoins des équipes commerciales, 
                  sans les complexités inutiles des outils traditionnels.
                </p>
              </motion.div>
            </motion.div>

            {/* Call to Action */}
            <motion.div 
              className="text-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={containerVariants}
            >
              <motion.h2 variants={itemVariants} className="text-3xl font-bold mb-6">
                Rejoignez-nous dans cette aventure
              </motion.h2>
              <motion.p variants={itemVariants} className="text-lg text-gray-700 mb-8">
                Découvrez comment chyll peut transformer votre approche de la prospection B2B
              </motion.p>
              <motion.div variants={itemVariants}>
                <Button 
                  size="lg" 
                  className="bg-indigo-600 hover:bg-indigo-700 px-8 py-3"
                  asChild
                >
                  <a href="https://cal.com/chyll.ai/30min">
                    Réserver une démonstration
                  </a>
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default AboutUs;
