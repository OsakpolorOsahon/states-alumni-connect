import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { db } from '@/lib/supabase'

export const useNews = () => {
  return useQuery({
    queryKey: ['news'],
    queryFn: async () => {
      const result = await db.getNews()
      if (result.error) throw new Error(result.error.message)
      return result.data || []
    }
  })
}

export const useCreateNews = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (newsData: any) => {
      const result = await db.createNews(newsData)
      if (result.error) throw new Error(result.error.message)
      return result.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['news'] })
    }
  })
}