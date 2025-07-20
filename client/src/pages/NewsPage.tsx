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
import { useNews, useCreateNews } from '@/hooks/useNews';
import { useAuth } from '@/contexts/AuthContext';
import { Newspaper, Calendar, User, Search, Plus, Clock } from 'lucide-react';
import { toast } from 'sonner';

const NewsPage = () => {
  const { data: news = [], isLoading } = useNews();
  const { mutate: createNews, isPending } = useCreateNews();
  const { member, isSecretary } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newNews, setNewNews] = useState({
    title: '',
    content: ''
  });

  const filteredNews = news.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!member) {
      toast.error('You must be logged in to create news');
      return;
    }

    try {
      await createNews({
        ...newNews,
        author_id: member.id,
        is_published: true,
        published_at: new Date().toISOString()
      });
      toast.success('News article published successfully!');
      setShowCreateForm(false);
      setNewNews({ title: '', content: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to publish news');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return diffInHours === 0 ? 'Just now' : `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return diffInDays === 1 ? '1 day ago' : `${diffInDays} days ago`;
    }
  };

  return (
    <>
      <SEO
        title="News & Announcements - SMMOWCUB"
        description="Stay updated with the latest news, announcements, and events from the SMMOWCUB community. Get insights from fellow statesmen."
        keywords="SMMOWCUB news, announcements, community updates, statesmen news"
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
              News & <span className="text-[#E10600]">Announcements</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Stay informed with the latest updates, announcements, and insights from our 
              distinguished community of statesmen.
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
                placeholder="Search news and announcements..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            {isSecretary && (
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogTrigger asChild>
                  <Button className="bg-[#E10600] hover:bg-[#C10500]">
                    <Plus className="h-4 w-4 mr-2" />
                    Publish News
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Publish News Article</DialogTitle>
                  </DialogHeader>
                  <form onSubmit={handleCreateNews} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Article Title *</label>
                      <Input
                        value={newNews.title}
                        onChange={(e) => setNewNews({...newNews, title: e.target.value})}
                        placeholder="Enter the news headline..."
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Article Content *</label>
                      <Textarea
                        value={newNews.content}
                        onChange={(e) => setNewNews({...newNews, content: e.target.value})}
                        placeholder="Write the full news article..."
                        rows={10}
                        required
                      />
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" disabled={isPending} className="bg-[#E10600] hover:bg-[#C10500]">
                        {isPending ? 'Publishing...' : 'Publish Article'}
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

          {/* News Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredNews.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Newspaper className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No news found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? 'Try adjusting your search terms' : 'No news articles available at the moment'}
              </p>
            </motion.div>
          ) : (
            <div className="space-y-8">
              {/* Featured Article (Latest) */}
              {filteredNews.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="mb-8 border-[#E10600]/20">
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className="bg-[#E10600] text-white">Featured</Badge>
                        <Badge variant="outline">Latest</Badge>
                      </div>
                      <CardTitle className="text-2xl mb-3">{filteredNews[0].title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <User className="h-4 w-4" />
                          <span>SMMOWCUB Team</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>{formatDate(filteredNews[0].published_at || filteredNews[0].updated_at)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{getTimeAgo(filteredNews[0].published_at || filteredNews[0].updated_at)}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="prose max-w-none">
                        <p className="text-muted-foreground text-lg leading-relaxed line-clamp-4">
                          {filteredNews[0].content}
                        </p>
                      </div>
                      <Button variant="outline" className="mt-4">
                        Read Full Article
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {/* Other Articles Grid */}
              {filteredNews.length > 1 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredNews.slice(1).map((article, index) => (
                    <motion.div
                      key={article.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: (index + 1) * 0.1 }}
                    >
                      <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="outline" className="text-xs">
                              {getTimeAgo(article.published_at || article.updated_at)}
                            </Badge>
                          </div>
                          <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(article.published_at || article.updated_at)}</span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <p className="text-muted-foreground line-clamp-3 mb-4">
                            {article.content}
                          </p>
                          <Button variant="outline" size="sm" className="w-full">
                            Read More
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
};

export default NewsPage;