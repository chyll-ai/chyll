
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100">
      <div className="container-custom py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-brand-blue mb-4">
              <span className="text-gray-800">GenerativSchool</span>
            </div>
            <p className="text-gray-600 mb-4 max-w-md">
              Smart solutions for businesses looking to automate workflows, improve customer experience, and scale with AI.
            </p>
            <p className="text-gray-500 text-sm">
              © {currentYear} GenerativSchool. All rights reserved.
            </p>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#features" className="text-gray-600 hover:text-brand-blue transition-colors">Features</a></li>
              <li><a href="#how-it-works" className="text-gray-600 hover:text-brand-blue transition-colors">How It Works</a></li>
              <li><a href="#pricing" className="text-gray-600 hover:text-brand-blue transition-colors">Pricing</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-gray-800 font-medium mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">About</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">Contact</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">Privacy</a></li>
              <li><a href="#" className="text-gray-600 hover:text-brand-blue transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
