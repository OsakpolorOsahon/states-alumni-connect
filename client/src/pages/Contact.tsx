
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MapPin } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Removed broken hooks

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }

    // Simulate form submission
    setTimeout(() => {
      toast({
        title: "Message Sent!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-slate-900 to-slate-800 dark:from-slate-950 dark:to-slate-900 py-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center opacity-10 dark:opacity-5"></div>
        <div className="absolute inset-0 bg-[#E10600] opacity-5 dark:opacity-10"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
            Connect with the SMMOWCUB community. We're here to help and answer your questions.
          </p>
        </div>
      </section>

      <main className="container mx-auto py-12 px-4">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="dark:bg-card dark:border-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-foreground dark:text-foreground">
                Send us a Message
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Full Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    className="dark:bg-background dark:border-border dark:text-foreground"
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Email Address *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="dark:bg-background dark:border-border dark:text-foreground"
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    className="dark:bg-background dark:border-border dark:text-foreground"
                    placeholder="What is this about?"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-foreground dark:text-foreground mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="dark:bg-background dark:border-border dark:text-foreground min-h-[120px]"
                    placeholder="Tell us more about your inquiry..."
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-[#E10600] hover:bg-[#C10500] text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="dark:bg-card dark:border-border">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-foreground dark:text-foreground">
                  Contact Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-[#E10600] mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground dark:text-foreground">Email</h3>
                    <p className="text-muted-foreground">info@smmowcub.org</p>
                    <p className="text-muted-foreground">secretary@smmowcub.org</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-[#E10600] mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground dark:text-foreground">Phone</h3>
                    <p className="text-muted-foreground">+234 (0) 803 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-[#E10600] mt-1" />
                  <div>
                    <h3 className="font-semibold text-foreground dark:text-foreground">Address</h3>
                    <p className="text-muted-foreground">
                      University of Benin<br />
                      Ugbowo Campus<br />
                      Benin City, Edo State, Nigeria
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;
