"use client";

import * as React from "react";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ContactClient() {
  const [form, setForm] = React.useState({ name: "", email: "", subject: "", message: "" });
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Full name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Please enter a valid email.";
    if (!form.subject.trim()) e.subject = "Subject title is required.";
    if (!form.message.trim()) e.message = "Message context is required.";
    return e;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      toast.success("Feedback Logged", { description: "We will get back to you shortly! 💬" });
      setForm({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="bg-bg-base min-h-screen text-text-primary">
      
      {/* ── Section 1: Hero Banner ── */}
      <section className="relative overflow-hidden bg-bg-surface py-16 border-b border-border-default/45">
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-25 dark:opacity-10" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-heading text-text-primary tracking-tight">
            Get in Touch with <span className="text-accent-primary">Us</span>
          </h1>
          <p className="text-sm sm:text-base text-text-secondary max-w-xl mx-auto font-body leading-relaxed">
            Have questions regarding property directory listings or our SaaS broker console subscriptions? Drop us a line.
          </p>
        </div>
      </section>

      {/* ── Section 2: Contact grid split ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* LEFT COLUMN: Contact Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-lg font-bold font-heading">Direct Details</h3>
            <p className="text-xs text-text-secondary font-body">Reach out to our offices directly during standard business hours.</p>

            <div className="space-y-4 pt-2">
              {[
                { icon: Phone, label: "Phone support", desc: "+1 (800) 555-ESTATE", href: "tel:+18005553782" },
                { icon: Mail, label: "Email inquiries", desc: "support@brandestate.com", href: "mailto:support@brandestate.com" },
                { icon: MapPin, label: "Main Headquarters", desc: "500 Fifth Avenue, 24th Floor, New York, NY 10110", href: "https://www.google.com/maps/search/?api=1&query=500+Fifth+Avenue+New+York" },
              ].map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                    className="p-5 rounded-2xl border border-border-default bg-bg-surface flex gap-4 hover:border-accent-primary/20 hover:shadow-md transition-all group"
                  >
                    <div className="h-10 w-10 rounded-xl bg-accent-primary-dim text-accent-primary flex items-center justify-center shrink-0 group-hover:bg-accent-primary group-hover:text-white transition-all">
                      <Icon className="h-4.5 w-4.5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">{item.label}</span>
                      <span className="text-sm font-bold text-text-primary mt-1 block">{item.desc}</span>
                    </div>
                  </a>
                );
              })}
            </div>

            {/* Static Maps Mockup preview */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden border border-border-default bg-bg-surface flex flex-col items-center justify-center p-6 text-center select-none shadow-sm">
              <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1.5px,transparent_1.5px)] [background-size:20px_20px] opacity-40" />
              <div className="absolute top-1/2 left-0 right-0 h-px border-t border-dashed border-border-subtle" />
              <div className="absolute left-1/2 top-0 bottom-0 w-px border-l border-dashed border-border-subtle" />
              
              <div className="relative z-10 flex flex-col items-center gap-1.5">
                <div className="h-9 w-9 rounded-full bg-accent-primary/15 border border-accent-primary/30 flex items-center justify-center text-accent-primary animate-pulse">
                  <MapPin className="h-4.5 w-4.5" />
                </div>
                <span className="text-[10px] font-bold text-text-primary uppercase mt-1">Midtown Manhattan Office</span>
                <span className="text-[11px] font-mono text-text-secondary">40.7528° N, 73.9818° W</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Feedback Form (7 cols) */}
          <div className="lg:col-span-7 rounded-2xl border border-border-default bg-bg-surface p-6 sm:p-8 shadow-sm space-y-6">
            <div>
              <h3 className="text-lg font-bold font-heading">Submit Inquiry Message</h3>
              <p className="text-xs text-text-secondary font-body mt-0.5">We typically respond to platform support logs within 12 hours.</p>
            </div>

            {submitted ? (
              <div className="p-8 rounded-2xl bg-state-success/10 border border-state-success/20 text-center space-y-3.5 animate-fade-in">
                <CheckCircle2 className="h-12 w-12 text-state-success mx-auto" />
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-state-success">Inquiry Submitted Successfully!</h4>
                  <p className="text-xs text-text-secondary leading-relaxed max-w-sm mx-auto">
                    Thank you for contacting us. We have received your query and dispatched a copy to our support logs.
                  </p>
                </div>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="link"
                  className="text-xs text-accent-primary font-bold hover:underline mt-2 p-0 h-auto"
                >
                  Send another feedback message
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Full Name *</label>
                    <Input
                      placeholder="e.g. Alex Johnson"
                      value={form.name}
                      onChange={(e) => { setForm(p => ({ ...p, name: e.target.value })); setErrors(p => ({ ...p, name: "" })); }}
                      className={cn("h-10 border-border-default/60 bg-bg-alt/30 text-sm rounded-xl", errors.name && "border-state-error")}
                      disabled={submitting}
                    />
                    {errors.name && <p className="text-[10px] font-bold text-state-error">{errors.name}</p>}
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Email Address *</label>
                    <Input
                      type="email"
                      placeholder="alex@example.com"
                      value={form.email}
                      onChange={(e) => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: "" })); }}
                      className={cn("h-10 border-border-default/60 bg-bg-alt/30 text-sm rounded-xl", errors.email && "border-state-error")}
                      disabled={submitting}
                    />
                    {errors.email && <p className="text-[10px] font-bold text-state-error">{errors.email}</p>}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Subject Title *</label>
                  <Input
                    placeholder="e.g. Inquiry regarding Agent Subscription Plan"
                    value={form.subject}
                    onChange={(e) => { setForm(p => ({ ...p, subject: e.target.value })); setErrors(p => ({ ...p, subject: "" })); }}
                    className={cn("h-10 border-border-default/60 bg-bg-alt/30 text-sm rounded-xl", errors.subject && "border-state-error")}
                    disabled={submitting}
                  />
                  {errors.subject && <p className="text-[10px] font-bold text-state-error">{errors.subject}</p>}
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-text-secondary uppercase tracking-wider">Detailed Message *</label>
                  <textarea
                    placeholder="Describe your request in detail..."
                    value={form.message}
                    onChange={(e) => { setForm(p => ({ ...p, message: e.target.value })); setErrors(p => ({ ...p, message: "" })); }}
                    rows={5}
                    className={cn(
                      "w-full text-sm border bg-bg-alt/30 text-text-primary border-border-default/60 rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-accent-primary transition-all resize-none",
                      errors.message && "border-state-error"
                    )}
                    disabled={submitting}
                  />
                  {errors.message && <p className="text-[10px] font-bold text-state-error">{errors.message}</p>}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold gap-1.5 active:scale-[0.98] transition-all"
                >
                  <Send className="h-4.5 w-4.5" />
                  {submitting ? "Sending..." : "Submit Message Request"}
                </Button>
              </form>
            )}
          </div>

        </div>
      </section>
      
    </div>
  );
}
