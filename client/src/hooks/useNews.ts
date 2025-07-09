import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
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
      const data = await api.getPublishedNews();
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
      if (channel && typeof channel.unsubscribe === 'function') {
        channel.unsubscribe();
      }
    };
  }, []);

  return { news, loading, error, refetch: fetchNews };
};