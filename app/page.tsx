/**
 * Design System Verification Page
 * Temporary page to visually verify that the Brand Estate
 * design tokens, fonts, and components are working correctly.
 *
 * Delete or replace this file when Spec 10 (Homepage) is implemented.
 */

import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Design System — Token Verification",
};

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-bg-base p-10 space-y-16">
      {/* ── Fonts ── */}
      <section className="space-y-4">
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
          Typography
        </p>
        <h1 className="text-5xl text-text-primary">
          Playfair Display — H1 Heading
        </h1>
        <h2 className="text-4xl text-text-primary">
          Playfair Display — H2 Heading
        </h2>
        <h3 className="text-2xl text-text-primary">
          Playfair Display — H3 Heading
        </h3>
        <p className="text-base text-text-secondary max-w-xl">
          Montserrat body text — Brand Estate is a premium real estate platform
          connecting buyers, renters, sellers, and agents. Search thousands of
          properties and find your perfect home.
        </p>
        <p className="text-sm text-text-muted">
          Montserrat small / label text
        </p>
      </section>

      {/* ── Color Palette ── */}
      <section className="space-y-4">
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
          Color Tokens
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { name: "bg-base", cls: "bg-bg-base border border-border-default" },
            { name: "bg-alt", cls: "bg-bg-alt" },
            { name: "bg-elevated", cls: "bg-bg-elevated" },
            { name: "accent-primary", cls: "bg-accent-primary" },
            { name: "accent-dim", cls: "bg-accent-primary-dim border border-accent-primary" },
            { name: "state-success", cls: "bg-state-success" },
            { name: "state-warning", cls: "bg-state-warning" },
            { name: "state-error", cls: "bg-state-error" },
            { name: "state-info", cls: "bg-state-info" },
          ].map(({ name, cls }) => (
            <div key={name} className="flex flex-col items-center gap-1">
              <div className={`w-14 h-14 rounded-xl ${cls}`} />
              <span className="text-xs text-text-muted font-medium">{name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Buttons ── */}
      <section className="space-y-4">
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
          Button Variants
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
      </section>

      {/* ── Text Colors ── */}
      <section className="space-y-2">
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
          Text Scale
        </p>
        <p className="text-text-primary font-semibold">text-primary — #0F172A</p>
        <p className="text-text-secondary">text-secondary — #334155</p>
        <p className="text-text-muted">text-muted — #64748B</p>
        <p className="text-text-faint">text-faint — #94A3B8</p>
        <p className="text-accent-primary font-medium">
          text-accent-primary — #0067D2
        </p>
      </section>

      {/* ── Dark mode check ── */}
      <section className="dark rounded-3xl p-8 space-y-4">
        <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
          Dark Mode Tokens (Admin / Dashboard context)
        </p>
        <h2 className="text-3xl text-text-primary">Dark H2 — Playfair Display</h2>
        <p className="text-text-secondary">
          Montserrat body in dark context — secondary text token.
        </p>
        <p className="text-text-muted">Muted text — #8D93A5</p>
        <p className="text-accent-primary font-semibold">
          accent-primary dark — #1D8CFF
        </p>
        <div className="flex flex-wrap gap-3">
          <Button variant="default">Primary Dark</Button>
          <Button variant="outline">Outline Dark</Button>
          <Button variant="secondary">Secondary Dark</Button>
          <Button variant="ghost">Ghost Dark</Button>
        </div>
      </section>
    </div>
  );
}
