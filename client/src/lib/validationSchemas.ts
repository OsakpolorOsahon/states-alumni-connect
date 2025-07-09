
import { z } from 'zod';

export const signUpSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  nickname: z.string().optional(),
  stateship_year: z.string().min(1, 'Please select your stateship year'),
  last_mowcub_position: z.string().min(1, 'Please select your last MOWCUB position'),
  current_council_office: z.string().optional(),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  location: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  nickname: z.string().optional(),
  phone: z.string().optional(),
  occupation: z.string().optional(),
  employer: z.string().optional(),
  location: z.string().optional(),
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
});

export const newsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  excerpt: z.string().max(200, 'Excerpt must be less than 200 characters').optional(),
  tags: z.array(z.string()).optional(),
});

export const eventSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  event_date: z.string().min(1, 'Event date is required'),
  location: z.string().min(1, 'Location is required'),
  registration_required: z.boolean().optional(),
});

export const hallOfFameSchema = z.object({
  member_id: z.string().min(1, 'Please select a member'),
  achievement_title: z.string().min(5, 'Achievement title must be at least 5 characters'),
  achievement_description: z.string().min(20, 'Description must be at least 20 characters'),
  achievement_date: z.string().optional(),
  category: z.enum(['Academic', 'Leadership', 'Innovation', 'Service', 'Other']),
});

export const forumThreadSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
});

export const forumReplySchema = z.object({
  content: z.string().min(10, 'Reply must be at least 10 characters'),
});

export const resetPasswordSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});
