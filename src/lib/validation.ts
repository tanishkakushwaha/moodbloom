import { z } from 'zod';
export const moodValues = ['happy', 'calm', 'loved', 'excited', 'tired', 'sad', 'anxious', 'angry'] as const;
export const dateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Choose a valid date').refine(v => {
    const d = new Date(`${v}T12:00:00Z`);
    return !isNaN(d.getTime()) && d.toISOString().slice(0, 10) === v;
}, 'Choose a valid date');
export const emailSchema = z.string().trim().email('Enter a valid email address').max(254).transform(s => s.toLowerCase());
export const passwordSchema = z.string().min(10, 'Use at least 10 characters').max(128, 'Use at most 128 characters');
export const signupSchema = z.object({ name: z.string().trim().min(2, 'Tell us your name').max(60), email: emailSchema, password: passwordSchema });
export const loginSchema = z.object({ email: emailSchema, password: z.string().min(1).max(128) });
export const loginFormSchema = loginSchema.extend({ name: z.string().trim().max(60) });
export const moodSchema = z.object({ date: dateSchema, mood: z.enum(moodValues), note: z.string().trim().max(500).default('') });
export const diarySchema = z.object({ title: z.string().trim().min(1, 'Give your entry a title').max(150), content: z.string().trim().min(1, 'Your page is waiting for a few words').max(50000), date: dateSchema, mood: z.enum(moodValues).nullable().optional(), tags: z.array(z.string().trim().min(1).max(30)).max(8).default([]) });
export const profileSchema = z.object({ name: z.string().trim().min(2).max(60), image: z.union([z.literal(''), z.string().url().max(2048).refine(s => s.startsWith('https://'), 'Use an HTTPS image URL')]).optional(), theme: z.enum(['light', 'dark', 'system']).optional() });
export const passwordChangeSchema = z.object({ currentPassword: z.string().min(1).max(128), newPassword: passwordSchema });
