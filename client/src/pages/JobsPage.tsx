import React, { useState } from 'react';
import { motion } from 'framer-motion';
import SEO from '@/components/SEO';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useJobPosts, useCreateJobPost } from '@/hooks/useJobPosts';
import { useAuth } from '@/contexts/AuthContext';
import { Briefcase, MapPin, DollarSign, Clock, Search, Plus } from 'lucide-react';
import { toast } from 'sonner';

const JobsPage = () => {
  const { data: jobs = [], isLoading } = useJobPosts();
  const { mutate: createJob, isPending } = useCreateJobPost();
  const { user, member, isActiveMember } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary_range: '',
    expires_at: ''
  });

  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) {
      toast.error('You must be logged in to post a job');
      return;
    }

    try {
      await createJob({
        ...newJob,
        posted_by: member.id,
        expires_at: newJob.expires_at ? new Date(newJob.expires_at).toISOString() : null
      });
      toast.success('Job posted successfully! It will be visible after secretary approval.');
      setShowCreateForm(false);
      setNewJob({
        title: '',
        description: '',
        company: '',
        location: '',
        salary_range: '',
        expires_at: ''
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create job posting');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isExpired = (expiresAt: string | null) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <>
      <SEO
        title="Job Opportunities - SMMOWCUB"
        description="Discover career opportunities shared by fellow statesmen. Connect with our network for job listings, career development, and professional growth."
        keywords="SMMOWCUB jobs, career opportunities, statesmen network, professional development"
      />
      <Navigation />
      <main className="min-h-screen pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Career <span className="text-[#E10600]">Opportunities</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Discover job opportunities shared by fellow statesmen. Connect, grow, and advance your career 
              within our distinguished network.
            </p>
          </motion.div>

          {/* Search and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search jobs by title, company, or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {isActiveMember && (
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button className="bg-[#E10600] hover:bg-[#C10500]">
                    <Plus className="h-4 w-4 mr-2" />
                    Post Job
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Post a New Job Opportunity</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateJob} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Job Title *</label>
                        <Input
                          value={newJob.title}
                          onChange={(e) => setNewJob({...newJob, title: e.target.value})}
                          placeholder="e.g. Senior Software Engineer"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Company *</label>
                        <Input
                          value={newJob.company}
                          onChange={(e) => setNewJob({...newJob, company: e.target.value})}
                          placeholder="e.g. Tech Corp Ltd"
                          required
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Location</label>
                        <Input
                          value={newJob.location}
                          onChange={(e) => setNewJob({...newJob, location: e.target.value})}
                          placeholder="e.g. Lagos, Nigeria"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Salary Range</label>
                        <Input
                          value={newJob.salary_range}
                          onChange={(e) => setNewJob({...newJob, salary_range: e.target.value})}
                          placeholder="e.g. ₦500,000 - ₦800,000"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Job Description *</label>
                      <Textarea
                        value={newJob.description}
                        onChange={(e) => setNewJob({...newJob, description: e.target.value})}
                        placeholder="Describe the role, requirements, and benefits..."
                        rows={6}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Expiry Date</label>
                      <Input
                        type="date"
                        value={newJob.expires_at}
                        onChange={(e) => setNewJob({...newJob, expires_at: e.target.value})}
                        min={new Date().toISOString().split('T')[0]}
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={isPending} className="bg-[#E10600] hover:bg-[#C10500]">
                        {isPending ? 'Posting...' : 'Post Job'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowCreateForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </motion.div>

          {/* Jobs Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Briefcase className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No jobs found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No job opportunities available at the moment'}
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredJobs.map((job, index) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className={`h-full hover:shadow-lg transition-shadow duration-300 ${isExpired(job.expires_at) ? 'opacity-60' : ''}`}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{job.title}</CardTitle>
                          <p className="text-muted-foreground font-medium">{job.company}</p>
                        </div>
                        {isExpired(job.expires_at) && (
                          <Badge variant="secondary">Expired</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {job.location && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            <span>{job.location}</span>
                          </div>
                        )}
                        {job.salary_range && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <DollarSign className="h-4 w-4" />
                            <span>{job.salary_range}</span>
                          </div>
                        )}
                        {job.expires_at && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            <span>Expires: {formatDate(job.expires_at)}</span>
                          </div>
                        )}
                        <p className="text-sm text-muted-foreground line-clamp-3">
                          {job.description}
                        </p>
                        <div className="pt-3">
                          <Button 
                            size="sm" 
                            className="w-full bg-[#E10600] hover:bg-[#C10500]"
                            disabled={isExpired(job.expires_at)}
                          >
                            Apply Now
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default JobsPage;