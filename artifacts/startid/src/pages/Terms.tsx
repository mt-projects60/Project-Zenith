import { MainLayout } from "@/components/layout/MainLayout";

const sections = [
  {
    title: "1. Acceptance of Terms",
    content: `By accessing or using Project Zenith ("the Platform"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not use the Platform.

These Terms apply to all users of the Platform, including startup founders, investors, service providers, and enthusiasts. Supplemental terms may apply to specific features and will be displayed to you before use.`
  },
  {
    title: "2. Eligibility",
    content: `You must be at least 18 years of age and have the legal capacity to enter into contracts to use the Platform. By using Project Zenith, you represent and warrant that you meet these requirements.

If you are using the Platform on behalf of a company or other legal entity, you represent that you have authority to bind that entity to these Terms.`
  },
  {
    title: "3. Your Project Zenith Account",
    content: `You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to:

- Provide accurate and complete information when creating your account
- Promptly update your information to keep it current
- Notify us immediately of any unauthorised use of your account
- Not share your login credentials with any third party

Project Zenith reserves the right to suspend or terminate accounts that violate these Terms or that we reasonably believe to be fraudulent or harmful to the Platform.`
  },
  {
    title: "4. Acceptable Use",
    content: `You agree not to use the Platform to:

- Post false, misleading, or fraudulent information about yourself, your startup, your fund, or your services
- Impersonate any person or entity, or falsely represent your affiliation with any person or entity
- Harvest or scrape user data without express written permission
- Transmit spam, unsolicited messages, or bulk communications to other users
- Upload or transmit malware, viruses, or other harmful code
- Attempt to gain unauthorised access to other users' accounts or data rooms
- Use the Platform for any illegal purpose or in violation of any applicable law

Violation of these rules may result in immediate account suspension without notice.`
  },
  {
    title: "5. Startup Profiles and Data Accuracy",
    content: `Startup founders are solely responsible for the accuracy, completeness, and legality of information posted on their profiles. Project Zenith does not verify the accuracy of traction metrics, funding figures, or other claims made in startup profiles.

Investors acknowledge that startup profiles are self-reported and that Project Zenith makes no representations or warranties about the accuracy of any information on the Platform. Independent due diligence is the sole responsibility of each investor.

**Project Zenith is not a broker-dealer, investment advisor, or financial institution.** Nothing on the Platform constitutes investment advice or a solicitation to invest.`
  },
  {
    title: "6. Data Room Access",
    content: `The data room feature allows founders to share confidential materials (pitch decks, financial models, cap tables, etc.) with selected investors. By using the data room feature:

- Founders grant Project Zenith a limited licence to host and transmit these materials to approved investors
- Investors receiving data room access agree not to share these materials without the founder's explicit consent
- Project Zenith is not liable for any unauthorised disclosure of data room materials resulting from investor actions

Founders may revoke data room access at any time.`
  },
  {
    title: "7. Intellectual Property",
    content: `Project Zenith and its licensors own all intellectual property rights in and to the Platform, including all software, design, trademarks, and content created by Project Zenith.

You retain ownership of content you post to the Platform (profiles, pitch materials, etc.) and grant Project Zenith a worldwide, non-exclusive, royalty-free licence to host, display, and distribute this content for the purpose of operating the Platform.

You may not copy, reverse engineer, or create derivative works from any portion of the Platform without our express written permission.`
  },
  {
    title: "8. Limitation of Liability",
    content: `To the maximum extent permitted by applicable law, Project Zenith shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including lost profits, loss of data, or business interruption, arising from your use of the Platform.

Our total liability for any claims arising from your use of the Platform shall not exceed the amount you paid to Project Zenith in the 12 months prior to the claim, or $100, whichever is greater.`
  },
  {
    title: "9. Governing Law",
    content: `These Terms are governed by and construed in accordance with the laws of India. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Mumbai, Maharashtra, India.`
  },
  {
    title: "10. Changes to Terms",
    content: `We reserve the right to modify these Terms at any time. We will provide notice of material changes by email or through the Platform. Your continued use of the Platform after changes take effect constitutes your acceptance of the revised Terms.`
  },
  {
    title: "11. Contact",
    content: `For questions about these Terms, please contact us at:

**Project Zenith Limited**  
Email: legal@projectzenith.io  
Address: One BKC, Bandra Kurla Complex, Mumbai 400051, India`
  },
];

export default function Terms() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="pt-20 pb-12">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Legal</p>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: March 1, 2026</p>
        </div>

        <div className="space-y-10 mb-20">
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
