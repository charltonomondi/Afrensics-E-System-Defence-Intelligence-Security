// EmailJS Configuration for AEDI Security
// Replace these with your actual EmailJS credentials

export const emailjsConfig = {
  // Your EmailJS Service ID (from EmailJS dashboard)
  serviceId: 'service_ccbllzq', // Replace with your actual service ID
  
  // Your EmailJS Template ID (from EmailJS dashboard)
  templateId: 'template_jeznh6e', // Replace with your actual template ID
  
  // Your EmailJS Public Key (from EmailJS dashboard)
  publicKey: 'xouy090qSXohX08Qu', // Replace with your actual public key
  
  // Recipient email (your business email)
  recipientEmail: 'info@aedisecurity.com',
  
  // Default messages for different scenarios
  messages: {
    success: {
      title: "Message Sent Successfully! ✅",
      description: "Thank you for contacting us! We'll get back to you within 24 hours. The form will clear automatically."
    },
    error: {
      title: "Failed to Send Message ❌",
      description: "Something went wrong. Please try again or contact us directly at info@aedisecurity.com"
    },
    validation: {
      required: "Please fill in all required fields (Name, Email, and Message).",
      invalidEmail: "Please enter a valid email address.",
      minLength: "Message must be at least 10 characters long."
    }
  }
};

// Email template parameters interface
export interface EmailTemplateParams extends Record<string, unknown> {
  from_name: string;
  from_email: string;
  to_email: string;
  subject: string;
  message: string;
}

// Form validation rules
export const validationRules = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 100
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    required: false,
    pattern: /^[\+]?[0-9\s\-\(\)]{10,}$/
  },
  company: {
    required: false,
    maxLength: 100
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000
  }
};

// Validate form data
export const validateFormData = (formData: any) => {
  const errors: string[] = [];
  
  // Name validation
  if (!formData.name || formData.name.trim().length < validationRules.name.minLength) {
    errors.push("Name must be at least 2 characters long.");
  }
  
  // Email validation
  if (!formData.email) {
    errors.push("Email address is required.");
  } else if (!validationRules.email.pattern.test(formData.email)) {
    errors.push("Please enter a valid email address.");
  }
  
  // Phone validation (optional)
  if (formData.phone && !validationRules.phone.pattern.test(formData.phone)) {
    errors.push("Please enter a valid phone number.");
  }
  
  // Message validation
  if (!formData.message || formData.message.trim().length < validationRules.message.minLength) {
    errors.push("Message must be at least 10 characters long.");
  }
  
  return errors;
};
