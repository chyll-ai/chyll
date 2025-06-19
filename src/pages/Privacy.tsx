import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import { Helmet } from 'react-helmet-async';

const Privacy = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Helmet>
        <title>Politique de Confidentialité | chyll.ai</title>
        <meta name="description" content="Politique de confidentialité de chyll.ai, une marque de GenerativSchool SAS." />
      </Helmet>
      
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Politique de Confidentialité</h1>
            <p className="text-gray-500 mb-8">Dernière mise à jour : 13 mai 2025</p>
            
            <div className="prose max-w-none">
              <p className="mb-6">
                Chez chyll.ai, une marque de GenerativSchool SAS, nous nous engageons à protéger votre vie privée et à respecter 
                la confidentialité des données personnelles que vous nous fournissez. Cette Politique de Confidentialité décrit 
                les informations que nous collectons, comment nous les utilisons et vos droits en matière de protection des données.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">1. Responsable du traitement</h2>
              <p>
                Le responsable du traitement des données personnelles est GenerativSchool SAS, société immatriculée en France, 
                dont le siège social est situé au 60 rue François Premier, 75008 Paris, France.
                <br />Email de contact : <a href="mailto:contact@generativschool.com" className="text-brand-blue hover:underline">contact@generativschool.com</a>
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">2. Collecte des données personnelles</h2>
              <p>
                Nous collectons les données personnelles que vous nous fournissez directement lorsque vous créez un compte sur notre 
                plateforme chyll.ai, ainsi que celles que nous recueillons automatiquement lors de votre utilisation de nos services.
              </p>
              
              <p className="font-medium mt-4">Données collectées lors de l'inscription :</p>
              <ul className="list-disc ml-6 mb-4">
                <li>Informations personnelles : nom, prénom, adresse e-mail, numéro de téléphone</li>
                <li>Informations sur l'entreprise : nom de l'entreprise, secteur d'activité, taille de l'entreprise</li>
                <li>Informations de facturation : adresse de facturation, informations de paiement</li>
              </ul>
              
              <p className="font-medium mt-4">Données collectées automatiquement :</p>
              <ul className="list-disc ml-6 mb-4">
                <li>Données d'utilisation : informations techniques relatives à votre appareil, adresse IP, type de navigateur, pages visitées, durée de la session</li>
                <li>Données de prospection : données des prospects enrichis via l'usage de l'outil (emails, numéros de téléphone, etc.), dans le cadre de l'utilisation de notre service AI SDR Agent</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">3. Utilisation des données personnelles</h2>
              <p>Les données collectées sont utilisées pour les finalités suivantes :</p>
              
              <ul className="list-disc ml-6 mb-4">
                <li>Fournir nos services : gestion de votre compte, fourniture des services de prospection, mise à jour des leads, suivi des actions commerciales</li>
                <li>Améliorer nos services : analyse de l'utilisation de la plateforme, développement de nouvelles fonctionnalités, et amélioration continue de l'expérience utilisateur</li>
                <li>Communication : envoi d'informations relatives à votre compte, notifications de service, informations marketing et commerciales (si vous avez consenti à recevoir des communications)</li>
                <li>Conformité légale : respecter nos obligations légales, résoudre les litiges et protéger nos droits</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">4. Base légale du traitement</h2>
              <p>Le traitement de vos données personnelles est fondé sur plusieurs bases légales :</p>
              
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Exécution d'un contrat</strong> : le traitement des données est nécessaire pour l'exécution du contrat entre vous et chyll.ai (par exemple, pour la gestion de votre abonnement).</li>
                <li><strong>Consentement</strong> : lorsque vous vous inscrivez pour recevoir des communications marketing ou des informations promotionnelles.</li>
                <li><strong>Intérêts légitimes</strong> : améliorer nos services, effectuer des analyses internes pour améliorer l'expérience utilisateur.</li>
              </ul>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">5. Partage des données</h2>
              <p>
                Nous ne vendons ni ne louons vos données personnelles à des tiers. Toutefois, nous pouvons partager vos données avec 
                des partenaires de confiance ou prestataires de services qui nous aident à fournir nos services (par exemple, pour le 
                traitement des paiements ou l'envoi d'e-mails). Ces prestataires sont tenus par des contrats de confidentialité stricts.
              </p>
              <p>
                Nous pouvons également divulguer vos données si la loi nous y oblige ou dans le cadre d'une procédure judiciaire.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">6. Transfert de données</h2>
              <p>
                Vos données personnelles peuvent être transférées en dehors de l'Espace économique européen (EEE), dans le cadre de 
                l'utilisation de certains services tiers ou partenaires. Dans ce cas, nous nous assurons que les transferts de données 
                sont conformes aux exigences du RGPD et que les données sont protégées de manière adéquate.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">7. Sécurité des données</h2>
              <p>
                Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles 
                contre tout accès non autorisé, perte, divulgation ou altération. Cependant, aucune méthode de transmission de données 
                sur Internet ou de stockage électronique n'est totalement sécurisée, et nous ne pouvons garantir une sécurité absolue.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">8. Durée de conservation des données</h2>
              <p>
                Nous conservons vos données personnelles aussi longtemps que nécessaire pour fournir nos services, respecter nos 
                obligations légales et résoudre les litiges. Les données liées à votre compte seront conservées pendant la durée 
                de votre abonnement, puis archivées pendant une période de 3 ans.
              </p>
              <p>
                Les données relatives à la prospection (leads, contacts) sont conservées tant que vous utilisez notre service ou 
                sur demande de suppression de votre part.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">9. Vos droits</h2>
              <p>Conformément à la législation sur la protection des données, vous disposez des droits suivants :</p>
              
              <ul className="list-disc ml-6 mb-4">
                <li><strong>Droit d'accès</strong> : vous avez le droit de savoir quelles données personnelles nous détenons à votre sujet.</li>
                <li><strong>Droit de rectification</strong> : vous pouvez demander la correction de données inexactes ou la mise à jour de vos informations personnelles.</li>
                <li><strong>Droit à l'effacement</strong> : vous pouvez demander la suppression de vos données personnelles, sous réserve des exceptions légales.</li>
                <li><strong>Droit à la limitation du traitement</strong> : vous pouvez demander la limitation de l'utilisation de vos données dans certaines circonstances.</li>
                <li><strong>Droit à la portabilité</strong> : vous avez le droit de recevoir vos données personnelles dans un format structuré, couramment utilisé et lisible par machine.</li>
                <li><strong>Droit d'opposition</strong> : vous pouvez vous opposer à l'utilisation de vos données personnelles, notamment à des fins de marketing direct.</li>
              </ul>
              
              <p>
                Pour exercer vos droits, vous pouvez nous contacter à l'adresse suivante :<br />
                Email de contact : <a href="mailto:contact@generativschool.com" className="text-brand-blue hover:underline">contact@generativschool.com</a>
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">10. Cookies et technologies similaires</h2>
              <p>
                Nous utilisons des cookies et des technologies similaires pour améliorer votre expérience sur notre plateforme, 
                analyser l'utilisation de nos services et personnaliser notre contenu. Vous pouvez gérer vos préférences en matière 
                de cookies via les paramètres de votre navigateur.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">11. Modifications de la politique de confidentialité</h2>
              <p>
                Nous nous réservons le droit de modifier cette Politique de Confidentialité à tout moment. En cas de modification, 
                la nouvelle version sera publiée sur cette page avec la date de mise à jour. Nous vous encourageons à consulter 
                régulièrement cette page pour être informé de toute mise à jour.
              </p>
              
              <h2 className="text-2xl font-semibold mt-8 mb-4">12. Contact</h2>
              <p>
                Si vous avez des questions concernant cette Politique de Confidentialité ou si vous souhaitez exercer vos droits, 
                vous pouvez nous contacter à l'adresse suivante :
              </p>
              <p>
                GenerativSchool SAS<br />
                Email de contact : <a href="mailto:contact@generativschool.com" className="text-brand-blue hover:underline">contact@generativschool.com</a><br />
                Adresse : 60 rue François Premier, 75008 Paris, France
              </p>
              
              <p className="mt-8">
                Cette Politique de Confidentialité reflète notre engagement à protéger vos données personnelles et à respecter 
                vos droits en matière de confidentialité.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2 />
    </div>
  );
};

export default Privacy;
