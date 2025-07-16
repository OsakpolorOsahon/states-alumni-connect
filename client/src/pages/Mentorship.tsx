import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GraduationCap, Users, MessageCircle, Calendar, CheckCircle, Clock, XCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
// Removed useMembers hook
import { useMentorshipRequests } from '@/hooks/useMentorshipRequests';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { MOWCUB_POSITIONS } from '@/data/memberData';

const Mentorship = () => {
  // Removed broken hooks
  // Removed broken hooks
  // Removed broken hooks
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState<string>('');
  const [requestMessage, setRequestMessage] = useState('');

  const handleCreateRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMentor) return;

    const result = await createRequest(selectedMentor, requestMessage);
    
    if (result.success) {
      toast({ title: 'Success', description: 'Mentorship request sent successfully!' });
      setShowRequestDialog(false);
      setSelectedMentor('');
      setRequestMessage('');
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to send request',
        variant: 'destructive'
      });
    }
  };

  const handleRespondToRequest = async (requestId: string, status: 'active' | 'completed') => {
    const result = await respondToRequest(requestId, status);
    
    if (result.success) {
      toast({ 
        title: 'Success', 
        description: `Request ${status === 'active' ? 'accepted' : 'completed'} successfully!` 
      });
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to respond to request',
        variant: 'destructive'
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDisplayName = (member: any) => {
    return member?.nickname || member?.full_name || 'Unknown';
  };

  const getPositionTitle = (code: string) => {
    const position = MOWCUB_POSITIONS.find(p => p.code === code);
    return position ? position.title : code;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-red-100 text-red-800';
    }
  };

  // Filter potential mentors (exclude very recent members)
  const potentialMentors = members.filter(member => {
    const memberYear = parseInt(member.stateship_year.split('/')[0]);
    // Removed broken hooks
    return currentYear - memberYear >= 3; // At least 3 years experience
  });

  if (membersLoading || requestsLoading) {
    return (
      <AuthGuard requireAuth requireActive>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto py-12 px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading mentorship program...</p>
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
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Mentorship Program</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Connect with experienced statesmen for guidance, or share your expertise with newer members.
              Build meaningful relationships that foster professional and personal growth.
            </p>
          </div>

          <Tabs defaultValue="mentors" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="mentors">Find Mentors</TabsTrigger>
              <TabsTrigger value="requests">My Requests</TabsTrigger>
              <TabsTrigger value="program">Program Info</TabsTrigger>
            </TabsList>

            <TabsContent value="mentors" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Available Mentors</h2>
                <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
                  <DialogTrigger asChild>
                    <Button className="bg-[#E10600] hover:bg-[#C10500]">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Request Mentorship
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Request Mentorship</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCreateRequest} className="space-y-4">
                      <div>
                        <Label htmlFor="mentor">Select Mentor</Label>
                        <select
                          id="mentor"
                          value={selectedMentor}
                          onChange={(e) => setSelectedMentor(e.target.value)}
                          className="w-full p-2 border rounded-md"
                          required
                        >
                          <option value="">Choose a mentor...</option>
                          {potentialMentors.map(mentor => (
                            <option key={mentor.id} value={mentor.id}>
                              {getDisplayName(mentor)} - {mentor.stateship_year}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <Label htmlFor="message">Message</Label>
                        <Textarea
                          id="message"
                          value={requestMessage}
                          onChange={(e) => setRequestMessage(e.target.value)}
                          rows={4}
                          placeholder="Introduce yourself and explain what you hope to gain from this mentorship..."
                          required
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" onClick={() => setShowRequestDialog(false)}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-[#E10600] hover:bg-[#C10500]">
                          Send Request
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {potentialMentors.map(mentor => (
                  <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <Avatar className="w-16 h-16">
                          <AvatarImage src={mentor.photo_url} alt={getDisplayName(mentor)} />
                          <AvatarFallback className="bg-[#E10600] text-white">
                            {getInitials(getDisplayName(mentor))}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{getDisplayName(mentor)}</h3>
                          <p className="text-sm text-muted-foreground">
                            {mentor.stateship_year}
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <p className="text-sm">
                          <span className="font-medium">Position:</span> {getPositionTitle(mentor.last_mowcub_position)}
                        </p>
                        {mentor.current_council_office && mentor.current_council_office !== 'None' && (
                          <Badge variant="secondary" className="text-xs">
                            {mentor.current_council_office}
                          </Badge>
                        )}
                      </div>

                      <Button 
                        size="sm" 
                        className="w-full"
                        onClick={() => {
                          setSelectedMentor(mentor.id);
                          setShowRequestDialog(true);
                        }}
                      >
                        Request Mentorship
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="space-y-6">
              <h2 className="text-xl font-semibold">Mentorship Requests</h2>
              
              {requests.length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No mentorship requests yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Start by requesting mentorship from an experienced member!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {requests.map(request => (
                    <Card key={request.id}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4">
                            <Avatar className="w-12 h-12">
                              <AvatarImage 
                                src={request.mentor?.photo_url || request.mentee?.photo_url} 
                                alt={getDisplayName(request.mentor || request.mentee)} 
                              />
                              <AvatarFallback className="bg-[#E10600] text-white">
                                {getInitials(getDisplayName(request.mentor || request.mentee))}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h3 className="font-semibold">
                                  {getDisplayName(request.mentor)} ↔ {getDisplayName(request.mentee)}
                                </h3>
                                <Badge className={getStatusColor(request.status)}>
                                  <div className="flex items-center gap-1">
                                    {getStatusIcon(request.status)}
                                    {request.status}
                                  </div>
                                </Badge>
                              </div>
                              
                              {request.request_message && (
                                <p className="text-muted-foreground mb-3">
                                  {request.request_message}
                                </p>
                              )}
                              
                              <div className="text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Calendar className="w-4 h-4" />
                                  Requested {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                                </div>
                                {request.responded_at && (
                                  <div className="flex items-center gap-1 mt-1">
                                    <CheckCircle className="w-4 h-4" />
                                    Responded {formatDistanceToNow(new Date(request.responded_at), { addSuffix: true })}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {request.status === 'pending' && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => handleRespondToRequest(request.id, 'active')}
                                className="bg-green-600 hover:bg-green-700"
                              >
                                Accept
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRespondToRequest(request.id, 'completed')}
                              >
                                Decline
                              </Button>
                            </div>
                          )}
                          
                          {request.status === 'active' && (
                            <Button
                              size="sm"
                              onClick={() => handleRespondToRequest(request.id, 'completed')}
                            >
                              Mark Complete
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="program" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <GraduationCap className="w-6 h-6 text-[#E10600]" />
                    About the Mentorship Program
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">
                    The SMMOWCUB Mentorship Program connects experienced statesmen with newer members 
                    to foster professional growth, leadership development, and lasting relationships 
                    within our distinguished community.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="w-5 h-5 text-[#E10600]" />
                        For Mentees
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Gain valuable insights from experienced professionals</li>
                        <li>• Accelerate your career development</li>
                        <li>• Build meaningful professional relationships</li>
                        <li>• Learn from real-world experiences</li>
                        <li>• Expand your professional network</li>
                      </ul>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <GraduationCap className="w-5 h-5 text-[#E10600]" />
                        For Mentors
                      </h3>
                      <ul className="space-y-1 text-sm text-muted-foreground">
                        <li>• Give back to the SMMOWCUB community</li>
                        <li>• Develop leadership and coaching skills</li>
                        <li>• Gain fresh perspectives from younger professionals</li>
                        <li>• Build lasting relationships</li>
                        <li>• Contribute to the next generation's success</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <h3 className="font-semibold mb-2">How It Works</h3>
                    <ol className="space-y-2 text-sm text-muted-foreground">
                      <li>1. Browse available mentors and find someone whose experience aligns with your goals</li>
                      <li>2. Send a mentorship request with a personalized message</li>
                      <li>3. Once accepted, connect directly to establish your mentoring relationship</li>
                      <li>4. Set regular check-ins and define your mentorship objectives</li>
                      <li>5. Both parties can mark the mentorship as complete when goals are achieved</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        <Footer />
      </div>
    </AuthGuard>
  );
};

export default Mentorship;