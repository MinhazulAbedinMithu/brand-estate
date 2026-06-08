"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Phone, Mail, FileText, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import type { ListerProfile } from "@/src/mocks/propertyTypes";

interface AgentContactCardProps {
  lister: ListerProfile;
  propertyTitle: string;
  className?: string;
}

export function AgentContactCard({ lister, propertyTitle, className }: AgentContactCardProps) {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    phone: "",
    message: `Hello, I am interested in "${propertyTitle}". Please contact me with more information.`,
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.phone.trim() && !/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }
    if (!formData.message.trim()) {
      newErrors.message = "Message cannot be empty";
    }
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      console.log("Inquiry Form Submission:", {
        agentEmail: lister.email,
        agentName: lister.name,
        submittedData: formData,
      });
      // Clear fields besides the success indicator
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    }, 1000);
  };

  const initials = lister.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={cn(
        "rounded-2xl border border-border-default/50 bg-bg-surface p-5 sm:p-6 shadow-sm",
        className
      )}
    >
      {/* Agent details header */}
      <div className="flex items-center gap-4 border-b border-border-default/45 pb-5">
        <Avatar className="h-14 w-14 border-2 border-accent-primary/20">
          <AvatarImage src={lister.avatar} alt={lister.name} className="object-cover" />
          <AvatarFallback className="bg-accent-primary-dim text-accent-primary font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <h4 className="font-body text-base font-bold text-text-primary truncate">{lister.name}</h4>
          <p className="text-xs text-text-muted font-medium truncate">{lister.agencyName}</p>
          {lister.licenseNumber && (
            <p className="text-[10px] text-text-faint font-semibold flex items-center gap-1 mt-1">
              <FileText className="h-3 w-3" /> Lic #{lister.licenseNumber}
            </p>
          )}
        </div>
      </div>

      {/* Quick contacts */}
      <div className="grid grid-cols-2 gap-3 py-4 border-b border-border-default/45">
        <a
          href={`tel:${lister.phone}`}
          className="flex items-center justify-center gap-2 h-10 rounded-full border border-border-default/60 hover:border-accent-primary/30 hover:bg-accent-primary-dim/20 text-xs font-bold text-text-secondary hover:text-accent-primary transition-all duration-200"
        >
          <Phone className="h-3.5 w-3.5" /> Call Agent
        </a>
        <a
          href={`mailto:${lister.email}`}
          className="flex items-center justify-center gap-2 h-10 rounded-full border border-border-default/60 hover:border-accent-primary/30 hover:bg-accent-primary-dim/20 text-xs font-bold text-text-secondary hover:text-accent-primary transition-all duration-200"
        >
          <Mail className="h-3.5 w-3.5" /> Email
        </a>
      </div>

      {/* Inquiry Form */}
      <div className="pt-5">
        <h5 className="font-body text-sm font-bold text-text-primary mb-4">Request Info & Inquiry</h5>

        {submitted ? (
          <div className="rounded-xl bg-state-success/10 border border-state-success/20 p-4 text-center animate-fade-in">
            <CheckCircle2 className="h-8 w-8 text-state-success mx-auto mb-2.5" />
            <h6 className="text-sm font-bold text-state-success mb-1">Inquiry Submitted!</h6>
            <p className="text-xs text-text-secondary font-medium leading-relaxed">
              We've dispatched your interest to {lister.name}. They will reach out to you directly as soon as possible.
            </p>
            <Button
              onClick={() => setSubmitted(false)}
              variant="link"
              className="text-xs text-accent-primary hover:text-accent-primary-hov font-bold p-0 mt-3 h-auto"
            >
              Send another message
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full Name *"
                className={cn(
                  "h-10 rounded-xl bg-bg-alt/40 border-border-default/50 text-sm focus:bg-bg-surface focus:ring-1 focus:ring-accent-primary",
                  errors.name && "border-state-error focus:ring-state-error"
                )}
                disabled={loading}
              />
              {errors.name && <p className="text-[10px] font-bold text-state-error pl-1">{errors.name}</p>}
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email Address *"
                className={cn(
                  "h-10 rounded-xl bg-bg-alt/40 border-border-default/50 text-sm focus:bg-bg-surface focus:ring-1 focus:ring-accent-primary",
                  errors.email && "border-state-error focus:ring-state-error"
                )}
                disabled={loading}
              />
              {errors.email && <p className="text-[10px] font-bold text-state-error pl-1">{errors.email}</p>}
            </div>

            {/* Phone Number */}
            <div className="space-y-1.5">
              <Input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Phone Number (Optional)"
                className={cn(
                  "h-10 rounded-xl bg-bg-alt/40 border-border-default/50 text-sm focus:bg-bg-surface focus:ring-1 focus:ring-accent-primary",
                  errors.phone && "border-state-error focus:ring-state-error"
                )}
                disabled={loading}
              />
              {errors.phone && <p className="text-[10px] font-bold text-state-error pl-1">{errors.phone}</p>}
            </div>

            {/* Message Area */}
            <div className="space-y-1.5">
              <Textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Write your message... *"
                className={cn(
                  "min-h-24 max-h-36 rounded-xl bg-bg-alt/40 border-border-default/50 text-sm focus:bg-bg-surface focus:ring-1 focus:ring-accent-primary resize-y",
                  errors.message && "border-state-error focus:ring-state-error"
                )}
                disabled={loading}
              />
              {errors.message && <p className="text-[10px] font-bold text-state-error pl-1">{errors.message}</p>}
            </div>

            {/* Submit */}
            <Button
              type="submit"
              className="w-full h-11 rounded-full bg-accent-primary hover:bg-accent-primary-hov text-white text-xs font-bold gap-2 active:scale-[0.98] transition-all"
              disabled={loading}
            >
              <Send className="h-3.5 w-3.5" />
              {loading ? "Sending..." : "Submit Inquiry"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
