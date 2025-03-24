import { z } from 'zod';

export const userSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().positive().optional(),
  address: z.string().optional(),
  numberOfRents: z.number().default(0),
  recentlyActive: z.number().default(() => Date.now() / 1000),
  totalAverageWeightRatings: z.number().default(0.0),
  totalPotential: z.number().optional().default(0),
});

export type User = z.infer<typeof userSchema>;
