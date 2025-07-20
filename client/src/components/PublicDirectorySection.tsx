import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Search, Filter, Users, Crown } from "lucide-react";
import { useMembers } from "@/hooks/useMembers";

// Council position hierarchy for sorting
const COUNCIL_POSITION_HIERARCHY = {
  "President": 1,
  "Vice President": 2,
  "Secretary General": 3,
  "Assistant Secretary General": 4,
  "Treasurer": 5,
  "Financial Secretary": 6,
  "Public Relations Officer": 7,
  "Welfare Officer": 8,
  "Provost Marshal": 9,
  "Organizing Secretary": 10,
  "Member": 11
};

// MOWCUB position hierarchy for sorting
const MOWCUB_POSITION_HIERARCHY = {
  "General": 1,
  "Lieutenant General": 2,
  "Major General": 3,
  "Brigadier General": 4,
  "Colonel": 5,
  "Lieutenant Colonel": 6,
  "Major": 7,
  "Captain": 8,
  "Lieutenant": 9,
  "Second Lieutenant": 10,
  "Warrant Officer I": 11,
  "Warrant Officer II": 12,
  "Staff Sergeant": 13,
  "Sergeant": 14,
  "Corporal": 15,
  "Lance Corporal": 16,
  "Recruit": 17
};

interface Member {
  id: string;
  full_name: string;
  nickname?: string;
  stateship_year: string;
  last_mowcub_position: string;
  current_council_office?: string;
  photo_url?: string;
  status: string;
  role: string;
}

const PublicDirectorySection = () => {
  const { data: members = [], isLoading } = useMembers();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [filterPosition, setFilterPosition] = useState('all');

  // Filter for active members only (public can only see active members)
  const activeMembers = members.filter((member: Member) => member.status === 'active');

  // Apply search and filters
  const filteredMembers = useMemo(() => {
    return activeMembers.filter((member: Member) => {
      const matchesSearch = member.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.nickname?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesYear = filterYear === 'all' || member.stateship_year === filterYear;
      
      const matchesPosition = filterPosition === 'all' || 
        member.current_council_office === filterPosition ||
        member.last_mowcub_position === filterPosition;

      return matchesSearch && matchesYear && matchesPosition;
    });
  }, [activeMembers, searchTerm, filterYear, filterPosition]);

  // Sort members by hierarchy
  const sortedMembers = useMemo(() => {
    return [...filteredMembers].sort((a, b) => {
      // 1. Council position hierarchy (President first, then others, members last)
      const aCouncilPos = a.current_council_office || 'Member';
      const bCouncilPos = b.current_council_office || 'Member';
      const aCouncilRank = COUNCIL_POSITION_HIERARCHY[aCouncilPos as keyof typeof COUNCIL_POSITION_HIERARCHY] || 999;
      const bCouncilRank = COUNCIL_POSITION_HIERARCHY[bCouncilPos as keyof typeof COUNCIL_POSITION_HIERARCHY] || 999;
      
      if (aCouncilRank !== bCouncilRank) {
        return aCouncilRank - bCouncilRank;
      }

      // 2. Stateship year (oldest first)
      const aYear = parseInt(a.stateship_year);
      const bYear = parseInt(b.stateship_year);
      
      if (aYear !== bYear) {
        return aYear - bYear;
      }

      // 3. Last MOWCUB position (highest rank first)
      const aMowcubRank = MOWCUB_POSITION_HIERARCHY[a.last_mowcub_position as keyof typeof MOWCUB_POSITION_HIERARCHY] || 999;
      const bMowcubRank = MOWCUB_POSITION_HIERARCHY[b.last_mowcub_position as keyof typeof MOWCUB_POSITION_HIERARCHY] || 999;
      
      return aMowcubRank - bMowcubRank;
    });
  }, [filteredMembers]);

  // Get unique years and positions for filters
  const uniqueYears = Array.from(new Set(activeMembers.map(m => m.stateship_year))).sort();
  const uniquePositions = Array.from(new Set([
    ...activeMembers.map(m => m.current_council_office).filter(Boolean),
    ...activeMembers.map(m => m.last_mowcub_position)
  ])).sort();

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDisplayPosition = (member: Member) => {
    if (member.current_council_office && member.current_council_office !== 'Member') {
      return member.current_council_office;
    }
    return member.last_mowcub_position;
  };

  const getRoleColor = (member: Member) => {
    if (member.role === 'secretary') return 'bg-purple-100 text-purple-800';
    if (member.current_council_office && member.current_council_office !== 'Member') {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-blue-100 text-blue-800';
  };

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-16 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-4xl font-bold text-foreground mb-4"
          >
            Our Distinguished <span className="text-[#E10600]">Statesmen</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted-foreground max-w-3xl mx-auto"
          >
            Connect with our network of {activeMembers.length} distinguished statesmen across the globe. 
            Members are arranged by council hierarchy, stateship year, and MOWCUB position.
          </motion.p>
        </div>

        {/* Search and Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search by name or nickname..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {uniqueYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={filterPosition} onValueChange={setFilterPosition}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Filter by position" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Positions</SelectItem>
                {uniquePositions.map(position => (
                  <SelectItem key={position} value={position}>{position}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Results count */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-center mb-8"
        >
          <p className="text-muted-foreground">
            Showing {sortedMembers.length} of {activeMembers.length} statesmen
          </p>
        </motion.div>

        {/* Members Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {sortedMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow duration-300 border border-border">
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    {/* Profile Picture */}
                    <div className="relative mb-4">
                      <Avatar className="w-20 h-20 border-2 border-[#E10600]/20">
                        <AvatarImage src={member.photo_url} alt={member.full_name} />
                        <AvatarFallback className="bg-[#E10600]/10 text-[#E10600] font-semibold text-lg">
                          {getInitials(member.full_name)}
                        </AvatarFallback>
                      </Avatar>
                      {member.current_council_office && member.current_council_office !== 'Member' && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                          <Crown className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <h3 className="font-semibold text-lg text-foreground mb-1">
                      {member.full_name}
                    </h3>
                    {member.nickname && (
                      <p className="text-sm text-muted-foreground mb-2">
                        "{member.nickname}"
                      </p>
                    )}

                    {/* Position Badge */}
                    <Badge className={`mb-2 ${getRoleColor(member)}`}>
                      {getDisplayPosition(member)}
                    </Badge>

                    {/* Stateship Year */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <Users className="h-4 w-4" />
                      <span>Class of {member.stateship_year}</span>
                    </div>

                    {/* Last MOWCUB Position */}
                    <div className="text-xs text-muted-foreground">
                      Former {member.last_mowcub_position}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {sortedMembers.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No members found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or filters to find members.
            </p>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default PublicDirectorySection;