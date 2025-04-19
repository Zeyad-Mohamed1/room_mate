'use client';
import { useState, useEffect } from 'react';
import { X, MessageSquare, HelpCircle, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

const WelcomeDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    // Check if the dialog has been shown before
    const hasSeenDialog = localStorage.getItem('hasSeenWelcomeDialog');
    
    if (!hasSeenDialog) {
      // Show the dialog after a short delay
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Set flag in localStorage to prevent showing again
    localStorage.setItem('hasSeenWelcomeDialog', 'true');
  };

  const handleNextStep = () => {
    setStep(2);
  };

  const handlePrevStep = () => {
    setStep(1);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scaleIn">
        <div className="flex justify-between items-start mb-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <MessageSquare className="h-6 w-6 text-primary" />
          </div>
          <button 
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close dialog"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {step === 1 ? (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Welcome to RoommateFinder!</h3>
            
            <p className="text-gray-600 mb-4">
              We're here to help you find your perfect roommate or living space. Browse through our listings to discover what's available.
            </p>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Can't find what you're looking for?</span> Our admin team is here to help! Contact us directly and we'll assist you in finding the perfect match.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleNextStep}
                className="flex-1 px-4 py-2.5 bg-gradient text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm"
              >
                Learn More
              </button>
              <button
                onClick={handleClose}
                className="flex-1 px-4 py-2.5 text-primary border border-primary rounded-lg hover:bg-gradient-subtle transition-colors font-medium text-sm"
              >
                Got it, thanks!
              </button>
            </div>
          </>
        ) : (
          <>
            <h3 className="text-xl font-bold text-gray-800 mb-2">How We Can Help</h3>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <HelpCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Personalized Assistance</h4>
                  <p className="text-gray-600 text-sm">Our team can help you find properties that match your specific requirements.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Email Support</h4>
                  <p className="text-gray-600 text-sm">Contact us at <span className="text-primary">support@roommatefinder.com</span></p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h4 className="font-medium text-gray-800">Phone Support</h4>
                  <p className="text-gray-600 text-sm">Call us at <span className="text-primary">+1 (555) 123-4567</span></p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handlePrevStep}
                className="flex-1 px-4 py-2.5 text-primary border border-primary rounded-lg hover:bg-gradient-subtle transition-colors font-medium text-sm"
              >
                Back
              </button>
              <Link
                href="/contact"
                className="flex-1 px-4 py-2.5 bg-gradient text-white rounded-lg hover:opacity-90 transition-opacity font-medium text-sm text-center"
              >
                Contact Admin
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default WelcomeDialog; 