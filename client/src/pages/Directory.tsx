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
import { STATESHIP_YEARS, MOWCUB_POSITIONS, COUNCIL_OFFICES } from '@/data/memberData';

interface Member {
  id: string;
  fullName: string;
  nickname?: string;
  stateshipYear: string;
  currentCouncilOffice?: string;
  mowcubPosition?: string;
  photoUrl?: string;
  location?: string;
  status: string;
}

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

  // Empty members array for now - will be populated when data is available
  const members: Member[] = [];
  const loading = false;
  const error = null;
  const stats = { totalMembers: 0, activeMembers: 0, hallOfFameCount: 0 };
  const statsLoading = false;

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
    if (!members || members.length === 0) return [];
    
    return [...members].sort((a, b) => {
      switch (sortBy) {
        case 'hierarchy':
          // First: Council Office (President first, then all the way to none)
          const aCouncilIndex = councilOfficeOrder.indexOf(a.currentCouncilOffice || null);
          const bCouncilIndex = councilOfficeOrder.indexOf(b.currentCouncilOffice || null);
          
          if (aCouncilIndex !== bCouncilIndex) {
            return aCouncilIndex - bCouncilIndex;
          }
          
          // Second: Year of Statesmanship (Oldest to youngest)
          const aYear = parseInt(a.stateshipYear.split('/')[0] || a.stateshipYear);
          const bYear = parseInt(b.stateshipYear.split('/')[0] || b.stateshipYear);
          
          if (aYear !== bYear) {
            return aYear - bYear;
          }
          
          // Third: MOWCUB Position (higher ranks first)
          const aMowcubIndex = mowcubPositionOrder.indexOf(a.mowcubPosition || 'Recruit');
          const bMowcubIndex = mowcubPositionOrder.indexOf(b.mowcubPosition || 'Recruit');
          
          return aMowcubIndex - bMowcubIndex;
          
        case 'year':
          const yearA = parseInt(a.stateshipYear.split('/')[0] || a.stateshipYear);
          const yearB = parseInt(b.stateshipYear.split('/')[0] || b.stateshipYear);
          return yearA - yearB;
          
        case 'name':
          return a.fullName.localeCompare(b.fullName);
          
        default:
          return 0;
      }
    });
  }, [members, sortBy]);

  // Filter members based on search criteria
  const filteredMembers = useMemo(() => {
    return sortedMembers.filter(member => {
      const matchesSearch = !filters.search || 
        member.fullName.toLowerCase().includes(filters.search.toLowerCase()) ||
        (member.nickname && member.nickname.toLowerCase().includes(filters.search.toLowerCase()));
      
      const matchesYear = filters.year === 'all' || member.stateshipYear === filters.year;
      const matchesPosition = filters.position === 'all' || member.mowcubPosition === filters.position;
      const matchesOffice = filters.office === 'all' || member.currentCouncilOffice === filters.office;
      
      return matchesSearch && matchesYear && matchesPosition && matchesOffice;
    });
  }, [sortedMembers, filters]);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Member <span className="text-[#E10600]">Directory</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with fellow Statesmen from across the globe. Our network spans multiple generations of leadership and excellence.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-[#E10600] mr-2" />
              <span className="text-2xl font-bold text-[#E10600]">
                {statsLoading ? '...' : stats.activeMembers}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">Active Members</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-center mb-2">
              <User className="h-6 w-6 text-[#E10600] mr-2" />
              <span className="text-2xl font-bold text-[#E10600]">
                {statsLoading ? '...' : stats.totalMembers}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">Total Members</p>
          </Card>
          
          <Card className="p-4">
            <div className="flex items-center justify-center mb-2">
              <Crown className="h-6 w-6 text-[#E10600] mr-2" />
              <span className="text-2xl font-bold text-[#E10600]">
                {statsLoading ? '...' : '50+'}
              </span>
            </div>
            <p className="text-sm text-muted-foreground text-center">Hall of Fame</p>
          </Card>
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
                    <SelectItem key={year} value={year}>{year}</SelectItem>
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
                    <SelectItem key={office} value={office}>{office}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Select value={sortBy} onValueChange={(value: 'hierarchy' | 'year' | 'name') => setSortBy(value)}>
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
                  {filteredMembers.length} members
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
              <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
                <p className="text-muted-foreground">Map view will be available when members are added</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Members Display - Empty State */}
        {members.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
            <h3 className="text-2xl font-semibold mb-4">No Members Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              The member directory is currently being built. Check back soon to connect with fellow Statesmen from across the globe.
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/signup">
                <Button className="bg-[#E10600] hover:bg-[#C10500]">
                  Member Signup
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
          // This will show when members data is available
          <div className={`${
            viewType === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
          }`}>
            {filteredMembers.map((member) => (
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
                        {member.currentCouncilOffice && (
                          <Badge variant="outline" className="text-[#E10600] border-[#E10600] text-xs">
                            <Crown className="h-3 w-3 mr-1" />
                            {member.currentCouncilOffice}
                          </Badge>
                        )}
                        {member.mowcubPosition && (
                          <Badge variant="secondary" className="text-xs">
                            {getPositionTitle(member.mowcubPosition)}
                          </Badge>
                        )}
                      </div>
                    </div>
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