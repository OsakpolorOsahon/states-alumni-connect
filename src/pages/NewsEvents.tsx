
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from '@/contexts/AuthContext';
import { Calendar, MapPin, User, Plus, Edit, Trash2, Eye } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

interface NewsItem {
  id: string;
  title: string;
  content: string;
  author_id?: string;
  published_at: string;
  is_published: boolean;
  members?: {
    full_name: string;
  };
}

interface EventItem {
  id: string;
  title: string;
  description?: string;
  event_date: string;
  location?: string;
  organizer_id?: string;
  members?: {
    full_name: string;
  };
}

const NewsEvents = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'events'>('news');
  const [news, setNews] = useState<NewsItem[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    description: '',
    event_date: '',
    location: ''
  });
  const { isSecretary, member } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    fetchNews();
    fetchEvents();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          members (full_name)
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          members (full_name)
        `)
        .order('event_date', { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title) {
      toast({
        title: "Missing Information",
        description: "Please provide a title",
        variant: "destructive"
      });
      return;
    }

    try {
      const isEditing = !!editingItem;
      const isNewsItem = activeTab === 'news';
      
      const payload = isNewsItem ? {
        title: formData.title,
        content: formData.content,
        author_id: member?.id,
        is_published: true
      } : {
        title: formData.title,
        description: formData.description,
        event_date: formData.event_date,
        location: formData.location,
        organizer_id: member?.id
      };

      let result;
      if (isEditing) {
        const { data, error } = await supabase
          .from(isNewsItem ? 'news' : 'events')
          .update(payload)
          .eq('id', editingItem.id)
          .select();
        result = { data, error };
      } else {
        const { data, error } = await supabase
          .from(isNewsItem ? 'news' : 'events')
          .insert([payload])
          .select();
        result = { data, error };
      }

      if (result.error) throw result.error;

      toast({
        title: `${isNewsItem ? 'News' : 'Event'} ${isEditing ? 'Updated' : 'Created'}`,
        description: `${isNewsItem ? 'News article' : 'Event'} has been ${isEditing ? 'updated' : 'created'} successfully`
      });

      resetForm();
      if (isNewsItem) {
        fetchNews();
      } else {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error saving item:', error);
      toast({
        title: "Error",
        description: `Failed to ${editingItem ? 'update' : 'create'} ${activeTab}`,
        variant: "destructive"
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm(`Are you sure you want to delete this ${activeTab}?`)) return;

    try {
      const { error } = await supabase
        .from(activeTab === 'news' ? 'news' : 'events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: `${activeTab === 'news' ? 'News' : 'Event'} Deleted`,
        description: `${activeTab === 'news' ? 'News article' : 'Event'} has been deleted successfully`
      });

      if (activeTab === 'news') {
        fetchNews();
      } else {
        fetchEvents();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
      toast({
        title: "Error",
        description: `Failed to delete ${activeTab}`,
        variant: "destructive"
      });
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      description: '',
      event_date: '',
      location: ''
    });
    setShowAddForm(false);
    setEditingItem(null);
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      content: item.content || '',
      description: item.description || '',
      event_date: item.event_date || '',
      location: item.location || ''
    });
    setShowAddForm(true);
  };

  const isUpcoming = (dateString: string) => {
    return new Date(dateString) > new Date();
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="container mx-auto py-12 px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">News & Events</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest news and upcoming events from the SMMOWCUB community.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-muted p-1 rounded-lg">
            <Button
              variant={activeTab === 'news' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('news')}
              size="sm"
            >
              News
            </Button>
            <Button
              variant={activeTab === 'events' ? 'default' : 'ghost'}
              onClick={() => setActiveTab('events')}
              size="sm"
            >
              Events
            </Button>
          </div>
        </div>

        {/* Add Button for Secretaries */}
        {isSecretary && (
          <div className="mb-8">
            <Button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-[#E10600] hover:bg-[#C10500]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add {activeTab === 'news' ? 'News Article' : 'Event'}
            </Button>
          </div>
        )}

        {/* Add/Edit Form */}
        {showAddForm && isSecretary && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>
                {editingItem ? 'Edit' : 'Add New'} {activeTab === 'news' ? 'News Article' : 'Event'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder={`Enter ${activeTab} title...`}
                />
              </div>
              
              {activeTab === 'news' ? (
                <div>
                  <label className="text-sm font-medium">Content</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData({...formData, content: e.target.value})}
                    placeholder="Write your news article content..."
                    rows={6}
                  />
                </div>
              ) : (
                <>
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Describe the event..."
                      rows={4}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Event Date & Time</label>
                    <Input
                      type="datetime-local"
                      value={formData.event_date}
                      onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      placeholder="Event location..."
                    />
                  </div>
                </>
              )}
              
              <div className="flex gap-2">
                <Button onClick={handleSubmit}>
                  {editingItem ? 'Update' : 'Create'} {activeTab === 'news' ? 'Article' : 'Event'}
                </Button>
                <Button variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#E10600] mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading {activeTab}...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeTab === 'news' ? (
              news.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No News Articles</h3>
                  <p className="text-muted-foreground">News articles will appear here when published.</p>
                </div>
              ) : (
                news.map((article) => (
                  <Card key={article.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <h3 className="font-semibold text-lg mb-3">{article.title}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-3">
                        {article.content.substring(0, 150)}...
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {article.members?.full_name || 'SMMOWCUB'}
                        </div>
                        <span>{new Date(article.published_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1">
                          <Eye className="h-3 w-3 mr-1" />
                          Read More
                        </Button>
                        {isSecretary && (
                          <>
                            <Button size="sm" variant="outline" onClick={() => startEdit(article)}>
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => handleDelete(article.id)}>
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              )
            ) : (
              events.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <h3 className="text-xl font-semibold mb-2">No Events Scheduled</h3>
                  <p className="text-muted-foreground">Events will appear here when scheduled.</p>
                </div>
              ) : (
                events.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                        {isUpcoming(event.event_date) && (
                          <Badge className="bg-green-500 text-white">Upcoming</Badge>
                        )}
                      </div>
                      
                      {event.description && (
                        <p className="text-muted-foreground text-sm mb-4">
                          {event.description}
                        </p>
                      )}
                      
                      <div className="space-y-2 text-sm text-muted-foreground mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          {new Date(event.event_date).toLocaleString()}
                        </div>
                        {event.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            {event.location}
                          </div>
                        )}
                        {event.members?.full_name && (
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4" />
                            Organized by {event.members.full_name}
                          </div>
                        )}
                      </div>
                      
                      {isSecretary && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => startEdit(event)}>
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(event.id)}>
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
              )
            )}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default NewsEvents;
