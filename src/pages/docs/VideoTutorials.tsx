
import React from 'react';
import DocLayout from '@/components/DocLayout';
import { Play, Clock, ChevronRight } from 'lucide-react';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: 'ai-workflows' | 'advanced-automation' | 'custom-integrations' | 'data-analysis';
  level: 'Beginner' | 'Intermediate' | 'Advanced';
}

const VideoTutorials = () => {
  const sidebarLinks = [
    { title: 'All Videos', url: '/documentation/videos', active: true },
    { title: 'Building AI Workflows', url: '/documentation/videos/ai-workflows' },
    { title: 'Advanced Automation', url: '/documentation/videos/advanced-automation' },
    { title: 'Custom Integrations', url: '/documentation/videos/custom-integrations' },
    { title: 'Data Analysis', url: '/documentation/videos/data-analysis' },
  ];

  const videos: VideoTutorial[] = [
    {
      id: 'video1',
      title: 'Getting Started with AI Workflows',
      description: 'Learn the basics of building AI-powered workflows in GenerativSchool',
      duration: '8:42',
      thumbnail: 'https://images.unsplash.com/photo-1516110833967-0b5716ca1387?w=600&h=400&fit=crop',
      category: 'ai-workflows',
      level: 'Beginner'
    },
    {
      id: 'video2',
      title: 'Advanced Conditional Logic in Automation Flows',
      description: 'Master complex decision trees and conditional branching in your workflows',
      duration: '12:15',
      thumbnail: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
      category: 'advanced-automation',
      level: 'Advanced'
    },
    {
      id: 'video3',
      title: 'Building Custom API Integrations',
      description: 'Connect to any external API and process data in your workflows',
      duration: '15:33',
      thumbnail: 'https://images.unsplash.com/photo-1580894908361-967195033215?w=600&h=400&fit=crop',
      category: 'custom-integrations',
      level: 'Intermediate'
    },
    {
      id: 'video4',
      title: 'Data Analysis Dashboards',
      description: 'Create powerful data visualizations from your workflow results',
      duration: '10:21',
      thumbnail: 'https://images.unsplash.com/photo-1560807707-8cc77767d783?w=600&h=400&fit=crop',
      category: 'data-analysis',
      level: 'Intermediate'
    },
    {
      id: 'video5',
      title: 'Natural Language Processing in Workflows',
      description: 'Implement text analysis and NLP capabilities in your automations',
      duration: '18:07',
      thumbnail: 'https://images.unsplash.com/photo-1555421689-3f034debb7a6?w=600&h=400&fit=crop',
      category: 'ai-workflows',
      level: 'Advanced'
    },
    {
      id: 'video6',
      title: 'Error Handling and Retry Logic',
      description: 'Build robust workflows that gracefully handle failures and retry operations',
      duration: '9:46',
      thumbnail: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=600&h=400&fit=crop',
      category: 'advanced-automation',
      level: 'Intermediate'
    },
    {
      id: 'video7',
      title: 'Webhook Integration Patterns',
      description: 'Learn different patterns for webhook-based integrations and callbacks',
      duration: '14:29',
      thumbnail: 'https://images.unsplash.com/photo-1581472723648-909f4851d4ae?w=600&h=400&fit=crop',
      category: 'custom-integrations',
      level: 'Intermediate'
    },
    {
      id: 'video8',
      title: 'Predictive Analytics with Workflow Data',
      description: 'Use historical workflow data to build predictive models',
      duration: '20:15',
      thumbnail: 'https://images.unsplash.com/photo-1599658880436-c61792e70672?w=600&h=400&fit=crop',
      category: 'data-analysis',
      level: 'Advanced'
    },
  ];

  // Group videos by category
  const videosByCategory = {
    'ai-workflows': videos.filter(v => v.category === 'ai-workflows'),
    'advanced-automation': videos.filter(v => v.category === 'advanced-automation'),
    'custom-integrations': videos.filter(v => v.category === 'custom-integrations'),
    'data-analysis': videos.filter(v => v.category === 'data-analysis'),
  };

  const categoryLabels = {
    'ai-workflows': 'Building AI Workflows',
    'advanced-automation': 'Advanced Automation Techniques',
    'custom-integrations': 'Custom Integrations',
    'data-analysis': 'Data Analysis Features',
  };

  return (
    <DocLayout
      title="Video Tutorials"
      description="Learn through comprehensive video guides covering all aspects of GenerativSchool"
      sidebarLinks={sidebarLinks}
      breadcrumbs={[{ title: 'Video Tutorials', url: '/documentation/videos' }]}
    >
      <div className="space-y-12">
        {/* Featured Video */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Featured Tutorial</h2>
          <div className="rounded-lg overflow-hidden border border-gray-200">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=1200&h=675&fit=crop" 
                alt="Featured tutorial thumbnail" 
                className="w-full h-auto object-cover aspect-video"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <button className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-colors">
                  <Play className="h-8 w-8 text-indigo-600" />
                </button>
              </div>
              <div className="absolute bottom-4 right-4 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                12:15
              </div>
            </div>
            <div className="p-4 bg-white">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-semibold">Advanced Conditional Logic in Automation Flows</h3>
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Advanced</span>
              </div>
              <p className="text-gray-700 mb-3">
                Master complex decision trees and conditional branching in your workflows. This tutorial covers everything from basic if/else conditions to complex branching logic with multiple paths.
              </p>
              <a href="#" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 font-medium">
                Watch tutorial
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
          </div>
        </section>

        {/* Videos by category */}
        {(Object.entries(videosByCategory) as [keyof typeof categoryLabels, VideoTutorial[]][]).map(([category, videos]) => (
          <section key={category}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">{categoryLabels[category]}</h2>
              <a href={`/documentation/videos/${category}`} className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center">
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </a>
            </div>
            
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
        ))}
        
        <section>
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h2 className="text-xl font-bold mb-3">Request a Tutorial</h2>
            <p className="text-gray-700 mb-4">
              Can't find what you're looking for? Let us know what topics you'd like to see covered in future tutorials.
            </p>
            <a href="/support" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors">
              Suggest a Topic
            </a>
          </div>
        </section>
      </div>
    </DocLayout>
  );
};

export default VideoTutorials;
