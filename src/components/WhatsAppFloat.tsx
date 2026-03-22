import { MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WhatsAppFloat = () => {
  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Hi! I'm interested in AEDI Security's cybersecurity services. Can you help me?");
    const phoneNumber = "254714796254";
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  };

  return (
    <div className="whatsapp-float">
      <Button
        onClick={handleWhatsAppClick}
        size="lg"
        className="bg-green-500 hover:bg-green-600 text-white rounded-full h-14 w-14 p-0 shadow-lg hover:shadow-xl transition-all duration-300 group"
      >
        <MessageCircle className="h-6 w-6 group-hover:scale-110 transition-transform duration-200" />
      </Button>
      <div className="absolute -top-12 right-0 bg-cyber-dark text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
        Chat with a Cybersecurity Expert
      </div>
    </div>
  );
};

export default WhatsAppFloat;