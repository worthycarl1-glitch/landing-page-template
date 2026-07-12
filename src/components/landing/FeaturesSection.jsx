import React from "react";
import { Link } from "react-router-dom";
import {
  UserCheck, Users, Phone, FolderOpen, TrendingUp, MapPin,
  Sparkles, BarChart2, Target, CheckCircle, Shield, Wrench, ArrowRight,
} from "lucide-react";
import { Reveal, Stagger, StaggerItem } from "@/components/landing/AnimationPrimitives";
import Eyebrow from "@/components/landing/Eyebrow";

const FEATURES = [
  { icon: UserCheck, title: "Team Management", desc: "Assign setters to closers, grant folder access, onboard the whole team from one page.", href: "/features/team-management" },
  { icon: Users, title: "Leads", desc: "Folder-based pipeline for business, personal, and insurance leads — leads auto-migrate through stages.", href: "/features/business-contacts" },
  { icon: Phone, title: "Click-to-Dial", desc: "Call straight from the contact card. Schedule, set follow-ups, drop to DNC without leaving.", href: "/features/phone-service" },
  { icon: FolderOpen, title: "Contact Folders", desc: "The pipeline backbone. Closers control which folders each setter can work.", href: "/features/contact-folders" },
  { icon: TrendingUp, title: "Sales Tracker", desc: "Revenue and team commissions, closer rankings, full transaction history.", href: "/features/sales-tracker" },
  { icon: MapPin, title: "Lead Generator", desc: "Pull real business leads from Google Places straight into your pipeline.", href: "/features/lead-generator" },
  { icon: Sparkles, title: "AI Bulk Import", desc: "Paste text or upload a file — AI extracts and imports the contacts for you.", href: "/features/ai-bulk-import" },
  { icon: BarChart2, title: "Minute Breakdown", desc: "Per-number usage, cost, call quality, and payment history.", href: "/features/minute-breakdown" },
  { icon: Target, title: "Setter Dashboard", desc: "A hub built just for setters to track their booked appointments and performance.", href: "/features/setter-dashboard" },
  { icon: CheckCircle, title: "Client Results", desc: "Post-sale records — closed clients, follow-ups, and revenue in one view.", href: "/features/client-results" },
  { icon: Shield, title: "Lead Enrichment", desc: "Find verified business emails with Hunter.io before you send a single message.", href: "/features/enrichment-verification" },
  { icon: Wrench, title: "Custom Solutions", desc: "Need something bespoke? The developer behind SA can build it.", href: "/features/custom-solutions" },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="border-b border-border">
      <div className="max-w-6xl mx-auto px-6 py-20">
        <Reveal className="max-w-2xl mb-12">
          <Eyebrow>Everything included</Eyebrow>
          <h2 className="mt-4 text-3xl md:text-4xl font-heading font-bold tracking-tight">
            Every tool a sales floor actually uses
          </h2>
          <p className="mt-4 text-muted-foreground text-lg leading-relaxed">
            Purpose-built for the closer/setter model — not a generic CRM with the features you need sold as add-ons.
          </p>
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-border rounded-md overflow-hidden border border-border" gap={0.05}>
          {FEATURES.map(({ icon: Icon, title, desc, href }) => (
            <StaggerItem key={title}>
              <Link to={href} className="group bg-background p-7 flex flex-col gap-4 h-full transition-colors hover:bg-card/80">
                <div className="w-10 h-10 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-heading font-semibold mb-1.5">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
                <span className="mt-auto inline-flex items-center gap-1.5 text-primary text-sm font-medium group-hover:gap-2.5 transition-all">
                  Learn more <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}