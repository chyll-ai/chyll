
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarIcon, Clock, Tag } from 'lucide-react';
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from './blog-data';
import { BlogPost as BlogPostType } from './blog-card';
import SEOMetadata from '@/components/SEOMetadata';
import { getArticleSchema, getBreadcrumbSchema } from '@/utils/structuredData';
import { Suspense, lazy } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Lazy load images for performance
const LazyImage = lazy(() => import('@/components/common/LazyImage'));

// Helper function to parse dates safely
const parseAndFormatDate = (dateString: string) => {
  // Try to extract year from string like "5 avril 2025"
  const yearMatch = dateString.match(/\d{4}/);
  if (!yearMatch) return null; // No year found
  
  const year = parseInt(yearMatch[0]);
  
  // Use a safe default date with the correct year
  return `${year}-01-01T00:00:00.000Z`;
};

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Combine all blog posts to find the one with matching ID
  const allPosts = [
    ...initialBlogPosts,
    ...additionalBlogPosts,
    ...finalBlogPosts
  ];
  
  const post = allPosts.find(post => post.id === Number(id));
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar currentPath="/blog" />
        <div className="flex-1 container-custom py-20 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">Article non trouvé</h1>
          <p className="mb-8">L'article que vous recherchez n'existe pas ou a été supprimé.</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2" size={16} />
            Retour au Blog
          </Button>
        </div>
        <Footer2Demo />
      </div>
    );
  }
  
  // Safely format date for structured data
  const formattedDate = parseAndFormatDate(post.date);
  
  // Generate article schema only if we have a valid date
  const articleSchema = formattedDate ? getArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `https://chyll.com/blog/${post.id}`,
    imageUrl: post.imageUrl,
    publishDate: formattedDate,
    authorName: 'Soufiane Lemqari'
  }) : null;
  
  // Generate breadcrumb schema
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: 'Accueil', url: 'https://chyll.com' },
    { name: 'Blog', url: 'https://chyll.com/blog' },
    { name: post.title, url: `https://chyll.com/blog/${post.id}` }
  ]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title={post.title}
        description={post.excerpt}
        canonicalUrl={`/blog/${post.id}`}
        ogType="article"
        ogImage={post.imageUrl}
        articlePublishedTime={formattedDate || undefined}
        structuredData={{
          ...(articleSchema ? { article: articleSchema } : {}),
          breadcrumb: breadcrumbSchema
        }}
      />
      
      <Navbar currentPath="/blog" />
      
      <article className="flex-1">
        <div className="w-full h-[400px] relative">
          <Suspense fallback={<div className="w-full h-full bg-gray-200 animate-pulse" />}>
            <LazyImage 
              src={post.imageUrl} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </Suspense>
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-end">
            <div className="container-custom text-white pb-16">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <span className="flex items-center">
                  <CalendarIcon size={16} className="mr-1" />
                  {post.date}
                </span>
                <span className="flex items-center">
                  <Clock size={16} className="mr-1" />
                  {post.readTime}
                </span>
                <span className="flex items-center bg-indigo-700 bg-opacity-70 px-3 py-1 rounded-full">
                  <Tag size={16} className="mr-1" />
                  {post.category}
                </span>
                <span className="flex items-center">
                  Par Soufiane Lemqari, CEO
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl mb-6">{post.excerpt}</p>
              
              {generateBlogContent(post)}
              
              <div className="mt-12 pt-6 border-t">
                <h3 className="text-xl font-bold mb-3">À propos de l'auteur</h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold text-xl mr-4">
                    SL
                  </div>
                  <div>
                    <h4 className="font-bold">Soufiane Lemqari</h4>
                    <p className="text-gray-600">CEO & Founder, chyll</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Button onClick={() => navigate('/blog')} variant="outline">
                <ArrowLeft className="mr-2" size={16} />
                Retour au Blog
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer2Demo />
    </div>
  );
};

