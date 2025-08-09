import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  Eye,
  Calendar,
  FileText,
  Briefcase,
  MapPin 
} from 'lucide-react';
import { useConfig } from '@/contexts/ConfigContext';
import { createSupabaseClient } from '@/lib/supabase';

interface NewsArticle {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  author_id: string;
  status: 'draft' | 'published';
  created_at: string;
  updated_at: string;
}

interface JobPost {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  requirements: string;
  contact_email: string;
  status: 'active' | 'closed';
  posted_by: string;
  created_at: string;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  organizer: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  created_at: string;
}

const SecretaryContentManagement = () => {
  const { config } = useConfig();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [activeSection, setActiveSection] = useState<'news' | 'jobs' | 'events'>('news');
  const [editingItem, setEditingItem] = useState<any>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Create Supabase client
  const supabaseClient = config ? createSupabaseClient(config.supabaseUrl, config.supabaseAnonKey) : null;

  // News queries and mutations
  const { data: news, isLoading: newsLoading } = useQuery({
    queryKey: ['secretary-news'],
    queryFn: async () => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      const { data, error } = await supabaseClient
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as NewsArticle[];
    },
    enabled: activeSection === 'news' && !!supabaseClient
  });

  const { data: jobs, isLoading: jobsLoading } = useQuery({
    queryKey: ['secretary-jobs'],
    queryFn: async () => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      const { data, error } = await supabaseClient
        .from('job_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as JobPost[];
    },
    enabled: activeSection === 'jobs' && !!supabaseClient
  });

  const { data: events, isLoading: eventsLoading } = useQuery({
    queryKey: ['secretary-events'],
    queryFn: async () => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      const { data, error } = await supabaseClient
        .from('events')
        .select('*')
        .order('event_date', { ascending: true });
      if (error) throw error;
      return data as Event[];
    },
    enabled: activeSection === 'events' && !!supabaseClient
  });

  // Create mutations
  const createNewsMutation = useMutation({
    mutationFn: async (newsData: Partial<NewsArticle>) => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      const { data, error } = await supabaseClient
        .from('news')
        .insert([newsData])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secretary-news'] });
      toast({ title: 'News article created successfully' });
      setIsCreating(false);
    }
  });

  const createJobMutation = useMutation({
    mutationFn: async (jobData: Partial<JobPost>) => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      const { data, error } = await supabaseClient
        .from('job_posts')
        .insert([jobData])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secretary-jobs'] });
      toast({ title: 'Job posting created successfully' });
      setIsCreating(false);
    }
  });

  const createEventMutation = useMutation({
    mutationFn: async (eventData: Partial<Event>) => {
      if (!supabaseClient) throw new Error('Supabase client not available');
      const { data, error } = await supabaseClient
        .from('events')
        .insert([eventData])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secretary-events'] });
      toast({ title: 'Event created successfully' });
      setIsCreating(false);
    }
  });

  // Update mutations
  const updateNewsMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string, updates: Partial<NewsArticle> }) => {
      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secretary-news'] });
      toast({ title: 'News article updated successfully' });
      setEditingItem(null);
    }
  });

  // Delete mutations
  const deleteNewsMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['secretary-news'] });
      toast({ title: 'News article deleted successfully' });
    }
  });

  const handleCreate = (formData: FormData) => {
    const data = Object.fromEntries(formData);
    
    if (activeSection === 'news') {
      createNewsMutation.mutate({
        title: data.title as string,
        content: data.content as string,
        excerpt: data.excerpt as string,
        status: data.status as 'draft' | 'published'
      });
    } else if (activeSection === 'jobs') {
      createJobMutation.mutate({
        title: data.title as string,
        company: data.company as string,
        location: data.location as string,
        description: data.description as string,
        requirements: data.requirements as string,
        contact_email: data.contact_email as string,
        status: 'active'
      });
    } else if (activeSection === 'events') {
      createEventMutation.mutate({
        title: data.title as string,
        description: data.description as string,
        date: data.date as string,
        location: data.location as string,
        organizer: data.organizer as string,
        status: 'upcoming'
      });
    }
  };

  const handleUpdate = (id: string, formData: FormData) => {
    const data = Object.fromEntries(formData);
    
    if (activeSection === 'news') {
      updateNewsMutation.mutate({
        id,
        updates: {
          title: data.title as string,
          content: data.content as string,
          excerpt: data.excerpt as string,
          status: data.status as 'draft' | 'published'
        }
      });
    }
  };

  const isLoading = newsLoading || jobsLoading || eventsLoading;

  const renderNewsForm = (item?: NewsArticle) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        if (item) {
          handleUpdate(item.id, formData);
        } else {
          handleCreate(formData);
        }
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={item?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="excerpt">Excerpt</Label>
        <Input
          id="excerpt"
          name="excerpt"
          defaultValue={item?.excerpt}
          required
        />
      </div>
      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          name="content"
          defaultValue={item?.content}
          rows={6}
          required
        />
      </div>
      <div>
        <Label htmlFor="status">Status</Label>
        <select
          id="status"
          name="status"
          defaultValue={item?.status || 'draft'}
          className="w-full p-2 border rounded-md"
        >
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={createNewsMutation.isPending || updateNewsMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          {item ? 'Update' : 'Create'}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreating(false);
            setEditingItem(null);
          }}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );

  const renderJobForm = (item?: JobPost) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleCreate(formData);
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="title">Job Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={item?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="company">Company</Label>
        <Input
          id="company"
          name="company"
          defaultValue={item?.company}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={item?.location}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={item?.description}
          rows={4}
          required
        />
      </div>
      <div>
        <Label htmlFor="requirements">Requirements</Label>
        <Textarea
          id="requirements"
          name="requirements"
          defaultValue={item?.requirements}
          rows={3}
          required
        />
      </div>
      <div>
        <Label htmlFor="contact_email">Contact Email</Label>
        <Input
          id="contact_email"
          name="contact_email"
          type="email"
          defaultValue={item?.contact_email}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={createJobMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          Create Job Posting
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreating(false)}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );

  const renderEventForm = (item?: Event) => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        handleCreate(formData);
      }}
      className="space-y-4"
    >
      <div>
        <Label htmlFor="title">Event Title</Label>
        <Input
          id="title"
          name="title"
          defaultValue={item?.title}
          required
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={item?.description}
          rows={3}
          required
        />
      </div>
      <div>
        <Label htmlFor="date">Date & Time</Label>
        <Input
          id="date"
          name="date"
          type="datetime-local"
          defaultValue={item?.date}
          required
        />
      </div>
      <div>
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          name="location"
          defaultValue={item?.location}
          required
        />
      </div>
      <div>
        <Label htmlFor="organizer">Organizer</Label>
        <Input
          id="organizer"
          name="organizer"
          defaultValue={item?.organizer}
          required
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={createEventMutation.isPending}>
          <Save className="w-4 h-4 mr-2" />
          Create Event
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => setIsCreating(false)}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
      </div>
    </form>
  );

  return (
    <div className="space-y-6">
      {/* Section Navigation */}
      <div className="flex space-x-1 bg-muted p-1 rounded-lg">
        {[
          { key: 'news', label: 'News Articles', icon: FileText },
          { key: 'jobs', label: 'Job Postings', icon: Briefcase },
          { key: 'events', label: 'Events', icon: Calendar },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => {
              setActiveSection(key as any);
              setIsCreating(false);
              setEditingItem(null);
            }}
            className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md transition-colors ${
              activeSection === key
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {/* Create New Button */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">
          {activeSection === 'news' && 'News Articles'}
          {activeSection === 'jobs' && 'Job Postings'}
          {activeSection === 'events' && 'Events'}
        </h3>
        <Button
          onClick={() => setIsCreating(true)}
          className="bg-[#E10600] hover:bg-[#C10500]"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>
              Create New {activeSection === 'news' ? 'Article' : activeSection === 'jobs' ? 'Job Posting' : 'Event'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSection === 'news' && renderNewsForm()}
            {activeSection === 'jobs' && renderJobForm()}
            {activeSection === 'events' && renderEventForm()}
          </CardContent>
        </Card>
      )}

      {/* Content List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#E10600]"></div>
          </div>
        ) : (
          <>
            {activeSection === 'news' && news?.map((article) => (
              <Card key={article.id}>
                <CardContent className="p-6">
                  {editingItem?.id === article.id ? (
                    renderNewsForm(article)
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="space-y-2">
                        <h4 className="font-semibold">{article.title}</h4>
                        <p className="text-sm text-muted-foreground">{article.excerpt}</p>
                        <div className="flex gap-2">
                          <Badge variant={article.status === 'published' ? 'default' : 'secondary'}>
                            {article.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {new Date(article.created_at).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingItem(article)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteNewsMutation.mutate(article.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}

            {activeSection === 'jobs' && jobs?.map((job) => (
              <Card key={job.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{job.title}</h4>
                      <p className="text-sm text-muted-foreground">{job.company} • {job.location}</p>
                      <p className="text-sm">{job.description.substring(0, 100)}...</p>
                      <div className="flex gap-2">
                        <Badge variant={job.status === 'active' ? 'default' : 'secondary'}>
                          {job.status}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {new Date(job.created_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeSection === 'events' && events?.map((event) => (
              <Card key={event.id}>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <h4 className="font-semibold">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        {new Date(event.date).toLocaleDateString()} • 
                        <MapPin className="w-4 h-4 inline ml-2 mr-1" />
                        {event.location}
                      </p>
                      <p className="text-sm">{event.description}</p>
                      <Badge variant={
                        event.status === 'upcoming' ? 'default' :
                        event.status === 'completed' ? 'secondary' : 'destructive'
                      }>
                        {event.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default SecretaryContentManagement;