import { Download, Heart, QrCode, ShieldCheck } from 'lucide-react';
import { Section } from './Section';

const FEATURES = [
    {
        icon: QrCode,
        title: 'Instant QR Live Gallery',
        description: 'Guests simply scan a table or invitation QR code to experience and download event photographs live as our team captures them.',
    },
    {
        icon: Heart,
        title: 'Effortless Curation & Favorites',
        description: 'Bookmark preferred shots from any device and curate your personalized print album directly with our design department.',
    },
    {
        icon: Download,
        title: 'Studio-Grade HD Downloads',
        description: 'Seamlessly access full-resolution digital deliverables protected by high-speed global cloud delivery.',
    },
    {
        icon: ShieldCheck,
        title: 'Encrypted Privacy Controls',
        description: 'Every event gallery remains secure with session-controlled access, expirable links, and granular customer permissions.',
    },
];

export function ExperienceSection() {
    return (
        <Section
            dark
            eyebrow="The Client Experience"
            title="Your Event Gallery, Live as It Unfolds"
            subtitle="We bridge artistic craftsmanship with modern technology so you and your attendees relive memories without waiting weeks."
        >
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {FEATURES.map((item) => {
                    const Icon = item.icon;
                    return (
                        <div
                            key={item.title}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-200 hover:border-brand-500/40 hover:bg-white/[0.08]"
                        >
                            <span className="flex size-12 items-center justify-center rounded-xl bg-brand-500/20 text-brand-400">
                                <Icon className="size-6" />
                            </span>
                            <h3 className="mt-5 text-lg font-semibold text-white">{item.title}</h3>
                            <p className="mt-2.5 text-sm leading-relaxed text-stone-300">{item.description}</p>
                        </div>
                    );
                })}
            </div>
        </Section>
    );
}
