import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar, MapPin, Building, DollarSign, Plus, ExternalLink } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { useJobPosts } from '@/hooks/useJobPosts';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const Jobs = () => {
  const { jobs, loading, error, createJob } = useJobPosts();
  const { toast } = useToast();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    company: '',
    location: '',
    salary_range: '',
    expires_at: ''
  });

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createJob({
      ...newJob,
      expires_at: newJob.expires_at || undefined,
      is_active: true
    });

    if (result.success) {
      toast({ title: 'Success', description: 'Job post created successfully!' });
      setShowCreateDialog(false);
      setNewJob({
        title: '',
        description: '',
        company: '',
        location: '',
        salary_range: '',
        expires_at: ''
      });
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to create job post',
        variant: 'destructive'
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (loading) {
    return (
      <AuthGuard requireAuth requireActive>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto py-12 px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading jobs...</p>
            </div>
          </div>
          <Footer />
        </div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard requireAuth requireActive>
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold">Job Board</h1>
              <p className="text-muted-foreground">
                Discover opportunities within the SMMOWCUB network
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#E10600] hover:bg-[#C10500]">
                  <Plus className="w-4 h-4 mr-2" />
                  Post Job
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create Job Post</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateJob} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={newJob.title}
                      onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={newJob.company}
                      onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={newJob.location}
                        onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                        placeholder="Optional"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salary">Salary Range</Label>
                      <Input
                        id="salary"
                        value={newJob.salary_range}
                        onChange={(e) => setNewJob({ ...newJob, salary_range: e.target.value })}
                        placeholder="e.g., $50,000 - $70,000"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="expires">Expires At (Optional)</Label>
                    <Input
                      id="expires"
                      type="datetime-local"
                      value={newJob.expires_at}
                      onChange={(e) => setNewJob({ ...newJob, expires_at: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Job Description</Label>
                    <Textarea
                      id="description"
                      value={newJob.description}
                      onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#E10600] hover:bg-[#C10500]">
                      Create Job Post
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Jobs List */}
          <div className="space-y-6">
            {error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-destructive">{error}</p>
                </CardContent>
              </Card>
            ) : jobs.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-muted-foreground">No job posts available yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Be the first to post a job opportunity!
                  </p>
                </CardContent>
              </Card>
            ) : (
              jobs.map(job => (
                <Card key={job.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={job.members?.photo_url} alt={job.members?.full_name} />
                          <AvatarFallback className="bg-[#E10600] text-white">
                            {job.members?.full_name ? getInitials(job.members.full_name) : 'NA'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-xl">{job.title}</CardTitle>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                            <div className="flex items-center gap-1">
                              <Building className="w-4 h-4" />
                              {job.company}
                            </div>
                            {job.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-4 h-4" />
                                {job.location}
                              </div>
                            )}
                            {job.salary_range && (
                              <div className="flex items-center gap-1">
                                <DollarSign className="w-4 h-4" />
                                {job.salary_range}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="secondary">
                          <Calendar className="w-3 h-3 mr-1" />
                          {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                        </Badge>
                        {job.expires_at && new Date(job.expires_at) > new Date() && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Expires {formatDistanceToNow(new Date(job.expires_at), { addSuffix: true })}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4 whitespace-pre-wrap">
                      {job.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <p className="text-sm text-muted-foreground">
                        Posted by {job.members?.full_name || 'Unknown'}
                      </p>
                      <Button className="bg-[#E10600] hover:bg-[#C10500]">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Apply Now
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default Jobs;