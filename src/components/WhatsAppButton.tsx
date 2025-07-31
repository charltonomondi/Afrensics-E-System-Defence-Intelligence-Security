import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WhatsAppButtonProps {
  phoneNumber?: string;
  message?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'button' | 'floating';
  children?: React.ReactNode;
}

const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  phoneNumber = "254743141928",
  message = "Hi! I'm interested in AEDI Security's cybersecurity services. Can you help me?",
  className = "",
  size = 'md',
  variant = 'icon',
  children
}) => {
  const handleWhatsAppClick = () => {
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  };

  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-10 w-10',
    lg: 'h-12 w-12'
  };

  const iconSizes = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6'
  };

  if (variant === 'floating') {
    return (
      <div className={`fixed bottom-6 right-6 z-50 ${className}`}>
        <Button
          onClick={handleWhatsAppClick}
          className={`${sizeClasses[size]} bg-green-500 hover:bg-green-600 text-white rounded-full p-0 shadow-lg hover:shadow-xl transition-all duration-300 group animate-pulse hover:animate-none`}
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className={`${iconSizes[size]} group-hover:scale-110 transition-transform duration-200`} />
        </Button>
        <div className="absolute -top-12 right-0 bg-gray-800 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
          Chat with a Cybersecurity Expert
        </div>
      </div>
    );
  }

  if (variant === 'button') {
    return (
      <Button
        onClick={handleWhatsAppClick}
        className={`bg-green-500 hover:bg-green-600 text-white ${className}`}
        title="Chat with us on WhatsApp"
      >
        <MessageCircle className={`${iconSizes[size]} mr-2`} />
        {children || 'WhatsApp'}
      </Button>
    );
  }

  // Default icon variant
  return (
    <button
      onClick={handleWhatsAppClick}
      className={`text-current hover:text-green-500 transition-colors duration-200 ${className}`}
      title="Chat with us on WhatsApp"
      aria-label="Contact us on WhatsApp"
    >
      <MessageCircle className={iconSizes[size]} />
    </button>
  );
};

export default WhatsAppButton;
