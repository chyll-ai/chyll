
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChatHeader: React.FC = () => {
  return (
    <header className="border-b p-4 flex items-center justify-between">
      <div className="flex items-center">
        <Link to="/" className="mr-4 hover:text-primary">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-2xl font-bold">Assistant chyll</h1>
      </div>
      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
    </header>
  );
};

export default ChatHeader;
