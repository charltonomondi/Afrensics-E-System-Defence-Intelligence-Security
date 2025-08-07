import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AppointmentBooking from "@/components/AppointmentBooking";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { slugify } from "@/utils/slugify";
import emailjs from 'emailjs-com';
import { useToast } from '@/components/ui/use-toast';
import { emailjsConfig } from '@/config/emailjs';
import aediLogo from "@/assets/favicon_logo/aedi.jpeg";
import WhatsApp from "@/assets/Whatsapp.png";
import vblog1 from "@/assets/blogs/vblog1.jpeg";
import vblog2 from "@/assets/blogs/vblog2.jpeg";
import vblog3 from 	"@/assets/blogs/vblog3.jpeg";
import vblog4 from "@/assets/blogs/vblog4.png";
import wblog1 from "@/assets/blogs/wblog1.png";
import wblog2 from "@/assets/blogs/wblog2.png";
import cyberincident from '@/assets/blogs/cyberincident.jpg';



// Example blog data
function SubscribeSection() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email.trim()) {
            toast({
                title: "Email Required",
                description: "Please enter your email address.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            toast({
                title: "Invalid Email",
                description: "Please enter a valid email address.",
                variant: "destructive",
                duration: 3000,
            });
            return;
        }

        setIsSubmitting(true);

        try {
            // Initialize EmailJS
            emailjs.init(emailjsConfig.publicKey);

            // Send newsletter subscription email
            await emailjs.send(
                emailjsConfig.serviceId,
                emailjsConfig.templateId,
                {
                    from_name: 'Newsletter Subscriber',
                    from_email: email,
                    phone: 'Not provided',
                    company: 'Not provided',
                    message: `Newsletter subscription request from: ${email}`,
                    to_email: emailjsConfig.recipientEmail,
                },
                emailjsConfig.publicKey
            );

            toast({
                title: "Successfully Subscribed! ✅",
                description: "Thank you for subscribing to our newsletter. You'll receive updates about cybersecurity trends and insights.",
                variant: "default",
                duration: 5000,
            });

            setSubscribed(true);
            setEmail("");
        } catch (error) {
            console.error('Newsletter subscription error:', error);

            toast({
                title: "Subscription Failed ❌",
                description: "Something went wrong. Please try again or contact us directly at info@aedisecurity.com",
                variant: "destructive",
                duration: 5000,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubscribe} className="flex flex-col items-center gap-4 max-w-md mx-auto">
            <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                className="w-full px-4 py-2 border border-input rounded focus:outline-none"
            />
            <button
                type="submit"
                disabled={isSubmitting}
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
            </button>
            {subscribed && (
                <div className="text-green-600 font-semibold mt-2">
                    Thank you for subscribing! You'll be notified when this post is published.
                </div>
            )}
        </form>
    );
}

