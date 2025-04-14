
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Play, Clock, Tag, ChevronRight } from 'lucide-react';

const AIWorkflows = () => {
  const sidebarLinks = [
    { title: 'All Videos', url: '/documentation/videos' },
    { title: 'Building AI Workflows', url: '/documentation/videos/ai-workflows', active: true },
    { title: 'Advanced Automation', url: '/documentation/videos/advanced-automation' },
    { title: 'Custom Integrations', url: '/documentation/videos/custom-integrations' },
    { title: 'Data Analysis', url: '/documentation/videos/data-analysis' },
  ];

  const videos = [
    {
      id: 'video1',
      title: 'Getting Started with AI Workflows',
      description: 'Learn the basics of building AI-powered workflows in GenerativSchool',
      duration: '8:42',
      thumbnail: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&h=400&fit=crop',
      level: 'Beginner'
    },
    {
      id: 'video5',
      title: 'Natural Language Processing in Workflows',
      description: 'Implement text analysis and NLP capabilities in your automations',
      duration: '18:07',
      thumbnail: 'https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=600&h=400&fit=crop',
      level: 'Advanced'
    },
    {
      id: 'video9',
      title: 'AI-Powered Document Processing',
      description: 'Extract information from documents using machine learning',
      duration: '14:23',
      thumbnail: 'https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600&h=400&fit=crop',
      level: 'Intermediate'
    },
    {
      id: 'video10',
      title: 'Sentiment Analysis Workflows',
      description: 'Build workflows that analyze text sentiment and trigger appropriate actions',
      duration: '11:15',
      thumbnail: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop',
      level: 'Intermediate'
    }
  ];

  return (
    <DocLayout
      title="Building AI Workflows"
      description="Learn how to implement AI capabilities in your automation workflows"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[
        { title: 'Video Tutorials', url: '/documentation/videos' },
        { title: 'Building AI Workflows', url: '/documentation/videos/ai-workflows' }
      ]}
      previousLink={{ title: 'All Videos', url: '/documentation/videos' }}
      nextLink={{ title: 'Advanced Automation', url: '/documentation/videos/advanced-automation' }}
    >
      <section className="mb-8">
        <p className="text-lg mb-6">
          Discover how to harness the power of artificial intelligence in your workflow automations. These tutorials will guide you through implementing AI features including natural language processing, document analysis, and more.
        </p>
      </section>

      <section className="mb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {videos.map((video) => (
            <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <div className="relative">
                <img 
                  src={video.thumbnail}
                  alt={`${video.title} thumbnail`}
                  className="w-full h-auto object-cover aspect-video"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <button className="bg-white bg-opacity-90 rounded-full p-3 hover:bg-opacity-100 transition-colors">
                    <Play className="h-6 w-6 text-indigo-600" />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  {video.duration}
                </div>
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{video.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    video.level === 'Beginner' ? 'bg-green-100 text-green-800' :
                    video.level === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                    'bg-indigo-100 text-indigo-800'
                  }`}>
                    {video.level}
                  </span>
                </div>
                <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                  Watch tutorial
                  <ChevronRight className="h-4 w-4 ml-1" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Related Resources</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">AI Model Documentation</h3>
            <p className="text-sm text-gray-700 mb-2">
              Explore our documentation on supported AI models and their capabilities.
            </p>
            <a href="#" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">Learn more</a>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="font-medium mb-2">API Integration Guide</h3>
            <p className="text-sm text-gray-700 mb-2">
              Connect to external AI services through our API integration system.
            </p>
            <a href="/documentation/api" className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">View guide</a>
          </div>
        </div>
      </section>
    </DocLayout>
  );
};

export default AIWorkflows;
