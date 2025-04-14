
import React from 'react';
import Navbar from '@/components/Navbar';
import { Footer2Demo } from '@/components/ui/footer2-demo';
import { Linkedin, Twitter, Mail } from 'lucide-react';

const TeamMember = ({ name, role, image, bio, social }: {
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    linkedin?: string;
    twitter?: string;
    email?: string;
  }
}) => (
  <div className="flex flex-col">
    <div className="relative overflow-hidden rounded-lg mb-4">
      <img src={image} alt={name} className="w-full h-80 object-cover" />
    </div>
    <h3 className="text-xl font-bold">{name}</h3>
    <p className="text-gray-600 mb-2">{role}</p>
    <p className="text-gray-700 mb-4">{bio}</p>
    <div className="flex gap-3 mt-auto">
      {social.linkedin && (
        <a href={social.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors">
          <Linkedin size={20} />
        </a>
      )}
      {social.twitter && (
        <a href={social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-600 hover:text-indigo-600 transition-colors">
          <Twitter size={20} />
        </a>
      )}
      {social.email && (
        <a href={`mailto:${social.email}`} className="text-gray-600 hover:text-indigo-600 transition-colors">
          <Mail size={20} />
        </a>
      )}
    </div>
  </div>
);

const Team = () => {
  const teamMembers = [
    {
      name: "Emma Laurent",
      role: "CEO & Co-founder",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=600",
      bio: "Emma brings over 15 years of experience in AI and machine learning, having previously led AI strategy at a Fortune 500 company.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "emma@generativschool.com"
      }
    },
    {
      name: "Thomas Moreau",
      role: "CTO & Co-founder",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&q=80&w=600",
      bio: "Previously a lead engineer at Google AI, Thomas is passionate about building scalable AI systems that solve real business problems.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "thomas@generativschool.com"
      }
    },
    {
      name: "Sophie Chen",
      role: "Head of AI Research",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=600",
      bio: "With a PhD in Computer Science from MIT, Sophie leads our AI research team, focusing on developing cutting-edge AI models.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "sophie@generativschool.com"
      }
    },
    {
      name: "David Kowalski",
      role: "VP of Customer Success",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=600",
      bio: "David ensures our clients get the most value from our AI solutions, with a background in customer experience and enterprise software.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "david@generativschool.com"
      }
    },
    {
      name: "Amara Okafor",
      role: "Head of Product",
      image: "https://images.unsplash.com/photo-1589156280159-27698a70f29e?auto=format&fit=crop&q=80&w=600",
      bio: "Amara combines her background in UX design and AI to create products that are both powerful and easy to use.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "amara@generativschool.com"
      }
    },
    {
      name: "Jean-Pierre Dubois",
      role: "Chief Business Officer",
      image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
      bio: "Jean-Pierre brings 20+ years of experience in business development and strategy for technology companies.",
      social: {
        linkedin: "#",
        twitter: "#",
        email: "jp@generativschool.com"
      }
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <section className="flex-grow py-16 bg-white">
        <div className="container-custom">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-center">Our Team</h1>
            <p className="text-lg text-gray-600 mb-12 text-center max-w-3xl mx-auto">
              Meet the talented individuals behind GenerativSchool, combining expertise in AI, business, 
              and customer experience to create transformative solutions for businesses.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-16">
              {teamMembers.map((member, index) => (
                <TeamMember key={index} {...member} />
              ))}
            </div>
            
            <div className="mt-20 text-center">
              <h2 className="text-2xl font-bold mb-6">Join Our Team</h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                We're always looking for talented individuals who are passionate about AI and creating exceptional customer experiences.
              </p>
              <a 
                href="/careers" 
                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
              >
                View Open Positions
              </a>
            </div>
          </div>
        </div>
      </section>
      
      <Footer2Demo />
    </div>
  );
};

export default Team;
