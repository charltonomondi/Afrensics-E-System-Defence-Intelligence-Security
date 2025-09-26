import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEO from '@/components/SEO';
import CybersecurityBreaches from '@/components/CybersecurityBreaches';
import { Button } from '@/components/ui/button';
import { slugify } from "@/utils/slugify";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, ArrowRight, Search, Filter, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import hacker from '@/assets/hacker.jpeg';
import WhatsApp from '@/assets/Whatsapp.png';
import cyber from '@/assets/cyber.png';
import blogBanner from '@/assets/banner/blog.webp';
import cyberincident from '@/assets/blogs/cyberincident.jpg';
import SA from '@/assets/blogs/SA.png'; 
import recap from '@/assets/blogs/recap.webp';
import recap2 from '@/assets/blogs/recap2.jpg';

const blogPosts = [
  {
    id: 8,
    title: "Afrensics Weekly Cybersecurity Highlights — 15–21 September 2025",
    excerpt: "Comprehensive analysis of Africa's cybersecurity landscape including rising threats to industrial automation systems, AI-powered phishing trends, Kenya's 4.6 billion-shilling cyber threats, and innovative responses from MTN and Central Bank of Kenya.",
    author: "Afrensics Security",
    date: "September 21, 2025",
    category: "Updates",
    image: cyber,
    featured: true,
    content: `
# AFRENSICS WEEKLY CYBERSECURITY HIGHLIGHTS
## 15–21 SEPTEMBER 2025

### CYBER THREATS AND ATTACKS

**Threat landscape for industrial automation systems in Africa:** High threat detection rates indicate low cybersecurity maturity in industrial sectors. Africa leads globally in threats including worms, ransomware, spyware, and web miners, with poor network segmentation and endpoint protection cited as challenges. South Africa, Namibia, Rwanda, Mauritania, and Gabon are top countries affected by various malware types.

**State of African cybersecurity:** A KnowB4 survey across seven African countries found increased awareness of cybersecurity threats but also revealed overconfidence — 83% believed they would recognize a security incident, yet 53% did not understand ransomware. African users are increasingly concerned about cybercrime, with 58% expressing high concern compared to 29% in 2023. Mobile banking and payments usage jumped to 85%, enlarging the digital attack surface. Phishing victims rose from 26% to 32%, while financial losses slightly increased, underscoring the sophistication of attacks and a gap between awareness and behaviour.

**Kaspersky cybersecurity expert warns of growing threats to African businesses:** Emphasis on increasing sophistication of cyberattacks necessitates layered and proactive cybersecurity strategies for African enterprises.

**Infostealer and ransomware trends increase in South Africa:** A Kaspersky report shows a rise in sophisticated cyber threats such as infostealers and ransomware targeting South African users and enterprises. Recommended multilayer defense strategies focusing on continuous threat intelligence and proactive incident response.

**Kenya detects 4.6 billion-shilling cyber threats in Q2 2025:** An 80.8% increase in detected cyber threats was recorded in Kenya driven by improved monitoring and expanding digital footprint. Increasingly sophisticated AI-powered attacks, social engineering, and phishing scams pose major risks to both private and public sectors.

**Namibia Cyber threats surge:** The Namibia Cyber Security Incident Response Team reported 843,000 cyber-attacks and 549,556 vulnerabilities detected in the second quarter of 2025, a significant rise in threat volume. This report emphasized both large-scale threat detection and the urgent need for proactive defences in public and private sectors.

**AI-Powered phishing fuels ransomware losses:** AI-generated phishing is a growing trend contributing to ransomware attacks, as noted in CrowdStrike's 2025 Threat Hunting Report, with 78% of enterprises experiencing at least one AI-specific breach.

### CYBERSECURITY RESPONSE & INNOVATION

**MTN in $240 Million AI data centre push:** MTN Group confirmed commercial negotiations with US and European partners to build AI-enabled data centres across Africa. The first centre in Nigeria aims to provide computing power for governments and enterprises, enhancing digital sovereignty and reducing reliance on overseas cloud providers. The move targets the continent's low data centre capacity and growing demand for secure, AI-powered infrastructure.

**Kenya's Central Bank launches banking sector cybersecurity centre:** The Central Bank of Kenya launched a state-of-the-art Banking Sector Cybersecurity Operations Centre to combat rising cyber threats in the financial sector. The BS-SOC will provide real-time threat intelligence, incident response, digital forensics, and cyber investigations. Banks and other regulated financial institutions must report cyber incidents within specified timelines and comply with harmonized cybersecurity regulations. The initiative follows a sharp rise in cybercrime in Kenya with 2.54 billion cyber threat incidents reported in Q1 2025 and a record $12 million stolen from bank customers in 2024.

**AI and Cybersecurity Innovations:** Collaborations among cybersecurity firms such as CrowdStrike with tech giants are enhancing AI security infrastructure to better protect against emerging vulnerabilities including model theft and data poisoning.

**What SMEs can do to avert cyberattacks:** Many SMEs lack basic cybersecurity measures, making them vulnerable to data theft, operational disruptions, and financial losses. The problem is worsened by employees falling for scams and outdated systems that hackers exploit. Strategies to solve this problem include implementing multi-layered defences such as regular staff training, timely software patching, automatic data backups, securing all devices, using stronger authentication methods like two-factor authentication, and limiting access rights within the organisation. By proactively addressing these vulnerabilities, SMEs can protect themselves from costly cyberattacks and build a safer digital future in an increasingly connected world.

**Bring Your Own Device (BYOD) policies:** Organizations face serious cybersecurity risks, especially with the escalating BYOD risks - 41% to 80% of employees using personal devices for work and growing shadow AI that lacks governance in organizations. These devices often lack proper security controls, making sensitive data vulnerable to leaks, malware infections, and breaches via unsecured apps, cloud storage, public Wi-Fi, or malicious downloads. To mitigate these issues, organisations must establish clear BYOD rules, implement technical safeguards such as strong passwords, multifactor authentication, encryption, and endpoint security, and prioritise thorough employee training.

---

*This comprehensive report highlights the evolving cybersecurity landscape across Africa, showcasing both emerging threats and innovative responses from governments, organizations, and industry leaders.*
    `
  },
  {
    id: 1,
    title: "Vulnerability haunts over a million Kenyan Businesses, more could be at risk!",
    excerpt: "Kenya’s Business Registration Service (BRS) experienced a significant cyberattack on the night of 31 January 2025, resulting in a data breach that exposed sensitive information.",
    author: "Afrensics Security",
    date: "February 25, 2025",
    category: "Threats",
    image: hacker,
    featured: false
  },
  {
    id: 2,
    title: "Bugs target mobile money in WhatsApp attacks ",
    excerpt: "Users of WhatsApp, one of the most popular messaging platforms globally, have faced various vulnerabilities in recent years, affecting users worldwide, like the zero-click, no-interaction required hacking attack acknowledged by Meta this year. ",
    author: "Afrensics Security",
    date: "May 26, 2025",
    category: "Tips",
    image: WhatsApp,
  },
  {
    id: 3,
    title: "May 2025 Africa Cyber Incidents and Responses",
    excerpt: "The state-owned Commercial Bank of Ethiopia (CBE), which has denied losing $51m from its internal account. The Addis Standard news website reported on 29 May that an attempted fraud was thwarted within minutes. ",
    author: "Afrensics Security",
    date: "May 30, 2025",
    category: "Trends",
    image: cyber,
  },
  {
    id: 4,
    title: "African Cyber Incidents and Responses - June 2025 Highlights",
    excerpt: "Comprehensive analysis of cybersecurity incidents across Africa including Kenya's 202% spike in cyberattacks, South African mining breaches, Mozambican cybercrime trends, and innovative responses from governments and organizations across the continent.",
    author: "Afrensics Security Team",
    date: "June 30, 2025",
    category: "Threat Intelligence",
    image: cyberincident,
    content: `
# AFRICAN CYBER INCIDENTS AND RESPONSES
## JUNE 2025 HIGHLIGHTS

### Key Findings:
- **Kenya**: Cyberattacks increased by 202% to 2.5 billion threats (Jan-Mar 2025)
- **Mozambique**: Cybercrime rose by 16% in 2024 with 1,051 processed cases
- **Ghana**: 377 cyberbullying complaints linked to unlicensed loan apps (Jan-May 2025)
- **Nigeria**: Major international partnerships launched for AI development

### Researchers say hackers using open-source tools in Africa

Cybersecurity researchers have drawn attention to a series of cyberattacks targeting financial organisations across Africa since at least July 2023 using a mix of open-source and publicly available tools to maintain access. According to the US Hacker news website, the suspected end goal of the attacks is to obtain initial access and then sell it to other criminal actors on underground forums, making the threat actor an initial access broker (IAB).

### Cyberattacks in Kenya spike by 200% between January-March 2025

Cyberattacks in Kenya increased by 202% to 2.5 billion threats between January and March 2025, up from 840.9 million recorded during the previous quarter (October- December 2024). According to the Communication Authority of Kenya attributing the surge to "system vulnerability threats" among Kenyan firms.

### Hackers target South African platinum mining giant

A leading South African mining firm, Eastern Platinum (Eastplats), announced a data breach related to specific files on its internal affairs. ICT news website mybroadband.co.za reported on 21 June that Eastplats is a platinum group metals (PGM) and chrome producer with assets located along South Africa's Bushveld Complex, the world's largest known PGM resource. The incident occurred on 27 May, but the company only announced it on 17 June.

### Mozambican cybercrime increased by 16% in 2024

Cybercrime in Mozambique increased by 16% last year, compared to 2023. "The crimes most often perpetrated are related to frauds involving electronic payment instruments and channels, but also to computer and communications fraud," the Portuguese news agency (Lusa) on 5 June quoted deputy attorney general, Amabelia Chuquela, as saying, blaming the trend on lack of resources and of public awareness.

### Gates Foundation launches AI scaling hub in Nigeria

The Nigerian Ministry of Communications, Innovation & Digital Economy, in partnership with the Gates Foundation, have announced the launch of the Nigeria Artificial Intelligence (AI) Scaling Hub. The initiative seeks "to accelerate the development of AI-driven solutions that improve lives and expand opportunity across key sectors such as health, agriculture, and education" in the country. The Gates Foundation pledged to support the hub with up to $7.5 million spread over three years.

### Ghana's surge in cyberbullying linked to unlicensed mobile loan apps

Ghana's Cyber Security Authority (CSA) has warned against a surge in cyberbullying, harassment, and blackmail linked to unlicensed mobile loan applications operating in the country. Joy FM news website report on 1 June quoted the CSA saying it received 377 complaints from January to May 2025 alone, compared to 228 for the whole of 2024.

## RESPONSE INITIATIVES

### Kenya's parliament blocks tax body's access to banking details

Kenyan members of the National Assembly have blocked the Kenya Revenue Authority (KRA) from accessing companies' trade secrets and customer data to assess the businesses for tax. The parliamentary committee on finance quashed a second attempt by the revenue authority to have unfettered access to detailed transactional data.

### Ethiopia 'reinforcing' national cyber-defence architecture

Ethiopia is reinforcing its national cyber-defence architecture as a core component of its ambitious Digital Ethiopia transformation agenda, with intensified awareness campaigns targeting public institutions and individual users.

### International Prosecutions

Multiple international prosecutions have resulted in significant sentences for cybercriminals, including Nigerian nationals receiving combined sentences of 159 years for a $17m fraud scheme, and Chinese, Filipino nationals being jailed in Nigeria for cyber-terrorism offences.

## INNOVATION & PARTNERSHIPS

### Nigeria, Meta launch AI 'accelerator' programme

The Nigerian government, in partnership with Meta, has launched the Nigeria AI Accelerator Programme to support startups developing AI solutions for agriculture, health, education, and financial services. The first cohort runs from August to December 2025.

### Uganda launches first-ever AI policy

Uganda announced the development of the country's first-ever AI policy as part of its Fourth National Development Plan (NDP4), positioning Uganda as a digitally empowered economy.

---

*This comprehensive report demonstrates the evolving cybersecurity landscape across Africa, highlighting both challenges and innovative responses from governments, organizations, and international partners.*
    `,
  },
  {
    id: 5,
    title: "African Cyber Incidents and Responses - July 2025 Highlights",
    excerpt: "Comprehensive analysis of major cybersecurity incidents across Africa in July 2025, including attacks on South African media houses, Namibian municipalities, and innovative AI responses across the continent.",
    author: "Afrensics Security",
    date: "August 9, 2025",
    category: "Threats",
    image: SA,
    featured: false,
    content: `
# AFRICAN CYBER INCIDENTS AND RESPONSES
## JULY 2025 HIGHLIGHTS

### Hackers unleash phishing attacks on South African media houses

Hackers unleashed phishing attacks between 28 and 31 July on two leading South African media outlets: the state South African Broadcasting Corporation (SABC) and the private eMedia. The attack "affected a small number of employee accounts", an SABC spokesman, Mmoni Ngubane told [MyBroadband](https://mybroadband.co.za/news/broadcasting/604864-sabc-hacked.html) technology news website on 31 July, adding "our IT Security team responded immediately, securing the affected mailboxes and containing the incident".

The SABC "continues strengthening its cybersecurity measures and educating staff on cybersecurity". At the eMedia house, including eNCA website, a spokesman told [MyBroadband](https://mybroadband.co.za/news/broadcasting/605080-two-south-african-broadcasters-hit-by-cyberattack.html) that a similar attack to the SABC incident hit a "single individual's email account" and "the situation was contained quickly". "The email that led to the compromise originated from a compromised SABC account".

### Hackers target Namibia's northern Otjiwarongo Municipality

The Namibian Cyber Security Incident Response Team (Nam-CSIRT) on 19 July reported a cybersecurity breach targeting the IT systems of the Otjiwarongo Municipality in the country's central-northern region. [The Namibian](https://www.namibian.com.na/otjiwarongo-municipality-hit-by-suspected-ransomware-attack/) newspaper reported that the incident detected on 16 July and confirmed by [Red Packet Security](https://www.redpacketsecurity.com/incransom-ransomware-victim-otjiwarongo-municipality/), a public sector entity located in Namibia "possibly involved stolen data and a ransom demand".

"Preliminary findings indicate that a cybercriminal group known as 'INC Ransom' may be behind the attack," said a statement issued by the Communications Regulatory Authority of Namibia, under which the Nam-CSIRT falls. The team "alerted the municipality and advised immediate containment steps," the statement added.

### Hackers list Seychelles bank's client data in the dark web

A hacker claims to have stolen and sold the personal data of clients of a prominent bank in the Indian Ocean archipelago of Seychelles. According to [Bank Info Security](https://www.bankinfosecurity.com/seychelles-commercial-bank-confirms-customer-data-breach-a-28972) website report on 15 July, the Seychelles Commercial Bank "recently identified and contained a cybersecurity incident, which has resulted in its internet banking services being temporarily suspended".

The breach became public on 4 July "via cybercrime marketplace DarkForums, when the user 'ByteToBreach' posted for sale a 'Seychelles main bank clients leak'". The listing read in part: 'I currently have the data of the clients of this bank, with DOB, phones, names, addresses, emails etc. The first attack occurred on 5 February, before the hackers returned on 3 July, "ultimately stealing 2.2 gigabytes of customer data," according to the Bank Info Security report.

### Zambia lost $4.8m to cybercrimes in the first half of 2025

Zambia's Minister of Home Affairs and Internal Security Jack Mwiimbu and his Technology and Science counterpart Felix Mutati on 10 July announced that the southern Africa country lost over $4.8m in cyber-related crimes between 1 January and 30 June 2025. According to [ICT Association of Zambia](https://www.facebook.com/ICTAssociationZM/posts/zambians-lost-over-k100-million-through-online-scammers-in-the-last-six-months-o/1128621975966548/), the ministers cited data from the Zambia Information and Communication Technology Authority (ZICTA), which reported 621 hacking cases all of which were recovered, and 224 impersonation cases, with 34 fake accounts successfully taken down.

"WhatsApp recorded 462 hacking cases all of which were recovered and 224 impersonation cases involving Very Important Persons (VIPs), with all hacked accounts recovered. Telegram saw 123 hacking cases (122 recovered) and 52 impersonation incidents.

### Malware attack on SA Treasury systems follows Microsoft server hack

South Africa's National Treasury (NT) on 22 July confirmed asking Microsoft for assistance identifying and addressing any potential vulnerabilities in its systems. The request followed a major cyberattack on [Microsoft's SharePoint](https://www.cnbc.com/2025/07/21/microsoft-sharepoint-attack-vulnerability.html?msockid=1e73022beb5668cb3091124dea9669b1) document management system which affected some 400 organisations globally.

South Africa's influential [Eyewitness News](https://www.ewn.co.za/2025/07/24/national-treasury-affected-by-malware-attack-after-hack-of-microsoft-server-software) cited a statement issued by the National Treasury saying that it "identified malware on its Infrastructure Reporting Model (IRM) website, its online infrastructure reporting and monitoring system, on 22 July". The institution "isolated the IRM servers to assess the magnitude of the compromise and to ensure the security of its systems". The Treasury reassured that "Despite these events, NT's systems and websites continue to operate normally without any disruption".

### SA website links Chinese APT41 group to "cyber espionage" in Southern Africa

A South African website has linked a Chinese-speaking advanced persistent threat (APT) group APT41 to "a cyber espionage attack" targeting an organisation in Southern Africa. "While APT41 has shown limited activity in southern Africa, this incident suggests the group is now targeting government IT services in the region", [ITWeb](https://www.itweb.co.za/article/kaspersky-links-cyber-espionage-attack-in-southern-africa-to-chinese-speaking-apt41/6GxRKMYQyJeMb3Wj) reported on 22 July, citing a statement issued by Kaspersky saying "the primary motive behind the intrusion was to extract sensitive data from compromised systems within the organisation's network, including credentials, internal documents, source code and communication records".

Kaspersky said it linked the attack to APT41 with "high confidence based on the tactics, techniques and procedures observed." They employed a credential-harvesting technique known as registry dumping to obtain two key domain accounts – one with local administrator rights across all workstations and another tied to a backup solution with domain administrator privileges. These credentials enabled lateral movement within the network." Kaspersky said it had "has not observed additional attacks in southern Africa by the group". APT41 focuses on a wide range of sectors, including telecommunications, education, healthcare, IT and energy and has been linked to operations in at least 42 countries.

## RESPONSE

### Rwanda reveals cybercrimes targeting foreigners

Rwandan authorities have revealed an elaborate cyberfraud scheme targeting foreign tourists booking permits online to see the country's iconic mountain gorillas. The [KT Press](https://www.ktpress.rw/2025/07/how-rwf-93-billion-in-criminal-proceeds-flowed-through-rwandas-economy/#google_vignette) news website reported on 21 July that fees paid by the tourists went "straight into a private bank account" operated by an employee of the tourism ministry. According to the website, some $478,000 was rerouted to this account and "By the time authorities uncovered the scheme, he had used the money to acquire properties and assets under his own name".

KT Press said the case is "one of many that now form the basis of Rwanda's 2024 National Money Laundering and Terrorist Financing Risk Assessment Report", which estimates that over $64m "in criminal proceeds—mostly from embezzlement, fraud, tax crimes, and cyber scams—circulated through the economy between 2019 and 2024". According to the report, "four crimes—embezzlement, fraud, tax crime and cybercrime—[were] responsible for 96% of the total proceeds". It added that the report warned of "a worrying shift toward technology-driven fraud, including pyramid schemes, mobile money scams, and cryptocurrency swindles".

### South Africa repositions cybersecurity in strategic defence realignment

South African Minister for National Security Khumbudzo Ntshavheni announced on 16 July that the government was "repositioning cyber security as a core component of its national security strategy, with a renewed focus on counter-intelligence and protective security, following a series of high-profile cyberattacks on state institutions."

According to IT Web, the minister revealed the plans when she unveiled the country's National Security Strategy (NSS) 2024–2029, the National Intelligence Estimate (NIE) 2019–2024 and the National Intelligence Priorities (NIPs). Ntshavheni added that "faced with the increased threat of cybercrime, the country will bolster cyber forensic capability to effectively address and regulate online technologies and crypto-currencies that are exploited to facilitate illicit financial flows". South Africa will "adjust its cyber security posture to accommodate counter-intelligence and protective security at its core".

## INNOVATION

### Google commits $37 million to AI advancement in Africa

Google has announced contributions totaling $37 million in support of research, talent development, and infrastructure to advance AI across Africa, [Philanthropy News Digest](https://philanthropynewsdigest.org/news/google-commits-37-million-for-ai-advancement-in-africa#:~:text=Home%20Philanthropy%20news%20Google%20commits,higher%20education%20institutions%20in%20Ghana) reported on 29 July. Funding from Google and Google.org will support the AI Community Centre in Accra, Ghana, a hub that aims to explore how AI can respond to the needs of Africans.

The commitments include $25 million in support of the AI Collaborative: Food Security initiative, which will provide AI tools designed to improve hunger forecasting, strengthen crop resilience, and bolster smallholder farmers; $7 million in support of AI education and safety programs in Ghana, Kenya, Nigeria, and South Africa; $3 million to boost the Masakhane African Languages AI Hub; and $1 million each to the African Institute for Data Science and Artificial Intelligence at the University of Pretoria and the Wits MIND Institute in Johannesburg for AI research.

### Nigeria deploying AI to help improve agricultural productivity

Nigeria's Vice President Kashim Shettima said on 27 July that the government was deploying AI and other modern technologies to monitor food production, enhance transparency, connect producers to markets, and reduce waste across the agricultural value chain. "The Fourth Industrial Revolution has not only disrupted the old order but gifted us instruments that were once confined to imagination. Artificial intelligence, geospatial analytics and satellite-driven climate intelligence are now part of our agricultural vocabulary," he said in remarks published by [Cable news](https://www.thecable.ng/shettima-fg-deploying-ai-to-boost-food-production-reduce-agricultural-waste/) website.

Nigeria is actively utilizing AI in various sectors, driven by a combination of government initiatives and private sector innovation. Key areas include:

**Economic Impact:** AI is expected to add up to $15.7 trillion to the global economy by 2030, positively impacting industries and governance.

**Sectors:** The fintech sector is at the forefront, with companies like PayStack leveraging AI for fraud reduction and financial inclusion.

**Skills Development:** Initiatives like the Three Million Technical Talent (3MTT) program are training the next generation in AI and digital skills.

**Policy Framework:** Nigeria is developing a homegrown AI policy to harness the innovation, with a recent survey showing high usage of AI across various sectors.

These efforts reflect Nigeria's commitment to integrating AI into its socio-economic fabric and driving national development.

### AI boosts South Africa Revenue Service in tax assessments, refunds

The South African Revenue Service (SARS) has assessed more than three-quarters of taxpayers and refunded over R10.6 billion, following its adoption of AI in its operations. ITweb reported on 21 July that "The auto assessments and refunds were processed ahead of the official start of manual filing" and "most refunds were paid within 72 hours, enabled by data integration, AI and data science". The SARS commissioner Edward Kieswetter told parliament earlier this year that future innovations include a "unique digital identity system" being developed in collaboration with the Department of Home Affairs and the South African Reserve Bank.

**AI upgrades bear fruit for South Africa's SARS:**

- R10.6 billion in refunds paid out within 72 hours, showcasing the efficiency of AI-driven processes
- 5.8 million taxpayers auto-assessed, an increase from 5 million in 2024, with minimal user interaction required
- 99.6% of auto-assessments remained unchanged by taxpayers, indicating the accuracy and reliability of the AI system
- Over 2.1 million taxpayers engaged with SARS through digital channels, including eFiling and the SARS MobiApp
- Fraud risk detection processes have stopped fraudulent refunds worth R61 billion, demonstrating AI's role in preventing impermissible or fraudulent refunds
- R210 billion reclaimed in the current tax year, part of SARS' broader efforts to tackle tax debt

These advancements reflect SARS's commitment to modernizing its tax administration and ensuring compliance with tax laws.

### Kenya tops global usage of ChatGPT by over 16-year olds - report

A new report by global internet researchers, [Datareportal and Meltwater](https://datareportal.com/reports/digital-2025-july-global-statshot), has placed Kenya first in the usage of ChatGPT ahead of the United Arab Emirates (UAE) and Israel. In Africa, Kenya was followed by South Africa, which was placed eighth globally, ahead of Egypt and Nigeria, ranked 18th and 19th globally respectively.

---

*This comprehensive report highlights the evolving cybersecurity landscape across Africa, showcasing both the challenges and innovative responses emerging across the continent.*
    `
  },
  {
    id: 6,
    title: "Afrensics Weekly Cybersecurity Highlights — Week 1: 1–7 September 2025",
    excerpt: "Week 1 highlights: Ghana reports GH■15 million in cybercrime losses; Benin’s public and finance sectors hit hardest; StealC v2 malware via Facebook; WhatsApp workplace risks; Nigeria’s 2026 telecom cybersecurity framework; Zimbabwe faces rising cybercrime.",
    author: "Afrensics Security",
    date: "September 7, 2025",
    category: "Updates",
    image: recap,
  },
  {
    id: 7,
    title: "Afrensics Weekly Cybersecurity Highlights — Week 2: 8–14 September 2025",
    excerpt: "Week 2 highlights: weaponized AI, stricter compliance, precision ransomware (Qilin, Medusa, Rhysida), Yurei in Africa/Asia, Google Cloud 2025 forecast, Uganda’s rising cybercrime, Nigeria shipping MITM scams, 168% surge in money mules, Kenya Sh1.59B mobile fraud, Angola worst-hit, mobile attacks up 29%, Proofpoint agentic AI, EdTech phishing, Africa’s literacy/investment gaps.",
    author: "Afrensics Security",
    date: "September 14, 2025",
    category: "Updates",
    image: recap2,
  }
];

