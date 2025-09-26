import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEO
        title="Privacy Policy | AEDI Security"
        description="Privacy Policy for AEDI Security Ltd. Learn how we collect, use, and protect your personal information."
        keywords="Privacy Policy, Data Protection, Personal Information, AEDI Security, GDPR, Data Privacy"
        url="https://aedisecurity.com/privacy"
      />
      <Navigation />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-card rounded-lg shadow-lg p-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-8 text-center">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Data Protection and Privacy Policy for AEDI Security
          </p>

          <div className="prose prose-gray max-w-none">
            <p className="text-sm text-muted-foreground mb-8">
              Last updated: September 25, 2024
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">1. Introduction</h2>
            <p className="mb-6">
              AEDI Security ("we," "us," "our," or "AEDI") respects your privacy and is committed to protecting the personal data you share with us. This Privacy Policy describes how we collect, use, disclose, and protect your personal information when you use our website (aedisecurity.com) or our services.
            </p>
            <p className="mb-6">
              By using our website or services, you agree to the collection and use of information in accordance with this policy.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">2. Definitions</h2>
            <p className="mb-4">
              <strong>Personal Data (or Personal Information):</strong> Any information that relates to an identified or identifiable natural person (e.g., name, email address, phone number, IP address).
            </p>
            <p className="mb-4">
              <strong>Processing:</strong> Any operation performed on Personal Data (collection, storage, use, transmission, etc.).
            </p>
            <p className="mb-4">
              <strong>Data Subject:</strong> The person to whom the Personal Data relates.
            </p>
            <p className="mb-4">
              <strong>Controller:</strong> The entity that determines the purposes and means of processing Personal Data (in this case, AEDI).
            </p>
            <p className="mb-6">
              <strong>Third Party:</strong> Any person or entity other than the data subject, controller, processor, and persons who under direct authority of the controller or processor are authorised to process personal data.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">3. What Data We Collect</h2>
            <p className="mb-6">
              We may collect and process the following personal data:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Contact information:</strong> Name, email address, phone number, mailing address (when you contact us or request services)</li>
              <li><strong>Usage data & technical data:</strong> IP address, device type, browser type, operating system, pages visited, time spent on pages, referring/exit pages, and other analytics (automatically collected)</li>
              <li><strong>Communications data:</strong> Your messages, feedback, or support requests</li>
              <li><strong>Other data you choose to provide:</strong> When you fill forms, send emails, register, or use interactive features on the website</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">4. How We Use Your Data</h2>
            <p className="mb-6">
              We may use your personal data for the following purposes:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>To provide, operate, and maintain our website and services</li>
              <li>To respond to your inquiries, questions, or requests</li>
              <li>To send you updates, newsletters, marketing communications (where you have consented)</li>
              <li>To monitor usage and improve our website, services, and user experience</li>
              <li>To detect, prevent, and address technical or security issues</li>
              <li>To comply with legal obligations</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">5. Legal Basis for Processing</h2>
            <p className="mb-6">
              Depending on the nature of the personal data and the context, we rely on one or more of the following legal bases:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Consent:</strong> You have given us clear consent to process your personal data for a specific purpose</li>
              <li><strong>Contractual necessity:</strong> Processing is necessary to perform our obligations under a contract with you</li>
              <li><strong>Legitimate interests:</strong> Processing is necessary for our legitimate interests (e.g. to improve our services, maintain security), provided those interests are not overridden by your rights</li>
              <li><strong>Legal obligation:</strong> Processing is required by law</li>
            </ul>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">6. Sharing Your Data / Disclosure</h2>
            <p className="mb-6">
              We may disclose or share your personal data with:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Service providers / subprocessors:</strong> Third-party vendors who assist us in operating the website, delivering services, sending emails, analytics, hosting, security, etc.</li>
              <li><strong>Legal or regulatory authorities:</strong> When required by law, court order, or to protect our rights, users, or others</li>
              <li><strong>Affiliates or business partners:</strong> When you agree or when necessary to fulfill a service</li>
              <li><strong>In connection with business transactions:</strong> In the event of a merger, acquisition, sale of assets, or reorganization</li>
            </ul>
            <p className="mb-6">
              We will ensure that any third party to whom we transfer your data provides at least the same level of protection as required by applicable law.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">7. Data Retention</h2>
            <p className="mb-6">
              We will retain your personal data only as long as necessary for the purposes for which it was collected (including to satisfy any legal, accounting, or reporting requirements). When it is no longer needed, we will securely delete or anonymize it.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">8. Security</h2>
            <p className="mb-6">
              We take appropriate technical and organisational measures to protect personal data against unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure — we cannot guarantee absolute security.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">9. Your Rights</h2>
            <p className="mb-4">
              Depending on your jurisdiction, you may have the following rights in relation to your personal data:
            </p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Right to access / request a copy</li>
              <li>Right to rectification (correct errors)</li>
              <li>Right to erasure ("right to be forgotten")</li>
              <li>Right to restrict or object to processing</li>
              <li>Right to data portability</li>
              <li>Right to withdraw consent (if processing is based on consent)</li>
              <li>Right to lodge a complaint with a supervisory authority</li>
            </ul>
            <p className="mb-6">
              If you wish to exercise any of these rights, please contact us using the contact details below.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">10. Cookies & Tracking Technologies</h2>
            <p className="mb-6">
              We use cookies and similar tracking technologies to monitor usage, improve your experience, and for analytics. You can refuse or disable cookies via your browser settings; however, that may affect some parts of the site's functionality.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">11. Links to Other Websites</h2>
            <p className="mb-6">
              Our website may contain links to third-party websites. This Privacy Policy does not apply to those websites; we encourage you to review their privacy policies. We are not responsible for the content or practices of third-party sites.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">12. Children's Privacy</h2>
            <p className="mb-6">
              Our services are not intended for children under the age of 18. We do not knowingly collect personal data from minors. If you believe we have done so, please contact us so we may delete such information.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">13. Changes to This Policy</h2>
            <p className="mb-6">
              We may revise this Privacy Policy from time to time. When changes are made, we will update the "Last updated" date. We may also notify you (e.g., via email or via our website) if changes are significant.
            </p>

            <h2 className="text-2xl font-semibold text-foreground mb-4 mt-8">14. Contact Us</h2>
            <p className="mb-4">
              If you have questions or concerns about this Privacy Policy or your personal data, please contact:
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

export default Privacy;