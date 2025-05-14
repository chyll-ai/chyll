
import React from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import { useLanguage } from '@/context/LanguageContext';
import SEOMetadata from '@/components/SEOMetadata';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Shield, Users, Globe, Heart, MessageCircle, Star } from 'lucide-react';
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
        title="À propos | chyll.ai"
        description="Découvrez l'histoire de chyll.ai, notre mission et ce qui nous rend uniques dans le domaine de la prospection B2B automatisée."
        canonicalUrl="/about-us"
        keywords={["à propos chyll.ai", "histoire chyll.ai", "mission chyll.ai", "équipe chyll.ai"]}
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
              {t.about.title}
            </motion.h1>
            <motion.div
              className="h-1 w-20 bg-indigo-600 mx-auto mb-8"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 80 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
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
                      src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1200" 
                      alt="Notre équipe chez chyll.ai" 
                      className="w-full h-full object-cover"
                    />
                  </AspectRatio>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-white">
                    <span className="px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">chyll.ai team</span>
                  </div>
                </div>
              </div>
              
              <motion.h2 
                className="text-2xl md:text-3xl font-semibold mb-6 text-gray-900"
                variants={itemVariants}
              >
                {t.about.story.title}
              </motion.h2>
              <motion.p 
                className="text-lg text-gray-700 mb-4"
                variants={itemVariants}
              >
                {t.about.story.text1}
              </motion.p>
              <motion.p 
                className="text-lg text-gray-700"
                variants={itemVariants}
              >
                {t.about.story.text2}
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
                {t.about.mission.title}
              </motion.h2>
              <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-xl mb-6">
                <motion.p 
                  className="text-lg text-gray-700 mb-4"
                  variants={itemVariants}
                >
                  {t.about.mission.text1}
                </motion.p>
                <motion.p 
                  className="text-lg text-gray-700"
                  variants={itemVariants}
                >
                  {t.about.mission.text2}
                </motion.p>
              </div>
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
                {t.about.unique.title}
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
                    <h3 className="ml-4 text-lg font-medium">{t.about.unique.items[0]}</h3>
                  </div>
                  <p className="text-gray-600">{t.about.unique.items[0]}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Globe className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">{t.about.unique.items[1]}</h3>
                  </div>
                  <p className="text-gray-600">{t.about.unique.items[1]}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Star className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">{t.about.unique.items[2]}</h3>
                  </div>
                  <p className="text-gray-600">{t.about.unique.items[2]}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Heart className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">{t.about.unique.items[3]}</h3>
                  </div>
                  <p className="text-gray-600">{t.about.unique.items[3]}</p>
                </motion.div>
                
                <motion.div 
                  className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow md:col-span-2"
                  variants={itemVariants}
                >
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-3 rounded-full">
                      <Shield className="h-6 w-6 text-indigo-600" />
                    </div>
                    <h3 className="ml-4 text-lg font-medium">{t.about.unique.items[4]}</h3>
                  </div>
                  <p className="text-gray-600">{t.about.unique.items[4]}</p>
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
                {t.about.cta.title}
              </h3>
              <p className="text-lg opacity-90 mb-8">
                {t.about.cta.text}
              </p>
              <Button 
                size="lg" 
                variant="secondary"
                className="font-medium"
                asChild
              >
                <a href="https://cal.com/chyll.ai/30min" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-5 w-5" />
                  {t.about.cta.button}
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