const categories = ["All", "Threats", "Tips", "Trends", "Breaches", "Updates"];

const Blog = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  // Filter and search blog posts
  const filteredPosts = useMemo(() => {
    let filtered = blogPosts;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.author.toLowerCase().includes(query) ||
        post.category.toLowerCase().includes(query)
      );
    }

    // Sort by date (newest first)
    filtered = filtered.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateB.getTime() - dateA.getTime();
    });

    return filtered;
  }, [searchQuery, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search is handled by the useMemo hook above
  };

  const clearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="min-h-screen">
      <SEO
        title="Cybersecurity Blog | Latest Security News & Insights | AEDI Security"
        description="Stay updated with the latest cybersecurity trends, threats, and insights from AEDI Security's expert team. Read about penetration testing, vulnerability research, and security best practices."
        keywords="Cybersecurity Blog, Security News, Cyber Threats, Penetration Testing Blog, Vulnerability Research, Security Insights, AEDI Blog, Cybersecurity Trends, Security Best Practices, Incident Response News"
        url="https://aedisecurity.com/blog"
      />
      <Navigation />
      
      {/* Hero Section */}
      <section
        className="py-20 bg-cover bg-center relative"
        style={{
          backgroundImage: `url(${blogBanner})`,
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Cybersecurity Blog
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Stay informed about the latest cybersecurity threats, trends, and best practices.
            Expert insights from Kenya's leading security professionals.
          </p>
        </div>
      </section>

      {/* Cybersecurity Breaches Section */}
      <CybersecurityBreaches />

      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Post */}
              {paginatedPosts.filter(post => post.featured).map(post => (
                <Card key={post.id} className="mb-12 card-gradient shadow-hero overflow-hidden">
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    <div className="relative">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-64 md:h-full object-cover"
                      />
                      <Badge className="absolute top-4 left-4 bg-primary text-white">
                        Featured
                      </Badge>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Badge variant="secondary">{post.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {post.date}
                        </div>
                      </div>
                      <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
                      <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span className="text-sm text-muted-foreground">{post.author}</span>
                        </div>
                        <Link to={`/blog/${slugify(post.title)}`}>
                          <Button variant="outline" size="sm">
                            Read More <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}

              {/* Regular Posts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {paginatedPosts.filter(post => !post.featured).length === 0 && searchQuery ? (
                  <div className="col-span-2 text-center py-12">
                    <Search className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-600 mb-2">No articles found</h3>
                    <p className="text-gray-500 mb-4">
                      No articles match your search for "{searchQuery}". Try different keywords or browse all articles.
                    </p>
                    <Button onClick={clearSearch} variant="outline">
                      <X className="h-4 w-4 mr-2" />
                      Clear Search
                    </Button>
                  </div>
                ) : (
                  paginatedPosts.filter(post => !post.featured).map(post => (
                  <Card key={post.id} className="card-gradient shadow-card hover:shadow-hero transition-all duration-300 overflow-hidden">
                    <div className="relative">
                      <img 
                        src={post.image} 
                        alt={post.title}
                        className="w-full h-48 object-cover"
                      />
                      <Badge className="absolute top-4 left-4" variant="secondary">
                        {post.category}
                      </Badge>
                    </div>
                    <CardHeader>
                      <div className="flex items-center text-sm text-muted-foreground mb-2">
                        <Calendar className="h-4 w-4 mr-1" />
                        {post.date}
                      </div>
                      <CardTitle className="text-lg font-semibold line-clamp-2">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="line-clamp-3">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span className="text-sm text-muted-foreground">{post.author}</span>
                        </div>
                        <Link to={`/blog/${slugify(post.title)}`}>
                          <Button variant="outline" size="sm">
                            Read More
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                  ))
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col items-center mt-12 space-y-4">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages} ({filteredPosts.length} posts total)
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </Button>
                    ))}

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Search */}
              <Card className="mb-8 card-gradient shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Search Articles
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSearch} className="space-y-3">
                    <div className="relative">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by title, keywords, author..."
                        className="w-full px-3 py-2 pr-10 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={clearSearch}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                    <Button type="submit" size="sm" className="w-full">
                      <Search className="h-4 w-4 mr-2" />
                      Search Articles
                    </Button>
                    {searchQuery && (
                      <div className="text-sm text-muted-foreground">
                        {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''} found for "{searchQuery}"
                      </div>
                    )}
                  </form>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card className="mb-8 card-gradient shadow-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Filter className="h-5 w-5 mr-2" />
                    Categories
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={`block w-full text-left px-3 py-2 rounded-md transition-colors ${
                          selectedCategory === category
                            ? 'bg-primary text-primary-foreground'
                            : 'hover:bg-accent hover:text-accent-foreground'
                        }`}
                      >
                        {category}
                        {category !== 'All' && (
                          <span className="float-right text-sm opacity-70">
                            {blogPosts.filter(post => post.category === category).length}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Latest Posts */}
              <Card className="card-gradient shadow-card">
                <CardHeader>
                  <CardTitle>Latest Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {filteredPosts.filter(post => !post.featured).slice(0, 3).map(post => (
                      <div key={post.id} className="flex space-x-3">
                        <img
                          src={post.image}
                          alt={post.title}
                          className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 mb-1">{post.title}</h4>
                          <p className="text-xs text-muted-foreground">{post.date}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      {/* <WhatsAppFloat /> */}
    </div>
  );
};

export default Blog;