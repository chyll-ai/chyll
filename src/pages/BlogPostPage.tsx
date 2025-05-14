
import React from 'react';
import BlogPostPageComponent from '@/components/blog/blog-post-page';
import { useParams } from 'react-router-dom';
import { initialBlogPosts, additionalBlogPosts, finalBlogPosts, productBlogPosts } from '@/components/blog/blog-data';

const BlogPostPage = () => {
  const { id } = useParams();
  const allPosts = [...initialBlogPosts, ...additionalBlogPosts, ...finalBlogPosts, ...productBlogPosts];
  const post = allPosts.find(post => post.id === Number(id));
  
  return <BlogPostPageComponent post={post} />;
};

export default BlogPostPage;
