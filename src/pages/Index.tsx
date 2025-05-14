
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import SEOMetadata from '@/components/SEOMetadata';
import { getOrganizationSchema } from '@/utils/structuredData';

const Index = () => {
  // Generate organization structured data
  const organizationSchema = getOrganizationSchema();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="chyll.ai - La prospection B2B, automatisée"
        description="chyll.ai trouve les bons prospects, les enrichit avec emails et téléphones vérifiés, et met à jour ton CRM."
        canonicalUrl="/"
        pageUrl="https://chyll.ai/"
        structuredData={{
          organization: organizationSchema
        }}
      />
      
      <Navbar />
      
      {/* Hero Section */}
      <section className="py-20 flex items-center justify-center flex-col text-center gradient-bg">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            La prospection B2B, <span className="text-blue-600">automatisée</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-700 max-w-3xl mx-auto mb-10">
            chyll.ai trouve les bons prospects, les enrichit avec emails et téléphones vérifiés, 
            et met à jour ton CRM pendant que tu bosses sur autre chose.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a 
              href="/contact" 
              className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Démarrer
            </a>
            <a 
              href="#about" 
              className="px-6 py-3 bg-white text-blue-600 font-medium rounded-lg border border-blue-600 hover:bg-gray-50 transition-colors"
            >
              En savoir plus
            </a>
          </div>
        </div>
      </section>
      
      {/* About Section */}
      <section id="about" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">À propos de chyll.ai</h2>
            <p className="text-lg text-gray-700 mb-8">
              chyll.ai est une solution d'automatisation de prospection commerciale qui vous permet de
              gagner du temps et d'optimiser votre processus de vente. Notre plateforme trouve et enrichit
              vos prospects avec des données vérifiées, facilitant ainsi vos efforts de prospection.
            </p>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default Index;
