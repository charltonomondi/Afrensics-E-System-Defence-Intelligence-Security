import React, { useState, useEffect } from 'react';
import { X, Sparkles, ArrowRight, CheckCircle, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link } from 'react-router-dom';

interface BiloHubAIPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const BiloHubAIPopup: React.FC<BiloHubAIPopupProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Animate content in
      setTimeout(() => setShowContent(true), 100);
    } else {
      setShowContent(false);
    }
  }, [isOpen]);

  // Handle ESC key
  useEffect(() => {
    if (isOpen) {
      const handleEscKey = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          onClose();
        }
      };
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, onClose]);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Popup Content */}
      <div 
        className={`relative w-full max-w-md transform transition-all duration-500 ${
          showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div 
          className="relative rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30"
          style={{
            background: 'linear-gradient(135deg, #0a0f1a 0%, #111827 100%)'
          }}
        >
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-teal-500/10 rounded-full blur-2xl" />
            {/* Grid pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(6,182,212,0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(6,182,212,0.1) 1px, transparent 1px)
                `,
                backgroundSize: '20px 20px'
              }}
            />
          </div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors border border-cyan-500/30"
          >
            <X className="w-4 h-4 text-cyan-300" />
          </button>

          {/* Content */}
          <div className="relative p-6 text-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/30 mb-4">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-300 text-xs font-medium">NEW</span>
            </div>

            {/* Title */}
            <h2 
              className="text-2xl font-bold mb-2"
              style={{
                background: 'linear-gradient(135deg, #22d3ee, #2dd4bf)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Introducing BiloHub AI
            </h2>
            
            <p className="text-gray-300 mb-6 text-sm">
              Africa's Premier AI Business Platform is coming soon! 
              Subscribe to get exclusive early access and launch updates.
            </p>

            {subscribed ? (
              <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                <CheckCircle className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                <p className="text-white font-medium">You're on the list!</p>
                <p className="text-cyan-200 text-sm">We'll notify you when we launch.</p>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-cyan-400" />
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-cyan-500/30 text-white placeholder:text-cyan-200/50 focus:border-cyan-500"
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 border-0"
                >
                  Subscribe for Updates
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
                <p className="text-xs text-cyan-200/60">
                  Join 500+ business owners waiting for BiloHub AI
                </p>
              </form>
            )}

            {/* Learn More Link */}
            <div className="mt-4 pt-4 border-t border-cyan-500/20">
              <Link 
                to="/bilohub-ai" 
                onClick={onClose}
                className="text-cyan-300 hover:text-cyan-200 text-sm font-medium inline-flex items-center gap-1"
              >
                Learn more about BiloHub AI
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Decorative corners */}
          <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-cyan-500/30" />
          <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-cyan-500/30" />
          <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-cyan-500/30" />
          <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-cyan-500/30" />
        </div>
      </div>
    </div>
  );
};

export default BiloHubAIPopup;