// Generate detailed educational blog content based on the blog post category
const generateBlogContent = (post: BlogPostType) => {
  // Create educational content based on the post category
  const getContentByCategory = () => {
    switch (post.category) {
      case "IA pour les Ventes":
        return [
          "L'IA conversationnelle représente une révolution majeure dans le domaine des ventes. Notre plateforme propose des assistants IA capables d'engager des conversations naturelles avec vos prospects, répondant à leurs questions et qualifiant leur intérêt en temps réel.",
          
          "L'un des principaux avantages de notre solution d'IA conversationnelle est sa capacité à fonctionner 24h/24, 7j/7, assurant qu'aucune opportunité commerciale n'est manquée, même en dehors des heures de bureau. Cet outil permet également de collecter des données précieuses sur les préoccupations et les besoins de vos prospects.",
          
          "Notre outil se distingue par sa capacité à adapter automatiquement son discours commercial en fonction des réponses du prospect. Si un client potentiel montre un intérêt pour une fonctionnalité spécifique, l'IA approfondira ce sujet, fournissant des informations détaillées et pertinentes.",
          
          "En pratique, nos clients ont constaté que l'IA conversationnelle permet de qualifier efficacement les prospects avant même qu'ils ne soient contactés par un commercial humain. Cela permet à vos équipes de se concentrer sur les prospects les plus prometteurs, augmentant ainsi leur productivité.",
          
          "Pour implémenter notre solution d'IA conversationnelle, il suffit d'intégrer notre widget sur votre site web ou de connecter notre API à vos canaux de communication existants. La configuration initiale prend généralement moins d'une journée, et notre équipe vous accompagne tout au long du processus.",
          
          "Notre système d'apprentissage continu permet à l'IA de s'améliorer avec chaque interaction, affinant ses réponses et ses stratégies de qualification au fil du temps. Vous pouvez également personnaliser les critères de qualification en fonction de vos objectifs commerciaux spécifiques."
        ];
      
      case "Analyse Prédictive":
        return [
          "Notre module d'analyse prédictive utilise des algorithmes sophistiqués pour identifier les modèles comportementaux dans les interactions client. En analysant des milliers de points de données, notre outil peut prédire avec une précision remarquable quels prospects sont les plus susceptibles de conclure un achat.",
          
          "L'un des aspects uniques de notre plateforme est sa capacité à détecter les signaux faibles - ces petits indices qui, ensemble, indiquent un intérêt croissant ou une intention d'achat. Notre algorithme a été entraîné sur des millions d'interactions commerciales pour reconnaître ces signaux subtils.",
          
          "En pratique, notre outil d'analyse prédictive examine les comportements comme le temps passé sur certaines pages, les téléchargements de ressources, les interactions sur les réseaux sociaux, et bien d'autres facteurs pour établir un score de propension à l'achat pour chaque prospect.",
          
          "Notre tableau de bord intuitif vous permet de visualiser ces données en temps réel, identifiant les prospects 'chauds' qui nécessitent une attention immédiate. Des alertes automatiques peuvent également être configurées pour notifier vos commerciaux dès qu'un prospect atteint un certain seuil de qualification.",
          
          "Pour mettre en place cette solution, vous devez d'abord connecter nos trackers à votre site web et à vos outils marketing. Notre équipe vous guide ensuite dans la configuration des paramètres spécifiques à votre secteur d'activité et à votre cycle de vente.",
          
          "Le système s'améliore en continu grâce à l'apprentissage automatique, s'adaptant à votre marché spécifique et à votre cycle de vente pour des prédictions toujours plus précises au fil du temps."
        ];
      
      case "Intégration IA":
      case "Agents Autonomes":
        return [
          "L'intégration de nos agents IA dans votre infrastructure existante est conçue pour être aussi simple et transparente que possible. Notre API REST documentée et nos connecteurs préconfigurés permettent une connexion rapide avec les principaux CRM du marché.",
          
          "Pour Salesforce, notre connecteur synchronise automatiquement les données entre votre CRM et notre plateforme IA. Les interactions gérées par nos agents sont enregistrées comme des activités dans Salesforce, et les scores de qualification sont ajoutés aux fiches prospect.",
          
          "Dans le cas de HubSpot, notre intégration permet non seulement le suivi des interactions, mais aussi le déclenchement automatique de workflows basés sur les insights générés par notre IA. Par exemple, un prospect montrant un fort intérêt peut être automatiquement placé dans une séquence d'emails personnalisés.",
          
          "Pour Pipedrive, notre agent IA peut créer et mettre à jour des deals en fonction des conversations avec les prospects, permettant une vision claire de votre pipeline commercial en temps réel.",
          
          "Notre documentation technique détaillée vous guide pas à pas dans le processus d'intégration, et notre équipe de support technique est disponible pour vous assister à chaque étape. La plupart de nos clients réussissent à configurer l'intégration en moins de 2 heures.",
          
          "Une fois l'intégration complétée, vous pouvez personnaliser les comportements de l'agent IA, définir des règles d'escalade vers vos commerciaux humains, et configurer des rapports automatiques pour suivre les performances."
        ];
      
      case "Études de Cas":
      case "Personnalisation":
        return [
          "Examinons comment cinq entreprises différentes ont transformé leur processus commercial grâce à nos outils d'IA, avec des résultats concrets et mesurables.",
          
          "Dans le secteur B2B, une entreprise de services informatiques a implémenté notre assistant commercial IA pour la qualification initiale des leads générés par leur site web. En trois mois, ils ont constaté une augmentation de 215% du taux de conversion des prospects, car chaque lead était instantanément engagé et qualifié avant d'être transmis à l'équipe commerciale.",
          
          "Une société de e-commerce a utilisé notre moteur de recommandation personnalisée pour suggérer des produits complémentaires pendant le parcours d'achat. Cette approche a augmenté la valeur moyenne des commandes de 37% et a généré plus de 200 000€ de revenus supplémentaires au cours du premier trimestre d'utilisation.",
          
          "Dans le secteur immobilier, une agence nationale a déployé notre IA d'analyse prédictive pour identifier les propriétaires susceptibles de vendre dans les prochains mois. Cette approche proactive a permis d'augmenter leur portefeuille de biens de 68% et leurs commissions de 124% en seulement six mois.",
          
          "Une entreprise SaaS a intégré notre chatbot IA à son processus d'onboarding client, offrant une assistance instantanée 24/7. Résultat : une réduction de 42% des demandes de support et une augmentation de 27% du taux de rétention client.",
          
          "Enfin, un groupe de distribution a utilisé notre solution d'automatisation du suivi client pour envoyer des messages personnalisés au bon moment. Cette stratégie a relancé 35% de clients inactifs et augmenté les ventes récurrentes de 86%. Le tout en réduisant de 65% le temps consacré au suivi manuel par l'équipe commerciale.",
          
          "Ces exemples concrets démontrent comment nos outils d'IA, correctement implémentés et personnalisés pour chaque secteur, peuvent transformer radicalement la performance commerciale d'une entreprise."
        ];
      
      case "Éthique IA":
      case "Sécurité":
        return [
          "L'éthique et la conformité sont au cœur de notre approche de l'IA pour les ventes. Nous avons développé nos outils selon le principe de 'Privacy by Design', intégrant la protection des données à chaque étape de notre processus de développement.",
          
          "Notre plateforme est entièrement conforme au RGPD, avec des fonctionnalités intégrées permettant de gérer facilement les droits des personnes concernées : droit d'accès, droit à l'effacement, droit à la portabilité des données, etc. Un tableau de bord dédié vous permet de traiter ces demandes en quelques clics.",
          
          "La transparence est un autre pilier de notre approche. Contrairement à certaines solutions 'boîte noire', nos algorithmes sont explicables et auditables. Nous fournissons des rapports détaillés sur les facteurs qui influencent les décisions de notre IA, vous permettant de comprendre pourquoi un prospect a été qualifié d'une certaine manière.",
          
          "En termes de sécurité, toutes les données sont chiffrées en transit et au repos, et nous effectuons des audits de sécurité réguliers. Nos serveurs sont hébergés en France et en Europe, garantissant que les données de vos clients restent dans un environnement juridique protecteur.",
          
          "Nous avons également mis en place des garde-fous éthiques dans nos algorithmes pour éviter toute discrimination ou biais. Par exemple, notre système de scoring des prospects est régulièrement analysé pour s'assurer qu'il ne défavorise aucun groupe démographique.",
          
          "Pour vous accompagner dans votre conformité, nous fournissons des modèles de clauses contractuelles et de mentions légales adaptées à l'utilisation de notre solution d'IA, ainsi qu'une documentation complète pour vos registres de traitement."
        ];
      
      case "Tutoriel":
      case "Formation":
        return [
          "La mise en place de votre premier assistant commercial IA peut sembler intimidante, mais notre processus en cinq étapes simplifie considérablement cette transition.",
          
          "Étape 1 : Configuration initiale - Commencez par vous connecter à votre tableau de bord et créer un nouveau projet d'assistant IA. Définissez les informations de base comme le nom de votre assistant, la langue principale, et le secteur d'activité. Cette étape est cruciale car elle détermine les modèles de base que nous utiliserons pour votre assistant.",
          
          "Étape 2 : Éducation de l'IA - Importez vos documents commerciaux (brochures, FAQ, fiches produits) dans notre système pour que l'IA puisse apprendre vos produits et services. Notre outil d'extraction automatique identifiera les informations clés et les structurera pour l'apprentissage de l'IA.",
          
          "Étape 3 : Personnalisation des conversations - Utilisez notre éditeur de flux conversationnels pour définir les scénarios de qualification et les arbres de décision. Notre interface drag-and-drop vous permet de créer visuellement des parcours conversationnels complexes sans compétences techniques.",
          
          "Étape 4 : Intégration et déploiement - Connectez votre assistant à votre site web via notre widget personnalisable, ou intégrez-le à vos canaux de communication existants (email, WhatsApp, Messenger). Un simple code à copier-coller suffit pour la plupart des intégrations.",
          
          "Étape 5 : Test et optimisation - Avant le déploiement complet, utilisez notre environnement de test pour simuler des conversations et affiner les réponses de l'IA. Notre outil d'analyse vous montre les points de friction potentiels et suggère des améliorations.",
          
          "Une fois ces étapes complétées, votre assistant est prêt à qualifier vos prospects 24/7. Notre tableau de bord vous permet ensuite de suivre ses performances et d'optimiser continuellement ses capacités."
        ];
      
      case "Intelligence Commerciale":
      case "Finance":
        return [
          "L'optimisation du cycle de vente grâce à l'analyse comportementale IA représente l'une des applications les plus puissantes de notre technologie. Notre module se distingue par sa capacité à analyser des schémas complexes dans le comportement des prospects.",
          
          "Concrètement, notre système analyse plus de 50 points de données pour chaque prospect : historique des interactions, engagement sur vos contenus, signaux d'intention sur les réseaux sociaux, saisonnalité des achats précédents, et bien d'autres facteurs. Cette analyse multidimensionnelle permet d'identifier avec précision la position du prospect dans le cycle d'achat.",
          
          "L'un des aspects les plus innovants de notre solution est la détection du 'moment optimal' pour chaque action commerciale. Par exemple, notre IA peut déterminer le meilleur moment pour envoyer une proposition commerciale, planifier une démonstration, ou effectuer une relance téléphonique, en fonction du comportement spécifique de chaque prospect.",
          
          "Pour mettre en œuvre cette analyse, notre plateforme commence par établir une base de référence en étudiant votre historique de ventes réussies. L'IA identifie les modèles comportementaux qui ont précédé les conversions passées et utilise ces informations pour prédire les conversions futures.",
          
          "En termes de ROI, nos clients constatent généralement une réduction de 40% de la durée du cycle de vente et une augmentation de 35% du taux de conversion. Ces améliorations sont directement attribuables à la capacité de notre IA à identifier le moment précis où un prospect est prêt à prendre une décision d'achat.",
          
          "Notre interface de reporting vous permet de visualiser clairement l'impact de ces optimisations sur vos KPIs commerciaux, avec des graphiques d'évolution et des analyses comparatives avant/après implémentation."
        ];
      
      case "IA Générative":
      case "Marketing IA":
        return [
          "Notre technologie d'IA générative pour les propositions commerciales représente une avancée majeure dans la personnalisation à grande échelle. Contrairement aux approches traditionnelles qui se contentent de remplacer quelques champs dans un modèle, notre système génère des documents entièrement personnalisés pour chaque prospect.",
          
          "Le processus commence par l'analyse approfondie du profil du prospect : secteur d'activité, taille de l'entreprise, interactions précédentes avec votre marque, pages consultées sur votre site, et même publications sur les réseaux sociaux professionnels. Ces données permettent à notre IA de comprendre les besoins spécifiques et les points de douleur du prospect.",
          
          "Ensuite, notre moteur génératif crée une proposition sur mesure qui met en avant les aspects de votre offre les plus pertinents pour ce prospect particulier. Par exemple, si l'analyse révèle que le prospect est particulièrement préoccupé par la sécurité des données, la proposition mettra l'accent sur vos certifications et protocoles de sécurité.",
          
          "L'aspect le plus révolutionnaire de notre solution est sa capacité à adapter le ton, le style et la complexité technique du document au profil du destinataire. Une proposition destinée à un directeur technique contiendra des détails techniques approfondis, tandis qu'une proposition pour un directeur financier mettra davantage l'accent sur le ROI et les aspects financiers.",
          
          "En termes de mise en œuvre, notre outil s'intègre parfaitement à votre CRM et à vos outils de gestion documentaire. Lorsqu'un commercial demande une proposition, notre système génère automatiquement un document personnalisé en quelques secondes, prêt à être révisé et envoyé.",
          
          "Les résultats parlent d'eux-mêmes : nos clients rapportent une augmentation moyenne de 60% du taux d'acceptation des propositions générées par notre IA, par rapport aux modèles standardisés qu'ils utilisaient auparavant."
        ];
      
      case "Développement Durable":
        return [
          "L'intégration de l'IA dans le processus commercial offre des avantages considérables en matière de développement durable, un aspect souvent négligé mais de plus en plus important pour les entreprises socialement responsables.",
          
          "Notre plateforme d'IA commerciale contribue à la réduction de l'empreinte carbone de plusieurs façons. Tout d'abord, en optimisant le ciblage des prospects, elle réduit considérablement le nombre de déplacements commerciaux inutiles. Nos analyses montrent que les entreprises utilisant notre solution diminuent en moyenne de 35% leurs déplacements commerciaux, tout en augmentant leurs résultats.",
          
          "La dématérialisation des supports commerciaux représente un autre avantage écologique majeur. Notre outil génère des propositions commerciales numériques interactives et personnalisées qui remplacent avantageusement les brochures et catalogues imprimés. Un de nos clients du secteur industriel a ainsi réduit sa consommation de papier de plus de 75% en un an.",
          
          "Notre solution de qualification automatisée des leads permet également d'optimiser l'allocation des ressources commerciales. En concentrant les efforts humains uniquement sur les prospects les plus prometteurs, elle réduit le gaspillage d'énergie et de ressources sur des pistes peu qualifiées.",
          
          "Pour quantifier l'impact positif de ces pratiques, nous avons développé un module de reporting environnemental qui calcule les économies de CO2 réalisées grâce à l'optimisation de votre processus commercial. Ce rapport peut être intégré à votre bilan RSE annuel.",
          
          "Notre engagement va au-delà des fonctionnalités : nos centres de données utilisent exclusivement des énergies renouvelables et nous avons mis en place une politique stricte de compensation carbone pour notre propre activité."
        ];
      
      default:
        // Default content for any other category
        return [
          `Notre approche de ${post.category} est fondée sur des années de recherche et développement dans le domaine de l'IA appliquée au processus commercial.`,
          
          "Nos outils d'intelligence artificielle sont conçus pour transformer chaque étape du cycle de vente, de la prospection initiale jusqu'au suivi post-vente, en automatisant les tâches répétitives et en fournissant des insights précieux pour les décisions stratégiques.",
          
          "Ce qui distingue notre solution est sa capacité d'adaptation à votre secteur d'activité spécifique et à votre processus de vente existant. Contrairement aux solutions génériques, notre IA apprend continuellement de vos données et de vos résultats pour s'améliorer avec le temps.",
          
          "L'implémentation de notre technologie est conçue pour être aussi fluide que possible, avec un temps de mise en place typiquement inférieur à deux semaines. Notre équipe d'experts vous accompagne à chaque étape, de la configuration initiale jusqu'à l'optimisation continue.",
          
          "Les bénéfices pour votre entreprise sont multiples : réduction du cycle de vente, augmentation du taux de conversion, amélioration de la satisfaction client, et optimisation de l'allocation des ressources commerciales.",
          
          "Pour commencer à transformer votre processus commercial avec notre solution d'IA, contactez notre équipe pour une démonstration personnalisée ou inscrivez-vous à notre webinaire hebdomadaire d'introduction."
        ];
    }
  };

  const paragraphs = getContentByCategory();

  // Return paragraphs with proper spacing
  return paragraphs.map((paragraph, index) => (
    <p key={index} className="mb-6">{paragraph}</p>
  ));
};

export default BlogPostPage;
