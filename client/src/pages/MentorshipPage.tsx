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
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import { db } from '@/lib/supabase';
import { Users, MessageCircle, Search, Plus, Clock, CheckCircle, UserCheck } from 'lucide-react';
import { toast } from 'sonner';

const MentorshipPage = () => {
  const { data: requests = [], isLoading } = useQuery({
    queryKey: ['mentorship-requests'],
    queryFn: async () => {
      const result = await db.getMentorshipRequests();
      if (result.error) throw new Error(result.error.message);
      return result.data || [];
    }
  });

  const { mutate: createRequest, isPending } = useMutation({
    mutationFn: async (requestData: any) => {
      const result = await db.createMentorshipRequest(requestData);
      if (result.error) throw new Error(result.error.message);
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mentorship-requests'] });
    }
  });

  const queryClient = useQueryClient();
  const { member, isActiveMember } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [newRequest, setNewRequest] = useState({
    request_message: ''
  });

  const filteredRequests = requests.filter((request: any) => 
    request.request_message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.mentees?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.mentors?.full_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) {
      toast.error('You must be logged in to request mentorship');
      return;
    }

    try {
      await createRequest({
        mentee_id: member.id,
        request_message: newRequest.request_message,
        status: 'pending'
      });
      toast.success('Mentorship request submitted successfully!');
      setShowRequestForm(false);
      setNewRequest({ request_message: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit mentorship request');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'active': return 'bg-green-100 text-green-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock;
      case 'active': return UserCheck;
      case 'completed': return CheckCircle;
      default: return Users;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <>
      <SEO
        title="Mentorship Program - SMMOWCUB"
        description="Connect with experienced mentors and guide fellow statesmen. Join our mentorship program to share knowledge and grow together."
      />
      <Navigation />
      <main className="min-h-screen pt-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Mentorship <span className="text-[#E10600]">Program</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect with experienced statesmen for guidance and mentorship. Share knowledge, 
              grow professionally, and strengthen our community bonds.
            </p>
          </motion.div>

          {/* Program Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
          >
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-[#E10600]/10 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-[#E10600]" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {requests.length}
                </div>
                <div className="text-sm text-muted-foreground">Total Requests</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {requests.filter((r: any) => r.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Mentorships</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-foreground mb-1">
                  {requests.filter((r: any) => r.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Search and Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search mentorship requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {isActiveMember && (
              <Dialog open={showRequestForm} onOpenChange={setShowRequestForm}>
                <DialogTrigger asChild>
                  <Button className="bg-[#E10600] hover:bg-[#C10500]">
                    <Plus className="h-4 w-4 mr-2" />
                    Request Mentorship
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Request a Mentor</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateRequest} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Why do you need mentorship? *</label>
                      <Textarea
                        value={newRequest.request_message}
                        onChange={(e) => setNewRequest({...newRequest, request_message: e.target.value})}
                        placeholder="Describe your goals, challenges, and what kind of guidance you're looking for..."
                        rows={6}
                        required
                      />
                    </div>
                    <div className="bg-muted/50 p-4 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">What to expect:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Your request will be reviewed by experienced statesmen</li>
                        <li>• You'll be matched with a suitable mentor based on your needs</li>
                        <li>• Regular check-ins and guidance sessions will be arranged</li>
                        <li>• Both parties can provide feedback throughout the process</li>
                      </ul>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={isPending} className="bg-[#E10600] hover:bg-[#C10500]">
                        {isPending ? 'Submitting...' : 'Submit Request'}
                      </Button>
                      <Button type="button" variant="outline" onClick={() => setShowRequestForm(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            )}
          </motion.div>

          {/* Mentorship Requests */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No mentorship requests found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to request mentorship or become a mentor!'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {filteredRequests.map((request: any, index: number) => {
                const StatusIcon = getStatusIcon(request.status);
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="hover:shadow-lg transition-shadow duration-300">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge className={getStatusColor(request.status)}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                              </Badge>
                              <span className="text-sm text-muted-foreground">
                                Requested on {formatDate(request.created_at)}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 text-sm">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">Mentee:</span>
                                <span>{request.mentees?.full_name || 'Anonymous'}</span>
                              </div>
                              {request.mentors && (
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">Mentor:</span>
                                  <span>{request.mentors.full_name}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-medium text-foreground mb-2">Request Details:</h4>
                            <p className="text-muted-foreground leading-relaxed">
                              {request.request_message}
                            </p>
                          </div>
                          
                          {request.status === 'pending' && isActiveMember && (
                            <div className="flex gap-3">
                              <Button size="sm" className="bg-[#E10600] hover:bg-[#C10500]">
                                <MessageCircle className="h-4 w-4 mr-2" />
                                Offer to Mentor
                              </Button>
                              <Button size="sm" variant="outline">
                                Contact Mentee
                              </Button>
                            </div>
                          )}
                          
                          {request.status === 'active' && (
                            <div className="bg-green-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 text-green-800 mb-2">
                                <UserCheck className="h-4 w-4" />
                                <span className="font-medium">Active Mentorship</span>
                              </div>
                              <p className="text-sm text-green-700">
                                This mentorship relationship is currently active. Regular sessions are in progress.
                              </p>
                            </div>
                          )}
                          
                          {request.status === 'completed' && (
                            <div className="bg-blue-50 p-4 rounded-lg">
                              <div className="flex items-center gap-2 text-blue-800 mb-2">
                                <CheckCircle className="h-4 w-4" />
                                <span className="font-medium">Completed Successfully</span>
                              </div>
                              <p className="text-sm text-blue-700">
                                This mentorship has been completed successfully. Goals were achieved and both parties provided positive feedback.
                              </p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default MentorshipPage;