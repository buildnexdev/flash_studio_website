import { zodResolver } from '@hookform/resolvers/zod';
import { CalendarCheck2, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'react-router';
import { z } from 'zod';
import { BookingFields } from '../components/BookingFields';
import { FormGrid, Input } from '../components/form';
import { Alert, Button, ButtonLink } from '../components/ui';
import { homeFor, useAuth } from '../hooks/useAuth';
import { useSeo } from '../hooks/useSeo';
import { useSite } from '../hooks/useSite';
import { useToast } from '../hooks/useToast';
import { PageHero } from '../sections/PageHero';
import { Section } from '../sections/Section';
import { applyFieldErrors, errorMessage } from '../services/api';
import { siteService } from '../services/siteService';
import { bookingDetailsSchema, bookingPayload, emailRule, phoneRule } from '../utils/validation';

const enquirySchema = bookingDetailsSchema.and(
    z.object({
        name: z.string().trim().min(2, 'Please enter your full name').max(120),
        email: emailRule,
        phone: phoneRule,
        city: z.string().trim().max(80).optional(),
        website: z.string().max(0).optional(),
    }),
);

type EnquiryFormValues = z.infer<typeof enquirySchema>;

export default function Book() {
    const site = useSite();
    const { studio, services, packages } = site.data;
    const { user } = useAuth();
    const [params] = useSearchParams();
    const toast = useToast();

    useSeo({
        title: `Book a Session | ${studio.name || 'FlashLight Photography'}`,
        description: 'Check date availability and request a comprehensive photography proposal. Transparent rates, fast response.',
        keywords: 'book wedding photographer, photography session enquiry, wedding photography booking, photo shoot reservation',
    });

    const [submissionCompleted, setSubmissionCompleted] = useState<{
        bookingNo: string;
        message: string;
    } | null>(null);
    const [formGeneralError, setFormGeneralError] = useState('');

    const {
        register,
        handleSubmit,
        watch,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<EnquiryFormValues>({
        resolver: zodResolver(enquirySchema),
        defaultValues: {
            packageId: params.get('package') ?? '',
            serviceId: params.get('service') ?? '',
            name: user?.name ?? '',
            email: user?.email ?? '',
            phone: user?.phone ?? '',
        },
    });

    const onSubmit = handleSubmit(async (values) => {
        setFormGeneralError('');
        try {
            const { data, message } = await siteService.sendEnquiry({
                ...bookingPayload(values),
                name: values.name,
                email: values.email,
                phone: values.phone,
                city: values.city || null,
                website: values.website ?? '',
            });

            setSubmissionCompleted({
                bookingNo: data.bookingNo,
                message: message || 'Your booking inquiry has been recorded successfully.',
            });
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
            if (!applyFieldErrors(err, setError as never)) {
                setFormGeneralError(errorMessage(err));
            } else {
                toast.error('Please correct the highlighted form fields.');
            }
        }
    });

    return (
        <>
            <PageHero
                eyebrow="Date Reservation"
                title="Reserve Your Photography Session"
                subtitle="Provide your celebration parameters below. Our studio coordinator will check master calendar availability and return a comprehensive quotation within 24 hours."
            />

            <Section>
                <div className="mx-auto max-w-3xl">
                    {submissionCompleted ? (
                        <div className="card p-10 sm:p-14 text-center border-emerald-200 bg-emerald-50/20 shadow-md">
                            <span className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                                <CheckCircle2 className="size-10" />
                            </span>
                            <h2 className="mt-5 font-display text-3xl font-bold text-stone-900">
                                Booking Inquiry Received
                            </h2>
                            <p className="mt-3 text-stone-600 max-w-lg mx-auto leading-relaxed">
                                {submissionCompleted.message}
                            </p>
                            <div className="mt-6 inline-block rounded-xl border border-stone-200 bg-white px-6 py-3 shadow-xs">
                                <span className="text-xs uppercase tracking-wider text-stone-400 font-medium block">
                                    Official Reference Number
                                </span>
                                <span className="font-mono text-xl font-bold text-brand-700">
                                    {submissionCompleted.bookingNo}
                                </span>
                            </div>

                            <p className="mt-6 text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
                                A confirmation has been transmitted to your email address. Our team will contact you directly to confirm logistics.
                            </p>

                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                {user ? (
                                    <ButtonLink to={homeFor(user)} variant="primary">
                                        View in Client Portal
                                    </ButtonLink>
                                ) : (
                                    <a
                                        href="/login"
                                        className="inline-flex items-center justify-center rounded-lg bg-brand-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-800 transition-colors"
                                    >
                                        Client Sign In
                                    </a>
                                )}
                                <ButtonLink to="/" variant="secondary">
                                    Return to Home
                                </ButtonLink>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={onSubmit} noValidate className="card p-8 sm:p-12 space-y-10 shadow-sm border-stone-200">
                            {formGeneralError && <Alert tone="error">{formGeneralError}</Alert>}

                            {/* Section 1: Contact Details */}
                            <fieldset>
                                <div className="border-b border-stone-100 pb-3 mb-6">
                                    <legend className="font-display text-xl font-semibold text-stone-900">
                                        1. Primary Contact Information
                                    </legend>
                                    <p className="text-xs text-stone-500 mt-1">
                                        We will send your formal quote and date verification to these contact coordinates.
                                    </p>
                                </div>
                                <FormGrid>
                                    <Input
                                        label="Full Name"
                                        required
                                        autoComplete="name"
                                        {...register('name')}
                                        error={errors.name?.message}
                                        placeholder="e.g., Priya & Arjun"
                                    />
                                    <Input
                                        label="Primary Phone Number"
                                        required
                                        type="tel"
                                        autoComplete="tel"
                                        {...register('phone')}
                                        error={errors.phone?.message}
                                        placeholder="e.g., +91 98765 43210"
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
                                        label="City / Region"
                                        autoComplete="address-level2"
                                        {...register('city')}
                                        error={errors.city?.message}
                                        placeholder="e.g., Chennai"
                                    />
                                </FormGrid>

                                {/* Anti-bot Honeypot */}
                                <div className="hidden" aria-hidden="true">
                                    <input tabIndex={-1} autoComplete="off" {...register('website')} />
                                </div>
                            </fieldset>

                            {/* Section 2: Event Details */}
                            <fieldset>
                                <div className="border-b border-stone-100 pb-3 mb-6">
                                    <legend className="font-display text-xl font-semibold text-stone-900">
                                        2. Celebration & Schedule Details
                                    </legend>
                                    <p className="text-xs text-stone-500 mt-1">
                                        Specify the timeline, venue location, and package scope to receive an accurate breakdown.
                                    </p>
                                </div>
                                <BookingFields
                                    register={register}
                                    errors={errors}
                                    watch={watch}
                                    services={services}
                                    packages={packages}
                                />
                            </fieldset>

                            {/* Trust Badge & Submit Action */}
                            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-6 border-t border-stone-100 pt-6">
                                <div className="flex items-center gap-2 text-xs text-stone-500">
                                    <ShieldCheck className="size-4 text-emerald-600 shrink-0" />
                                    <span>No obligations · Date confirmation within 24 hours</span>
                                </div>
                                <Button type="submit" size="lg" loading={isSubmitting} className="w-full sm:w-auto shadow-md">
                                    <CalendarCheck2 className="size-5 mr-2" />
                                    Submit Booking Request
                                </Button>
                            </div>
                        </form>
                    )}
                </div>
            </Section>
        </>
    );
}
