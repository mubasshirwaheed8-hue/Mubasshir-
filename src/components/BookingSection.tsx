import { useEffect, useState, type FormEvent } from 'react';
import { Calendar, CheckCircle2, Mail, AlertCircle } from 'lucide-react';
import { IMAGES, SERVICES, STUDIO_DEMO_CONTACT } from '../data/salonData';

interface BookingSectionProps {
  preselectedService: string;
}

interface BookingFormState {
  fullName: string;
  email: string;
  phone: string;
  service: string;
  preferredDate: string;
  message: string;
}

type FormErrors = Partial<Record<keyof BookingFormState, string>>;

export function BookingSection({ preselectedService }: BookingSectionProps) {
  const todayIso = new Date().toISOString().split('T')[0];

  const [form, setForm] = useState<BookingFormState>({
    fullName: '',
    email: '',
    phone: '',
    service: preselectedService || SERVICES[0].title,
    preferredDate: '',
    message: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [submittedEnquiry, setSubmittedEnquiry] = useState<BookingFormState | null>(null);

  useEffect(() => {
    if (preselectedService) {
      setForm((prev) => ({ ...prev, service: preselectedService }));
      setSubmittedEnquiry(null);
    }
  }, [preselectedService]);

  const validate = (data: BookingFormState): FormErrors => {
    const nextErrors: FormErrors = {};

    if (!data.fullName.trim() || data.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }

    const digitsOnly = data.phone.replace(/\D/g, '');
    if (digitsOnly.length < 7) {
      nextErrors.phone = 'Please enter a valid contact phone number.';
    }

    if (!data.service) {
      nextErrors.service = 'Please choose a preferred service.';
    }

    if (!data.preferredDate) {
      nextErrors.preferredDate = 'Please select a preferred appointment date.';
    } else if (data.preferredDate < todayIso) {
      nextErrors.preferredDate = 'Please choose today or a future date.';
    }

    return nextErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate(form);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setSubmittedEnquiry({ ...form });
  };

  const buildMailtoHref = (enquiry: BookingFormState) => {
    const subject = encodeURIComponent(
      `LUMIÈRE Appointment Enquiry — ${enquiry.service} (${enquiry.fullName})`
    );
    const body = encodeURIComponent(
      [
        `Hello LUMIÈRE Concierge,`,
        ``,
        `I would like to request an appointment with the following details:`,
        `Full Name: ${enquiry.fullName}`,
        `Email: ${enquiry.email}`,
        `Phone: ${enquiry.phone}`,
        `Preferred Service: ${enquiry.service}`,
        `Preferred Date: ${enquiry.preferredDate}`,
        `Additional Notes: ${enquiry.message || 'None provided'}`,
      ].join('\n')
    );
    return `mailto:${STUDIO_DEMO_CONTACT.email}?subject=${subject}&body=${body}`;
  };

  const inputBaseClass =
    'w-full border bg-[#090909]/85 px-4 py-3 text-sm text-[#F3EEE6] placeholder-[#AAA39A]/55 transition-colors duration-200 focus:border-[#C9A875] focus:outline-none';

  return (
    <section
      id="booking"
      className="relative scroll-mt-20 overflow-hidden border-t border-[#C9A875]/15 bg-[#090909] py-24 sm:py-32 lg:py-36"
    >
      {/* Atmospheric Background Photography + Champagne Lighting Scrim */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <img
          src={IMAGES.salonInterior}
          alt=""
          loading="lazy"
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#090909]/95 via-[#090909]/88 to-[#11100F]/95" />
        <div className="absolute -top-40 right-0 h-[520px] w-[520px] rounded-full bg-[#C9A875]/8 blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Editorial Invitation */}
          <div className="flex flex-col justify-between lg:col-span-5">
            <div>
              <p className="text-[11px] font-medium tracking-[0.28em] text-[#C9A875] uppercase">
                PRIVATE CONSULTATION & BOOKING
              </p>

              <h2 className="mt-5 font-serif text-[clamp(2.1rem,4vw,3.5rem)] leading-[1.08] font-normal text-[#F3EEE6]">
                READY FOR YOUR
                <br />
                <span className="text-[#EAD5AD]">NEXT CHAPTER?</span>
              </h2>

              <p className="mt-6 max-w-md text-[15px] leading-[1.8] text-[#AAA39A] sm:text-base">
                Your next great hair experience starts with a conversation. Tell us what
                you have in mind and let our team help you find the perfect service.
              </p>
            </div>

            {/* Studio Hours & Honest Enquiry Info */}
            <div className="mt-10 space-y-6 border-t border-[#C9A875]/15 pt-8">
              <div>
                <p className="text-[11px] font-medium tracking-[0.22em] text-[#EAD5AD] uppercase">
                  Studio Hours (Demo Schedule)
                </p>
                <div className="mt-3 space-y-2 text-sm text-[#AAA39A]">
                  {STUDIO_DEMO_CONTACT.hours.map((row) => (
                    <div key={row.days} className="flex justify-between gap-4">
                      <span>{row.days}</span>
                      <span className="text-[#F3EEE6]/85 tabular-nums">{row.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Form Container */}
          <div className="border border-[#C9A875]/20 bg-[#11100F]/92 p-6 backdrop-blur-md sm:p-10 lg:col-span-7">
            {!submittedEnquiry ? (
              <form onSubmit={handleSubmit} noValidate className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Full Name */}
                  <div>
                    <label
                      htmlFor="booking-fullName"
                      className="mb-2 block text-[11px] font-medium tracking-[0.2em] text-[#EAD5AD] uppercase"
                    >
                      Full Name <span className="text-[#C9A875]">*</span>
                    </label>
                    <input
                      id="booking-fullName"
                      type="text"
                      required
                      value={form.fullName}
                      onChange={(e) => {
                        setForm({ ...form, fullName: e.target.value });
                        if (errors.fullName) setErrors({ ...errors, fullName: undefined });
                      }}
                      placeholder="Camille Laurent"
                      aria-invalid={Boolean(errors.fullName)}
                      className={`${inputBaseClass} ${
                        errors.fullName ? 'border-amber-400/80' : 'border-[#C9A875]/22'
                      }`}
                    />
                    {errors.fullName && (
                      <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-300">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.fullName}</span>
                      </p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="booking-email"
                      className="mb-2 block text-[11px] font-medium tracking-[0.2em] text-[#EAD5AD] uppercase"
                    >
                      Email Address <span className="text-[#C9A875]">*</span>
                    </label>
                    <input
                      id="booking-email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => {
                        setForm({ ...form, email: e.target.value });
                        if (errors.email) setErrors({ ...errors, email: undefined });
                      }}
                      placeholder="camille@example.com"
                      aria-invalid={Boolean(errors.email)}
                      className={`${inputBaseClass} ${
                        errors.email ? 'border-amber-400/80' : 'border-[#C9A875]/22'
                      }`}
                    />
                    {errors.email && (
                      <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-300">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.email}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  {/* Phone */}
                  <div>
                    <label
                      htmlFor="booking-phone"
                      className="mb-2 block text-[11px] font-medium tracking-[0.2em] text-[#EAD5AD] uppercase"
                    >
                      Phone Number <span className="text-[#C9A875]">*</span>
                    </label>
                    <input
                      id="booking-phone"
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => {
                        setForm({ ...form, phone: e.target.value });
                        if (errors.phone) setErrors({ ...errors, phone: undefined });
                      }}
                      placeholder="+1 (212) 555-0194"
                      aria-invalid={Boolean(errors.phone)}
                      className={`${inputBaseClass} ${
                        errors.phone ? 'border-amber-400/80' : 'border-[#C9A875]/22'
                      }`}
                    />
                    {errors.phone && (
                      <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-300">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.phone}</span>
                      </p>
                    )}
                  </div>

                  {/* Preferred Date */}
                  <div>
                    <label
                      htmlFor="booking-date"
                      className="mb-2 block text-[11px] font-medium tracking-[0.2em] text-[#EAD5AD] uppercase"
                    >
                      Preferred Appointment Date <span className="text-[#C9A875]">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id="booking-date"
                        type="date"
                        required
                        min={todayIso}
                        value={form.preferredDate}
                        onChange={(e) => {
                          setForm({ ...form, preferredDate: e.target.value });
                          if (errors.preferredDate)
                            setErrors({ ...errors, preferredDate: undefined });
                        }}
                        aria-invalid={Boolean(errors.preferredDate)}
                        className={`${inputBaseClass} [color-scheme:dark] ${
                          errors.preferredDate ? 'border-amber-400/80' : 'border-[#C9A875]/22'
                        }`}
                      />
                    </div>
                    {errors.preferredDate && (
                      <p role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-300">
                        <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                        <span>{errors.preferredDate}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Preferred Service */}
                <div>
                  <label
                    htmlFor="booking-service"
                    className="mb-2 block text-[11px] font-medium tracking-[0.2em] text-[#EAD5AD] uppercase"
                  >
                    Preferred Service <span className="text-[#C9A875]">*</span>
                  </label>
                  <select
                    id="booking-service"
                    value={form.service}
                    onChange={(e) => setForm({ ...form, service: e.target.value })}
                    className={`${inputBaseClass} border-[#C9A875]/22`}
                  >
                    {SERVICES.map((srv) => (
                      <option key={srv.id} value={srv.title} className="bg-[#11100F] text-[#F3EEE6]">
                        {srv.number} — {srv.title}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Additional Message */}
                <div>
                  <label
                    htmlFor="booking-message"
                    className="mb-2 block text-[11px] font-medium tracking-[0.2em] text-[#EAD5AD] uppercase"
                  >
                    Additional Message
                  </label>
                  <textarea
                    id="booking-message"
                    rows={4}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Share your hair goals, inspiration, or preferred time of day..."
                    className={`${inputBaseClass} resize-none border-[#C9A875]/22`}
                  />
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="submit"
                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center gap-2.5 border border-[#C9A875] bg-[#C9A875] px-8 py-3.5 text-xs font-medium tracking-[0.2em] text-[#090909] uppercase whitespace-nowrap transition-colors duration-200 hover:bg-[#EAD5AD]"
                  >
                    <Calendar className="h-4 w-4" strokeWidth={1.6} />
                    <span>REQUEST AN APPOINTMENT</span>
                  </button>
                  <p className="text-xs text-[#AAA39A]">
                    Enquiry preview · Prepares a direct concierge email
                  </p>
                </div>
              </form>
            ) : (
              /* Honest Sample Confirmation + Mailto Fallback */
              <div className="space-y-6 py-4">
                <div className="flex items-start gap-3.5">
                  <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-[#C9A875]" strokeWidth={1.5} />
                  <div>
                    <p className="text-[11px] font-medium tracking-[0.22em] text-[#C9A875] uppercase">
                      ENQUIRY PREPARED (DEMO PREVIEW)
                    </p>
                    <h3 className="mt-1.5 font-serif text-2xl font-normal text-[#F3EEE6]">
                      Your consultation details are ready, {submittedEnquiry.fullName}.
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#AAA39A]">
                      This sample website does not connect to a live salon scheduling server,
                      so no appointment has been automatically reserved. Use the email action
                      below to send your prepared enquiry directly to the studio concierge.
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5 border border-[#C9A875]/18 bg-[#090909]/70 p-5 text-sm">
                  <div className="flex justify-between gap-4">
                    <span className="text-[#AAA39A]">Service</span>
                    <span className="text-right text-[#F3EEE6]">{submittedEnquiry.service}</span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#AAA39A]">Preferred Date</span>
                    <span className="text-[#F3EEE6] tabular-nums">
                      {submittedEnquiry.preferredDate}
                    </span>
                  </div>
                  <div className="flex justify-between gap-4">
                    <span className="text-[#AAA39A]">Contact</span>
                    <span className="text-right text-[#F3EEE6]">
                      {submittedEnquiry.email} · {submittedEnquiry.phone}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4">
                  <a
                    href={buildMailtoHref(submittedEnquiry)}
                    className="inline-flex min-h-[48px] items-center justify-center gap-2.5 border border-[#C9A875] bg-[#C9A875] px-7 py-3 text-xs font-medium tracking-[0.2em] text-[#090909] uppercase whitespace-nowrap transition-colors hover:bg-[#EAD5AD]"
                  >
                    <Mail className="h-4 w-4" strokeWidth={1.6} />
                    <span>SEND VIA EMAIL ENQUIRY</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => setSubmittedEnquiry(null)}
                    className="inline-flex min-h-[48px] cursor-pointer items-center justify-center border border-[#C9A875]/35 px-6 py-3 text-xs tracking-[0.18em] text-[#F3EEE6] uppercase whitespace-nowrap transition-colors hover:border-[#C9A875]"
                  >
                    EDIT DETAILS
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
