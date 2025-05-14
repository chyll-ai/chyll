
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-8">Conditions Générales d'Utilisation (CGU)</h1>
            
            <div className="prose max-w-none">
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Objet des Conditions Générales d'Utilisation</h2>
              <p>
                Les présentes Conditions Générales d'Utilisation (ci-après les "CGU") régissent l'accès et l'utilisation des services proposés par chyll.ai, marque de GenerativSchool SAS (ci-après "la Société"), notamment l'agent IA SDR ("AI SDR Agent"), qui permet aux entreprises d'automatiser la prospection commerciale, d'enrichir les leads et de gérer le suivi commercial via une interface dédiée.
              </p>
              <p>
                En accédant à notre plateforme, vous acceptez expressément les présentes CGU. Si vous n'êtes pas d'accord avec ces conditions, vous ne devez pas utiliser nos services.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Description des Services</h2>
              <p>
                chyll.ai offre une solution d'automatisation de prospection commerciale via un agent IA ("AI SDR Agent"). Cette solution inclut la recherche, l'enrichissement et l'organisation des leads B2B, ainsi que le suivi commercial simplifié via une interface personnalisée. L'outil est accessible en ligne via un abonnement mensuel ou annuel.
              </p>
              <p>Les services incluent :</p>
              <ul className="list-disc pl-6 my-4">
                <li>Recherche et identification de leads qualifiés en fonction de critères définis par l'utilisateur.</li>
                <li>Enrichissement des données des prospects (emails, numéros de téléphone, informations d'entreprise, etc.).</li>
                <li>Organisation et suivi des leads dans une interface dédiée.</li>
                <li>Mise à jour automatique des leads et suivi des actions commerciales.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Accès au Service et Création de Compte</h2>
              <p>
                Pour accéder aux services de chyll.ai, vous devez créer un compte utilisateur sur la plateforme. La création d'un compte implique la fourniture d'informations personnelles, telles que le nom, l'email, le nom de l'entreprise et d'autres informations nécessaires pour activer votre service.
              </p>
              <p>
                Vous êtes responsable de la confidentialité de vos identifiants de connexion et de toutes les actions réalisées sur votre compte.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Tarifs et Abonnement</h2>
              <p>
                Les tarifs des services de chyll.ai sont définis dans l'offre choisie lors de l'inscription. Les abonnements peuvent être mensuels ou annuels, selon la formule sélectionnée par le client.
              </p>
              <p>
                Le paiement est effectué via une solution de paiement sécurisée (par exemple, Stripe). Le montant de l'abonnement sera débité de manière récurrente à la fréquence choisie (mensuelle ou annuelle).
              </p>
              <p>
                Les tarifs sont indiqués hors taxes et sont susceptibles d'être modifiés à tout moment. Les abonnements sont reconductibles automatiquement, sauf résiliation préalable par le client.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Responsabilité du Client</h2>
              <p>Le client s'engage à :</p>
              <ul className="list-disc pl-6 my-4">
                <li>Fournir des informations exactes et complètes lors de la création du compte.</li>
                <li>Utiliser le service dans le respect des lois et réglementations applicables.</li>
                <li>Ne pas utiliser le service à des fins illégales, telles que l'envoi de communications non sollicitées (spam) ou l'utilisation de données personnelles sans consentement.</li>
              </ul>
              <p>
                Le client est seul responsable de l'utilisation des leads générés et de l'interaction avec les prospects.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Propriété Intellectuelle</h2>
              <p>
                Les services chyll.ai et tous les éléments associés (logiciels, interfaces, données générées, etc.) sont la propriété exclusive de GenerativSchool SAS ou de ses partenaires. Aucun droit de propriété intellectuelle n'est transféré au client par l'utilisation du service.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Confidentialité et Protection des Données</h2>
              <p>
                GenerativSchool SAS s'engage à protéger les données personnelles du client conformément à la législation en vigueur, notamment le Règlement Général sur la Protection des Données (RGPD).
              </p>
              <p>
                Les données des prospects récoltées via le service sont traitées par chyll.ai uniquement pour la fourniture des services. Le client est responsable de s'assurer qu'il dispose des droits nécessaires pour utiliser ces données dans le cadre de la prospection.
              </p>
              <p>
                Les informations personnelles du client, telles que l'email, sont utilisées uniquement pour la gestion de l'abonnement et l'assistance au client. Ces informations ne sont pas partagées avec des tiers sans le consentement préalable du client, sauf en cas d'obligation légale.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Sécurité</h2>
              <p>
                Nous mettons en place des mesures techniques et organisationnelles appropriées pour garantir la sécurité des données et des systèmes. Cependant, GenerativSchool SAS ne peut garantir une sécurité absolue contre les intrusions, et le client accepte d'utiliser le service à ses propres risques.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Suspension et Résiliation</h2>
              <p>
                GenerativSchool SAS se réserve le droit de suspendre ou de résilier l'accès aux services de chyll.ai en cas de violation des présentes CGU, de non-paiement de l'abonnement ou d'abus d'utilisation des services. La résiliation peut être effectuée à tout moment par le client via l'interface de gestion du compte.
              </p>
              <p>
                En cas de résiliation, les données des leads et les informations client seront conservées pendant une durée maximale de 30 jours, sauf demande expresse du client de suppression immédiate.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Limitation de Responsabilité</h2>
              <p>
                GenerativSchool SAS ne pourra être tenue responsable des dommages directs ou indirects, y compris la perte de profit, de données ou d'opportunités commerciales, résultant de l'utilisation ou de l'impossibilité d'utiliser les services de chyll.ai.
              </p>
              <p>
                La responsabilité de GenerativSchool SAS sera limitée au montant total payé par le client pour les services sur une période de 6 mois.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Modifications des CGU</h2>
              <p>
                GenerativSchool SAS se réserve le droit de modifier ces CGU à tout moment. Les clients seront informés des modifications via l'interface de leur compte ou par email. L'utilisation continue des services après modification des CGU vaut acceptation des nouvelles conditions.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">12. Droit Applicable et Litiges</h2>
              <p>
                Les présentes CGU sont régies par le droit français. En cas de litige relatif à l'interprétation ou à l'exécution des présentes, les parties s'engagent à tenter une résolution amiable. À défaut, le tribunal compétent sera celui du siège social de GenerativSchool SAS.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">13. Contact</h2>
              <p>
                Pour toute question concernant ces CGU ou les services de chyll.ai, vous pouvez nous contacter à l'adresse suivante :<br />
                GenerativSchool SAS<br />
                Email de contact : <a href="mailto:contact@generativschool.com" className="text-brand-blue hover:underline">contact@generativschool.com</a><br />
                Adresse : 60 rue François Premier, 75008 Paris, France
              </p>
              
              <p className="text-sm mt-12">Dernière mise à jour : 13 mai 2025</p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Terms;
