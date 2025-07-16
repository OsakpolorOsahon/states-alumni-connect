import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { MessageSquare, Plus, Pin, Lock, Calendar, User } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import AuthGuard from '@/components/AuthGuard';
import { useForumThreads } from '@/hooks/useForumThreads';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const Forums = () => {
  // Removed broken hooks
  // Removed broken hooks
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newThread, setNewThread] = useState({
    title: '',
    content: ''
  });

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await createThread(newThread);

    if (result.success) {
      toast({ title: 'Success', description: 'Thread created successfully!' });
      setShowCreateDialog(false);
      setNewThread({ title: '', content: '' });
    } else {
      toast({ 
        title: 'Error', 
        description: result.error || 'Failed to create thread',
        variant: 'destructive'
      });
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getDisplayName = (member: any) => {
    return member?.nickname || member?.full_name || 'Unknown User';
  };

  if (loading) {
    return (
      <AuthGuard requireAuth requireActive>
        <div className="min-h-screen bg-background">
          <Navigation />
          <div className="container mx-auto py-12 px-4">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
              <p className="mt-4 text-muted-foreground">Loading forum...</p>
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
              <h1 className="text-3xl font-bold">Discussion Forums</h1>
              <p className="text-muted-foreground">
                Connect and engage with fellow SMMOWCUB members
              </p>
            </div>
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button className="bg-[#E10600] hover:bg-[#C10500]">
                  <Plus className="w-4 h-4 mr-2" />
                  New Thread
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Thread</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleCreateThread} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Thread Title</Label>
                    <Input
                      id="title"
                      value={newThread.title}
                      onChange={(e) => setNewThread({ ...newThread, title: e.target.value })}
                      placeholder="What would you like to discuss?"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="content">Content</Label>
                    <Textarea
                      id="content"
                      value={newThread.content}
                      onChange={(e) => setNewThread({ ...newThread, content: e.target.value })}
                      rows={8}
                      placeholder="Share your thoughts, questions, or start a discussion..."
                      required
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={() => setShowCreateDialog(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-[#E10600] hover:bg-[#C10500]">
                      Create Thread
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Threads List */}
          <div className="space-y-4">
            {error ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-destructive">{error}</p>
                </CardContent>
              </Card>
            ) : threads.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <MessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No discussions yet.</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Start the conversation by creating the first thread!
                  </p>
                </CardContent>
              </Card>
            ) : (
              threads.map(thread => (
                <Card key={thread.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={thread.members?.photo_url} alt={getDisplayName(thread.members)} />
                        <AvatarFallback className="bg-[#E10600] text-white">
                          {getInitials(getDisplayName(thread.members))}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          {thread.is_pinned && (
                            <Pin className="w-4 h-4 text-[#E10600]" />
                          )}
                          {thread.is_locked && (
                            <Lock className="w-4 h-4 text-muted-foreground" />
                          )}
                          <h3 className="text-lg font-semibold truncate">
                            {thread.title}
                          </h3>
                        </div>
                        
                        <p className="text-muted-foreground mb-3 line-clamp-3">
                          {thread.content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="w-4 h-4" />
                              {getDisplayName(thread.members)}
                            </div>
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {formatDistanceToNow(new Date(thread.created_at), { addSuffix: true })}
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {thread.reply_count || 0} replies
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {thread.last_reply && thread.last_reply !== thread.created_at && (
                              <Badge variant="outline" className="text-xs">
                                Last reply: {formatDistanceToNow(new Date(thread.last_reply), { addSuffix: true })}
                              </Badge>
                            )}
                            <Button size="sm" variant="outline">
                              View Thread
                            </Button>
                          </div>
                        </div>
                      </div>
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

export default Forums;