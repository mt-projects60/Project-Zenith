import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

const featured = {
  title: "The Death of the Pitch Deck: Why Structured Capital Profiles Are the Future",
  excerpt: "After interviewing 200 investors across India, Europe, and North America, one thing became clear: the pitch deck is broken. Here's what replaces it.",
  author: "Arjun Mehta",
  role: "CEO, Project Zenith",
  date: "March 10, 2026",
  readTime: "8 min read",
  category: "Insights",
  color: "bg-blue-600",
};

const posts = [
  {
    title: "How NovaPay Raised $1.85M Without a Single Cold Email",
    excerpt: "Abiola Lawal shares the exact steps he took to build inbound investor interest using his Project Zenith profile — and what data metrics drove the most engagement.",
    author: "Abiola Lawal",
    date: "Mar 7, 2026",
    readTime: "5 min",
    category: "Founder Story",
    cat_color: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "What Investors Actually Look at in the First 90 Seconds",
    excerpt: "We tracked 10,000 investor sessions on Project Zenith. Here are the sections that make investors stay — and the ones that make them leave.",
    author: "Ngozi Adeyemi",
    date: "Mar 5, 2026",
    readTime: "6 min",
    category: "Data Report",
    cat_color: "bg-violet-50 text-violet-700",
  },
  {
    title: "Emerging Markets Fundraising in 2026: State of the Market",
    excerpt: "A data-driven look at seed and Series A activity across India, Southeast Asia, and the Middle East — and what it means for founders raising this year.",
    author: "Rohan Kapoor",
    date: "Mar 1, 2026",
    readTime: "9 min",
    category: "Market Report",
    cat_color: "bg-amber-50 text-amber-700",
  },
  {
    title: "The 7 Profile Sections That Drive the Most Investor Interest",
    excerpt: "After analysing thousands of investor-startup interactions, we've identified exactly which profile sections drive data room requests vs. which get ignored.",
    author: "Priya Menon",
    date: "Feb 25, 2026",
    readTime: "4 min",
    category: "Product Tips",
    cat_color: "bg-blue-50 text-blue-700",
  },
  {
    title: "Legal Structures Every Startup Founder Must Understand",
    excerpt: "SAFE notes, term sheets, convertible notes — the terminology is confusing. Our legal team explains the basics every founder needs before their first investor conversation.",
    author: "Anika Singh",
    date: "Feb 20, 2026",
    readTime: "7 min",
    category: "Legal",
    cat_color: "bg-rose-50 text-rose-700",
  },
  {
    title: "How Service Providers Can Generate Qualified Startup Leads on Project Zenith",
    excerpt: "Legal firms, tech agencies, and hiring companies are quietly generating their best leads through Project Zenith provider profiles. Here's the playbook.",
    author: "Project Zenith Team",
    date: "Feb 15, 2026",
    readTime: "5 min",
    category: "For Providers",
    cat_color: "bg-orange-50 text-orange-700",
  },
];

export default function Blog() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 max-w-5xl">

        <div className="pt-20 pb-12 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-4">Project Zenith Blog</p>
          <h1 className="text-5xl font-extrabold tracking-tight mb-4">Ideas for founders, investors, and ecosystem builders</h1>
          <p className="text-lg text-muted-foreground">Research, stories, and product thinking from the Project Zenith team.</p>
        </div>

        {/* Featured */}
        <div className="bg-foreground text-background rounded-2xl p-10 mb-14 flex flex-col md:flex-row gap-8 items-start">
          <div className="flex-1">
            <Badge className="bg-background/20 text-background border-background/30 mb-4 text-xs">{featured.category}</Badge>
            <h2 className="text-2xl font-extrabold tracking-tight mb-4 leading-snug">{featured.title}</h2>
            <p className="text-background/70 leading-relaxed mb-6">{featured.excerpt}</p>
            <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-full ${featured.color} flex items-center justify-center text-white font-bold text-xs`}>
                {featured.author[0]}
              </div>
              <div>
                <p className="text-sm font-semibold">{featured.author}</p>
                <p className="text-xs text-background/60">{featured.role} · {featured.date} · {featured.readTime}</p>
              </div>
            </div>
          </div>
          <Button variant="secondary" className="shrink-0 gap-2">
            Read article <ArrowRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {posts.map((post, i) => (
            <article key={i} className="bg-card border rounded-2xl p-6 hover:shadow-md hover:border-primary/20 transition-all cursor-pointer group flex flex-col">
              <div className="mb-4">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${post.cat_color}`}>{post.category}</span>
              </div>
              <h3 className="font-bold text-sm leading-snug mb-2 group-hover:text-primary transition-colors flex-1">{post.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center gap-2 mt-auto">
                <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[10px] font-bold">
                  {post.author[0]}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {post.author} · {post.readTime} · {post.date}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter CTA */}
        <div className="border rounded-2xl p-10 text-center mb-20">
          <h2 className="text-2xl font-extrabold tracking-tight mb-3">Get new posts in your inbox</h2>
          <p className="text-muted-foreground mb-6">Join 8,400+ founders and investors who read the Project Zenith newsletter every week.</p>
          <div className="flex gap-3 max-w-sm mx-auto">
            <input type="email" placeholder="you@company.com" className="flex-1 border rounded-lg px-3 py-2 text-sm bg-background focus:outline-none focus:ring-2 focus:ring-foreground" />
            <Button>Subscribe</Button>
          </div>
        </div>

      </div>
    </MainLayout>
  );
}
