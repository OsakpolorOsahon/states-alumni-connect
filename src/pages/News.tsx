
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

const News = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const newsArticles = [
    {
      id: 1,
      title: "SMMOWCUB Annual Convention 2024 - A Resounding Success",
      excerpt: "The 2024 Annual Convention brought together over 200 alumni from across the globe, featuring keynote speeches, networking sessions, and the Hall of Fame induction ceremony.",
      content: "Full article content would go here...",
      author: "Secretary General",
      date: "2024-03-15",
      category: "events",
      image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: true
    },
    {
      id: 2,
      title: "New Mentorship Program Launches for Young Professionals",
      excerpt: "Our latest initiative connects recent graduates with seasoned alumni in their respective fields, fostering professional growth and career advancement.",
      content: "Full article content would go here...",
      author: "Programs Committee",
      date: "2024-03-10",
      category: "programs",
      image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 3,
      title: "Alumni Excellence Awards 2024 - Call for Nominations",
      excerpt: "Nominate outstanding alumni who have made significant contributions to their communities and professions. Deadline for submissions is April 30th.",
      content: "Full article content would go here...",
      author: "Awards Committee",
      date: "2024-03-05",
      category: "awards",
      image: "https://images.unsplash.com/photo-1500673922987-e212871fec22?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    },
    {
      id: 4,
      title: "Digital Portal Enhancement - New Features Released",
      excerpt: "The SMMOWCUB portal has been updated with enhanced member profiles, improved job board functionality, and new community discussion features.",
      content: "Full article content would go here...",
      author: "Tech Team",
      date: "2024-02-20",
      category: "technology",
      image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      featured: false
    }
  ];

  const categories = [
    { id: "all", label: "All News" },
    { id: "events", label: "Events" },
    { id: "programs", label: "Programs" },
    { id: "awards", label: "Awards" },
    { id: "technology", label: "Technology" }
  ];

  const filteredArticles = selectedCategory === "all" 
    ? newsArticles 
    : newsArticles.filter(article => article.category === selectedCategory);

  const featuredArticle = newsArticles.find(article => article.featured);
  const regularArticles = newsArticles.filter(article => !article.featured);

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="absolute inset-0 bg-[#E10600] opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10 mb-8"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Latest News
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Stay updated with the latest happenings in the SMMOWCUB community
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {categories.map(category => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              onClick={() => setSelectedCategory(category.id)}
              className={selectedCategory === category.id 
                ? "bg-[#E10600] hover:bg-[#C10500]" 
                : "border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white"
              }
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Featured Article */}
        {featuredArticle && selectedCategory === "all" && (
          <Card className="mb-12 dark:bg-card dark:border-border overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2">
                <img 
                  src={featuredArticle.image} 
                  alt={featuredArticle.title}
                  className="w-full h-64 md:h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-6">
                <Badge className="bg-[#E10600] text-white mb-4">Featured</Badge>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground dark:text-foreground mb-4">
                  {featuredArticle.title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {featuredArticle.excerpt}
                </p>
                <div className="flex items-center text-sm text-muted-foreground mb-4">
                  <User className="h-4 w-4 mr-2" />
                  <span className="mr-4">{featuredArticle.author}</span>
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{new Date(featuredArticle.date).toLocaleDateString()}</span>
                </div>
                <Button className="bg-[#E10600] hover:bg-[#C10500] text-white">
                  Read More
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.filter(article => !article.featured || selectedCategory !== "all").map(article => (
            <Card key={article.id} className="dark:bg-card dark:border-border overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="aspect-video overflow-hidden">
                <img 
                  src={article.image} 
                  alt={article.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <CardHeader>
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-[#E10600] border-[#E10600]">
                    {article.category}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(article.date).toLocaleDateString()}
                  </span>
                </div>
                <CardTitle className="text-lg font-bold text-foreground dark:text-foreground hover:text-[#E10600] transition-colors">
                  {article.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <User className="h-4 w-4 mr-1" />
                    <span>{article.author}</span>
                  </div>
                  <Button variant="outline" size="sm" className="border-[#E10600] text-[#E10600] hover:bg-[#E10600] hover:text-white">
                    Read More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold text-foreground dark:text-foreground mb-4">
              No articles found
            </h3>
            <p className="text-muted-foreground">
              No articles match the selected category. Try selecting a different category.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default News;
