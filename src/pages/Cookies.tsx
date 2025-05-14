
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import SEOMetadata from '@/components/SEOMetadata';

const Cookies = () => {
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
                La plupart des navigateurs vous permettent de consulter et supprimer les cookies :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>
                  <strong>Chrome</strong> : Menu {'>'}  Paramètres {'>'}  Afficher les paramètres avancés {'>'}  Confidentialité {'>'}  Paramètres de contenu {'>'}  Cookies
                </li>
                <li>
                  <strong>Firefox</strong> : Menu {'>'}  Options {'>'}  Vie privée {'>'}  Historique {'>'}  Paramètres pour l'historique {'>'}  Cookies
                </li>
                <li>
                  <strong>Safari</strong> : Préférences {'>'}  Confidentialité {'>'}  Cookies et données de site
                </li>
                <li>
                  <strong>Edge</strong> : Menu {'>'}  Paramètres {'>'}  Effacer les données de navigation {'>'}  Cookies et données de sites web enregistrés
                </li>
              </ul>
              <p>
                Veuillez noter que la désactivation de certains cookies peut affecter votre expérience sur notre site et limiter votre accès à certaines fonctionnalités.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Durée de conservation des cookies</h2>
              <p>
                La durée de conservation des cookies varie selon leur type :
              </p>
              <ul className="list-disc ml-6 mb-4">
                <li>Les cookies de session expirent à la fin de votre session de navigation</li>
                <li>Les cookies permanents peuvent être conservés pendant plusieurs jours, mois ou années, selon leur configuration</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Cookies tiers</h2>
              <p>
                Certains de nos partenaires peuvent également installer des cookies sur votre appareil lorsque vous visitez notre site. Ces cookies tiers permettent à ces partenaires de vous proposer des publicités ciblées ou de suivre votre activité en ligne sur d'autres sites.
              </p>
              <p>
                Nous n'avons pas de contrôle direct sur ces cookies tiers. Nous vous encourageons à consulter les politiques de confidentialité de ces partenaires pour comprendre comment ils utilisent les cookies.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Modifications de la politique des cookies</h2>
              <p>
                Nous nous réservons le droit de modifier cette politique des cookies à tout moment. Les modifications prendront effet dès leur publication sur notre site. Nous vous encourageons à consulter régulièrement cette page pour rester informé des mises à jour.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Contact</h2>
              <p>
                Si vous avez des questions concernant notre utilisation des cookies, n'hésitez pas à nous contacter à l'adresse suivante : <a href="mailto:privacy@chyll.ai" className="text-brand-blue hover:underline">privacy@chyll.ai</a>
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
