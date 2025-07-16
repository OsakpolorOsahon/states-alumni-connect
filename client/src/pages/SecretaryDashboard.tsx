
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  UserCheck, 
  Award, 
  FileText, 
  TrendingUp
} from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SecretaryMemberManagement from "@/components/SecretaryMemberManagement";

const SecretaryDashboard = () => {
  // Removed broken hooks
  const [activeTab, setActiveTab] = useState("management");

  return (
    <div className="min-h-screen bg-background dark:bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Secretary Dashboard</h1>
              <p className="text-muted-foreground mt-2">
                Welcome, {member?.full_name} - Manage SMMOWCUB operations
              </p>
            </div>
            <Button asChild variant="outline">
              <a href="/dashboard">Back to Member Dashboard</a>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
                  <p className="text-2xl font-bold text-amber-600">3</p>
                </div>
                <UserCheck className="h-8 w-8 text-amber-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Members</p>
                  <p className="text-2xl font-bold">1,247</p>
                </div>
                <Users className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold text-green-600">+23</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Badges Awarded</p>
                  <p className="text-2xl font-bold">156</p>
                </div>
                <Award className="h-8 w-8 text-[#E10600]" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="management">Member Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="badges">Badge Management</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <SecretaryMemberManagement />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Content Management</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button asChild className="h-24 flex-col gap-2">
                    <a href="/news-events">
                      <FileText className="h-6 w-6" />
                      Manage News & Events
                    </a>
                  </Button>
                  <Button asChild className="h-24 flex-col gap-2" variant="outline">
                    <a href="/hall-of-fame">
                      <Award className="h-6 w-6" />
                      Hall of Fame Management
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Badge Management</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Award badges to members directly from the Member Management tab, or manage existing badges here.
                </p>
                <Button asChild>
                  <a href="/directory">Go to Member Directory</a>
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Analytics dashboard will be implemented here.
                  This will include membership growth, engagement metrics, and detailed reports.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
      <Footer />
    </div>
  );
};

export default SecretaryDashboard;
