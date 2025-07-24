import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Trophy, Star, Medal, Award, Plus, Search } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface HallOfFameMember {
  id: string;
  member_id: string;
  achievement_title: string;
  achievement_description?: string;
  achievement_date?: string;
  created_at: string;
  members: {
    full_name: string;
    nickname?: string;
    photo_url?: string;
    stateship_year: string;
    current_council_office?: string;
  };
}

const HallOfFame = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Empty data for now - will be populated when backend is available
  const hallOfFameMembers: HallOfFameMember[] = [];
  const loading = false;

  const categories = [
    { id: 'all', name: 'All Categories', icon: Trophy, count: 0 },
    { id: 'academic', name: 'Academic Excellence', icon: Star, count: 0 },
    { id: 'leadership', name: 'Leadership', icon: Award, count: 0 },
    { id: 'innovation', name: 'Innovation', icon: Medal, count: 0 },
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getCategoryIcon = (category: string) => {
    const cat = categories.find(c => c.id === category);
    return cat ? cat.icon : Trophy;
  };

  const filteredMembers = hallOfFameMembers.filter(member => {
    const matchesSearch = !searchTerm || 
      member.achievement_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.members.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      member.achievement_title.toLowerCase().includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <div key={index} className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>
            ))}
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Hall of <span className="text-[#E10600]">Fame</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Celebrating the extraordinary achievements of our distinguished statesmen who have made 
            significant contributions to society and brought honor to our Organization.
          </p>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="p-4 cursor-pointer hover:shadow-lg transition-shadow"
                    onClick={() => setSelectedCategory(category.id)}>
                <div className="flex items-center justify-center mb-2">
                  <IconComponent className="h-6 w-6 text-[#E10600] mr-2" />
                  <span className="text-2xl font-bold text-[#E10600]">
                    {category.count}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground text-center">{category.name}</p>
                {selectedCategory === category.id && (
                  <div className="mt-2 h-1 bg-[#E10600] rounded-full"></div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Search */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search achievements or member names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Hall of Fame Members - Empty State */}
        {hallOfFameMembers.length === 0 ? (
          <Card className="p-12 text-center">
            <Trophy className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">No Honorees Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              The Hall of Fame is being prepared to showcase the remarkable achievements of our 
              distinguished Statesmen. Check back soon to celebrate their contributions.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/directory">
                <Button className="bg-[#E10600] hover:bg-[#C10500]">
                  View Member Directory
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline">
                  Contact Secretariat
                </Button>
              </Link>
            </div>
          </Card>
        ) : (
          // This will show when hall of fame data is available
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => {
              const IconComponent = getCategoryIcon(selectedCategory);
              return (
                <Card key={member.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <IconComponent className="h-6 w-6 text-[#E10600]" />
                      <Badge variant="secondary" className="text-xs">
                        {member.achievement_date ? new Date(member.achievement_date).getFullYear() : 'Recent'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={member.members.photo_url} alt={member.members.full_name} />
                        <AvatarFallback className="bg-[#E10600] text-white">
                          {getInitials(member.members.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {member.members.full_name}
                        </h3>
                        {member.members.nickname && (
                          <p className="text-sm text-muted-foreground">
                            "{member.members.nickname}"
                          </p>
                        )}
                        <Badge variant="outline" className="text-xs mt-1">
                          {member.members.stateship_year}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-[#E10600]">
                        {member.achievement_title}
                      </h4>
                      {member.achievement_description && (
                        <p className="text-sm text-muted-foreground">
                          {member.achievement_description}
                        </p>
                      )}
                      {member.members.current_council_office && (
                        <Badge variant="outline" className="text-xs">
                          {member.members.current_council_office}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* No results message */}
        {hallOfFameMembers.length > 0 && filteredMembers.length === 0 && (
          <Card className="p-8 text-center">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Results Found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all categories.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </Card>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default HallOfFame;