import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CalendarIcon, Clock, Tag } from 'lucide-react';
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts, initialBlogPostsFr } from './blog-data';
import { BlogPost as BlogPostType } from './blog-card';
import SEOMetadata from '@/components/SEOMetadata';
import { getArticleSchema, getBreadcrumbSchema } from '@/utils/structuredData';
import { Suspense, lazy } from 'react';
import { useLanguage } from '@/context/LanguageContext';

// Lazy load images for performance
const LazyImage = lazy(() => import('@/components/common/LazyImage'));

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  
  // Combine all blog posts to find the one with matching ID
  const allPosts = [
    ...(language === 'fr' ? initialBlogPostsFr : initialBlogPosts),
    ...additionalBlogPosts,
    ...finalBlogPosts
  ];
  
  const post = allPosts.find(post => post.id === Number(id));
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar currentPath="/blog" />
        <div className="flex-1 container-custom py-20 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">
            {language === 'fr' ? 'Article non trouvé' : 'Blog Post Not Found'}
          </h1>
          <p className="mb-8">
            {language === 'fr' 
              ? "L'article que vous recherchez n'existe pas ou a été supprimé."
              : "The blog post you're looking for doesn't exist or has been removed."}
          </p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2" size={16} />
            {language === 'fr' ? 'Retour au Blog' : 'Back to Blog'}
          </Button>
        </div>
        <Footer2Demo />
      </div>
    );
  }
  
  // Format date for structured data
  const formattedDate = new Date(post.date).toISOString();
  
  // Generate article schema
  const articleSchema = getArticleSchema({
    title: post.title,
    description: post.excerpt,
    url: `https://generativschool.com/blog/${post.id}`,
    imageUrl: post.imageUrl,
    publishDate: formattedDate,
    authorName: 'Soufiane Lemqari'
  });
  
  // Generate breadcrumb schema
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: language === 'fr' ? 'Accueil' : 'Home', url: 'https://generativschool.com' },
    { name: 'Blog', url: 'https://generativschool.com/blog' },
    { name: post.title, url: `https://generativschool.com/blog/${post.id}` }
  ]);
  
  return (
    <div className="min-h-screen flex flex-col">
      <SEOMetadata 
        title={post.title}
        description={post.excerpt}
        canonicalUrl={`/blog/${post.id}`}
        ogType="article"
        ogImage={post.imageUrl}
        articlePublishedTime={formattedDate}
        structuredData={{
          article: articleSchema,
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
                  {language === 'fr' ? 'Par' : 'By'} Soufiane Lemqari, CEO
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="container-custom py-12">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="lead text-xl mb-6">{post.excerpt}</p>
              
              {generateBlogContent(post, language)}
              
              <div className="mt-12 pt-6 border-t">
                <h3 className="text-xl font-bold mb-3">
                  {language === 'fr' ? "À propos de l'auteur" : 'About the Author'}
                </h3>
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold text-xl mr-4">
                    SL
                  </div>
                  <div>
                    <h4 className="font-bold">Soufiane Lemqari</h4>
                    <p className="text-gray-600">CEO & Founder, GenerativSchool</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-10">
              <Button onClick={() => navigate('/blog')} variant="outline">
                <ArrowLeft className="mr-2" size={16} />
                {language === 'fr' ? 'Retour au Blog' : 'Back to Blog'}
              </Button>
            </div>
          </div>
        </div>
      </article>
      
      <Footer2Demo />
    </div>
  );
};

// Generate detailed blog content based on the blog post
const generateBlogContent = (post: BlogPostType, language: 'en' | 'fr') => {
  // Create consistent content based on the post ID and language
  const paragraphs = language === 'fr' ? [
    `Dans le paysage technologique en constante évolution d'aujourd'hui, ${post.category} est à l'avant-garde de l'innovation et de la transformation. Chez GenerativSchool, nous suivons de près les développements dans ce domaine et mettons en œuvre des solutions de pointe pour nos clients.`,
    
    `L'importance de ${post.category} ne peut être surestimée. Alors que les entreprises continuent de naviguer dans les complexités de la transformation numérique, celles qui adoptent ces technologies acquièrent un avantage concurrentiel significatif. Notre équipe chez GenerativSchool a développé un cadre complet pour aider les organisations à mettre en œuvre efficacement les solutions ${post.category}.`,
    
    `L'un des principaux défis dans l'adoption de ${post.category} est de trouver le bon équilibre entre innovation et praticité. De nombreuses entreprises se précipitent pour mettre en œuvre de nouvelles technologies sans comprendre clairement comment elles s'alignent sur leurs objectifs stratégiques. Chez GenerativSchool, nous préconisons une approche mesurée qui commence par identifier les problèmes commerciaux spécifiques pouvant être résolus grâce à ${post.category}.`,
    
    `Prenons l'exemple de l'un de nos clients, une entreprise de taille moyenne qui luttait contre des inefficacités opérationnelles. En mettant en œuvre notre solution ${post.category}, ils ont pu automatiser les tâches routinières, libérant ainsi de précieuses ressources humaines pour des initiatives plus stratégiques. Le résultat a été une augmentation de 40 % de la productivité et une amélioration significative de la satisfaction des employés.`,
    
    `Pour l'avenir, nous prévoyons plusieurs développements importants dans l'espace ${post.category}. Premièrement, nous nous attendons à voir une intégration plus sophistiquée entre différentes technologies d'IA, créant des solutions plus complètes et plus puissantes. Deuxièmement, à mesure que les cadres réglementaires évoluent, l'accent sera mis davantage sur les considérations éthiques et la transparence des algorithmes d'IA.`,
    
    `Chez GenerativSchool, nous restons engagés à rester à la pointe de ${post.category} tout en veillant à ce que nos solutions soient accessibles, pratiques et alignées sur les objectifs commerciaux de nos clients. Nous croyons que le véritable potentiel de ces technologies ne réside pas dans leur complexité, mais dans leur capacité à résoudre des problèmes du monde réel et à créer une valeur tangible.`,
    
    `Alors que nous continuons d'innover et d'étendre nos offres, nous invitons les entreprises de toutes tailles à nous rejoindre dans ce voyage de transformation numérique. Que vous commenciez tout juste à explorer les possibilités de ${post.category} ou que vous cherchiez à améliorer vos capacités existantes, GenerativSchool est là pour vous aider à naviguer vers l'avenir.`
  ] : [
    `In today's rapidly evolving technological landscape, ${post.category} stands at the forefront of innovation and transformation. At GenerativSchool, we've been closely monitoring the developments in this field and implementing cutting-edge solutions for our clients.`,
    
    `The importance of ${post.category} cannot be overstated. As businesses continue to navigate the complexities of digital transformation, those who embrace these technologies gain a significant competitive advantage. Our team at GenerativSchool has developed a comprehensive framework to help organizations implement ${post.category} solutions effectively.`,
    
    `One of the key challenges in adopting ${post.category} is finding the right balance between innovation and practicality. Many businesses rush to implement new technologies without a clear understanding of how they align with their strategic objectives. At GenerativSchool, we advocate for a measured approach that begins with identifying specific business problems that can be addressed through ${post.category}.`,
    
    `Consider the case of one of our clients, a mid-sized enterprise that was struggling with operational inefficiencies. By implementing our ${post.category} solution, they were able to automate routine tasks, freeing up valuable human resources for more strategic initiatives. The result was a 40% increase in productivity and a significant improvement in employee satisfaction.`,
    
    `Looking ahead, we anticipate several important developments in the ${post.category} space. First, we expect to see more sophisticated integration between different AI technologies, creating more comprehensive and powerful solutions. Second, as regulatory frameworks evolve, there will be an increased focus on ethical considerations and transparency in AI algorithms.`,
    
    `At GenerativSchool, we remain committed to staying at the cutting edge of ${post.category} while ensuring our solutions are accessible, practical, and aligned with our clients' business objectives. We believe that the true potential of these technologies lies not in their complexity, but in their ability to solve real-world problems and create tangible value.`,
    
    `As we continue to innovate and expand our offerings, we invite businesses of all sizes to join us on this journey of digital transformation. Whether you're just beginning to explore the possibilities of ${post.category} or looking to enhance your existing capabilities, GenerativSchool is here to help you navigate the path forward.`
  ];

  // Return paragraphs with proper spacing
  return paragraphs.map((paragraph, index) => (
    <p key={index} className="mb-6">{paragraph}</p>
  ));
};

export default BlogPostPage;
