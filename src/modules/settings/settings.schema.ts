import { z } from 'zod';

export const patchUserSettingsSchema = z.object({
  theme: z.string().optional(),
  language: z.string().optional(),
  notifications_email: z.string().optional(),
  notifications_browser: z.string().optional(),
  default_application_status: z.string().optional(),
  pagination_size: z.string().optional(),
});
