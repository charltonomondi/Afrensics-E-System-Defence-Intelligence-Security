import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Terms = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Terms & Conditions | AEDI Security"
        description="Terms & Conditions for AEDI Security Ltd. Read our terms of use, privacy policy, and service agreements."
        keywords="Terms & Conditions, Terms of Use, Privacy Policy, AEDI Security, Legal, User Agreement"
        url="https://aedisecurity.com/terms"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Terms & Conditions
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Terms of Use for AEDI Security
          </p>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: September 25, 2024
            </p>

            <p className="mb-6">
              Welcome to aedisecurity.com (the "Website"). These Terms & Conditions (the "Terms") govern your use of our website and services provided by AEDI Security. By accessing or using the website, you agree to these Terms. If you do not agree, please do not use the site.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">1. Definitions</h2>
            <p className="mb-4">
              "User" or "you" means any person who accesses or uses the Website or our services.
            </p>
            <p className="mb-4">
              "Services" means any cybersecurity, intelligence, consulting, subscription, or other services offered by AEDI via the Website or otherwise.
            </p>
            <p className="mb-6">
              "Content" means any text, images, videos, software, or other materials made available on the Website.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">2. Use of the Website</h2>
            <p className="mb-4">
              You must be at least 18 years old (or the age of majority in your jurisdiction) to use the Website.
            </p>
            <p className="mb-4">
              You agree to use the Website and services only for lawful purposes and in compliance with all applicable laws and regulations.
            </p>
            <p className="mb-4">
              You agree not to use the Website in any way that could damage, disable, overburden, or impair it.
            </p>
            <p className="mb-6">
              You shall not attempt to gain unauthorized access to any portions of the Website or related systems or networks.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">3. Intellectual Property Rights</h2>
            <p className="mb-4">
              All content, design, graphics, logos, text, software, and materials on the Website are the intellectual property of AEDI or its licensors and are protected by copyright, trademark, patent, and other intellectual property laws.
            </p>
            <p className="mb-4">
              You may view, download, or print copies of the Website content for your personal, non-commercial use only, provided you do not remove or alter any copyright or proprietary notices.
            </p>
            <p className="mb-6">
              You may not reproduce, distribute, modify, create derivative works, publicly display, or exploit any content from the Website without our prior written consent.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">4. User Content</h2>
            <p className="mb-4">
              You may submit feedback, comments, suggestions, or other content ("User Content") via contact forms or other means.
            </p>
            <p className="mb-4">
              By submitting User Content, you grant AEDI a perpetual, irrevocable, non-exclusive, royalty-free, transferable license to use, reproduce, distribute, adapt, publish, and display such content in any media.
            </p>
            <p className="mb-6">
              You represent and warrant that your User Content is original, that you have all necessary rights, and it does not violate any third-party rights.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">5. Disclaimers & Limitation of Liability</h2>
            <p className="mb-4">
              <strong>No warranties:</strong> The Website and services are provided on an "as is" and "as available" basis, without any warranties of any kind, whether express or implied (including warranties of merchantability, fitness for a particular purpose, non-infringement).
            </p>
            <p className="mb-4">
              <strong>No guarantee of accuracy:</strong> We do not guarantee that content is completely accurate, complete, or up to date.
            </p>
            <p className="mb-4">
              <strong>Limitation of liability:</strong> To the fullest extent permitted by law, AEDI and its officers, employees, agents, or affiliates will not be liable for any indirect, incidental, special, consequential, or punitive damages, or loss of profits, data, or use, arising out of or in any way connected with your use of the Website or services.
            </p>
            <p className="mb-6">
              <strong>Maximum liability:</strong> Where liability cannot be excluded by law, our liability is limited to the maximum extent allowed by applicable law.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">6. Indemnification</h2>
            <p className="mb-6">
              You agree to indemnify, defend, and hold harmless AEDI, its affiliates, officers, employees, and agents from all claims, liabilities, damages, losses, or expenses (including legal fees) arising out of or in connection with your use of the Website, your User Content, your violation of these Terms, or your infringement of any rights of third parties.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">7. Termination</h2>
            <p className="mb-6">
              We may suspend or terminate your access to the Website or services, with or without cause, at any time and without notice. Sections that by their nature should survive termination (e.g., intellectual property, disclaimers, limitation of liability, indemnification) will survive.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">8. Links to Third-Party Sites</h2>
            <p className="mb-6">
              The Website may contain links to external websites operated by third parties. We have no control over and are not responsible for the content, privacy practices, or terms of those sites. Your use of third-party sites is at your own risk.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">9. Governing Law & Dispute Resolution</h2>
            <p className="mb-4">
              These Terms and your use of the Website and services shall be governed by and construed in accordance with the laws of Kenya (without regard to conflict of law principles).
            </p>
            <p className="mb-6">
              Any dispute, controversy, or claim arising out of or relating to these Terms or the Website shall be resolved through good-faith negotiation. If resolution cannot be reached, it shall be submitted to the courts of competent jurisdiction in Kenya.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">10. Changes to Terms</h2>
            <p className="mb-6">
              We may modify or update these Terms at any time. When changes are made, we will post the updated version on the Website and revise the "Last updated" date. Your continued use of the Website after modifications constitutes acceptance of those changes.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">11. Severability</h2>
            <p className="mb-6">
              If any provision of these Terms is held invalid or unenforceable by a court, that provision will be struck or limited to the minimum extent necessary, and the remaining provisions will remain in full force and effect.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">12. Entire Agreement</h2>
            <p className="mb-6">
              These Terms (together with any policies, disclaimers, privacy provisions, or other documents incorporated herein) constitute the entire agreement between you and AEDI regarding your use of the Website and services, superseding any prior agreements or communications.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">13. Contact Information</h2>
            <p className="mb-4">
              If you have questions, concerns, or requests regarding these Terms, please contact us at:
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="mb-2"><strong>Afrensics E-System Defence & Intelligence Security Ltd</strong></p>
              <p className="mb-2">Email: info@aedisecurity.com</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;