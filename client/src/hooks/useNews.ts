import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { createRealtimeSubscription } from '@/lib/realtime';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  is_published: boolean;
  published_at: string;
  updated_at: string;
  author_id: string;
  members?: {
    full_name: string;
    photo_url?: string;
  };
}

export const useNews = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('news')
        .select(`
          *,
          members!author_id (
            full_name,
            photo_url
          )
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false });

      if (error) throw error;
      setNews(data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();

    // Set up real-time subscription
    const channel = createRealtimeSubscription({
      table: 'news',
      callback: () => fetchNews()
    });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { news, loading, error, refetch: fetchNews };
};