import { useState, useMemo } from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
// import WhatsAppFloat from '@/components/WhatsAppFloat';
import SEO from '@/components/SEO';
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

const blogPosts = [
  {
    id: 1,
    title: "Vulnerability haunts over a million Kenyan Businesses, more could be at risk!",
    excerpt: "Kenya’s Business Registration Service (BRS) experienced a significant cyberattack on the night of 31 January 2025, resulting in a data breach that exposed sensitive information.",
    author: "Afrensics Security",
    date: "February 25, 2025",
    category: "Threats",
    image: hacker,
    featured: true
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
    title: "Cloud Security Best Practices for Kenyan SMEs",
    excerpt: "Small and medium enterprises are increasingly moving to the cloud. Here's how to ensure your cloud infrastructure remains secure and compliant.",
    author: "",
    date: "Coming Soon",
    category: "Tips",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop"
  },
  {
    id: 5,
    title: "Phishing Attacks Target Mobile Banking Users in Kenya",
    excerpt: "Mobile money and banking users are facing sophisticated phishing attacks. Learn how to identify and avoid these dangerous scams.",
    author: "",
    date: "Coming Soon",
    category: "Threats",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=400&h=250&fit=crop"
  },
  {
    id: 6,
    title: "The Rise of AI in Cybersecurity: Opportunities and Challenges",
    excerpt: "Artificial Intelligence is transforming cybersecurity. Explore how AI is being used to enhance security and the new challenges it brings.",
    author: "",
    date: "Coming Soon",
    category: "Trends",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400&h=250&fit=crop"
  }
];

const categories = ["All", "Threats", "Tips", "Trends", "Breaches", "Updates"];

const Blog = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

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

    return filtered;
  }, [searchQuery, selectedCategory]);

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
          backgroundImage: `url('/src/assets/banner/blog.webp')`,
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


      {/* Blog Content */}
      <section className="py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Featured Post */}
              {filteredPosts.filter(post => post.featured).map(post => (
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
                {filteredPosts.filter(post => !post.featured).length === 0 && searchQuery ? (
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
                  filteredPosts.filter(post => !post.featured).map(post => (
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
              <div className="flex justify-center mt-12">
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Previous</Button>
                  <Button variant="default" size="sm">1</Button>
                  <Button variant="outline" size="sm">2</Button>
                  <Button variant="outline" size="sm">3</Button>
                  <Button variant="outline" size="sm">Next</Button>
                </div>
              </div>
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
                    {filteredPosts.slice(0, 3).map(post => (
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