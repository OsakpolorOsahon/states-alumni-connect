import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import SecretaryMemberManagement from "@/components/SecretaryMemberManagement";
import SecretaryContentManagement from "@/components/SecretaryContentManagement";
import SecretaryStats from "@/components/SecretaryStats";
import BadgeManagement from "@/components/BadgeManagement";
import HallOfFameManagement from "@/components/HallOfFameManagement";

const SecretaryDashboard = () => {
  const { user, member, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("management");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600]"></div>
      </div>
    );
  }

  if (!member || member.role !== 'secretary') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground">Secretary access required</p>
        </div>
      </div>
    );
  }

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

        {/* Quick Stats - Real-time from Supabase */}
        <SecretaryStats />

        {/* Main Dashboard Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="management">Member Management</TabsTrigger>
            <TabsTrigger value="content">Content Management</TabsTrigger>
            <TabsTrigger value="badges">Badge Management</TabsTrigger>
            <TabsTrigger value="halloffame">Hall of Fame</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="management" className="space-y-6">
            <SecretaryMemberManagement />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <SecretaryContentManagement />
          </TabsContent>

          <TabsContent value="badges" className="space-y-6">
            <BadgeManagement />
          </TabsContent>

          <TabsContent value="halloffame" className="space-y-6">
            <HallOfFameManagement />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics & Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Analytics dashboard will be implemented here.</p>
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