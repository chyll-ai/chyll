
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';

const AboutUs = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">À propos de nous</h1>
            
            <div className="mb-10">
              <img 
                src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=1200" 
                alt="Équipe travaillant ensemble" 
                className="w-full h-72 object-cover rounded-lg mb-6"
              />
            </div>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">Notre histoire</h2>
              <p>Chyll.ai est née d'une frustration partagée par de nombreux entrepreneurs et commerciaux : la prospection commerciale B2B est chronophage, répétitive et souvent inefficace. Notre fondateur, après avoir passé des années à construire manuellement des listes de prospects et à chercher les bonnes coordonnées, a décidé d'automatiser ce processus grâce à l'intelligence artificielle.</p>
              <p className="mt-4">Fondée en 2023, notre entreprise s'est donnée pour mission de libérer les commerciaux et entrepreneurs des tâches administratives de la prospection, pour leur permettre de se concentrer sur ce qui compte vraiment : les relations humaines et la conclusion de deals.</p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Notre mission</h2>
              <p>Notre mission est simple : transformer la prospection B2B d'une corvée manuelle en un processus automatisé, intelligent et efficace. Nous voulons que chaque entreprise, quelle que soit sa taille, puisse accéder à des outils de prospection dignes des grandes organisations, sans avoir besoin d'une armée de SDRs ou de connaissances techniques avancées.</p>
              <p className="mt-4">À travers notre agent IA, nous digitalisons l'ensemble du processus de prospection commerciale, depuis l'identification des cibles jusqu'au suivi des opportunités, en passant par l'enrichissement des données et l'organisation des contacts.</p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">Ce qui nous rend uniques</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li>Une approche 100% orientée résultats, avec des leads directement actionnables</li>
                <li>Une interface utilisateur intuitive, sans courbe d'apprentissage</li>
                <li>Un accompagnement personnalisé pour adapter l'agent IA à vos besoins spécifiques</li>
                <li>Une technologie propriétaire qui combine l'IA et des sources de données exclusives</li>
                <li>Un modèle de tarification transparent, sans engagement à long terme</li>
              </ul>
              
              <div className="bg-gray-50 p-6 rounded-lg mt-10">
                <h3 className="text-xl font-semibold mb-4">Prêt à transformer votre approche de la prospection ?</h3>
                <p className="mb-6">Découvrez comment chyll.ai peut vous faire gagner du temps et augmenter votre pipeline commercial grâce à la prospection automatisée.</p>
                <a 
                  href="https://api.leadconnectorhq.com/widget/booking/XvUg6399vyVtvCXETgsY" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
                >
                  Réserver une démo
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default AboutUs;
