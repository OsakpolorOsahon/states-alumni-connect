
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import AuthGuard from "@/components/AuthGuard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users, ExternalLink } from "lucide-react";

const NewsEvents = () => {
  const events = [
    {
      id: 1,
      title: "Annual SMMOWCUB Convention 2025",
      date: "March 15-17, 2025",
      location: "University of Benin, Benin City",
      type: "Convention",
      description: "Join fellow statesmen for our annual gathering featuring networking, workshops, and celebrations of our brotherhood.",
      attendees: "200+ Expected",
      status: "upcoming"
    },
    {
      id: 2,
      title: "Leadership Workshop Series",
      date: "February 10, 2025",
      location: "Virtual Event",
      type: "Workshop",
      description: "Professional development session focusing on modern leadership techniques and career advancement strategies.",
      attendees: "50+ Registered",
      status: "upcoming"
    },
    {
      id: 3,
      title: "Alumni Networking Dinner - Lagos",
      date: "January 25, 2025",
      location: "Lagos, Nigeria",
      type: "Networking",
      description: "Connect with fellow statesmen in the Lagos area for an evening of networking and fellowship.",
      attendees: "75+ Expected",
      status: "upcoming"
    }
  ];

  const news = [
    {
      id: 1,
      title: "New SMMOWCUB Portal Launch",
      date: "January 15, 2025",
      category: "Technology",
      summary: "We're excited to announce the launch of our comprehensive digital platform connecting all Senior Members globally.",
      link: "#"
    },
    {
      id: 2,
      title: "Scholarship Program Update",
      date: "January 10, 2025",
      category: "Education",
      summary: "Applications are now open for the 2025 SMMOWCUB Educational Scholarship Program for current UNIBEN students.",
      link: "#"
    },
    {
      id: 3,
      title: "Community Service Initiative",
      date: "December 20, 2024",
      category: "Community",
      summary: "SMMOWCUB members contributed over 500 hours of community service during our annual giving season.",
      link: "#"
    }
  ];

  return (
    <AuthGuard requireAuth requireActive>
      <div className="min-h-screen bg-background dark:bg-background">
        <Navigation />
        
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 py-16">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1505373877841-8d25f7d46678?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 dark:opacity-5"></div>
          <div className="absolute inset-0 bg-[#E10600] opacity-5 dark:opacity-10"></div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              News & Events
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
              Stay connected with the latest updates and upcoming events in the SMMOWCUB community.
            </p>
          </div>
        </section>

        <main className="container mx-auto py-12 px-4">
          {/* Upcoming Events */}
          <section className="mb-16">
            <h2 className="text-3xl font-bold text-foreground dark:text-foreground mb-8">
              Upcoming Events
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event) => (
                <Card key={event.id} className="dark:bg-card dark:border-border hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="secondary" className="text-xs">
                        {event.type}
                      </Badge>
                      <Badge variant="outline" className="text-xs text-green-600 border-green-600">
                        {event.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-foreground dark:text-foreground">
                      {event.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-2" />
                        {event.date}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground dark:text-muted-foreground">
                        <Users className="h-4 w-4 mr-2" />
                        {event.attendees}
                      </div>
                      <p className="text-sm text-muted-foreground dark:text-muted-foreground mt-3">
                        {event.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {/* Latest News */}
          <section>
            <h2 className="text-3xl font-bold text-foreground dark:text-foreground mb-8">
              Latest News
            </h2>
            <div className="space-y-6">
              {news.map((article) => (
                <Card key={article.id} className="dark:bg-card dark:border-border">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {article.category}
                          </Badge>
                          <span className="text-sm text-muted-foreground dark:text-muted-foreground">
                            {article.date}
                          </span>
                        </div>
                        <h3 className="text-xl font-semibold text-foreground dark:text-foreground mb-3">
                          {article.title}
                        </h3>
                        <p className="text-muted-foreground dark:text-muted-foreground mb-4">
                          {article.summary}
                        </p>
                      </div>
                      <div className="md:ml-6">
                        <a
                          href={article.link}
                          className="inline-flex items-center text-[#E10600] hover:text-[#C10500] transition-colors"
                        >
                          Read More
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </AuthGuard>
  );
};

export default NewsEvents;
