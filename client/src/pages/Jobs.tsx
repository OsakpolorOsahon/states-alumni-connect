import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Briefcase, MapPin, Clock, DollarSign, Building, Filter, Plus, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const Jobs = () => {
  // Removed broken hooks
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['jobs', 'active'],
    queryFn: () => api.getActiveJobPosts(),
  });

  // Filter and sort jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || job.type === selectedType;
    const matchesLocation = selectedLocation === 'all' || job.location === selectedLocation;
    
    return matchesSearch && matchesType && matchesLocation;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'salary':
        return (b.salaryMax || 0) - (a.salaryMax || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const jobTypes = [...new Set(jobs.map(job => job.type))];
  const locations = [...new Set(jobs.map(job => job.location))];

  const formatSalary = (min: number, max: number) => {
    if (min && max) {
      return `₦${min.toLocaleString()} - ₦${max.toLocaleString()}`;
    } else if (min) {
      return `₦${min.toLocaleString()}+`;
    } else if (max) {
      return `Up to ₦${max.toLocaleString()}`;
    }
    return 'Negotiable';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading jobs...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading jobs: {error.message}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            SMMOWCUB Job Board
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover career opportunities shared by fellow Statesmen
          </p>
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
                  placeholder="Search jobs or companies..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  {jobTypes.map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  {locations.map(location => (
                    <SelectItem key={location} value={location}>{location}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="salary">Highest Salary</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredJobs.length} of {jobs.length} jobs
                </span>
              </div>
              
              {user && (
                <Button 
                  size="sm" 
                  className="bg-[#E10600] hover:bg-[#C10500]"
                  onClick={() => {/* Navigate to post job */}}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Post Job
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        {filteredJobs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No jobs found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-xl font-semibold text-foreground">
                          {job.title}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {job.type}
                        </Badge>
                        {job.isUrgent && (
                          <Badge variant="destructive" className="text-xs">
                            Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{formatDistanceToNow(new Date(job.createdAt), { addSuffix: true })}</span>
                        </div>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-3">
                        {job.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm font-medium text-[#E10600]">
                            <DollarSign className="h-4 w-4" />
                            <span>{formatSalary(job.salaryMin, job.salaryMax)}</span>
                          </div>
                          
                          {job.requirements && (
                            <div className="flex flex-wrap gap-1">
                              {job.requirements.slice(0, 3).map((req, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {req}
                                </Badge>
                              ))}
                              {job.requirements.length > 3 && (
                                <Badge variant="outline" className="text-xs">
                                  +{job.requirements.length - 3} more
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => {/* Navigate to job detail */}}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          
                          {user && (
                            <Button 
                              size="sm" 
                              className="bg-[#E10600] hover:bg-[#C10500]"
                              onClick={() => {/* Apply for job */}}
                            >
                              <Briefcase className="h-4 w-4 mr-2" />
                              Apply Now
                            </Button>
                          )}
                        </div>
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

export default Jobs;