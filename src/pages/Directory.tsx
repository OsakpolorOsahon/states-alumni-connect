
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import InteractiveMap from '@/components/InteractiveMap';
import { useMembers } from '@/hooks/useMembers';
import { STATESHIP_YEARS, MOWCUB_POSITIONS, COUNCIL_OFFICES } from '@/data/memberData';

const Directory = () => {
  const [filters, setFilters] = useState({
    search: '',
    year: '',
    position: '',
    office: ''
  });
  const [showMap, setShowMap] = useState(false);

  const { members, loading, error } = useMembers(filters);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPositionTitle = (code: string) => {
    const position = MOWCUB_POSITIONS.find(p => p.code === code);
    return position ? position.title : code;
  };

  if (loading) {
    return (
      <AuthGuard requireAuth requireActive>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto py-12 px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading directory...</p>
            </div>
          </div>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
          <div className="space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <h1 className="text-3xl font-bold">Member Directory</h1>
              <p className="text-muted-foreground">
                Connect with fellow SMMOWCUB members across the globe
              </p>
              <div className="flex justify-center gap-2">
                <Button 
                  variant={showMap ? "outline" : "default"}
                  onClick={() => setShowMap(false)}
                >
                  <User className="w-4 h-4 mr-2" />
                  Directory
                </Button>
                <Button 
                  variant={showMap ? "default" : "outline"}
                  onClick={() => setShowMap(true)}
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Map View
                </Button>
              </div>
            </div>

            {showMap ? (
              <InteractiveMap />
            ) : (
              <>
                {/* Filters */}
                <Card>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search members..."
                          value={filters.search}
                          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                          className="pl-10"
                        />
                      </div>
                      
                      <Select value={filters.year} onValueChange={(value) => setFilters(prev => ({ ...prev, year: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Years</SelectItem>
                          {STATESHIP_YEARS.map(year => (
                            <SelectItem key={year} value={year}>{year}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters.position} onValueChange={(value) => setFilters(prev => ({ ...prev, position: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by position" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Positions</SelectItem>
                          {MOWCUB_POSITIONS.map(position => (
                            <SelectItem key={position.code} value={position.code}>{position.code}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Select value={filters.office} onValueChange={(value) => setFilters(prev => ({ ...prev, office: value }))}>
                        <SelectTrigger>
                          <SelectValue placeholder="Filter by office" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">All Offices</SelectItem>
                          {COUNCIL_OFFICES.map(office => (
                            <SelectItem key={office} value={office}>{office}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </CardContent>
                </Card>

                {/* Results */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <p className="text-muted-foreground">
                      {members.length} member{members.length !== 1 ? 's' : ''} found
                    </p>
                  </div>

                  {error ? (
                    <Card>
                      <CardContent className="p-8 text-center">
                        <p className="text-destructive">{error}</p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {members.map(member => (
                        <Card key={member.id} className="hover:shadow-lg transition-shadow">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              <Avatar className="w-16 h-16">
                                <AvatarImage src={member.photo_url || '/images/logo-transparent.png'} alt={member.full_name} />
                                <AvatarFallback className="bg-[#E10600] text-white">
                                  {getInitials(member.full_name)}
                                </AvatarFallback>
                              </Avatar>
                              
                              <div className="flex-1 min-w-0">
                                {member.nickname && (
                                  <p className="text-sm text-muted-foreground">"{member.nickname}"</p>
                                )}
                                
                                <div className="mt-2 space-y-1">
                                  <p className="text-sm">
                                    <span className="font-medium">Year:</span> {member.stateship_year}
                                  </p>
                                  {member.current_council_office && member.current_council_office !== 'None' && (
                                    <Badge variant="secondary" className="text-xs">
                                      {member.current_council_office}
                                    </Badge>
                                  )}
                                  <p className="text-sm font-semibold">{member.full_name} Statesman {getPositionTitle(member.last_mowcub_position)} {member.stateship_year}</p>
                                </div>

                                <div className="mt-4">
                                  <Link to={`/directory/${member.id}`}>
                                    <Button size="sm" className="w-full">
                                      View Profile
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <Footer />
      </div>
  );
};

export default Directory;
