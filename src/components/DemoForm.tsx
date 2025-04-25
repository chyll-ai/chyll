
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Calendar, Mail, Phone, User } from 'lucide-react';

const DemoForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Redirect to new booking page
    window.location.href = "https://cal.com/generativschool/30min?overlayCalendar=true";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Full Name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="pl-10"
        />
      </div>
      
      <div className="relative">
        <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="email"
          placeholder="Work Email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="pl-10"
        />
      </div>
      
      <div className="relative">
        <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          type="tel"
          placeholder="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          className="pl-10"
        />
      </div>
      
      <div className="relative">
        <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <Input
          placeholder="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          className="pl-10"
        />
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-brand-blue hover:bg-brand-blue-dark"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Redirecting..." : "Book Your Demo"}
      </Button>
      
      <p className="text-xs text-gray-500 text-center">
        By submitting, you agree to our Privacy Policy and Terms of Service.
      </p>
    </form>
  );
};

export default DemoForm;