// Only blog post objects inside the array!
const blogPosts = [
	{
		id: "1",
		title: "Vulnerability haunts over a million Kenyan Businesses, more could be at risk!",
		author: "Afrensics Security",
		date: "February 25, 2025",
		image: aediLogo,
		content: (
			<>
				<div className="mb-6 text-lg font-semibold text-primary">
					Over 1.1 million business records compromised at Kenyan registry of companies
				</div>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Incident Overview</h2>
					<p className="mb-4">
						Kenya’s Business Registration Service (B.R.S) experienced a significant cyber attack on the night of 31 January 2025, resulting in a data breach that exposed sensitive information. According to <a href="https://brs.go.ke/companies-registry-statistics/" target="_blank" className="text-blue-600 hover:underline">B.R.S statistics</a>, the compromised data includes details about company ownership, directorship, and beneficial ownership of over 1,111,450 companies both private and public registered since 2015. Analysis by key Kenyan media reports following the attack indicates that the <a href="https://www.capitalfm.co.ke/news/2025/02/govt-confirms-data-breach-on-main-registry-exposing-millions-of-companies/" target="_blank" className="text-blue-600 hover:underline">state confirmed</a> breach of the <a href="https://www.standardmedia.co.ke/business/business/article/2001510890/business-registration-service-issues-statement-after-reports-of-data-breach" target="_blank" className="text-blue-600 hover:underline">sole custodian</a> of the country’s company registry, raises concerns about the security of <a href="https://dailysecurityreview.com/security-spotlight/brs-cyber-attack-data-breach-at-business-registration-exposes-sensitive-business-information/" target="_blank" className="text-blue-600 hover:underline">sensitive individual and business information</a>, highlighting weaknesses in the protection of critical personal and corporate data.
					</p>
					<p className="mb-4">
						The breach was first reported by the <a href="https://www.businessdailyafrica.com/bd/corporate/technology/how-moldovan-firm-leaked-rutos-kenyattas-dealings-4912202" target="_blank" className="text-blue-600 hover:underline">Business Daily</a>, which stated that a Moldovan business intelligence firm, B2bHint, had allegedly accessed and offered for sale sensitive data from over two million Kenyan companies. The report claimed that the firm had exploited a vulnerability in the B.R.S system to access this data, which included personal details such as residential addresses, email addresses, and phone numbers of significant shareholders.</p>

					<img
						src={vblog1}
						alt="BRS Data Breach"
						className="w-[800px] h-[600px] object-cover rounded-md mb-4 shadow-md mx-auto"
					/>
					<blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
						Weak protection of critical personal and corporate data can lead to serious consequences for victims.
					</blockquote>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Cybersecurity weaknesses?</h2>
					<p className="mb-4">
						Kenya’s <a href="https://www.businessdailyafrica.com/bd/corporate/technology/how-moldovan-firm-leaked-rutos-kenyattas-dealings-4912202" target="_blank" className="text-blue-600 hover:underline">Business Daily</a> has said a little-known Moldovan business intelligence firm allegedly exploited a weakness in Kenya's government-owned Business Registration Service (BRS) to gain access to sensitive data of major shareholders in registered firms. The <a href="https://www.businessdailyafrica.com/bd/corporate/technology/how-moldovan-firm-leaked-rutos-kenyattas-dealings-4912202?utm_source=chatgpt.com" target="_blank" className="text-blue-600 hover:underline">report</a>, refuted by B2bHint, says the firm accessed and subsequently offered for sale a substantial amount of sensitive data from over two million Kenyan companies. This data included personal details such as residential addresses, email addresses, and phone numbers of significant shareholders. The firm reportedly sold this information for as much as Sh. 24 million for a comprehensive package, with individual phone numbers priced as low as $0.015.
					</p>
					<p className="mb-4">
						According to the same Business Daily report, B2b Hint denied hacking the BRS system, attributing its access to a perceived weakness in the BRS's cybersecurity standards. B2bHint refuted the claim that they hacked into the BRS system, saying the data was accessed through public URLs that were not adequately protected, rather than through a direct breach or hacking. B2bhint representatives clarified that their access to the data was based on the public availability of information and not as a result of malicious hacking. The Moldovan firm the data was exposed due to the BRS's cybersecurity weaknesses, rather than any illegal breach on their part.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Response from Kenyan authorities</h2>
					<p className="mb-4">
						BRS Director General Kenneth Gathuma <a href="https://techpoint.africa/news/kenyas-business-registration-service-data-breach/" target="_blank" className="text-blue-600 hover:underline">confirmed the breach</a> , emphasizing that the organization was strengthening its cybersecurity measures in response and that investigations were ongoing to understand the scope and prevent further incidents. The Ministry of Information, Communications, and the Digital Economy insisted that the <a href="https://www.the-star.co.ke/news/2025-02-06-kabogo-weve-addressed-data-breach-at-business-registration-service" target="_blank" className="text-blue-600 hover:underline">data breach had been addressed</a>.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">What is at stake?</h2>
					<p className="mb-4">
						Whether it was through hacking or cybersecurity weaknesses, the BRS breach on 31 January 2025 is notable for its scale. With sensitive data now exposed to the public domain raises concerns about its potential misuse. This could negatively impact investor confidence and erode trust in Kenya's regulatory systems. Restoring trust will require clear and transparent communication about the breach, its consequences, and the steps taken to address it.
					</p>
					<img
						src={vblog2}
						alt="BRS Data Breach2"
						className="w-full max-w-md mx-auto rounded-md mb-4 shadow-md"
					/>

					<blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
						The prospect of critical personal and corporate data on sale in the dark web is unsettling.
					</blockquote>
					<p className="mb-4">
						While some analysts have suggested the <a href="https://newsroom.maudhui.co.ke/corporate/hackers-strike-kenyas-business-registry-exposing-crucial-data-40892" target="_blank" className="text-blue-600 hover:underline">possibility dark web sale</a> of the hacked personal data, the exposure of the data-rich BRS, could lead to identity theft, fraud, or targeted social engineering attacks, particularly as it contains information about both companies and beneficial owners of the companies.
					</p>
					<p className="mb-4">
						The ongoing investigation into the origins of the BRS attack is crucial. Authorities are examining the breach for signs of advanced persistent threats (APTs), as well as identifying whether the attack is linked to broader geopolitical concerns. In previous incidents, such as the Stuxnet attack on Iran’s nuclear facilities in 2010, investigators traced the attack to a nation-state-backed effort using highly sophisticated malware.
					</p>
					<p className="mb-4">
						In other breaches in the past, there was disruption of operations and compromised customer data. This is the case in South Africa, where a 2019 <a href="https://www.bleepingcomputer.com/news/security/ransomware-attack-cripples-power-company-s-entire-network/" target="_blank" className="text-blue-600 hover:underline">ransomware attack on City Power Johannesburg</a> disrupted operations and compromised customer data. The breach demonstrated the significant impact such attacks can have on both public trust and the operational capacity of vital services. Following this incident, South African companies were advised to invest in cybersecurity awareness training.
					</p>
					<p className="mb-4">
						Following a 2019 <a href="https://businessday.ng/lead-story/article/nitda-says-lirs-breaches-nigeria-data-protection-regulation/" target="_blank" className="text-blue-600 hover:underline">Nigerian National Information Technology Development Agency</a>, where personal data belonging to millions of citizens was exposed, Nigerian authorities called for stronger data protection regulations, which were echoed by international data protection standards such as GDPR. This incident highlights the importance of regulatory compliance in cybersecurity and data management.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">How do affected entities protect themselves?</h2>
					<p className="mb-4">
						Following this incident, both individual and corporate need to mitigate the consequences of identity theft and use of sensitive data to steal from them. Individual victims of personal identity theft, especially those whose information is at risk of being sold on the dark web, can take several steps to protect themselves:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<ol className="list-decimal pl-6 space-y-4 text-justify">
							<li>
								<p><strong>Report identity theft:</strong> Immediately report the theft to relevant authorities, such as your local police, the National Data Commission, and any other relevant agencies to create a record of the crime and prevent further misuse of your information.</p>
							</li>
							<li>
								<p><strong>Monitor your bank account and credit card statements:</strong> Review your financial statements carefully for any unauthorized transactions. Immediately report any suspicious activity to your bank or credit card company. Regularly check for any unusual activity and consider subscribing to a monitoring service for real-time alerts.</p>
							</li>
							<li>
								<p><strong>Identity theft protection services:</strong> Many services monitor the use of your personal data on the dark web and provide assistance in recovering your identity. These services may also help in freezing your credit or notifying you of suspicious activity.</p>
							</li>
							<li>
								<p><strong>File a report with the dark web monitoring service:</strong> Many services allow you to search the dark web for your personal data. You can work with these services to monitor any signs of your information being sold or used maliciously.</p>
							</li>
							<li>
								<p><strong>Secure your online account:</strong> Change passwords: Immediately change the passwords for all online accounts, especially those that store sensitive information, such as email, banking, and social media. Use strong, unique passwords for each account. Enable 2-factor authentication: For added security, enable 2FA on accounts where possible. This adds an extra layer of protection by requiring a second form of verification beyond just your password.</p>
							</li>
							<li>
								<p><strong>Change passwords:</strong> Immediately change the passwords for all online accounts, especially those that store sensitive information, such as email, banking, and social media. Use strong, unique passwords for each account.</p>
							</li>
							<li>
								<p><strong>Enable 2-factor authentication:</strong> For added security, enable 2FA on accounts where possible. This adds an extra layer of protection by requiring a second form of verification beyond just your password.</p>
							</li>
							<li>
								<p><strong>Secure your devices:</strong> Ensure that your devices (computers, smartphones, etc.) have up-to-date antivirus software, firewalls, and other protective measures to prevent further data breaches.</p>
							</li>
							<li>
								<p><strong>Educate yourself about phishing and scams:</strong> Be cautious about unsolicited emails, messages, or phone calls asking for your personal information. Avoid clicking on suspicious links or downloading attachments from unknown sources.</p>
							</li>
							<li>
								<p><strong>Seek legal assistance:</strong> If your identity has been misused in serious ways, consider consulting a lawyer who specializes in identity theft for legal advice on how to recover damages or protect your rights.</p>
							</li>
						</ol>

					</ul>

					<img
						src={vblog3}
						alt="BRS Data Breach3"
						className="w-full max-w-md mx-auto rounded-md mb-4 shadow-md"
					/>

					<p className="mb-4">
						Taking these steps can significantly reduce the risks and help victims regain control over their personal information after a breach.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Corporate entities: Essential steps</h2>
					<p className="mb-4">
						Corporate entities whose sensitive information is compromised should take immediate, comprehensive actions to protect themselves and the organization. Here are some essential steps to mitigate further damage and safeguard against exploitation:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<ol className="list-decimal pl-6 space-y-4 text-justify">
							<li>
								<strong>Notify relevant authorities</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Report to law enforcement:</strong> Alert local authorities or other relevant cybercrime units about the breach. Authorities can investigate and help prevent the sale or misuse of sensitive corporate data.</li>
									<li><strong>Contact cybersecurity agencies:</strong> In many countries, there are national cybercrime agencies (e.g. the National Data Commission). They may assist with specific steps to protect the data.</li>
									<li><strong>Report to industry regulators:</strong> If the company operates within an industry regulated by privacy laws (e.g., finance, healthcare), report the breach to regulatory bodies such as the Communication Authority of Kenya.</li>
								</ul>
							</li>
							<li>
								<strong>Perform a comprehensive investigation</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Conduct a security audit:</strong> Immediately launch an internal investigation into how the data was accessed or stolen. This can involve external cybersecurity firms to help with the breach investigation.</li>
									<li><strong>Identify compromised data:</strong> Determine what specific sensitive data has been compromised—whether it's intellectual property, financial data, employee information, or customer data. Understanding the extent of the breach is key to mitigating risk..</li>
								</ul>
							</li>
							<li>
								<strong>Enhance cybersecurity measures</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Strengthen network security:</strong> Ensure that all systems are secure and up to date. Implement advanced firewalls, endpoint detection, and intrusion prevention systems to block further unauthorized access.</li>
									<li><strong>Implement data encryption:</strong> Use encryption for sensitive corporate data both at rest and in transit. This makes stolen data unreadable without the proper decryption keys..</li>
									<li><strong>Multi-factor authentication:</strong> Require MFA for accessing corporate systems, especially for critical accounts, such as those containing sensitive data..</li>
									<li><strong>Update access controls:</strong> Review user permissions and tighten access to sensitive systems. Remove access for any individuals or external partners who no longer need it.</li>
								</ul>
							</li>
							<li>
								<strong>Monitor the dark web</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Dark web monitoring:</strong> Subscribe to services that actively monitor the dark web for your company’s data. If your sensitive corporate information appears, you can take immediate steps to remove it or take legal action.</li>
									<li><strong>Work with dark web intelligence firms:</strong> Some companies specialize in identifying corporate data breaches on the dark web and can help locate and mitigate the spread of stolen data.</li>
								</ul>
							</li>
							<li>
								<strong>Communicate internally and externally</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Inform stakeholders:</strong> If customer or employee data is compromised, notify them immediately. Transparency can help minimize reputational damage and allow those affected to take protective steps.</li>
									<li><strong>Work with legal teams:</strong> Coordinate with legal professionals to assess the potential damage, compliance issues, and any legal actions to take against the perpetrators.</li>
									<li><strong>Prepare a crisis communication plan:</strong> Establish a strategy to communicate with the public, media, and stakeholders. A transparent and well-planned communication strategy can reduce r harm.</li>
								</ul>
							</li>
							<li>
								<strong>Take legal and compliance actions</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Review contracts:</strong> For companies that work with third parties, ensure that there are clauses in vendor contracts that require notification in case of a data breach and ensure these vendors are complying with the necessary cybersecurity standards..</li>
									<li><strong>Follow legal requirements:</strong> Adhere to data breach notification laws that mandate prompt disclosure of sensitive data exposure to affected individuals.</li>
								</ul>
							</li>
							<li>
								<strong>Notify affected customers or employees</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Offer identity protection:</strong> If customer or employee personal information is compromised, offer affected individuals identity theft protection services.</li>
									<li><strong>Implement a response plan for clients:</strong> Provide clients with resources to monitor and protect their data (e.g., credit monitoring, fraud alerts) if sensitive information was compromised..</li>
								</ul>
							</li>
							<li>
								<strong>Investigate and pursue legal action</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Engage in legal action against perpetrators:</strong> Work with law enforcement and legal teams to identify and take action against the cyber criminals behind the data breach. This may involve suing for damages or pursuing international legal routes if the data was sold across borders.</li>
									<li><strong>Consider cybersecurity insurance:</strong> If your organization has cybersecurity insurance, contact the provider. Many cybersecurity policies cover data breach responses, including legal costs and the costs of recovering compromised data.</li>
								</ul>
							</li>
							<li>
								<strong>Plan for long-term security</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Re-evaluate cybersecurity posture:</strong> After a breach, reevaluate your company's overall cybersecurity strategy. Implement additional training for employees, conduct regular vulnerability assessments, and stay up-to-date with the latest cyber threats.</li>
									<li><strong>Develop an incident response plan:</strong> If your organization does not already have a comprehensive incident response plan, now is the time to develop one. This plan should outline immediate actions to take in the event of a data breach, including who is responsible for what and how to communicate internally and externally.</li>
								</ul>
							</li>
							<li>
								<strong>Keep monitoring post-breach</strong>
								<ul className="list-disc pl-6 mt-2 space-y-1">
									<li><strong>Ongoing threat intelligence:</strong> Continue monitoring the dark web and other platforms for new threats related to the breach.</li>
									<li><strong>Periodic security audits:</strong> Schedule regular security assessments to proactively identify vulnerabilities and ensure compliance with the latest security protocols.</li>
								</ul>
							</li>
						</ol>
					</ul>
					<p className="mb-4">
						By following these steps, victims of sensitive corporate data theft can mitigate damage, prevent further breaches, and protect themselves and their customers from the consequences of stolen data being sold or misused on the dark web.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Policy Way Forward for the BRS and similar state agencies</h2>
					<h3 className="text-lg font-semibold mb-2">Enhanced cybersecurity measures</h3>
					<p className="mb-4">
						The BRS breach highlights vulnerabilities in systems managing sensitive corporate and personal data. The breach has sparked demands for stronger cybersecurity protocols in both public and private sectors. Some effective strategies for addressing these vulnerabilities include:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<ol className="list-decimal pl-6 space-y-4 text-justify">
							<li>
								<p><strong><a href="https://www.nist.gov/publications/zero-trust-architecture" target="_blank" className="text-blue-600 hover:underline">Zero trust architecture</a>:</strong> This approach ensures no implicit trust is granted to users or systems inside the network. The Z.T.A reduces reliance on perimeter security and emphasizes verifying each access attempt, regardless of the location of the user or device.</p>
							</li>
							<img
								src={vblog4}
								alt="BRS Data Breach4"
								className="w-full max-w-md mx-auto rounded-md mb-4 shadow-md"
							/>
							<li>
								<p><strong><a href="https://www.cisa.gov/sites/default/files/publications/MFA-Fact-Sheet-Jan22-508.pdf" target="_blank" className="text-blue-600 hover:underline">Encryption and multi-factor authentication</a>:</strong> The implementation of these practices prevents unauthorized access even if credentials are compromised.</p>
							</li>
							<li>
								<p><strong><a href="https://www.paloaltonetworks.com/cyberpedia/ai-in-threat-detection" target="_blank" className="text-blue-600 hover:underline">AI for threat detection</a>:</strong> Tools that leverage machine learning algorithms to detect anomalous behavior can prevent threats in real-time.</p>
							</li>
							<li>
								<p><strong>Advanced intrusion prevention systems:</strong> These systems monitor and block potentially harmful activities before they breach a network..</p>
							</li>
							<li>
								<p><strong>Security Information and Event Management (S.I.E.M):</strong> This centralized approach to monitoring and analyzing security data in real-time can help detect patterns that indicate potential threats.</p>
							</li>

						</ol>
					</ul>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Techniques and tactics for immediate action</h2>
					<p className="mb-4">
						To mitigate the risks associated with this breach, BRS and other organizations can implement a three-point plan of best practices, drawn from notable cybersecurity frameworks:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<ol className="list-decimal pl-6 space-y-4 text-justify">
							<li>
								<p><strong>Incident response plan:</strong> Having a structured and rehearsed I.R.P can help reduce the damage of future breaches.</p>
							</li>
							<li>
								<p><strong>Phishing simulation and employee training:</strong> One of the most common attack vectors is phishing. Organizations such as <a href="https://www.ibm.com/us-en" target="_blank" className="text-blue-600 hover:underline">IBM</a> have incorporated regular phishing simulations to improve employee awareness of cyber risks. This can be particularly beneficial in protecting sensitive data and avoiding human error that leads to breaches.</p>
							</li>
							<li>
								<p><strong>Data masking:</strong> Data masking techniques can obscure sensitive information in a non-disruptive way, as implemented by <a href="https://www.microsoft.com/en-us/" target="_blank" className="text-blue-600 hover:underline">Microsoft</a> in their enterprise solutions to protect customer data while ensuring compliance with data protection laws.</p>
							</li>
						</ol>
					</ul>
					<p className="mb-4">Afrensics Security offers all these remedies.</p>
				
				<AppointmentBooking />
			</section>
			</>
		),
	},
	{
		id: "2",
		title: "Bugs target mobile money in WhatsApp attacks",
		author: "Afrensics Security",
		date: "May 26, 2025",
		image: WhatsApp,
		content: (
			<>
				<div className="mb-6 text-lg font-semibold text-primary">
					Users of WhatsApp, one of the most popular messaging platforms globally, have faced various <a href="https://www.forbes.com/sites/zakdoffman/2024/07/07/whatsapp-signal-warning-issued-for-millions-of-apple-iphone-mac-users/" target="_blank" className="text-blue-600 hover:underline">vulnerabilities in recent years</a>, affecting users worldwide, like the zero-click, no-interaction required <a href="https://www.forbes.com/sites/daveywinder/2025/02/03/whatsapp-hack-attack-confirmed-by-meta-what-you-need-to-know/" target="_blank" className="text-blue-600 hover:underline">hacking attack acknowledged by Meta</a> this year. Cybercriminals increasingly target mobile users by exploiting vulnerabilities in mobile networks and telecommunications infrastructure. These vulnerabilities typically involve issues related to privacy, security, data breaches, and government surveillance.
				</div>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">WhatsApp Account Hijacking via SIM Swapping</h2>
					<p className="mb-4">
						WhatsApp group users in Kenya, Nigeria, and South Africa, have reported incidents where an attacker gains control of a victim member’s phone number, they can take over the WhatsApp account and access all messages, media, contacts, and group information associated with that account. Many are familiar with messages that seek to get members to click on a link and those who fall prey to this have their personal information stolen.
					</p>
					<img
						src={wblog1}
						alt="whatsApp Hack1"
						className="w-full max-w-md mx-auto rounded-md mb-4 shadow-md"
					/>
					<blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
						A phishing link sent to one of a WhatsApp group in Nairobi by a hacker using the number of a member of the group after successful SIM Swapping. A keen observer of the link will notice that it is not related to the image.
					</blockquote>
					<p className="mb-4">
						Recent incidents in these countries show that WhatsApp is a prime target for SIM swapping because it uses phone numbers as unique identifiers for accounts. This vulnerability is particularly dangerous for WhatsApp because it relies on phone numbers for authentication.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">What is SIM Swapping?</h2>
					<p className="mb-4">
						SIM swapping (or SIM card swapping) is a type of identity theft in which an attacker tricks a mobile carrier into switching a phone number from its legitimate owner’s SIM card to one under the attacker’s control. Once the hacker has control of the victim’s phone number, they can gain access to various online services, especially those that use SMS-based two-factor authentication (2FA).
					</p>
					<p className="mb-4">
						SIM swapping and account hijacking are increasingly prevalent types of cybercrimes, affecting users globally, and have become particularly problematic in many African countries where mobile-first internet usage is common. Both attacks exploit vulnerabilities in mobile network security systems, targeting individuals' phone numbers to gain unauthorized access to online accounts, including WhatsApp, banking apps, email, and social media platforms. 
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Key target: Mobile money and online banking </h2>
					<img
						src={wblog2}
						alt="WhatsApp Hack2"
						className="w-full max-w-2xl h-auto mx-auto rounded-md mb-4 shadow-md"
					/>

					<p className="mb-4">
						Reports have emerged in Kenya where people have fallen victim to SIM swap scams. In some cases, victims reported that their WhatsApp accounts were hijacked after receiving unusual SMS alerts that seemed legitimate. Once the attacker gained control of the victim’s phone number, they used WhatsApp to impersonate the victim and request money from their contacts.
					</p>
					<p className="mb-4">
						These scams were especially targeted at people involved in mobile money transactions (like M-Pesa or Airtel money in Kenya). These mobile money platforms are used by almost every member of WhatsApp groups, which are popular for fundraising to help family and friends with hospital or school fee bills or seeking to raise money for weddings or funerals.
					</p>
					<p className="mb-4">
						In Nigeria, users of WhatsApp have also been victims of SIM swapping. Attackers impersonated customers of Nigerian telecommunications carriers to request SIM card replacements and gain control of their victims' WhatsApp accounts. Once in control, they could use the account to send fraudulent messages to contacts or initiate mobile money transfers.
					</p>
					<p className="mb-4">
						In South Africa, SIM swapping and account hijacking have become significant cybersecurity issues, with growing reports of cybercriminals exploiting mobile networks to gain access to sensitive personal information. These attacks, which target mobile phone numbers as a gateway to online accounts, have been increasingly problematic, particularly as South Africa remains a hub for mobile money, online banking, and social media activity.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">How SIM Swapping Works</h2>
					<p className="mb-4">
						The process of SIM swapping typically involves the following steps:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<ol className="list-decimal pl-4 space-y-2">
							<li>
								<p><strong>Social Engineering:</strong> The attacker typically starts by gathering personal information about the victim. This information may come from social media profiles, phishing attacks, or data breaches. Details like the victim's full name, phone number, address, or even specific details about their phone carrier are collected.</p>
							</li>
							<li>
								<p><strong>Contacting the Carrier:</strong> The attacker then contacts the victim’s mobile service provider, claiming to be the victim. They usually provide the gathered personal details to convince the carrier that they are the legitimate account holder. Often, the attacker will request a SIM swap, typically stating they’ve lost their phone or need to upgrade to a new SIM card.</p>
							</li>
							<li>
								<p><strong>SIM Card Activation:</strong> If the hacker successfully convinces the carrier, the victim's phone number is transferred to a new SIM card in the attacker’s possession. Once the SIM swap is complete, the victim’s phone will lose signal, and the hacker will now have full control over the phone number.</p>
							</li>
							<li>
								<p><strong>Hijacking Accounts:</strong> Since the phone number is tied to various online accounts, the attacker can use it to intercept SMS-based authentication codes sent by services like WhatsApp, email, or banking apps. This allows the hacker to bypass security checks and take over these accounts.</p>
							</li>
						</ol>
					</ul>
				</section>
					

				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Why is SIM Swapping Dangerous?</h2>
					<ul className="list-disc pl-6 mb-4">
						<ol className="list-decimal pl-4 space-y-2">
							<li>
								<p><strong>Account Access:</strong> As mobile phones are often used for 2FA (where users receive a code via SMS for verification), once the hacker has control over the victim's number, they can reset passwords and access email, banking accounts, social media, and even WhatsApp.</p>
							</li>
							<li>
								<p><strong>Financial Loss:</strong> Cybercriminals may exploit access to online banking, mobile money, or even cryptocurrency accounts linked to the hijacked number. In some cases, large sums of money can be transferred to the hacker's account, causing significant financial loss for the victim.</p>
							</li>
							<li>
								<p><strong>Personal Data Exposure:</strong> Once an attacker has control of personal accounts, they can steal sensitive data (like personal identification numbers, financial information, or private communications), leading to identity theft or further scams.</p>
							</li>
						</ol>

					</ul>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">How Attackers Hijack WhatsApp Accounts via SIM Swapping</h2>
					<iframe
						width="700"
						height="400"
						src="https://www.youtube.com/embed/PqGFhP9KiJs"
						title="YouTube video player"
						style={{ border: 0 }}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
						className="w-full max-w-xl mx-auto rounded-md shadow-md my-4"
					/>

					<ul className="list-disc pl-6 mb-4">
						<ol className="list-decimal pl-4 space-y-2">
							<li>
								<strong>SIM Swap:</strong> Once the attacker gains control of the victim’s phone number through SIM swapping, they can trigger a “forgot password” process on WhatsApp. The app will send a verification code to the victim's phone number, but since the hacker controls the number, they receive the code instead.
							</li>
							<li>
								<strong>Verification and Account Takeover:</strong> With the verification code, the attacker can log into the victim’s WhatsApp account on their own device. Once logged in, the hacker has full access to all WhatsApp chats, groups, and contacts.
							</li>
							<li>
								<strong>Exploiting Group Features:</strong> The victim’s WhatsApp account becomes a bait for other members of their WhatsApp group, especially when too many group members have admin privileges with the power to add or remove members. Member after another falls victim and becomes a bait/target for hacking or spam attacks in another group as the web expands.
							</li>
							<li>
								<strong>Potential Harm:</strong> The attackers can then:
								<ul className="list-disc pl-6 mb-4">
									<li>Send messages to the victim’s contacts, asking for money or sensitive information, often impersonating the victim.</li>
									<li>Access private conversations and media shared in groups, which can lead to further scams or blackmail.</li>
									<li>Use the victim’s account to spread malware or phishing links to their contacts, potentially compromising more accounts.</li>
								</ul>
							</li>
						</ol>

					</ul>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Challenges in Addressing SIM Swapping in Africa</h2>
					<p className="mb-4">
						While solutions exist to prevent SIM swapping, several factors make it difficult to tackle the issue in Africa:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<li>
							<p><strong>Weak Carrier Security:</strong> Many African telecommunications companies still have weak security measures in place to protect their customers' data and verify requests for SIM swaps.</p>
						</li>
						<li>
							<p><strong>Lack of Awareness:</strong> A general lack of awareness about SIM swapping and mobile security, especially in rural areas, means that many people are unaware of the risks and fail to take basic precautions.</p>
						</li>
						<li>
							<p><strong>Limited Regulatory Oversight:</strong> In many African countries, data protection and cybersecurity regulations are underdeveloped, which makes it harder to hold telecom operators accountable for failing to secure customer information.</p>
						</li>
					</ul>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">What to remember</h2>
					<p className="mb-4">
						WhatsApp’s business model involves data sharing with its parent company, Facebook (now Meta). This has raised concerns about user data privacy, especially in regions with weak data protection laws, including many African countries. For instance, in <a href="https://africabusiness.com/2021/03/06/whatsapps-new-privacy-terms-data-protection-and-privacy-laws-in-south-africa/" target="_blank" className="text-blue-600 hover:underline">South Africa</a>, there were concerns when WhatsApp introduced new terms of service in 2021, which expanded the scope of data sharing between WhatsApp and Facebook. Critics warned that this could lead to data being exploited by third parties, including advertisers, which could potentially violate privacy laws. Although WhatsApp subsequently delayed the enforcement of these terms, concerns about data privacy remain in countries like South Africa, where consumer protection laws are still evolving.
					</p>
					<p className="mb-4">
						WhatsApp Web, the platform's browser-based version, has its own set of vulnerabilities. When users link their phone to the web app, malicious actors can potentially gain control of a user’s account if the phone is compromised, or if the browser session is hijacked. In Kenya, South Africa and Nigeria, incidents have been reported where cyber-criminals use WhatsApp Web vulnerabilities to access business or personal accounts. This often occurs through phishing attacks where users are tricked into clicking on malicious links that allow hackers to take control of their WhatsApp Web session.
					</p>
					<p className="mb-4">
						The vulnerabilities in WhatsApp, particularly in African countries, highlight the complexities of digital security in regions with ongoing political, social, and economic challenges. While WhatsApp provides a high level of encryption, it is not immune to <a href="https://www.darkreading.com/vulnerabilities-threats/whatsapp-messages-can-be-intercepted-manipulated" target="_blank" className="text-blue-600 hover:underline">manipulation, exploitation</a> and <a href="https://www.financialexpress.com/life/technology-whatsapp-spyware-scandal-facebook-parent-meta-wins-168-million-in-damages-from-israeli-surveillance-firm-nso-3835636/" target="_blank" className="text-blue-600 hover:underline">surveillance</a>. Governments, corporations, and cybercriminals exploit weaknesses in the system to achieve their objectives, raising concerns about user safety, privacy, and the protection of freedom of expression.
					</p>
					<p className="mb-4">
						Efforts to address these issues, such as improving data privacy laws, enhancing digital literacy, and implementing stronger cybersecurity practices, are crucial to mitigating the risks associated with using WhatsApp in African countries.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Afrensics Security can help you prevent SIM Swapping and Account Hijacking</h2>
					<p className="mb-4">
						Protecting oneself from SIM swapping requires a combination of vigilance, secure practices, and proactive security measures.
					</p>
					<ul className="list-disc pl-6 mb-4">
						<li>Enable PIN or Password on Your SIM Card</li>
						<li>Use Strong Authentication (app-based 2FA)</li>
						<li>Monitor Your Mobile Account</li>
						<li>Set Up Alerts with Your Carrier</li>
						<li>Use App-Specific Authentication</li>
						<li>Limit Personal Information Online</li>
					</ul>
					<p className="mb-4">
						Afrensics Security runs depth and breadth bespoke training for businesses and institutions on carrier responsibility and cybersecurity awareness to ensure staff remain cyber-smart.
					</p>
					<p className="mb-4">
						We believe Cybersecurity is 80% staff awareness and 20% technical intervention. We help you take steps to secure phone accounts by utilizing stronger authentication methods, remaining vigilant for suspicious activity, and ensuring individuals mitigate the risks of SIM swapping and account hijacking.
					</p>
				</section>


				<section className="max-w-4xl mx-auto p-4">
					<h2 className="text-2xl font-semibold mb-4 text-red-700">How to Prevent SIM Swapping and Account Hijacking</h2>

					<div className="text-gray-800 space-y-4 text-justify">
						<p>Cybercriminals are exploiting mobile money platforms by leveraging WhatsApp to hijack accounts and intercept M-PESA transactions...</p>

						{/* Other blog content above here... */}

						<h2 className="text-2xl font-semibold mt-6 mb-2 text-red-700">Understanding SIM Swapping and Prevention</h2>
						<p>
							SIM swapping and account hijacking are serious cybercrimes that disproportionately affect mobile-centric users, particularly in Africa,
							where mobile phone usage often outpaces internet connectivity. While technology companies like WhatsApp implement security measures to
							protect user accounts, the vulnerability of mobile phone systems, coupled with social engineering tactics, creates significant opportunities
							for cybercriminals to exploit users.
						</p>

						<h3 className="text-xl font-semibold mt-4">Preventive Steps:</h3>
						<ul className="list-disc pl-6 mb-4">
							<ol className="list-decimal pl-4 space-y-2">
								<li><strong>Enable PIN or Password on Your SIM Card:</strong> Some mobile carriers allow users to set a PIN or password for their accounts. This adds an extra layer of security when an attacker tries to request a SIM swap. In many African countries, however, these services are not always widely advertised, so users should inquire with their carriers.</li>

								<li><strong>Use Strong Authentication:</strong> Whenever possible, switch from SMS-based 2FA to app-based 2FA (using apps like Google Authenticator or Authy). These authentication apps are more secure as they don't rely on SMS, which can be intercepted during a SIM swap attack.</li>

								<li><strong>Monitor Your Mobile Account:</strong> Be alert to any sudden loss of signal or phone service, as this can be a sign that your SIM card has been swapped. Contact your carrier immediately if this happens.</li>

								<li><strong>Set Up Alerts with Your Carrier:</strong> Some mobile carriers offer services that alert you to changes made to your account, such as a SIM swap request. Activating these services can help you detect fraud early.</li>

								<li><strong>Use App-Specific Authentication:</strong> For services like WhatsApp, enable additional layers of security, such as two-step verification, which requires a PIN in addition to the verification code sent via SMS.</li>

								<li><strong>Limit Personal Information Online:</strong> Attackers often gather personal information from social media, so reducing the amount of sensitive data available online (e.g., phone number, address, or details about your mobile carrier) can help minimize the risk.</li>
							</ol>
						</ul>
					</div>
				</section>

				<AppointmentBooking />

			</>
		),

	},
	{
		id: "3",
		title: "May 2025 Africa Cyber Incidents and Responses",
		author: "Afrensics Security",
		date: "May 30, 2025",
		image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
		content: (
			<>
				<div className="mb-6 text-lg font-semibold text-primary">
					Cyber threats worsen in Kenya, Nigeria & South Africa. A new report by Kaspersky issued in May said Kenya, South Africa and Nigeria were among the countries experiencing a sharp rise in online threats during Q1 2025.
				</div>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Kaspersky Report: Africa's Top Threats</h2>
					<p className="mb-4">
						A new report by global cybersecurity firm <a href="https://www.kaspersky.com/about/press-releases/kaspersky-state-of-ransomware-report-2025-global-and-regional-insights-for-international-anti-ransomware-day" target="_blank" className="text-blue-600 hover:underline">Kaspersky</a> issued in May said Kenya, South Africa and Nigeria were among the countries experiencing a sharp rise in online threats during the first quarter of 2025. According to the report, Nigeria recorded "17.5% of users" affected by web-based threats, while South Africa reported similar figures. These statistics place both nations among the top five countries in the region facing heightened cybersecurity risks. Türkiye tops the list with 26.1%, followed by Kenya at 20.1% and Qatar at 17.8 %.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Ethiopian State Bank “Thwart” Cyberattack</h2>
					<p className="mb-4">
						The state-owned Commercial Bank of Ethiopia (CBE), which has denied losing $51m from its internal account. The <a href="https://addisstandard.com/cbe-denies-media-report-of-7-billion-birr-theft-says-attempted-fraud-thwarted-within-minutes/" target="_blank" className="text-blue-600 hover:underline">Addis Standard news website</a> reported on 29 May that an attempted fraud was "thwarted within minutes". There had been an "attempted theft of a large amount of money" but this was foiled and the suspects arrested, the CBE said, adding "no money was stolen, instead, the incident involved an attempted theft of a large amount of money" but was "thwarted within minutes due to its (CBE) strong internal control system". Previously, the <a href="https://addisstandard.com/commercial-bank-of-ethiopia-recovers-78-of-801-4-million-birr-lost-in-system-glitch-president-abe-sano/" target="_blank" className="text-blue-600 hover:underline">Addis Standard news website</a> reported on 16 March 2024, a CBE ‘system glitch’ allowed customers - mainly university students - to withdraw cash and make large digital transfers.

					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Cybercriminals Refining Tactics in Ghana</h2>
					<p className="mb-4">
						Ghanaians lost $48,500 to online blackmail and sextortion between January and April 2025, the Citi Newsroom website reported on 2 May, citing data from the Cyber Security Authority (CSA). That's nearly a fivefold increase from the $356 recorded during the same period in 2024. The surge in financial losses reflects how cybercriminals are refining tactics - especially through fake romantic relationships on social media—to exploit victims. The CSA says reports of sextortion have slightly increased compared to the 155 cases recorded in early 2024. Many perpetrators now use encrypted apps like WhatsApp, Telegram, and Signal to evade tracking.
						</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Hacking Group Devman Claims Kenya's Social Security Fund Attack</h2>
					<p className="mb-4">
						A hacking group known as Devman claimed compromising Kenya's National Social Security Fund (NSSF) system on 20 May and managed to access members' data, Kenyans.co.ke reported on 21 May. The report quoted Dubai-based cybersecurity consultancy, HackManac, which said the hackers demanded $4.5m from the government. The hackers claimed to have directly contacted the Kenyan authorities and issued a 24-hour ultimatum for the government to act; failure to which they would leak crucial data to the public. A Kenya Times news website reported NSSF assurance to the public on 20 May in a statement that no such data or financial records were compromised in the cyberattack attempt on its image storage system. The agency said an investigation into the incident was ongoing and reiterated its commitment to data security and transparency.

					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Nigerian Bankers Insiders Colluding with Hackers</h2>
					<p className="mb-4">
						Nigeria recorded over 119,000 leaked data breaches in the first quarter of 2025, according to the latest global data breach report by the Netherlands-based cybersecurity firm Surfshark. According to <a href="https://businessday.ng/news/article/nigeria-recorded-119000-data-breaches-in-q1-report/#google_vignette" target="_blank" className="text-blue-600 hover:underline">Surfshark</a>, Nigeria remains one of the most affected countries in Sub-Saharan Africa on data breaches. The research reveals that 10 in every 100 Nigerians have been affected by data breaches. Analysis indicates an 85% drop in the number of leaked accounts in Nigeria from Q4 2024 to Q1 2025, in line with a global trend that saw leaked accounts plunge 93% year-on-year, from 973.7 million to 68.3 million.  The <a href="https://punchng.com/insiders-aiding-international-bank-hackers-efcc-chair/" target="_blank" className="text-blue-600 hover:underline">Punch news website</a> on 28 May quoted chairman of Nigeria's Economic and Financial Crimes Commission (EFCC), Ola Olukoyede, saying the agency arrested several banking staff who granted access to local and international hackers, enabling coordinated cyberattacks on Nigerian banks. Speaking in an interview, Olukoyede said "insiders within the banks" collaborate with hackers operating remotely in Eastern Europe and the US to take control of bank platforms and swiftly transfer funds out of the systems. Six Nigerian banks were targets of these attacks. The EFCC successfully recovered large sums in three operations, namely $6.3m, $4.5m, and $2.4m. 

					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Cybercriminal Syndicate Target Exam Bodies</h2>
					<p className="mb-4">
						At least 20 suspects have been arrested across Nigeria for computer-based test (CBT) hacking targeting the 2025 Unified Tertiary Matriculation Examination (UTME) conducted by the Joint Admission and Matriculation Board <a href="https://businessday.ng/news/article/2025-utme-over-20-arrested-for-cbt-hacking/#google_vignette" target="_blank" className="text-blue-600 hover:underline">(JAMB)</a>. Security agents detained over 20 individuals in the federal capital Abuja in connection with the large-scale breach of the 2025 computer-based examination system of JAMB. The suspects are reportedly members of a cybercriminal syndicate comprising more than 100 individuals linked to attacks on digital infrastructure of key examination bodies, including JAMB and the National Examinations Council (NECO). 
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Microsoft Warns Nigeria Over AI-Powered Scams</h2>
					<p className="mb-4">
						Microsoft has raised alarm over three AI-powered scams threatening Nigeria's growing digital economy. The tech giant identified e-commerce fraud, job scams, and tech support fraud as the top three AI-driven schemes to watch in 2025. A <a href="https://news.microsoft.com/source/emea/features/three-ai-scams-nigerians-need-to-watch-out-for-in-2025/?msockid=1e73022beb5668cb3091124dea9669b1" target="_blank" className="text-blue-600 hover:underline">Microsoft security article</a> published on 6 April warned that the increased accessibility of generative AI tools is helping cybercriminals scale up their operations with alarming precision and believability. According to the article, Deepfake incidents, which surged sevenfold in Africa from Q2 to Q4 of 2024, as AI tools made it easier to create fake identities and manipulate biometric data. Secondly, AI-generated product descriptions, images, and reviews deceive customers into trusting these fake merchants. Thirdly, AI-powered chatbots interact convincingly with customers, delaying chargebacks with scripted excuses and manipulating complaints to maintain a professional facade. A deeper dive into AI in <a href="https://www.microsoft.com/en-us/security/blog/2025/04/16/cyber-signals-issue-9-ai-powered-deception-emerging-fraud-threats-and-countermeasures/" target="_blank" className="text-blue-600 hover:underline">Microsoft's Cyber Signals ransomware report</a> on 16 April, illustrates how the proliferation of generative AI is making it easier and cheaper for scammers to produce convincing fake content.

					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Hacking Gang INC Claims South African Airways Cyberattack</h2>
					<p className="mb-4">
						A ransomware gang, known as INC, claimed on 16 May to have perpetrated the cyberattack on South African Airways. According to a <a href="https://www.comparitech.com/news/ransomware-gang-inc-claims-recent-attack-on-south-african-airways/" target="_blank" className="text-blue-600 hover:underline">Comparitech</a> report on 16 May, the airlines didn't confirm INC's claims or whether or not a ransom was demanded/paid. The INC first started adding victims to its data leak site in August 2023. Since then, it has been linked to 91 confirmed attacks and 211 unconfirmed ones. In January 2025, INC posted Air Europa (Spain) to its data leak site, alleging to have lots of client data in its hands. Shortly after, Air Europa started notifying customers that their data may have been posted online. According to <a href="https://www.capetownetc.com/news/south-african-airways-suffers-cyber-attack-disrupting-services/" target="_blank" className="text-blue-600 hover:underline">Capetownetc.com</a>, South African Airways (SAA) announced that it was hit by a significant cyber incident on 3 May, which temporarily disrupted its systems. An SAA statement assured that ‘swift actions’ by the airlines "successfully contained the incident and minimised disruption to core flight operations." The attack occurred two weeks after one of the country's largest mobile telecommunications companies, the <a href="https://www.mtn.com/mtn-cybersecurity-incident-but-critical-infrastructure-secure/" target="_blank" className="text-blue-600 hover:underline">MTN Group</a> cyberattack reported on 24 April.
.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Hacktivists Target Tanzanian Government Institutions</h2>
					<p className="mb-4">
						Various <a href="https://tmc.co.tz/igtwg-statement-on-cyber-attacks-and-unlawful-blocking-of-access-to-x-platform-in-tanzania/" target="_blank" className="text-blue-600 hover:underline">Tanzanian institutions</a>, including the Ministry of Information, Culture, Arts and Sports in 20 May condemned the deliberate spread of false information online to incite fear and unrest in the country following a series of cyberattacks targeting major government institutions, including the X accounts of the police and the YouTube channel of the Tanzania Revenue Authority, where false information was posted. Content was posted on the police X handle, alleging the death of Tanzanian President Samia Suluhu Hassan, whose administration has come under attack from Kenyan activists over the deportation of their colleagues. <a href="https://www.thecitizen.co.tz/tanzania/news/national/police-launch-hunt-after-official-x-account-hacked-warns-public-against-sharing-fake-news-5049060" target="_blank" className="text-blue-600 hover:underline">Citizen website</a> reported on 20 May that the Tanzania Police Force on 20 May launched an investigation and issued a strong warning after its official X account (TANPOL) was hacked and used to spread false information. Several other popular accounts were also hacked, including those of mobile telephone provider, Airtel Tanzania, and Simba SC, a prominent Tanzanian football club. 

					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Cybersecurity Response</h2>
					<ul className="list-disc pl-6 mb-4">
						<li>
							<strong>Kenya and Microsoft launch cybersecurity initiative:</strong> <a href="https://news.microsoft.com/source/2024/05/22/microsoft-and-g42-announce-1-billion-comprehensive-digital-ecosystem-initiative-for-kenya/?msockid=1e73022beb5668cb3091124dea9669b1" target="_blank" className="text-blue-600 hover:underline">Microsoft</a> has launched a new cybersecurity initiative targeting the Global South, starting with a strategic partnership with Kenya's National Computer and Cybercrime Coordination Committee. According to a <a href="https://www.capitalfm.co.ke/business/2025/05/microsoft-partners-with-kenya-to-launch-regional-cybersecurity-initiative/" target="_blank" className="text-blue-600 hover:underline">Capital FM website report</a> on 27 May, the move is part of the company's Advancing Regional Cybersecurity (ARC) Initiative to strengthen regional cybersecurity capacity amid rising digital threats. The announcement was made on 27 May during the second Global Conference on Cyber Capacity Building (GC3B) in Geneva. Recent high-profile incidents—including ransomware attacks on public utilities and breaches at regional agencies—have exposed vulnerabilities in existing cyber defences.

						</li>
						<li>
							<strong>Ghana's Central Bank to strengthen cybersecurity campaign:</strong> Ghana's central bank reaffirmed on 2 May its commitment to strengthening cybersecurity in the financial sector through enhanced collaboration and regulatory reform, <a href="https://www.myjoyonline.com/bog-deepens-cybersecurity-collaboration-set-to-revise-key-directive-at-ficsoc-stakeholder-forum/" target="_blank" className="text-blue-600 hover:underline">Joy news website</a> reported on 8 May. Addressing a meeting of Financial Industry Command Security Operations Centre (FICSOC) Stakeholders Forum in the capital Accra, First Deputy Governor of the Bank of Ghana, Dr Zakari Mumuni, cited the bank's alliance with the Cyber Security Authority (CSA), aimed at protecting Ghana's financial institutions from increasing digital threats. Dr Mumuni also announced that the bank was revising its Cyber and Information Security Directive to address new and emerging digital risks. 

						</li>
						<li>
							<strong>Somalia moves to enhance cybersecurity:</strong> SSomalia's regulatory National Communications Authority (NCA) signed two agreements with Malaysia on strengthening digital regulation and cyber security cooperation between the two countries. The <a href="https://sonna.so/en/somalia-signs-mous-with-malaysia-on-digital-regulation-and-cybersecurity/" target="_blank" className="text-blue-600 hover:underline">Somali National News Agency</a> reported on 7 May that the accords "reflect Somalia's commitment to aligning with international best practices in digital governance and cybersecurity". One of the pacts, signed with the Malaysian Communications and Multimedia Commission, covered collaboration in areas such as 5G, regulatory exchanges and institutional capacity building. The second accord will seek to improve Somalia's cyber resilience. 
						</li>
						<li>
							<strong>Nigeria jails 15 foreigners over cyber-related crimes:</strong> Summary: The high court in Nigeria's commercial capital Lagos sentenced 15 foreigners to a year each in prison after finding them guilty of cyber-terrorism and internet fraud. The <a href="https://www.channelstv.com/2025/05/30/lagos-court-jails-15-foreigners-for-cyber-terrorism-internet-fraud/" target="_blank" className="text-blue-600 hover:underline">Channels TV website</a> reported on 30 May that the foreigners included 11 Filipinos, two Chinese, a Malaysian and an Indonesian. It said the convictions raised the total of foreigners found guilty of cybercrimes in Nigeria to 33. The other 18 were convicted on 23 May. They changed their not guilty pleas after reaching a plea bargain with Nigeria's Economic and Financial Crimes Commission (EFCC). They are among 193 foreigners arrested during the "Eagle Flush Operation" carried out by the EFCC in December 2024 in Lagos over alleged various cybercrime offences.

						</li>
					</ul>
				</section>
				<AppointmentBooking />
			</>
		),
	},
	{
		id: "4",
		title: "Cloud Security Best Practices for Kenyan SMEs",
		author: "",
		date: "Coming Soon",
		image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
		content: (
			<>
				<div className="text-center py-16">
					<h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
					<p className="mb-6 text-lg">
						Want to be the first to receive the latest updates? Subscribe below!
					</p>
					<SubscribeSection />
				</div>
			</>
		),
	},
	{
		id: "5",
		title: "Phishing Attacks Target Mobile Banking Users in Kenya",
		author: "",
		date: "Coming Soon",
		image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop",
		content: (
			<>
				<div className="text-center py-16">
					<h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
					<p className="mb-6 text-lg">
						Want to be the first to receive the latest updates? Subscribe below!
					</p>
					<SubscribeSection />
				</div>
			</>
		),
	},
	{
		id: "6",
		title: "The Rise of AI in Cybersecurity: Opportunities and Challenges",
		author: "",
		date: "Coming Soon",
		image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop",
		content: (
			<>
				<div className="text-center py-16">
					<h2 className="text-3xl font-bold mb-4">Coming Soon</h2>
					<p className="mb-6 text-lg">
						Want to be the first to receive the latest updates? Subscribe below!
					</p>
					<SubscribeSection />
				</div>
			</>
		),
	},
	{
		id: "4",
		title: "African Cyber Incidents and Responses - June 2025 Highlights",
		author: "Afrensics Security Team",
		date: "June 30, 2025",
		image: cyberincident,
		content: (
			<>
				<div className="mb-6 text-lg font-semibold text-primary">
					Comprehensive analysis of cybersecurity incidents across Africa
				</div>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Key Findings</h2>
					<ul className="list-disc list-inside mb-4 space-y-2">
						<li><strong>Kenya:</strong> Cyberattacks increased by 202% to 2.5 billion threats (Jan-Mar 2025)</li>
						<li><strong>Mozambique:</strong> Cybercrime rose by 16% in 2024 with 1,051 processed cases</li>
						<li><strong>Ghana:</strong> 377 cyberbullying complaints linked to unlicensed loan apps (Jan-May 2025)</li>
						<li><strong>Nigeria:</strong> Major international partnerships launched for AI development</li>
					</ul>
				</section>

				<section className="mb-8">
					<h2 className="text-xl font-bold mb-4">Major Incidents</h2>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Researchers say hackers using open-source tools in Africa</h3>
						<p className="mb-4">
							Cybersecurity researchers have drawn attention to a series of cyberattacks targeting financial organisations across Africa since at least July 2023 using a mix of open-source and publicly available tools to maintain access. According to the US Hacker news website, the suspected end goal of the attacks is to obtain initial access and then sell it to other criminal actors on underground forums, making the threat actor an initial access broker (IAB).
						</p>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Cyberattacks in Kenya spike by 200% between January-March 2025</h3>
						<p className="mb-4">
							Cyberattacks in Kenya increased by 202% to 2.5 billion threats between January and March 2025, up from 840.9 million recorded during the previous quarter (October-December 2024). According to the Communication Authority of Kenya attributing the surge to "system vulnerability threats" among Kenyan firms.
						</p>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Hackers target South African platinum mining giant</h3>
						<p className="mb-4">
							A leading South African mining firm, Eastern Platinum (Eastplats), announced a data breach related to specific files on its internal affairs. ICT news website mybroadband.co.za reported on 21 June that Eastplats is a platinum group metals (PGM) and chrome producer with assets located along South Africa's Bushveld Complex, the world's largest known PGM resource. The incident occurred on 27 May, but the company only announced it on 17 June.
						</p>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Mozambican cybercrime increased by 16% in 2024</h3>
						<p className="mb-4">
							Cybercrime in Mozambique increased by 16% last year, compared to 2023. "The crimes most often perpetrated are related to frauds involving electronic payment instruments and channels, but also to computer and communications fraud," the Portuguese news agency (Lusa) on 5 June quoted deputy attorney general, Amabelia Chuquela, as saying, blaming the trend on lack of resources and of public awareness.
						</p>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-xl font-bold mb-4">Positive Developments</h2>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Gates Foundation launches AI scaling hub in Nigeria</h3>
						<p className="mb-4">
							The Nigerian Ministry of Communications, Innovation & Digital Economy, in partnership with the Gates Foundation, have announced the launch of the Nigeria Artificial Intelligence (AI) Scaling Hub. The initiative seeks "to accelerate the development of AI-driven solutions that improve lives and expand opportunity across key sectors such as health, agriculture, and education" in the country. The Gates Foundation pledged to support the hub with up to $7.5 million spread over three years.
						</p>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Ghana's response to cyberbullying surge</h3>
						<p className="mb-4">
							Ghana's Cyber Security Authority (CSA) has warned against a surge in cyberbullying, harassment, and blackmail linked to unlicensed mobile loan applications operating in the country. Joy FM news website report on 1 June quoted the CSA saying it received 377 complaints from January to May 2025 alone, compared to 228 for the whole of 2024.
						</p>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-xl font-bold mb-4">Government Responses</h2>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Kenya's parliament blocks tax body's access to banking details</h3>
						<p className="mb-4">
							Kenyan members of the National Assembly have blocked the Kenya Revenue Authority (KRA) from accessing companies' trade secrets and customer data to assess the businesses for tax. The parliamentary committee on finance quashed a second attempt by the revenue authority to have unfettered access to detailed transactional data.
						</p>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Ethiopia 'reinforcing' national cyber-defence architecture</h3>
						<p className="mb-4">
							Ethiopia is reinforcing its national cyber-defence architecture as a core component of its ambitious Digital Ethiopia transformation agenda, with intensified awareness campaigns targeting public institutions and individual users.
						</p>
					</div>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Uganda launches first-ever AI policy</h3>
						<p className="mb-4">
							Uganda announced the development of the country's first-ever AI policy as part of its Fourth National Development Plan (NDP4), positioning Uganda as a digitally empowered economy.
						</p>
					</div>
				</section>

				<section className="mb-8">
					<h2 className="text-xl font-bold mb-4">International Prosecutions</h2>
					<p className="mb-4">
						Multiple international prosecutions have resulted in significant sentences for cybercriminals, including Nigerian nationals receiving combined sentences of 159 years for a $17m fraud scheme, and Chinese, Filipino nationals being jailed in Nigeria for cyber-terrorism offences.
					</p>
				</section>

				<section className="mb-8">
					<h2 className="text-xl font-bold mb-4">Innovation & Partnerships</h2>

					<div className="mb-6">
						<h3 className="text-lg font-semibold mb-2">Nigeria, Meta launch AI 'accelerator' programme</h3>
						<p className="mb-4">
							The Nigerian government, in partnership with Meta, has launched the Nigeria AI Accelerator Programme to support startups developing AI solutions for agriculture, health, education, and financial services. The first cohort runs from August to December 2025.
						</p>
					</div>
				</section>

				<div className="bg-gray-50 p-6 rounded-lg">
					<p className="text-sm text-gray-600 italic">
						This comprehensive report demonstrates the evolving cybersecurity landscape across Africa, highlighting both challenges and innovative responses from governments, organizations, and international partners.
					</p>
				</div>
			</>
		),
	},
];

