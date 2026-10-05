import type { FieldErrors, UseFormRegister, UseFormWatch } from 'react-hook-form';
import type { Package, Service } from '../services/siteService';
import { money, todayYmd } from '../utils/format';
import { EVENT_TYPES, type BookingDetailsForm } from '../utils/validation';
import { FormGrid, Input, Select, Textarea } from './form';

export function BookingFields<T extends BookingDetailsForm>({
    register,
    errors,
    watch,
    services,
    packages,
}: {
    register: UseFormRegister<T>;
    errors: FieldErrors<T>;
    watch: UseFormWatch<T>;
    services: Service[];
    packages: Package[];
}) {
    const reg = register as unknown as UseFormRegister<BookingDetailsForm>;
    const err = errors as FieldErrors<BookingDetailsForm>;
    const serviceId = (watch as unknown as UseFormWatch<BookingDetailsForm>)('serviceId');
    const pkgOptions = packages.filter((p) => !serviceId || !p.service_id || String(p.service_id) === serviceId);

    return (
        <FormGrid>
            <Select
                label="Preferred Service"
                {...reg('serviceId')}
                placeholder="Choose a service (or discuss during consultation)"
                options={services.map((s) => ({ value: s.id, label: s.name }))}
                error={err.serviceId?.message}
            />
            <Select
                label="Select Package"
                {...reg('packageId')}
                placeholder="Select a package (or request custom proposal)"
                options={pkgOptions.map((p) => ({ value: p.id, label: `${p.name} · ${money(p.price, true)}` }))}
                error={err.packageId?.message}
            />
            <div>
                <Input
                    label="Event Type"
                    required
                    list="event-types"
                    {...reg('eventType')}
                    error={err.eventType?.message}
                    placeholder="e.g., Wedding Ceremony, Pre-Wedding, Gala"
                />
                <datalist id="event-types">
                    {EVENT_TYPES.map((t) => (
                        <option key={t} value={t} />
                    ))}
                </datalist>
            </div>
            <Input
                label="Event Date"
                type="date"
                required
                min={todayYmd()}
                {...reg('eventDate')}
                error={err.eventDate?.message}
            />
            <Input label="Estimated Start Time" type="time" {...reg('startTime')} error={err.startTime?.message} />
            <Input label="Estimated End Time" type="time" {...reg('endTime')} error={err.endTime?.message} />
            <Input
                label="Event Venue & City"
                {...reg('venue')}
                error={err.venue?.message}
                placeholder="e.g., Leela Palace, Chennai"
            />
            <Input
                label="Approximate Guest Count"
                inputMode="numeric"
                {...reg('guests')}
                error={err.guests?.message}
                placeholder="e.g., 250"
            />
            <Textarea
                label="Special Requirements or Vision"
                wrapperClassName="sm:col-span-2"
                {...reg('message')}
                error={err.message?.message}
                placeholder="Please share any key details, specific rituals, preferred photography styles, or questions you have for our team..."
                rows={4}
            />
        </FormGrid>
    );
}
