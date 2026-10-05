import { z } from 'zod';
import { todayYmd } from './format';

export const phoneRule = z
    .string()
    .trim()
    .regex(/^\+?[0-9\s-]{8,16}$/, 'Please enter a valid phone number (e.g. +91 98765 43210)');

export const optionalPhone = z
    .string()
    .trim()
    .refine((v) => !v || /^\+?[0-9\s-]{8,16}$/.test(v), 'Please enter a valid phone number');

export const emailRule = z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Please enter a valid email address')
    .max(190);

export const bookingDetailsSchema = z
    .object({
        serviceId: z.string().optional(),
        packageId: z.string().optional(),
        eventType: z.string().trim().min(2, 'Please select or specify the type of event').max(60),
        eventDate: z
            .string()
            .min(1, 'Please select your preferred event date')
            .refine((v) => v >= todayYmd(), 'The event date cannot be in the past'),
        startTime: z.string().optional(),
        endTime: z.string().optional(),
        venue: z.string().trim().max(255).optional(),
        guests: z
            .string()
            .optional()
            .refine((v) => !v || (/^\d+$/.test(v) && Number(v) <= 100000), 'Please enter an estimated number of guests'),
        message: z.string().trim().max(3000).optional(),
    })
    .refine((v) => !v.startTime || !v.endTime || v.endTime > v.startTime, {
        path: ['endTime'],
        message: 'End time must be later than start time',
    });

export type BookingDetailsForm = z.infer<typeof bookingDetailsSchema>;

export const bookingPayload = (v: BookingDetailsForm) => ({
    serviceId: v.serviceId ? Number(v.serviceId) : null,
    packageId: v.packageId ? Number(v.packageId) : null,
    eventType: v.eventType,
    eventDate: v.eventDate,
    startTime: v.startTime || null,
    endTime: v.endTime || null,
    venue: v.venue || null,
    guests: v.guests ? Number(v.guests) : null,
    message: v.message || null,
});

export const EVENT_TYPES = [
    'Wedding Ceremony & Reception',
    'Engagement & Ring Ceremony',
    'Pre-Wedding Creative Shoot',
    'Maternity & Newborn Session',
    'Family & Portrait Session',
    'Birthday & Milestone Celebration',
    'Corporate Event & Gala',
    'Commercial & Product Shoot',
    'Custom Celebration',
];
