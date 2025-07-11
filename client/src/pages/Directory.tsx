import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Search, MapPin, User, Users, Crown, Star, Filter, ArrowUpDown } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import InteractiveMap from '@/components/InteractiveMap';
import { useMembers } from '@/hooks/useMembers';
import { useRealTimeStats } from '@/hooks/useRealTimeStats';
import { STATESHIP_YEARS, MOWCUB_POSITIONS, COUNCIL_OFFICES } from '@/data/memberData';

const Directory = () => {
  const [filters, setFilters] = useState({
    search: '',
    year: 'all',
    position: 'all',
    office: 'all'
  });
  const [showMap, setShowMap] = useState(false);
  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState<'hierarchy' | 'year' | 'name'>('hierarchy');

  const { members, loading, error } = useMembers(filters);
  const { stats, loading: statsLoading } = useRealTimeStats();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getPositionTitle = (code: string) => {
    const position = MOWCUB_POSITIONS.find(p => p.code === code);
    return position ? position.title : code;
  };

  // Define hierarchy orders
  const councilOfficeOrder = [
    "President", "Vice President", "Secretary General", "Assistant Secretary General",
    "Treasurer", "Financial Secretary", "Public Relations Officer", "Welfare Officer",
    "Provost Marshal", "Organizing Secretary", "Member", null
  ];

  const mowcubPositionOrder = [
    "Commander In Chief", "Deputy Commander In Chief", "Adjutant General",
    "Quarter Master General", "Director of Training", "Director of Intelligence",
    "Recruit", "Lance Corporal", "Corporal", "Sergeant", "Staff Sergeant",
    "Warrant Officer II", "Warrant Officer I", "Second Lieutenant",
    "Lieutenant", "Captain", "Major", "Lieutenant Colonel", "Colonel",
    "Brigadier General", "Major General", "Lieutenant General", "General"
  ];

  // Sort members by hierarchy
  const sortedMembers = useMemo(() => {
    if (!members) return [];
    
    return [...members].sort((a, b) => {
      switch (sortBy) {
        case 'hierarchy':
          // First: Council Office (President first, then all the way to none)
          const aCouncilIndex = councilOfficeOrder.indexOf(a.currentCouncilOffice || a.current_council_office || null);
          const bCouncilIndex = councilOfficeOrder.indexOf(b.currentCouncilOffice || b.current_council_office || null);
          
          if (aCouncilIndex !== bCouncilIndex) {
            return aCouncilIndex - bCouncilIndex;
          }
          
          // Second: Year of Statesmanship (Oldest to youngest)
          const aYear = parseInt((a.stateshipYear || a.stateship_year).split('/')[0] || (a.stateshipYear || a.stateship_year));
          const bYear = parseInt((b.stateshipYear || b.stateship_year).split('/')[0] || (b.stateshipYear || b.stateship_year));
          
          if (aYear !== bYear) {
            return aYear - bYear;
          }
          
          // Third: Last MOWCUB Position (Commander In Chief to Director of Intelligence)
          const aMowcubIndex = mowcubPositionOrder.indexOf(a.lastMowcubPosition || a.last_mowcub_position);
          const bMowcubIndex = mowcubPositionOrder.indexOf(b.lastMowcubPosition || b.last_mowcub_position);
          
          return aMowcubIndex - bMowcubIndex;
        case 'year':
          return (a.stateshipYear || a.stateship_year).localeCompare(b.stateshipYear || b.stateship_year);
        case 'name':
          return (a.fullName || a.full_name).localeCompare(b.fullName || b.full_name);
        default:
          return 0;
      }
    });
  }, [members, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center progressive-load">
            <div className="spinner-smooth rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
            <p className="mt-4 text-muted-foreground fade-in-scroll">Loading directory...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-8 px-4">
        {/* Header with Real-time Stats */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Member Directory
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-6">
            Connect with our distinguished network of Statesmen from across the globe
          </p>
          
          {/* Real-time Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-md mx-auto mb-8">
            <Card className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-6 w-6 text-[#E10600] mr-2" />
                <span className="text-2xl font-bold text-[#E10600]">
                  {statsLoading ? '...' : stats.activeMembers}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Active Members</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Crown className="h-6 w-6 text-[#E10600] mr-2" />
                <span className="text-2xl font-bold text-[#E10600]">
                  {statsLoading ? '...' : stats.hallOfFameCount}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Hall of Fame</p>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-6 w-6 text-[#E10600] mr-2" />
                <span className="text-2xl font-bold text-[#E10600]">
                  {statsLoading ? '...' : stats.recentMembers}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">Recent Members</p>
            </Card>
          </div>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Search & Filter
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or nickname..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                  className="pl-10"
                />
              </div>
              
              <Select value={filters.year} onValueChange={(value) => setFilters({...filters, year: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Stateship Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Years</SelectItem>
                  {STATESHIP_YEARS.map(year => (
                    <SelectItem key={year.value} value={year.value}>{year.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.position} onValueChange={(value) => setFilters({...filters, position: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="MOWCUB Position" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Positions</SelectItem>
                  {MOWCUB_POSITIONS.map(position => (
                    <SelectItem key={position.code} value={position.code}>{position.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.office} onValueChange={(value) => setFilters({...filters, office: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Council Office" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Offices</SelectItem>
                  {COUNCIL_OFFICES.map(office => (
                    <SelectItem key={office.value} value={office.value}>{office.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hierarchy">Hierarchy</SelectItem>
                  <SelectItem value="year">Year</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Button
                  variant={viewType === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewType('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewType === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewType('list')}
                >
                  List
                </Button>
              </div>

              <Button
                variant={showMap ? 'default' : 'outline'}
                size="sm"
                onClick={() => setShowMap(!showMap)}
                className="flex items-center gap-2"
              >
                <MapPin className="h-4 w-4" />
                {showMap ? 'Hide Map' : 'Show Map'}
              </Button>

              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">
                  {sortedMembers.length} members
                </span>
                {sortBy === 'hierarchy' && (
                  <Badge variant="secondary" className="text-xs">
                    <ArrowUpDown className="h-3 w-3 mr-1" />
                    By Hierarchy
                  </Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Interactive Map */}
        {showMap && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Member Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <InteractiveMap members={sortedMembers} />
            </CardContent>
          </Card>
        )}

        {/* Members Grid/List */}
        {sortedMembers.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No members found matching your criteria.</p>
          </div>
        ) : (
          <div className={`${
            viewType === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}>
            {sortedMembers.map((member) => (
              <Card key={member.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={member.photoUrl} alt={member.fullName} />
                      <AvatarFallback className="bg-[#E10600] text-white">
                        {getInitials(member.fullName)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-foreground">
                        {member.fullName}
                      </h3>
                      {member.nickname && (
                        <p className="text-sm text-muted-foreground">
                          "{member.nickname}"
                        </p>
                      )}
                      <div className="flex flex-wrap gap-2 mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {member.stateshipYear}
                        </Badge>
                        {member.currentCouncilOffice && member.currentCouncilOffice !== 'None' && (
                          <Badge variant="outline" className="text-xs">
                            {member.currentCouncilOffice}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {getPositionTitle(member.lastMowcubPosition)}
                      </span>
                    </div>
                    {member.latitude && member.longitude && (
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Location Available
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default Directory;