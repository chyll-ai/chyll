
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { useLocation } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import { BlogList } from '@/components/blog/blog-list';
import { initialBlogPostsFr, additionalBlogPosts, finalBlogPosts } from '@/components/blog/blog-data';
import { BlogPost } from '@/components/blog/blog-card';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>(initialBlogPostsFr);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const location = useLocation();

  const loadMoreArticles = () => {
    setIsLoading(true);

    // Simulate a network request
    setTimeout(() => {
      if (page === 1) {
        setBlogPosts([...blogPosts, ...additionalBlogPosts]);
        setPage(2);
        setIsLoading(false);
      } else if (page === 2) {
        setBlogPosts([...blogPosts, ...finalBlogPosts]);
        setPage(3);
        setHasMore(false);
        setIsLoading(false);
        toast({
          title: "Tous les articles ont été chargés",
          description: "Vous avez atteint la fin de notre blog.",
          duration: 3000,
        });
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="bg-indigo-50 py-20">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-lg text-gray-700">
              Découvrez nos dernières actualités, conseils et ressources pour optimiser votre prospection et développer votre business.
            </p>
          </div>
        </div>
      </section>
      
      <section className="py-16">
        <div className="container-custom">
          <BlogList 
            posts={blogPosts}
            isLoading={isLoading}
            hasMore={hasMore}
            onLoadMore={loadMoreArticles}
          />
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Blog;
