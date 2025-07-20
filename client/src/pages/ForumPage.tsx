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
import { useForumThreads, useCreateForumThread, useForumReplies, useCreateForumReply } from '@/hooks/useForumThreads';
import { useAuth } from '@/contexts/AuthContext';
import { MessageSquare, Pin, Lock, Search, Plus, User, Clock } from 'lucide-react';
import { toast } from 'sonner';

const ForumPage = () => {
  const { data: threads = [], isLoading } = useForumThreads();
  const { mutate: createThread, isPending: creatingThread } = useCreateForumThread();
  const { user, member, isActiveMember } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedThread, setSelectedThread] = useState<string | null>(null);
  const [newThread, setNewThread] = useState({
    title: '',
    content: ''
  });

  const filteredThreads = threads.filter(thread => 
    thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    thread.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateThread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) {
      toast.error('You must be logged in to create a thread');
      return;
    }

    try {
      await createThread({
        ...newThread,
        author_id: member.id
      });
      toast.success('Thread created successfully!');
      setShowCreateForm(false);
      setNewThread({ title: '', content: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create thread');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <SEO
        title="Community Forum - SMMOWCUB"
        description="Join discussions with fellow statesmen. Share experiences, ask questions, and connect with the SMMOWCUB community."
        keywords="SMMOWCUB forum, community discussions, statesmen network, UNIBEN alumni"
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
              Community <span className="text-[#E10600]">Forum</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Connect, discuss, and share experiences with fellow statesmen. Our forum is a space for 
              meaningful conversations and community building.
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
                placeholder="Search discussions..."
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
                    New Discussion
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Start a New Discussion</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateThread} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Discussion Title *</label>
                      <Input
                        value={newThread.title}
                        onChange={(e) => setNewThread({...newThread, title: e.target.value})}
                        placeholder="What would you like to discuss?"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Message *</label>
                      <Textarea
                        value={newThread.content}
                        onChange={(e) => setNewThread({...newThread, content: e.target.value})}
                        placeholder="Share your thoughts, ask questions, or start a conversation..."
                        rows={6}
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={creatingThread} className="bg-[#E10600] hover:bg-[#C10500]">
                        {creatingThread ? 'Creating...' : 'Create Discussion'}
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

          {/* Threads List */}
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredThreads.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No discussions found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'Be the first to start a discussion!'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {filteredThreads.map((thread, index) => (
                <motion.div
                  key={thread.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        onClick={() => setSelectedThread(selectedThread === thread.id ? null : thread.id)}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {thread.is_pinned && (
                              <Pin className="h-4 w-4 text-[#E10600]" />
                            )}
                            {thread.is_locked && (
                              <Lock className="h-4 w-4 text-muted-foreground" />
                            )}
                            <CardTitle className="text-lg">{thread.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              <span>By Member</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              <span>{formatDate(thread.created_at)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MessageSquare className="h-4 w-4" />
                              <span>0 replies</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {thread.is_pinned && (
                            <Badge variant="secondary">Pinned</Badge>
                          )}
                          {thread.is_locked && (
                            <Badge variant="outline">Locked</Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-2">
                        {thread.content}
                      </p>
                      {selectedThread === thread.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-4 pt-4 border-t"
                        >
                          <div className="prose max-w-none">
                            <p className="text-foreground whitespace-pre-wrap">{thread.content}</p>
                          </div>
                          
                          {/* Thread Replies Section */}
                          <ThreadReplies threadId={thread.id} />
                        </motion.div>
                      )}
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

// Thread Replies Component
const ThreadReplies = ({ threadId }: { threadId: string }) => {
  const { data: replies = [], isLoading } = useForumReplies(threadId);
  const { mutate: createReply, isPending } = useCreateForumReply();
  const { member, isActiveMember } = useAuth();
  const [newReply, setNewReply] = useState('');

  const handleCreateReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member || !newReply.trim()) return;

    try {
      await createReply({
        thread_id: threadId,
        author_id: member.id,
        content: newReply
      });
      setNewReply('');
      toast.success('Reply posted successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to post reply');
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <h4 className="font-semibold text-foreground">Replies ({replies.length})</h4>
      
      {/* Existing Replies */}
      {replies.map((reply, index) => (
        <motion.div
          key={reply.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-muted/50 rounded-lg p-4 ml-4"
        >
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Member</span>
            <span>•</span>
            <span>{new Date(reply.created_at).toLocaleDateString()}</span>
          </div>
          <p className="text-foreground whitespace-pre-wrap">{reply.content}</p>
        </motion.div>
      ))}

      {/* Reply Form */}
      {isActiveMember && (
        <form onSubmit={handleCreateReply} className="ml-4 space-y-3">
          <Textarea
            value={newReply}
            onChange={(e) => setNewReply(e.target.value)}
            placeholder="Share your thoughts..."
            rows={3}
            className="resize-none"
          />
          <Button
            type="submit"
            disabled={isPending || !newReply.trim()}
            size="sm"
            className="bg-[#E10600] hover:bg-[#C10500]"
          >
            {isPending ? 'Posting...' : 'Post Reply'}
          </Button>
        </form>
      )}

      {!isActiveMember && (
        <p className="text-sm text-muted-foreground ml-4">
          Please log in as an active member to participate in discussions.
        </p>
      )}
    </div>
  );
};

export default ForumPage;