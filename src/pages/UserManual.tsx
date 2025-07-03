import React from 'react';
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Users, Map, Award, Settings, FileText, UserCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const UserManual = () => {
  const sections = [
    {
      title: "Getting Started",
      icon: UserCheck,
      items: [
        {
          action: "Sign Up",
          description: "Create your account by filling out the registration form with your personal details, MOWCUB information, and uploading required documents (profile photo and dues proof).",
          steps: ["Go to Sign Up page", "Fill personal information", "Upload profile photo and dues proof", "Submit application", "Wait for approval"]
        },
        {
          action: "Login",
          description: "Access your account using your email and password after approval.",
          steps: ["Go to Login page", "Enter email and password", "Click Sign In"]
        }
      ]
    },
    {
      title: "Member Features",
      icon: Users,
      items: [
        {
          action: "Browse Directory",
          description: "View and search through all active SMMOWCUB members worldwide.",
          steps: ["Navigate to Directory", "Use search filters (name, year, position, office)", "Click on member cards to view profiles"]
        },
        {
          action: "View Member Profiles",
          description: "See detailed information about fellow members including their achievements and badges.",
          steps: ["Click on any member in the directory", "View their full profile", "See their badges and achievements"]
        },
        {
          action: "Interactive Map",
          description: "Explore member locations on a global map and find members near you.",
          steps: ["Go to Map page or use Map View in Directory", "Click on markers to see member info", "Use location controls to update your position"]
        }
      ]
    },
    {
      title: "Member Dashboard",
      icon: Settings,
      items: [
        {
          action: "Update Profile",
          description: "Keep your information current and manage your profile settings.",
          steps: ["Go to Member Dashboard", "Edit your profile information", "Update location if needed", "Save changes"]
        },
        {
          action: "View Notifications",
          description: "Stay updated with important announcements and badge awards.",
          steps: ["Check notification bell icon", "View your notifications", "Mark as read when done"]
        }
      ]
    },
    {
      title: "Explore Content",
      icon: FileText,
      items: [
        {
          action: "Read News & Updates",
          description: "Stay informed about SMMOWCUB activities and announcements.",
          steps: ["Navigate to News section", "Browse latest articles", "Read full articles for details"]
        },
        {
          action: "View Hall of Fame",
          description: "Celebrate outstanding achievements of fellow members.",
          steps: ["Go to Hall of Fame page", "Browse member achievements", "View achievement details"]
        },
        {
          action: "Learn History",
          description: "Explore the rich history and timeline of SMMOWCUB.",
          steps: ["Visit History page", "Browse interactive timeline", "Click on events for more details"]
        }
      ]
    },
    {
      title: "Secretary Features",
      icon: Award,
      items: [
        {
          action: "Manage Members",
          description: "Approve new member applications and manage existing members (Secretary only).",
          steps: ["Access Secretary Dashboard", "Review pending applications", "Approve or reject members", "Manage member status"]
        },
        {
          action: "Award Badges",
          description: "Recognize member achievements with badges (Secretary only).",
          steps: ["Go to Badge Management", "Select member", "Choose badge type", "Add description", "Award badge"]
        },
        {
          action: "Publish Content",
          description: "Create and publish news articles and manage Hall of Fame entries (Secretary only).",
          steps: ["Access News & Events management", "Create new articles", "Publish or save as draft", "Manage Hall of Fame entries"]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <Link to="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            User Manual
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Complete guide to using the SMMOWCUB platform effectively
          </p>
        </div>

        {/* Quick Start Guide */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-6 w-6 text-[#E10600]" />
              Quick Start Guide
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">New Users</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click "Join SMMOWCUB" on homepage</li>
                  <li>Fill out registration form completely</li>
                  <li>Upload profile photo and dues proof</li>
                  <li>Submit application and wait for approval</li>
                  <li>Check email for approval notification</li>
                </ol>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Existing Members</h4>
                <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Click "Login" on homepage</li>
                  <li>Enter your email and password</li>
                  <li>Access member directory and features</li>
                  <li>Update your profile information</li>
                  <li>Connect with fellow members</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Sections */}
        <div className="space-y-8">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <IconComponent className="h-6 w-6 text-[#E10600]" />
                    {section.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {section.items.map((item, itemIndex) => (
                      <div key={itemIndex}>
                        <div className="flex items-start gap-3 mb-3">
                          <Badge variant="outline" className="text-xs">
                            {item.action}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground mb-3">{item.description}</p>
                        <div className="bg-muted/30 p-3 rounded-lg">
                          <h5 className="font-medium mb-2 text-sm">Steps:</h5>
                          <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                            {item.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ol>
                        </div>
                        {itemIndex < section.items.length - 1 && <Separator className="mt-4" />}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Support Section */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Contact Support</h4>
                <p className="text-sm text-muted-foreground mb-2">
                  If you encounter any issues or need assistance:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>Visit the Contact page</li>
                  <li>Email technical support</li>
                  <li>Contact your local chapter secretary</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Common Issues</h4>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li><strong>Login Issues:</strong> Check email/password, contact support if needed</li>
                  <li><strong>Upload Problems:</strong> Ensure files are under size limit and correct format</li>
                  <li><strong>Profile Updates:</strong> Save changes after editing</li>
                  <li><strong>Directory Access:</strong> Must be logged in as active member</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default UserManual;