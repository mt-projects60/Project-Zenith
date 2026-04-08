import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    desc: "For founders just getting started. Create your profile and get discovered.",
    color: "border-border",
    badge: null,
    cta: "Get started",
    ctaVariant: "outline" as const,
    features: [
      "Public startup profile",
      "Funding round details",
      "Basic traction metrics",
      "Pitch deck URL",
      "1 founder profile",
      "Community access",
      "Investor interest notifications",
    ],
    missing: [
      "Data room access control",
      "Advanced analytics",
      "Priority placement",
      "Investor CRM",
      "Dedicated support",
    ],
  },
  {
    name: "Growth",
    price: "$49",
    period: "per month",
    desc: "For actively fundraising startups. Full control over your capital narrative.",
    color: "border-foreground ring-2 ring-foreground",
    badge: "Most popular",
    cta: "Start free trial",
    ctaVariant: "default" as const,
    features: [
      "Everything in Free",
      "Data room with granular access control",
      "Approve / deny investor access",
      "Up to 5 founder profiles with LinkedIn",
      "Full traction dashboard (MRR, ARR, growth)",
      "Investor pipeline CRM",
      "Profile analytics & investor insights",
      "Section visibility controls",
      "Priority search placement",
      "Email support",
    ],
    missing: [],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per year",
    desc: "For accelerators, studios, and multi-company portfolios.",
    color: "border-border",
    badge: null,
    cta: "Contact sales",
    ctaVariant: "outline" as const,
    features: [
      "Everything in Growth",
      "Unlimited startup profiles",
      "Custom branding & domain",
      "Dedicated investor relations manager",
      "Bulk CSV import",
      "API access",
      "SLA & uptime guarantee",
      "Custom reporting",
      "Dedicated Slack channel",
      "Volume pricing for investors",
    ],
    missing: [],
  },
];

const faqs = [
  { q: "Is Project Zenith really free forever?", a: "Yes. The Free plan has no time limit. You can create and maintain a public startup profile, list your funding details, and receive investor interest — entirely free." },
  { q: "How does the data room work?", a: "On the Growth plan, you upload your pitch deck, financials, and other materials to a secure data room. Each investor who requests access must be individually approved by you. You can revoke access at any time." },
  { q: "Can investors use Project Zenith for free?", a: "Yes. Investors, service providers, and enthusiasts always access Project Zenith for free. Paid features are for startups that want advanced profile controls and analytics." },
  { q: "What counts as a 'founder profile'?", a: "Each co-founder or key team member can have their own mini-profile within your startup profile, including their LinkedIn, bio, and role. The Free plan supports 1 founder profile; Growth supports up to 5." },
  { q: "Can I cancel anytime?", a: "Absolutely. Cancel your Growth subscription anytime from your dashboard. You'll retain access until the end of your billing period, then revert to the Free plan." },
];

export default function Pricing() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="pt-20 pb-14 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full bg-muted mb-6">
            <Zap className="w-3.5 h-3.5" /> Simple, transparent pricing
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight mb-5">Start free. Upgrade when you're raising.</h1>
          <p className="text-lg text-muted-foreground">
            Every startup gets a permanent, discoverable profile at no cost. Upgrade to Growth when you need data room controls, investor CRM, and analytics.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-24">
          {plans.map(plan => (
            <div key={plan.name} className={cn("rounded-2xl border p-8 flex flex-col relative", plan.color)}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full">{plan.badge}</span>
                </div>
              )}
              <div className="mb-6">
                <p className="text-sm font-semibold text-muted-foreground mb-2">{plan.name}</p>
                <div className="flex items-end gap-1 mb-2">
                  <span className="text-4xl font-extrabold tracking-tight">{plan.price}</span>
                  {plan.price !== "Custom" && <span className="text-sm text-muted-foreground mb-1">/{plan.period}</span>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{plan.desc}</p>
              </div>

              <Link href="/signup" className="mb-8">
                <Button variant={plan.ctaVariant} className="w-full">{plan.cta}</Button>
              </Link>

              <ul className="space-y-3 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    {f}
                  </li>
                ))}
                {plan.missing.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground line-through">
                    <span className="w-4 h-4 shrink-0 mt-0.5 flex items-center justify-center text-muted-foreground/40">—</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* FAQs */}
        <div className="max-w-2xl mx-auto mb-24">
          <h2 className="text-2xl font-extrabold tracking-tight mb-8 text-center">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map(faq => (
              <div key={faq.q} className="border-b pb-6">
                <p className="font-semibold mb-2">{faq.q}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
