import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import aediLogo from "@/assets/favicon_logo/aedi.jpeg";
import WhatsApp from "@/assets/Whatsapp.png";

// Example blog data
function SubscribeSection() {
    const [email, setEmail] = useState("");
    const [subscribed, setSubscribed] = useState(false);

    const handleSubscribe = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim()) {
            setSubscribed(true);
            setEmail("");
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
                className="bg-primary text-white px-6 py-2 rounded hover:bg-primary/80 transition"
            >
                Subscribe
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
						Kenya’s Business Registration Service (B.R.S) experienced a significant cyber attack on the night of 31 January 2025, resulting in a data breach that exposed sensitive information. According to B.R.S statistics, the compromised data includes details about company ownership, directorship, and beneficial ownership of over 1,111,450 companies both private and public registered since 2015. Analysis by key Kenyan media reports following the attack indicates that the state confirmed breach of the sole custodian of the country’s company registry, raises concerns about the security of sensitive individual and business information, highlighting weaknesses in the protection of critical personal and corporate data.
					</p>
					<blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
						Weak protection of critical personal and corporate data can lead to serious consequences for victims.
					</blockquote>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Cybersecurity weaknesses?</h2>
					<p className="mb-4">
						Kenya’s Business Daily has said a little-known Moldovan business intelligence firm allegedly exploited a weakness in Kenya's government-owned Business Registration Service (BRS) to gain access to sensitive data of major shareholders in registered firms. The report, refuted by B2bHint, says the firm accessed and subsequently offered for sale a substantial amount of sensitive data from over two million Kenyan companies. This data included personal details such as residential addresses, email addresses, and phone numbers of significant shareholders. The firm reportedly sold this information for as much as Sh. 24 million for a comprehensive package, with individual phone numbers priced as low as $0.015.
					</p>
					<p className="mb-4">
						According to the same Business Daily report, B2b Hint denied hacking the BRS system, attributing its access to a perceived weakness in the BRS's cybersecurity standards. B2bHint refuted the claim that they hacked into the BRS system, saying the data was accessed through public URLs that were not adequately protected, rather than through a direct breach or hacking. B2bhint representatives clarified that their access to the data was based on the public availability of information and not as a result of malicious hacking. The Moldovan firm the data was exposed due to the BRS's cybersecurity weaknesses, rather than any illegal breach on their part.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Response from Kenyan authorities</h2>
					<p className="mb-4">
						BRS Director General Kenneth Gathuma confirmed the breach, emphasizing that the organization was strengthening its cybersecurity measures in response and that investigations were ongoing to understand the scope and prevent further incidents. The Ministry of Information, Communications, and the Digital Economy insisted that the data breach had been addressed.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">What is at stake?</h2>
					<p className="mb-4">
						Whether it was through hacking or cybersecurity weaknesses, the BRS breach on 31 January 2025 is notable for its scale. With sensitive data now exposed to the public domain raises concerns about its potential misuse. This could negatively impact investor confidence and erode trust in Kenya's regulatory systems. Restoring trust will require clear and transparent communication about the breach, its consequences, and the steps taken to address it.
					</p>
					<blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground mb-4">
						The prospect of critical personal and corporate data on sale in the dark web is unsettling.
					</blockquote>
					<p className="mb-4">
						While some analysts have suggested the possibility dark web sale of the hacked personal data, the exposure of the data-rich BRS, could lead to identity theft, fraud, or targeted social engineering attacks, particularly as it contains information about both companies and beneficial owners of the companies.
					</p>
					<p className="mb-4">
						The ongoing investigation into the origins of the BRS attack is crucial. Authorities are examining the breach for signs of advanced persistent threats (APTs), as well as identifying whether the attack is linked to broader geopolitical concerns. In previous incidents, such as the Stuxnet attack on Iran’s nuclear facilities in 2010, investigators traced the attack to a nation-state-backed effort using highly sophisticated malware.
					</p>
					<p className="mb-4">
						In other breaches in the past, there was disruption of operations and compromised customer data. This is the case in South Africa, where a 2019 ransomware attack on City Power Johannesburg disrupted operations and compromised customer data. The breach demonstrated the significant impact such attacks can have on both public trust and the operational capacity of vital services. Following this incident, South African companies were advised to invest in cybersecurity awareness training.
					</p>
					<p className="mb-4">
						Following a 2019 Nigerian National Information Technology Development Agency, where personal data belonging to millions of citizens was exposed, Nigerian authorities called for stronger data protection regulations, which were echoed by international data protection standards such as GDPR. This incident highlights the importance of regulatory compliance in cybersecurity and data management.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">How do affected entities protect themselves?</h2>
					<ul className="list-disc pl-6 mb-4">
						<li>Report identity theft to relevant authorities</li>
						<li>Monitor bank account and credit card statements</li>
						<li>Use identity theft protection services</li>
						<li>File a report with dark web monitoring services</li>
						<li>Secure online accounts and change passwords</li>
						<li>Enable 2-factor authentication</li>
						<li>Secure devices with antivirus and firewalls</li>
						<li>Educate yourself about phishing and scams</li>
						<li>Seek legal assistance if needed</li>
					</ul>
					<p className="mb-4">
						Taking these steps can significantly reduce the risks and help victims regain control over their personal information after a breach.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Corporate entities: Essential steps</h2>
					<ol className="list-decimal pl-6 mb-4">
						<li>Notify relevant authorities</li>
						<li>Perform a comprehensive investigation</li>
						<li>Enhance cybersecurity measures</li>
						<li>Monitor the dark web</li>
						<li>Communicate internally and externally</li>
						<li>Take legal and compliance actions</li>
						<li>Notify affected customers or employees</li>
						<li>Investigate and pursue legal action</li>
						<li>Plan for long-term security</li>
						<li>Keep monitoring post-breach</li>
					</ol>
					<p className="mb-4">
						By following these steps, victims of sensitive corporate data theft can mitigate damage, prevent further breaches, and protect themselves and their customers from the consequences of stolen data being sold or misused on the dark web.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Policy Way Forward for the BRS and similar state agencies</h2>
					<ul className="list-disc pl-6 mb-4">
						<li>Zero trust architecture</li>
						<li>Encryption and multi-factor authentication</li>
						<li>AI for threat detection</li>
						<li>Advanced intrusion prevention systems</li>
						<li>Security Information and Event Management (SIEM)</li>
					</ul>
					<p className="mb-4">
						To mitigate the risks associated with this breach, BRS and other organizations can implement a three-point plan of best practices, drawn from notable cybersecurity frameworks:
					</p>
					<ul className="list-disc pl-6 mb-4">
						<li>Incident response plan</li>
						<li>Phishing simulation and employee training</li>
						<li>Data masking</li>
					</ul>
					<p className="mb-4">Afrensics Security offers all these remedies.</p>
				</section>
				<div className="flex items-center mt-8">
					<img src={aediLogo} alt="AEDI Logo" className="h-10 w-10 rounded mr-3" />
					<span className="font-bold text-lg">Click to book an appointment with our professionals today.</span>
				</div>
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
					Users of WhatsApp, one of the most popular messaging platforms globally, have faced various vulnerabilities in recent years, affecting users worldwide, like the zero-click, no-interaction required hacking attack acknowledged by Meta this year. Cybercriminals increasingly target mobile users by exploiting vulnerabilities in mobile networks and telecommunications infrastructure. These vulnerabilities typically involve issues related to privacy, security, data breaches, and government surveillance.
				</div>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">WhatsApp Account Hijacking via SIM Swapping</h2>
					<p className="mb-4">
						WhatsApp group users in Kenya, Nigeria, and South Africa, have reported incidents where an attacker gains control of a victim member’s phone number, they can take over the WhatsApp account and access all messages, media, contacts, and group information associated with that account. Many are familiar with messages that seek to get members to click on a link and those who fall prey to this have their personal information stolen.
					</p>
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
					<ul className="list-disc pl-6 mb-4">
						<li>Social Engineering: The attacker typically starts by gathering personal information about the victim.</li>
						<li>Contacting the Carrier: The attacker then contacts the victim’s mobile service provider, claiming to be the victim.</li>
						<li>SIM Card Activation: If the hacker successfully convinces the carrier, the victim's phone number is transferred to a new SIM card in the attacker’s possession.</li>
						<li>Hijacking Accounts: The attacker can use it to intercept SMS-based authentication codes and take over accounts.</li>
					</ul>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Why is SIM Swapping Dangerous?</h2>
					<ul className="list-disc pl-6 mb-4">
						<li>Account Access: Hackers can reset passwords and access email, banking, social media, and WhatsApp.</li>
						<li>Financial Loss: Cybercriminals may exploit access to online banking, mobile money, or cryptocurrency accounts.</li>
						<li>Personal Data Exposure: Attackers can steal sensitive data, leading to identity theft or further scams.</li>
					</ul>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">How Attackers Hijack WhatsApp Accounts via SIM Swapping</h2>
					<ul className="list-disc pl-6 mb-4">
						<li>SIM Swap: Attacker triggers a “forgot password” process on WhatsApp and receives the verification code.</li>
						<li>Verification and Account Takeover: Attacker logs into the victim’s WhatsApp account.</li>
						<li>Exploiting group features: The victim’s account becomes a bait for other members of their WhatsApp group.</li>
						<li>Potential Harm: Attacker can send fraudulent messages, access sensitive conversations, and spread misinformation.</li>
					</ul>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Challenges in Addressing SIM Swapping in Africa</h2>
					<ul className="list-disc pl-6 mb-4">
						<li>Weak Carrier Security</li>
						<li>Lack of Awareness</li>
						<li>Limited Regulatory Oversight</li>
					</ul>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">What to remember</h2>
					<p className="mb-4">
						WhatsApp’s business model involves data sharing with its parent company, Facebook (now Meta). This has raised concerns about user data privacy, especially in regions with weak data protection laws, including many African countries.
					</p>
					<p className="mb-4">
						WhatsApp Web, the platform's browser-based version, has its own set of vulnerabilities. When users link their phone to the web app, malicious actors can potentially gain control of a user’s account if the phone is compromised, or if the browser session is hijacked.
					</p>
					<p className="mb-4">
						The vulnerabilities in WhatsApp, particularly in African countries, highlight the complexities of digital security in regions with ongoing political, social, and economic challenges.
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
						Nigeria recorded "17.5% of users" affected by web-based threats, while South Africa reported similar figures. Türkiye tops the list with 26.1%, followed by Kenya at 20.1% and Qatar at 17.8%. Both Nigeria and South Africa are among the top five countries in the region facing heightened cybersecurity risks.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Ethiopian State Bank “Thwart” Cyberattack</h2>
					<p className="mb-4">
						The state-owned Commercial Bank of Ethiopia (CBE) denied losing $51m from its internal account. An attempted fraud was "thwarted within minutes" and suspects were arrested. No money was stolen, and the incident was contained due to strong internal controls. Previously, a CBE ‘system glitch’ allowed customers to withdraw cash and make large digital transfers.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Cybercriminals Refining Tactics in Ghana</h2>
					<p className="mb-4">
						Ghanaians lost $48,500 to online blackmail and sextortion between January and April 2025, nearly a fivefold increase from the same period in 2024. Many perpetrators now use encrypted apps like WhatsApp, Telegram, and Signal to evade tracking. Sextortion cases and financial losses are rising as criminals exploit fake romantic relationships on social media.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Hacking Group Devman Claims Kenya's Social Security Fund Attack</h2>
					<p className="mb-4">
						Devman claimed compromising Kenya's National Social Security Fund (NSSF) system on 20 May, accessing members' data and demanding $4.5m from the government. NSSF assured the public that no data or financial records were compromised and investigations are ongoing.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Nigerian Bankers Insiders Colluding with Hackers</h2>
					<p className="mb-4">
						Nigeria recorded over 119,000 leaked data breaches in Q1 2025. The EFCC arrested several banking staff who granted access to hackers, enabling coordinated cyberattacks on Nigerian banks. Six banks were targeted, and large sums were recovered in three operations.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Cybercriminal Syndicate Target Exam Bodies</h2>
					<p className="mb-4">
						At least 20 suspects were arrested across Nigeria for computer-based test hacking targeting the 2025 UTME by JAMB. The syndicate is linked to attacks on digital infrastructure of key examination bodies, including JAMB and NECO.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Microsoft Warns Nigeria Over AI-Powered Scams</h2>
					<p className="mb-4">
						Microsoft identified e-commerce fraud, job scams, and tech support fraud as top AI-driven schemes in 2025. Deepfake incidents surged sevenfold in Africa from Q2 to Q4 of 2024. AI-powered chatbots and fake content are making scams more convincing and harder to detect.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Hacking Gang INC Claims South African Airways Cyberattack</h2>
					<p className="mb-4">
						The ransomware gang INC claimed a cyberattack on South African Airways in May. SAA confirmed a significant cyber incident on 3 May, which was contained and minimized disruption to flight operations. The attack followed a major cyberattack on MTN Group in April.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Hacktivists Target Tanzanian Government Institutions</h2>
					<p className="mb-4">
						Various Tanzanian institutions condemned the spread of false information online after cyberattacks targeted major government accounts, including the police and Tanzania Revenue Authority. The police launched an investigation after its official X account was hacked and used to spread false information.
					</p>
				</section>
				<section className="mb-8">
					<h2 className="text-xl font-bold mb-2">Cybersecurity Response</h2>
					<ul className="list-disc pl-6 mb-4">
						<li>
							<strong>Kenya and Microsoft launch cybersecurity initiative:</strong> Microsoft partnered with Kenya's National Computer and Cybercrime Coordination Committee to strengthen regional cybersecurity capacity.
						</li>
						<li>
							<strong>Ghana's Central Bank to strengthen cybersecurity campaign:</strong> Ghana's central bank reaffirmed its commitment to cybersecurity in the financial sector through collaboration and regulatory reform.
						</li>
						<li>
							<strong>Somalia moves to enhance cybersecurity:</strong> Somalia signed agreements with Malaysia to strengthen digital regulation and cyber security cooperation.
						</li>
						<li>
							<strong>Nigeria jails 15 foreigners over cyber-related crimes:</strong> The high court in Lagos sentenced 15 foreigners to a year each in prison for cyber-terrorism and internet fraud, raising the total to 33 convicted foreigners.
						</li>
					</ul>
				</section>
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
];

const BlogPost = () => {
	const { id } = useParams();
	const post = blogPosts.find((p) => p.id === id);

	// Like button state, initialized from localStorage
	const [likes, setLikes] = useState(0);

	useEffect(() => {
		// Load likes from localStorage for this blog post
		const storedLikes = localStorage.getItem(`blogLikes_${id}`);
		if (storedLikes) {
			setLikes(parseInt(storedLikes, 10));
		}
	}, [id]);

	const handleLike = () => {
		const newLikes = likes + 1;
		setLikes(newLikes);
		localStorage.setItem(`blogLikes_${id}`, newLikes.toString());
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
		const storedComments = localStorage.getItem(`blogComments_${id}`);
		if (storedComments) {
			setComments(JSON.parse(storedComments));
		}
	}, [id]);

	// Save comments to localStorage whenever they change
	useEffect(() => {
		localStorage.setItem(`blogComments_${id}`, JSON.stringify(comments));
	}, [comments, id]);

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
	const relatedPosts = blogPosts.filter((p) => p.id !== id);

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
										href={`/blog/${rp.id}`}
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