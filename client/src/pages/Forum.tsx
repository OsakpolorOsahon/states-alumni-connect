import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, MessageCircle, User, Calendar, Pin, Filter, Plus, TrendingUp } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { formatDistanceToNow } from 'date-fns';

const Forum = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('recent');

  const { data: threads = [], isLoading, error } = useQuery({
    queryKey: ['forum', 'threads'],
    queryFn: () => api.getAllForumThreads(),
  });

  // Filter and sort threads
  const filteredThreads = threads.filter(thread => {
    const matchesSearch = searchTerm === '' || 
      thread.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      thread.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || 
      thread.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.lastActivityAt || b.createdAt).getTime() - new Date(a.lastActivityAt || a.createdAt).getTime();
      case 'oldest':
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case 'popular':
        return (b.replyCount || 0) - (a.replyCount || 0);
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const categories = [...new Set(threads.map(thread => thread.category))];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="container mx-auto py-12 px-4">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading forum...</p>
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
            <p className="text-red-500">Error loading forum: {error.message}</p>
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
            SMMOWCUB Forum
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Connect, discuss, and share knowledge with fellow Statesmen
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>{category}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Recent Activity</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="popular">Most Replies</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {filteredThreads.length} of {threads.length} discussions
                </span>
              </div>
              
              {user && (
                <Button 
                  size="sm" 
                  className="bg-[#E10600] hover:bg-[#C10500]"
                  onClick={() => {/* Navigate to create thread */}}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Discussion
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Forum Threads */}
        {filteredThreads.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No discussions found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredThreads.map((thread) => (
              <Card key={thread.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={thread.authorAvatar} alt={thread.authorName} />
                      <AvatarFallback className="bg-[#E10600] text-white">
                        {getInitials(thread.authorName)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {thread.isPinned && (
                            <Pin className="h-4 w-4 text-[#E10600]" />
                          )}
                          <h3 className="text-lg font-semibold text-foreground hover:text-[#E10600] cursor-pointer">
                            {thread.title}
                          </h3>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {thread.category}
                        </Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {thread.content}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{thread.authorName}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDistanceToNow(new Date(thread.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MessageCircle className="h-4 w-4" />
                            <span>{thread.replyCount || 0} replies</span>
                          </div>
                          
                          {thread.replyCount > 10 && (
                            <div className="flex items-center gap-1 text-sm text-[#E10600]">
                              <TrendingUp className="h-4 w-4" />
                              <span>Popular</span>
                            </div>
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

export default Forum;