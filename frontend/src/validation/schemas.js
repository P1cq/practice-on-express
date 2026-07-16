import { z } from 'zod';

// Mirrors the backend Joi rules exactly (src/modules/auth/auth.validation.js,
// src/common/index.js genralScema) so the client can fail fast with the same
// rules the server will ultimately enforce. The server remains authoritative.

const EMAIL_PATTERN = /^\w{3,80}@(gmail|yahoo)(\.com|\.net|\.eu){1,3}/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PHONE_PATTERN = /^01[0-5][0-9]{8}$/;

export const nameSchema = z
  .string()
  .trim()
  .min(3, 'Name must be at least 3 characters')
  .max(20, 'Name must be at most 20 characters');

export const emailSchema = z
  .string()
  .trim()
  .regex(EMAIL_PATTERN, 'Must be a valid gmail/yahoo address');

export const passwordSchema = z
  .string()
  .regex(
    PASSWORD_PATTERN,
    'Password must include an uppercase, lowercase, digit, special character and be at least 8 characters',
  );

export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^[0-9]+$/, 'OTP must be numeric');

export const messageContentSchema = z
  .string()
  .trim()
  .min(3, 'Message must be at least 3 characters')
  .max(2000, 'Message must be at most 2000 characters');

export const signupSchema = z
  .object({
    name: nameSchema,
    email: emailSchema,
    password: passwordSchema,
    rePassword: z.string(),
    phoneNumber: z.string().regex(PHONE_PATTERN, 'Invalid Egyptian phone number').optional().or(z.literal('')),
    gender: z.number().int().min(0).max(1),
  })
  .refine((data) => data.password === data.rePassword, {
    message: 'Passwords do not match',
    path: ['rePassword'],
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

// Returns { field: message } for the first error per field, or null if valid.
export function validateWithZod(schema, data) {
  const result = schema.safeParse(data);
  if (result.success) return null;

  const errors = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] ?? '_root';
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
