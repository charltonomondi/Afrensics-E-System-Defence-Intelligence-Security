# EmailJS Setup Guide for AEDI Security Contact Form

## 🎯 Overview
This guide will help you set up EmailJS to receive contact form submissions directly to your email: **info@aedisecurity.com**

## 📧 EmailJS Configuration

### Step 1: Create EmailJS Account
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up with your email: **info@aedisecurity.com**
3. Verify your email address

### Step 2: Create Email Service
1. In EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose **Gmail** (recommended) or your email provider
4. Connect your **info@aedisecurity.com** account
5. Note down your **Service ID** (replace `service_ccbllzq` in the code)

### Step 3: Create Email Template
1. Go to **Email Templates**
2. Click **Create New Template**
3. Use this template configuration:

**Template Name:** AEDI Security Contact Form
**Template ID:** (Note this down to replace `template_jeznh6e`)

**Subject:** New Contact Form Submission - {{from_name}}

**HTML Content:**
```html
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #1e40af; margin-bottom: 10px;">AEDI Security</h1>
    <h2 style="color: #374151; margin-top: 0;">New Contact Form Submission</h2>
  </div>
  
  <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #1e40af; margin-top: 0;">Contact Details</h3>
    <p><strong>Name:</strong> {{from_name}}</p>
    <p><strong>Email:</strong> {{from_email}}</p>
    <p><strong>Phone:</strong> {{phone}}</p>
    <p><strong>Company:</strong> {{company}}</p>
  </div>
  
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h3 style="color: #1e40af; margin-top: 0;">Message</h3>
    <p style="white-space: pre-wrap; line-height: 1.6;">{{message}}</p>
  </div>
  
  <div style="text-align: center; padding: 20px; background-color: #1e40af; color: white; border-radius: 8px;">
    <p style="margin: 0; font-size: 14px;">This message was sent from the AEDI Security website contact form.</p>
    <p style="margin: 5px 0 0 0; font-size: 12px;">Please respond within 24 hours for best customer service.</p>
  </div>
</div>
```

**Plain Text Content:**
```
New Contact Form Submission - AEDI Security

Contact Details:
Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Company: {{company}}

Message:
{{message}}

---
This message was sent from the AEDI Security website contact form.
Please respond within 24 hours for best customer service.
```

### Step 4: Get Your Public Key
1. Go to **Account** → **General**
2. Find your **Public Key** (replace `xouy090qSXohX08Qu` in the code)

### Step 5: Update the Code
Replace these values in `src/pages/Contact.tsx`:

```typescript
// Replace these with your actual EmailJS credentials
const SERVICE_ID = 'service_ccbllzq';
const TEMPLATE_ID = 'template_ifc8dgx';
const PUBLIC_KEY = 'xouy090qSXohX08Qu';

// In the emailjs.send() call:
await emailjs.send(
  SERVICE_ID,        // Your service ID
  TEMPLATE_ID,       // Your template ID
  {
    from_name: formData.name,
    from_email: formData.email,
    phone: formData.phone,
    company: formData.company,
    message: formData.message,
    to_email: 'info@aedisecurity.com',
  },
  PUBLIC_KEY         // Your public key
);
```

## 🔧 Current Configuration

The contact form is currently configured with:
- **Service ID:** `service_ccbllzq`
- **Template ID:** `template_jeznh6e`
- **Public Key:** `xouy090qSXohX08Qu`
- **Recipient Email:** `info@aedisecurity.com`

## ✅ Features Implemented

### Form Validation
- ✅ Required field validation (Name, Email, Message)
- ✅ Email format validation
- ✅ Real-time error messages

### User Experience
- ✅ Loading state with spinner
- ✅ Success toast notification
- ✅ Error toast notification with retry instructions
- ✅ Form reset after successful submission
- ✅ Disabled submit button during sending

### Form Fields
- ✅ Full Name (required)
- ✅ Email Address (required)
- ✅ Phone Number (optional)
- ✅ Company Name (optional)
- ✅ Message (required)

### Notifications
- ✅ **Success:** "Message Sent Successfully! ✅"
- ✅ **Error:** "Failed to Send Message ❌"
- ✅ **Validation:** Field-specific error messages

## 📱 Mobile Responsive
- ✅ Responsive grid layout
- ✅ Touch-friendly form elements
- ✅ Floating WhatsApp button for alternative contact

## 🚀 Testing the Form

1. Fill out the contact form on your website
2. Check your **info@aedisecurity.com** inbox
3. Look for emails with subject: "New Contact Form Submission - [Name]"
4. Verify all form data is included in the email

## 🔒 Security Features

- ✅ Client-side form validation
- ✅ Email format verification
- ✅ XSS protection through proper encoding
- ✅ Rate limiting through EmailJS
- ✅ No sensitive data stored in frontend

## 📞 Alternative Contact Methods

If the form fails, users can:
- ✅ Click the floating WhatsApp button
- ✅ Call directly from the contact information
- ✅ Email directly to info@aedisecurity.com

---

**Note:** Make sure to replace the placeholder EmailJS credentials with your actual ones for the form to work properly.
