
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Footer2 } from '@/components/ui/footer2';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';
import { useLanguage } from '@/context/LanguageContext';

const BlogPostPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  
  // Find the blog post with the matching ID
  const allPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts];
  const post = allPosts.find(post => post.id.toString() === id);
  
  if (!post) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar currentPath="/blog" />
        <div className="flex-1 container mx-auto py-20 flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">{t.blog?.postNotFound || "Article non trouvé"}</h1>
          <p className="mb-8">{t.blog?.postNotFoundDesc || "L'article que vous recherchez n'existe pas ou a été supprimé."}</p>
          <Button onClick={() => navigate('/blog')}>
            <ArrowLeft className="mr-2" size={16} />
            {t.blog?.backToBlog || "Retour au Blog"}
          </Button>
        </div>
        <Footer2 />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar currentPath="/blog" />
      
      <article className="flex-1 container mx-auto py-16 px-4">
        <Button onClick={() => navigate('/blog')} variant="outline" className="mb-8">
          <ArrowLeft className="mr-2" size={16} />
          Retour au Blog
        </Button>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <span className="bg-indigo-100 text-indigo-800 text-sm font-medium px-3 py-1 rounded-full">
              {post.category}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-bold mb-6">{post.title}</h1>
          
          <div className="flex items-center text-gray-600 mb-8">
            <span>{post.date}</span>
            <span className="mx-2">•</span>
            <span>{post.readTime}</span>
          </div>
          
          <div className="aspect-[16/9] overflow-hidden rounded-lg mb-10">
            <img 
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="prose prose-lg max-w-none">
            <p className="lead text-xl">{post.excerpt}</p>
            
            <p>Nous travaillons actuellement sur le contenu complet de cet article. Revenez bientôt pour découvrir l'article dans son intégralité.</p>
            
            <p>Pour plus d'informations sur nos solutions de prospection B2B alimentées par l'IA, n'hésitez pas à nous contacter ou à demander une démonstration.</p>
          </div>
        </div>
      </article>
      
      <Footer2 />
    </div>
  );
};

export default BlogPostPage;
