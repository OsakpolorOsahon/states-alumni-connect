
import { useState } from "react";
import { Search, Badge } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";

// Sample member data
const sampleMembers = [
  {
    id: 1,
    fullName: "John Doe",
    nickname: "JD",
    graduationYear: "2018",
    lastWarSession: "2017/2018",
    lastMowcubPosition: "Chief Scout",
    currentCouncilOffice: "Secretary General",
    profilePhoto: "/placeholder.svg",
    hasBadge: true,
  },
  {
    id: 2,
    fullName: "Jane Smith",
    nickname: "JS",
    graduationYear: "2020",
    lastWarSession: "2019/2020",
    lastMowcubPosition: "Assistant Chief Scout",
    currentCouncilOffice: "None",
    profilePhoto: "/placeholder.svg",
    hasBadge: false,
  },
  {
    id: 3,
    fullName: "Michael Johnson",
    nickname: "Mike",
    graduationYear: "2019",
    lastWarSession: "2018/2019",
    lastMowcubPosition: "Drill Instructor",
    currentCouncilOffice: "Financial Secretary",
    profilePhoto: "/placeholder.svg",
    hasBadge: true,
  },
  {
    id: 4,
    fullName: "Sarah Wilson",
    nickname: "SW",
    graduationYear: "2021",
    lastWarSession: "2020/2021",
    lastMowcubPosition: "Platoon Leader",
    currentCouncilOffice: "Vice President",
    profilePhoto: "/placeholder.svg",
    hasBadge: false,
  },
  {
    id: 5,
    fullName: "David Brown",
    nickname: "DB",
    graduationYear: "2017",
    lastWarSession: "2016/2017",
    lastMowcubPosition: "Squad Leader",
    currentCouncilOffice: "President",
    profilePhoto: "/placeholder.svg",
    hasBadge: true,
  },
  {
    id: 6,
    fullName: "Emily Davis",
    nickname: "Em",
    graduationYear: "2022",
    lastWarSession: "2021/2022",
    lastMowcubPosition: "None",
    currentCouncilOffice: "None",
    profilePhoto: "/placeholder.svg",
    hasBadge: false,
  },
];

const graduationYears = ["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024"];
const councilOffices = [
  "President", "Vice President", "Secretary General", "Assistant Secretary", 
  "Financial Secretary", "Treasurer", "Public Relations Officer", "Welfare Officer",
  "Sports Director", "Social Director", "Auditor", "Legal Adviser", "Ex-Officio"
];
const warSessions = ["2015/2016", "2016/2017", "2017/2018", "2018/2019", "2019/2020", "2020/2021", "2021/2022", "2022/2023"];

interface Member {
  id: number;
  fullName: string;
  nickname: string;
  graduationYear: string;
  lastWarSession: string;
  lastMowcubPosition: string;
  currentCouncilOffice: string;
  profilePhoto: string;
  hasBadge: boolean;
}

interface MemberCardProps {
  member: Member;
}

const MemberCard = ({ member }: MemberCardProps) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Card className="relative group hover:transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 bg-white dark:bg-gray-800">
      <CardContent className="p-6 text-center">
        {member.hasBadge && (
          <div className="absolute top-4 right-4">
            <Badge className="w-5 h-5 text-brand" />
          </div>
        )}
        
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            <AvatarImage src={member.profilePhoto} alt={`${member.fullName} profile`} />
            <AvatarFallback className="bg-gray-200 text-gray-600 text-lg font-semibold">
              {getInitials(member.fullName)}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-foreground">{member.fullName}</h3>
            <p className="text-sm text-muted-foreground">Statesman</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {member.lastMowcubPosition} {member.lastWarSession}
            </p>
            {member.currentCouncilOffice !== "None" && (
              <p className="text-sm font-medium text-brand">{member.currentCouncilOffice}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const Directory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGradYear, setSelectedGradYear] = useState("all");
  const [selectedOffice, setSelectedOffice] = useState("all");
  const [selectedSession, setSelectedSession] = useState("all");

  const filteredMembers = sampleMembers.filter(member => {
    const matchesSearch = member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.nickname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGradYear = selectedGradYear === "all" || member.graduationYear === selectedGradYear;
    const matchesOffice = selectedOffice === "all" || member.currentCouncilOffice === selectedOffice;
    const matchesSession = selectedSession === "all" || member.lastWarSession === selectedSession;

    return matchesSearch && matchesGradYear && matchesOffice && matchesSession;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Statesmen Directory</h1>
          <p className="text-base text-muted-foreground max-w-3xl">
            Explore our distinguished Statesmen—sorted by council office, service session, and final club role.
          </p>
        </div>

        {/* Controls Bar */}
        <div className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border mb-8 pb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search members by name"
              />
            </div>

            {/* Graduation Year Filter */}
            <Select value={selectedGradYear} onValueChange={setSelectedGradYear}>
              <SelectTrigger aria-label="Filter by graduation year">
                <SelectValue placeholder="Graduation Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {graduationYears.map(year => (
                  <SelectItem key={year} value={year}>{year}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Council Office Filter */}
            <Select value={selectedOffice} onValueChange={setSelectedOffice}>
              <SelectTrigger aria-label="Filter by council office">
                <SelectValue placeholder="Council Office" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Offices</SelectItem>
                <SelectItem value="None">None</SelectItem>
                {councilOffices.map(office => (
                  <SelectItem key={office} value={office}>{office}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* War Session Filter */}
            <Select value={selectedSession} onValueChange={setSelectedSession}>
              <SelectTrigger aria-label="Filter by war session">
                <SelectValue placeholder="War Session" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sessions</SelectItem>
                {warSessions.map(session => (
                  <SelectItem key={session} value={session}>{session}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMembers.map(member => (
            <MemberCard key={member.id} member={member} />
          ))}
        </div>

        {/* No Results */}
        {filteredMembers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No members found matching your criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search term.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Directory;
