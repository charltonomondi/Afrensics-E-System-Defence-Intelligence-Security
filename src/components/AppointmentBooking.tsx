import { ExternalLink } from 'lucide-react';
import aediLogo from '@/assets/favicon_logo/aedi.jpeg';

interface AppointmentBookingProps {
  className?: string;
}

const AppointmentBooking = ({ className = "" }: AppointmentBookingProps) => {
  const handleBookingClick = () => {
    window.open('https://calendly.com/aedisecurity-info/30min', '_blank', 'noopener,noreferrer');
  };

  return (
    <div 
      className={`flex items-center mt-8 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg cursor-pointer hover:from-blue-100 hover:to-indigo-100 transition-all duration-300 shadow-sm hover:shadow-md ${className}`}
      onClick={handleBookingClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleBookingClick();
        }
      }}
    >
      <img 
        src={aediLogo} 
        alt="AEDI Logo" 
        className="h-10 w-10 rounded mr-3 flex-shrink-0" 
      />
      <div className="flex-grow">
        <span className="font-bold text-lg text-gray-800 block">
          Book an appointment with our professionals today.
        </span>
        <span className="text-sm text-gray-600 mt-1 block">
          Get expert cybersecurity consultation - Click to schedule your free 30-minute session
        </span>
      </div>
      <ExternalLink className="h-5 w-5 text-blue-600 ml-3 flex-shrink-0" />
    </div>
  );
};

export default AppointmentBooking;
