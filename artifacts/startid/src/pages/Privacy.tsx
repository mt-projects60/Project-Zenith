import { MainLayout } from "@/components/layout/MainLayout";

const sections = [
  {
    title: "1. Information We Collect",
    content: `We collect information you provide directly to us, including:

**Account information:** When you create an account, we collect your name, email address, password, and role (startup, investor, service provider, or enthusiast).

**Profile information:** Founders may provide company name, industry, stage, funding details, pitch materials (deck URLs, video URLs), traction metrics, team information, and social links. Investors may provide firm name, check size, and investment thesis. Service providers may provide firm name, category, and service descriptions.

**Usage data:** We collect information about how you interact with the platform, including pages viewed, search queries, profile clicks, and interaction timestamps.

**Communications:** If you contact us, we retain those communications to assist with any future inquiries.`
  },
  {
    title: "2. How We Use Your Information",
    content: `We use the information we collect to:

- Operate, maintain, and improve the Project Zenith platform
- Match startups with relevant investors based on industry, stage, and geography
- Enable profile discovery by investors and other platform users
- Send transactional emails (account verification, password resets, investor interest notifications)
- Send the Project Zenith newsletter and product updates, if you have opted in
- Analyse platform usage to improve features and user experience
- Comply with legal obligations and enforce our Terms of Service`
  },
  {
    title: "3. Information Sharing",
    content: `**Your public profile:** Startup, investor, and service provider profiles are visible to all logged-in users of the platform unless you have configured specific sections as private using the profile visibility controls.

**Data room materials:** Documents and links uploaded to your data room are only accessible to investors you have individually approved.

**Third parties:** We do not sell your personal data to third parties. We may share data with service providers who assist us in operating the platform (hosting, analytics, email delivery) under strict data processing agreements.

**Legal requirements:** We may disclose information if required to do so by law or in response to valid requests from public authorities.`
  },
  {
    title: "4. Data Retention",
    content: `We retain your account and profile data for as long as your account is active or as needed to provide services. If you delete your account, we will delete or anonymise your personal data within 30 days, except where retention is required by law.

Activity logs (investor interactions, views, bookmarks) may be retained in anonymised aggregate form for up to 24 months for analytics purposes.`
  },
  {
    title: "5. Security",
    content: `We implement industry-standard security measures including encryption in transit (TLS), encrypted storage of sensitive data, access controls, and regular security audits. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.

We recommend you use a strong, unique password for your Project Zenith account and enable two-factor authentication when it becomes available.`
  },
  {
    title: "6. Your Rights",
    content: `Depending on your location, you may have the following rights regarding your personal data:

- **Access:** Request a copy of the personal data we hold about you
- **Correction:** Request correction of inaccurate or incomplete data
- **Deletion:** Request deletion of your personal data
- **Portability:** Request your data in a structured, machine-readable format
- **Objection:** Object to processing of your data for marketing purposes

To exercise these rights, contact us at privacy@projectzenith.io. We will respond within 30 days.`
  },
  {
    title: "7. Cookies",
    content: `We use cookies and similar technologies to authenticate your session, remember your preferences, and analyse platform usage. You can control cookie preferences through your browser settings.

We use:
- **Essential cookies:** Required for platform functionality (session management, authentication)
- **Analytics cookies:** Help us understand how users interact with the platform (anonymised)
- **Preference cookies:** Remember your settings and language preferences`
  },
  {
    title: "8. Changes to This Policy",
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes by email or through a prominent notice on the platform. Your continued use of Project Zenith after such changes constitutes your acceptance of the updated policy.`
  },
  {
    title: "9. Contact",
    content: `If you have questions about this Privacy Policy or our data practices, please contact us at:

**Project Zenith Limited**  
Email: privacy@projectzenith.io  
Address: One BKC, Bandra Kurla Complex, Mumbai 400051, India`
  },
];

export default function Privacy() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="pt-20 pb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: March 1, 2026</p>
        </div>

        <div className="prose-sm max-w-none space-y-10 mb-20">
          <p className="text-muted-foreground leading-relaxed">
            Project Zenith Limited ("Project Zenith", "we", "us", "our") is committed to protecting your personal information. This Privacy Policy explains how we collect, use, share, and protect data when you use the Project Zenith platform at projectzenith.io.
          </p>

          {sections.map((s, i) => (
            <div key={i} className="space-y-4">
              <h2 className="text-lg font-bold">{s.title}</h2>
              <div className="text-muted-foreground leading-relaxed text-sm space-y-3">
                {s.content.split("\n\n").map((para, j) => (
                  <p key={j} dangerouslySetInnerHTML={{
                    __html: para
                      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
                      .replace(/^- /gm, '• ')
                      .replace(/\n/g, '<br />')
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
