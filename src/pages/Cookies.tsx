
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import SEOMetadata from '@/components/SEOMetadata';
import { useLanguage } from '@/context/LanguageContext';

const Cookies = () => {
  const { language } = useLanguage();
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title="Politique des Cookies" 
        description="La politique des cookies de chyll.ai explique comment nous utilisons les cookies pour améliorer votre expérience de navigation."
        canonicalUrl="/cookies"
      />
      
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Politique des Cookies</h1>
            <p className="text-sm text-gray-500 mb-8">Dernière mise à jour : 13 mai 2025</p>
            
            <div className="prose max-w-none">
              <p>
                Chez chyll.ai, une marque de GenerativSchool SAS, nous utilisons des cookies et des technologies similaires pour améliorer votre expérience de navigation, analyser l'utilisation de nos services, personnaliser notre contenu et améliorer la performance de notre plateforme.
              </p>
              
              <p>
                Cette politique vous explique ce que sont les cookies, comment nous les utilisons et comment vous pouvez les gérer.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Qu'est-ce qu'un cookie ?</h2>
              <p>
                Un cookie est un petit fichier texte qui est déposé sur votre appareil (ordinateur, tablette, smartphone) lors de la navigation sur un site web. Les cookies permettent au site web de se souvenir de vos actions et préférences (comme votre identifiant de connexion ou votre langue) pendant un certain temps, ce qui vous évite de devoir les saisir à chaque fois que vous revenez sur le site ou que vous naviguez d'une page à l'autre.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Types de cookies utilisés</h2>
              <p>
                Nous utilisons plusieurs types de cookies pour différentes finalités :
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Cookies essentiels</h3>
              <p>
                Ces cookies sont nécessaires au fonctionnement de notre plateforme. Ils vous permettent de naviguer sur le site et d'utiliser les fonctionnalités de base, telles que la gestion de votre compte ou la sécurisation de votre session.
              </p>
              <p>
                Exemples :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Cookies de session</li>
                <li>Cookies d'authentification</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Cookies de performance</h3>
              <p>
                Ces cookies collectent des informations sur la manière dont vous utilisez notre site, comme les pages que vous consultez et les liens sur lesquels vous cliquez. Ces informations sont utilisées pour améliorer le fonctionnement du site et pour comprendre comment les utilisateurs interagissent avec notre plateforme.
              </p>
              <p>
                Exemples :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Cookies de Google Analytics</li>
                <li>Cookies de performance de navigation</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Cookies de fonctionnalité</h3>
              <p>
                Ces cookies permettent au site de mémoriser vos préférences et de vous offrir une expérience personnalisée. Par exemple, ces cookies peuvent se souvenir de la langue que vous avez choisie ou de vos paramètres d'affichage.
              </p>
              <p>
                Exemples :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Cookies de personnalisation de l'interface utilisateur</li>
                <li>Cookies de langue</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Cookies publicitaires et de ciblage</h3>
              <p>
                Ces cookies sont utilisés pour vous proposer des publicités adaptées à vos intérêts, en fonction de votre navigation sur notre site et d'autres sites. Ils peuvent également être utilisés pour limiter le nombre de fois où vous voyez une annonce.
              </p>
              <p>
                Exemples :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Cookies de retargeting (publicité ciblée)</li>
                <li>Cookies de réseaux sociaux (comme Facebook, LinkedIn)</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Comment nous utilisons les cookies</h2>
              <p>
                Les cookies nous permettent de :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Améliorer la performance et la fonctionnalité de notre site</li>
                <li>Analyser l'utilisation de notre plateforme pour l'améliorer</li>
                <li>Vous offrir une expérience personnalisée (préférences, langue, etc.)</li>
                <li>Gérer des campagnes publicitaires adaptées à vos intérêts</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Gestion des cookies</h2>
              <p>
                Vous avez la possibilité de gérer vos préférences en matière de cookies à tout moment. Vous pouvez choisir de désactiver certains cookies ou de modifier les paramètres de votre navigateur pour refuser tous les cookies.
              </p>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Comment gérer vos cookies dans votre navigateur ?</h3>
              <p>
                La plupart des navigateurs vous permettent de refuser ou d'accepter les cookies. Vous pouvez configurer votre navigateur pour qu'il vous avertisse lorsqu'un cookie est envoyé, ou bien pour les désactiver complètement.
              </p>
              <p>
                Voici comment gérer les cookies dans les principaux navigateurs :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Google Chrome : Paramètres &gt; Confidentialité et sécurité &gt; Cookies et autres données de site</li>
                <li>Mozilla Firefox : Options &gt; Vie privée et sécurité &gt; Cookies et données de site</li>
                <li>Safari : Préférences &gt; Confidentialité &gt; Cookies et données de site</li>
                <li>Microsoft Edge : Paramètres &gt; Cookies et autorisations de site</li>
              </ul>
              
              <h3 className="text-xl font-semibold mt-6 mb-3">Refuser les cookies publicitaires</h3>
              <p>
                Vous pouvez également refuser les cookies publicitaires de certaines plateformes en visitant des sites tels que :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>YourOnlineChoices : <a href="https://www.youronlinechoices.com" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">www.youronlinechoices.com</a></li>
                <li>Network Advertising Initiative : <a href="https://www.networkadvertising.org" target="_blank" rel="noopener noreferrer" className="text-brand-blue hover:underline">www.networkadvertising.org</a></li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Cookies tiers</h2>
              <p>
                Lorsque vous utilisez notre site, des cookies tiers peuvent également être déposés par des services externes, tels que Google Analytics, Facebook, ou LinkedIn. Ces cookies sont utilisés pour analyser votre navigation, vous offrir des publicités personnalisées, ou vous permettre de partager du contenu sur les réseaux sociaux. Nous n'avons pas de contrôle sur l'utilisation de ces cookies, et vous devez consulter les politiques de confidentialité de ces services tiers pour plus d'informations.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Conservation des cookies</h2>
              <p>
                La durée de conservation des cookies dépend du type de cookie :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Cookies de session : ces cookies sont conservés uniquement pendant la durée de votre session de navigation et sont supprimés dès que vous fermez votre navigateur.</li>
                <li>Cookies permanents : ces cookies restent sur votre appareil pendant une durée maximale de 13 mois.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications de la politique des cookies</h2>
              <p>
                Nous pouvons mettre à jour cette Politique des Cookies de temps à autre. Toute modification sera publiée sur cette page avec la date de mise à jour. Nous vous encourageons à consulter régulièrement cette politique pour être informé de toute modification.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
              <p>
                Si vous avez des questions concernant notre Politique des Cookies ou si vous souhaitez exercer vos droits en matière de cookies, vous pouvez nous contacter à l'adresse suivante :<br />
                <strong>GenerativSchool SAS</strong><br />
                Email de contact : <a href="mailto:contact@generativschool.com" className="text-brand-blue hover:underline">contact@generativschool.com</a><br />
                Adresse : 60 rue François Premier, 75008 Paris, France
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default Cookies;
