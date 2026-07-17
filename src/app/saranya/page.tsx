import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { 
  Award, 
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  BookOpen
} from "lucide-react";

export const metadata: Metadata = {
  title: "Saranya | Founder & Mentor of Prime Strike",
  description: "Learn stock trading and option hedging strategies from Saranya, founder of Prime Strike trading school in Chennai.",
  alternates: {
    canonical: "/saranya",
  },
  openGraph: {
    title: "Saranya | Professional Trading Mentor",
    description: "Founder and mentor behind Chennai's premium trading academy, Prime Strike.",
    images: ["/images/saranya.jpg"],
  }
};

const expertise = [
  {
    title: "Options Hedging Strategies",
    description: "Designing multi-leg strategies to manage risk and protect trading capital in volatile markets.",
    icon: ShieldCheck,
  },
  {
    title: "Price Action Trading",
    description: "Analyzing raw market charts using support, resistance, volume profiles, and trend behavior.",
    icon: TrendingUp,
  },
  {
    title: "Systematic Webinars",
    description: "Hosting interactive online bootcamps and webinars that make market concepts easy for retail traders.",
    icon: Sparkles,
  }
];

const highlights = [
  { label: "Trading Experience", value: "8+ Years" },
  { label: "Students Trained", value: "10k+" },
  { label: "Office Location", value: "Chennai" },
  { label: "Live Webinars", value: "500+" },
];

export default function SaranyaFounderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Saranya",
    "jobTitle": "Founder & CEO",
    "worksFor": {
      "@type": "Organization",
      "name": "Prime Strike"
    },
    "description": "Founder of Prime Strike, a premier trading school in Chennai specialized in options trading and technical analysis webinars.",
    "url": "https://www.primestrike.in/saranya",
    "image": "https://www.primestrike.in/images/saranya.jpg",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Chennai",
      "addressRegion": "Tamil Nadu",
      "addressCountry": "IN"
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-gold/20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[120px]" />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/5 border border-gold/10 text-[10px] sm:text-xs font-medium tracking-widest uppercase mb-6 text-gold">
                <Award className="w-3 h-3" />
                Founder & Mentor
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 font-[family-name:var(--font-poppins)]">
                Saranya <span className="text-gold">Founder</span>
              </h1>
              <p className="text-xl text-white/50 leading-relaxed max-w-2xl mx-auto lg:mx-0 mb-8 font-light">
                Helping retail traders manage risk and build execution discipline. 
                Combining years of market study with interactive online webinars 
                to make structured trading education accessible.
              </p>
              <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                <Link href="/contact" className="px-8 py-3 rounded-full bg-gold text-black font-semibold hover:bg-gold/90 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(231,180,95,0.2)]">
                  Connect with Saranya <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/services" className="px-8 py-3 rounded-full bg-white/5 border border-white/10 font-semibold hover:bg-white/10 transition-all">
                  Our Courses
                </Link>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mt-16 pt-12 border-t border-white/5">
                {highlights.map((h) => (
                  <div key={h.label}>
                    <div className="text-2xl font-bold text-white mb-1">{h.value}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30">{h.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative w-72 lg:w-[400px] group">
              <div className="absolute -inset-4 bg-gold/10 rounded-2xl blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative rounded-2xl border border-white/10 overflow-hidden aspect-[4/5] bg-neutral-900 shadow-2xl">
                <Image
                  src="/images/saranya.jpg"
                  alt="Saranya Founder"
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-neutral-900/50">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative">
              <div className="absolute -top-10 -left-10 w-20 h-20 border-t-2 border-l-2 border-gold/30" />
              <h2 className="text-3xl md:text-4xl font-bold mb-8 font-[family-name:var(--font-poppins)]">A Path to <span className="text-gold">Consistency</span></h2>
              <div className="space-y-6 text-white/50 text-lg leading-relaxed font-light">
                <p>
                  Saranya started trading eight years ago, navigating the steep learning curves and market challenges that retail traders commonly face. 
                  Her focus shifted from searching for magic indicators to mastering price action and position sizing.
                </p>
                <p>
                  In 2024, she founded Prime Strike to offer structured, webinar-based trading education. 
                  She wanted to build a program that moves away from empty profit promises, focusing instead on rules-based risk management and objective chart reading.
                </p>
                <div className="flex items-center gap-4 py-4">
                  <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    <BookOpen className="w-6 h-6" />
                  </div>
                  <span className="text-white font-medium italic text-sm">&quot;Trading is not about being right on every setup. It is about protecting your capital when you are wrong.&quot;</span>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              {expertise.map((item) => (
                <div key={item.title} className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-gold/20 transition-all group">
                  <div className="flex gap-6">
                    <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center text-gold group-hover:scale-110 transition-transform">
                      <item.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 font-[family-name:var(--font-poppins)]">{item.title}</h3>
                      <p className="text-white/40 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 border-t border-white/5 overflow-hidden">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-sm uppercase tracking-[0.5em] text-gold mb-12">The Mentor&apos;s Philosophy</h2>
            <div className="text-3xl md:text-5xl font-light italic leading-tight text-white/90 font-[family-name:var(--font-poppins)]">
              &quot;We focus on process over outcome. Once you control your risk and execute setups without emotional bias, consistency follows naturally. Our webinars aim to build that exact discipline.&quot;
            </div>
            <div className="mt-12 text-gold font-semibold tracking-widest uppercase text-sm">&mdash; Saranya</div>
          </div>
        </div>
      </section>

      <footer className="py-12 border-t border-white/5 bg-neutral-950">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-white/20 tracking-widest uppercase">
            © {new Date().getFullYear()} Saranya • Prime Strike
          </div>
          <div className="flex gap-8">
            <Link href="/" className="text-xs text-white/20 hover:text-gold transition-colors uppercase tracking-widest">Site Home</Link>
            <Link href="/services" className="text-xs text-white/20 hover:text-gold transition-colors uppercase tracking-widest">Our Courses</Link>
            <Link href="/contact" className="text-xs text-white/20 hover:text-gold transition-colors uppercase tracking-widest">Connect</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
