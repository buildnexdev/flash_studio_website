import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { FormGrid, Input, Textarea } from '../components/form';
import { Alert, Button } from '../components/ui';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';
import { applyFieldErrors, errorMessage } from '../services/api';
import { siteService } from '../services/siteService';
import { emailRule, optionalPhone } from '../utils/validation';

const contactSchema = z.object({
    name: z.string().trim().min(2, 'Please enter your full name').max(120),
    email: emailRule,
    phone: optionalPhone.optional(),
    subject: z.string().trim().min(3, 'Please provide a short inquiry subject').max(160),
    message: z.string().trim().min(10, 'Please share additional details (at least 10 characters)').max(3000),
    website: z.string().max(0).optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Contact() {
    const site = useSite();
    const studio = site.data.studio;
    const [submissionResult, setSubmissionResult] = useState<{ tone: 'success' | 'error'; text: string } | null>(null);

    useSeo({
        title: `Contact Us | ${studio.name || 'FlashLight Photography'}`,
        description: 'Have questions about dates, photography packages, or your event gallery? Reach out to our studio team today.',
        keywords: 'contact photographer, photography studio phone, studio address, photography consultation',
    });

    const {
        register,
        handleSubmit,
        reset,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<ContactFormValues>({
        resolver: zodResolver(contactSchema),
    });

    const onSubmit = handleSubmit(async (values) => {
        setSubmissionResult(null);
        try {
            const { message } = await siteService.sendContact({
                name: values.name,
                email: values.email,
                phone: values.phone || null,
                subject: values.subject,
                message: values.message,
                website: values.website ?? '',
            });
            setSubmissionResult({
                tone: 'success',
                text: message || 'Thank you for reaching out. We have received your message and will respond within 24 hours.',
            });
            reset();
        } catch (err) {
            if (!applyFieldErrors(err, setError as never)) {
                setSubmissionResult({ tone: 'error', text: errorMessage(err) });
            }
        }
    });

    const cleanWhatsApp = studio.whatsapp ? studio.whatsapp.replace(/[^\d]/g, '') : '';

    return (
        <>
            <PageHero
                eyebrow="Studio Concierge"
                title="Get in Touch with Our Team"
                subtitle="Have inquiries regarding date availability, custom package arrangements, or gallery access? We are delighted to assist you."
            />

            <Section>
                <div className="grid gap-12 lg:grid-cols-5 items-start">
                    {/* Left Column: Direct Studio Information */}
                    <div className="space-y-4 lg:col-span-2">
                        {studio.address && (
                            <InfoCard icon={MapPin} title="Studio Location">
                                <p>{studio.address}</p>
                                {studio.city && <p className="text-stone-500">{studio.city}</p>}
                                {studio.mapUrl && (
                                    <a
                                        href={studio.mapUrl}
                                        target="_blank"
                                        rel="noreferrer noopener"
                                        className="link mt-2 inline-block text-xs"
                                    >
                                        Open in Maps →
                                    </a>
                                )}
                            </InfoCard>
                        )}

                        {studio.phone && (
                            <InfoCard icon={Phone} title="Telephone Inquiries">
                                <a href={`tel:${studio.phone}`} className="link text-stone-900 font-medium">
                                    {studio.phone}
                                </a>
                                <p className="text-xs text-stone-500 mt-1">Available during working hours</p>
                            </InfoCard>
                        )}

                        {cleanWhatsApp && (
                            <InfoCard icon={MessageCircle} title="WhatsApp Concierge">
                                <a
                                    href={`https://wa.me/${cleanWhatsApp}`}
                                    target="_blank"
                                    rel="noreferrer noopener"
                                    className="link text-emerald-700 font-medium"
                                >
                                    Chat with Booking Coordinator →
                                </a>
                                <p className="text-xs text-stone-500 mt-1">Fast response for schedule confirmations</p>
                            </InfoCard>
                        )}

                        {studio.email && (
                            <InfoCard icon={Mail} title="Email Communication">
                                <a href={`mailto:${studio.email}`} className="link text-stone-900 font-medium">
                                    {studio.email}
                                </a>
                                <p className="text-xs text-stone-500 mt-1">Inquiries answered within 1 business day</p>
                            </InfoCard>
                        )}

                        {studio.hours && (
                            <InfoCard icon={Clock} title="Consultation Hours">
                                <p>{studio.hours}</p>
                                <p className="text-xs text-stone-500 mt-1">In-studio sessions by advance booking</p>
                            </InfoCard>
                        )}
                    </div>

                    {/* Right Column: Interactive Contact Form */}
                    <div className="card p-8 sm:p-10 lg:col-span-3 shadow-sm border-stone-200">
                        <h2 className="font-display text-2xl font-semibold text-stone-900 mb-2">
                            Send Us a Direct Message
                        </h2>
                        <p className="text-sm text-stone-600 mb-6">
                            Fill out the inquiry form below and our studio coordinator will reach out promptly.
                        </p>

                        {submissionResult && (
                            <div className="mb-6">
                                <Alert tone={submissionResult.tone}>{submissionResult.text}</Alert>
                            </div>
                        )}

                        <form onSubmit={onSubmit} noValidate className="space-y-6">
                            <FormGrid>
                                <Input
                                    label="Your Full Name"
                                    required
                                    autoComplete="name"
                                    {...register('name')}
                                    error={errors.name?.message}
                                    placeholder="e.g., Priya Sharma"
                                />
                                <Input
                                    label="Email Address"
                                    required
                                    type="email"
                                    autoComplete="email"
                                    {...register('email')}
                                    error={errors.email?.message}
                                    placeholder="e.g., priya@example.com"
                                />
                                <Input
                                    label="Phone Number"
                                    type="tel"
                                    autoComplete="tel"
                                    {...register('phone')}
                                    error={errors.phone?.message}
                                    placeholder="e.g., +91 98765 43210"
                                />
                                <Input
                                    label="Inquiry Subject"
                                    required
                                    {...register('subject')}
                                    error={errors.subject?.message}
                                    placeholder="e.g., Wedding Photography Quote"
                                />
                            </FormGrid>

                            <Textarea
                                label="Your Message or Event Scope"
                                required
                                rows={5}
                                {...register('message')}
                                error={errors.message?.message}
                                placeholder="Please describe your event location, dates, expected guest count, and any specific questions you have..."
                            />

                            {/* Honeypot anti-spam input */}
                            <div className="hidden" aria-hidden="true">
                                <input tabIndex={-1} autoComplete="off" {...register('website')} />
                            </div>

                            <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
                                <Send className="size-4 mr-2" />
                                Send Message
                            </Button>
                        </form>
                    </div>
                </div>
            </Section>
        </>
    );
}

function InfoCard({
    icon: Icon,
    title,
    children,
}: {
    icon: typeof Phone;
    title: string;
    children: React.ReactNode;
}) {
    return (
        <div className="card flex items-start gap-4 p-5">
            <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700">
                <Icon className="size-5" />
            </span>
            <div className="text-sm flex-1">
                <p className="font-semibold text-stone-900">{title}</p>
                <div className="mt-1 text-stone-600">{children}</div>
            </div>
        </div>
    );
}