const BlogPost = () => {
	const { slug } = useParams();
	const post = blogPosts.find((p) => slugify(p.title) === slug);

	// Like button state, initialized from localStorage
	const [likes, setLikes] = useState(0);

	useEffect(() => {
		// Load likes from localStorage for this blog post
		const storedLikes = localStorage.getItem(`blogLikes_${slug}`);
		if (storedLikes) {
			setLikes(parseInt(storedLikes, 10));
		}
	}, [slug]);

	const handleLike = () => {
		const newLikes = likes + 1;
		setLikes(newLikes);
		localStorage.setItem(`blogLikes_${slug}`, newLikes.toString());
	};

	// Comment section state, persisted in localStorage
	const [comments, setComments] = useState<
		{ name: string; organization: string; comment: string }[]
	>([]);
	const [name, setName] = useState("");
	const [organization, setOrganization] = useState("");
	const [commentInput, setCommentInput] = useState("");

	// Load comments from localStorage on mount
	useEffect(() => {
		const storedComments = localStorage.getItem(`blogComments_${slug}`);
		if (storedComments) {
			setComments(JSON.parse(storedComments));
		}
	}, [slug]);

	// Save comments to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem(`blogComments_${slug}`, JSON.stringify(comments));
	}, [comments, slug]);

	const handleCommentSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		if (name.trim() && commentInput.trim()) {
			setComments([
				...comments,
				{ name, organization, comment: commentInput },
			]);
			setName("");
			setOrganization("");
			setCommentInput("");
		}
	};

	// Related posts (excluding current)
	const relatedPosts = blogPosts.filter((p) => slugify(p.title) !== slug);

	if (!post) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<h1 className="text-2xl font-bold">Blog Post Not Found</h1>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-background">
			<Navigation />
			<div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
				{/* Main blog content */}
				<div className="md:col-span-3">
					<div className="flex items-center mb-6">
						<img src={post.image} alt="Blog Logo" className="h-12 w-12 rounded mr-3" />
						<div>
							<h1 className="text-3xl font-bold mb-1">{post.title}</h1>
							<div className="text-muted-foreground text-sm">
								{post.author} &bull; {post.date}
							</div>
						</div>
					</div>
					{post.content}
				</div>

				{/* Sidebar */}
				<aside className="md:col-span-1 space-y-8">
					{/* Like Button */}
					<div className="bg-white rounded shadow p-4">
						<button
							className="bg-primary text-white px-4 py-2 rounded hover:bg-primary/80 transition w-full"
							onClick={handleLike}
						>
							👍 Like
						</button>
						<div className="mt-2 text-center text-lg font-semibold">
							{likes} {likes === 1 ? "Like" : "Likes"}
						</div>
					</div>

					{/* Comment Section */}
					<div className="bg-white rounded shadow p-4">
						<h2 className="text-lg font-bold mb-2">Comments</h2>
						<form onSubmit={handleCommentSubmit} className="space-y-2 mb-2">
							<input
								type="text"
								value={name}
								onChange={(e) => setName(e.target.value)}
								placeholder="Your Name"
								className="w-full px-2 py-1 border border-input rounded focus:outline-none"
								required
							/>
							<input
								type="text"
								value={organization}
								onChange={(e) => setOrganization(e.target.value)}
								placeholder="Organization (optional)"
								className="w-full px-2 py-1 border border-input rounded focus:outline-none"
							/>
							<textarea
								value={commentInput}
								onChange={(e) => setCommentInput(e.target.value)}
								placeholder="Your Comment"
								className="w-full px-2 py-1 border border-input rounded focus:outline-none"
								rows={2}
								required
							/>
							<button
								type="submit"
								className="bg-primary text-white px-3 py-1 rounded hover:bg-primary/80 transition w-full"
							>
								Post Comment
							</button>
						</form>
						<div className="space-y-2">
							{comments.length === 0 && (
								<p className="text-muted-foreground text-sm">No comments yet.</p>
							)}
							{comments.map((c, idx) => (
								<blockquote key={idx} className="border-l-4 border-accent pl-3 italic text-muted-foreground">
									{c.name}
									{c.organization && (
										<span> ({c.organization})</span>
									)}
									{": "}
									{c.comment}
								</blockquote>
							))}
						</div>
					</div>

					{/* Related Posts */}
					<div className="bg-white rounded shadow p-4">
						<h2 className="text-lg font-bold mb-2">Related Posts</h2>
						<ul className="space-y-2">
							{relatedPosts.map((rp) => (
								<li key={rp.id} className="flex items-center">
									<img
										src={rp.image}
										alt={rp.title}
										className="h-8 w-8 rounded mr-2 object-cover"
									/>
									<a
										href={`/blog/${slugify(rp.title)}`}
										className="text-primary hover:underline"
									>
										{rp.title}
									</a>
								</li>
							))}
						</ul>
					</div>
				</aside>
			</div>
			<Footer />
		</div>
	);
};

export default BlogPost;