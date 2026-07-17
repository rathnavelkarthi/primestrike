"use client";

import Link from "next/link";
import Image from "next/image";
import { CalendarDays, MapPin, ArrowRight, Sparkles, Users, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AnimatedSection } from "@/components/animated-section";
import { FEATURED_EVENT, UPCOMING_EVENTS } from "@/lib/constants";

export default function EventsPage() {
  const featured = {
    ...FEATURED_EVENT,
    image: "/images/event-featured.png",
    stats: [
      { label: "Students", value: "500+", icon: Users },
      { label: "Duration", value: "8 Hours", icon: Clock },
      { label: "Curriculum", value: "Options Hedging", icon: BookOpen },
    ],
  };

  const upcoming = UPCOMING_EVENTS.map((event, i) => {
    const images = [
      "/images/event-neon.png",
      "/images/event-golden.png",
      "/images/event-purple.png",
    ];
    return {
      ...event,
      image: images[i % images.length],
    };
  });

  return (
    <>
      {/* ══════════════════════════════════════════════════
          HERO
          ══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <Image
          src="/images/events-hero.png"
          alt="Online trading webinars and live masterclasses screen"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />

        <div className="relative z-10 mx-auto max-w-5xl px-6 text-center">
          <AnimatedSection>
            <p className="text-xs uppercase tracking-[0.4em] text-gold/50 mb-6 font-[family-name:var(--font-poppins)]">
              Our Webinars
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.08}>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tighter leading-[0.85] mb-8">
              Interactive
              <br />
              Webinars
            </h1>
          </AnimatedSection>
          <AnimatedSection delay={0.16}>
            <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
              Discover our upcoming live trading sessions and options strategy webinars.
            </p>
          </AnimatedSection>
          <AnimatedSection delay={0.24}>
            <div className="mt-12">
              <div className="animate-bounce inline-block">
                <div className="w-px h-16 bg-gradient-to-b from-gold to-transparent mx-auto" />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          FEATURED EVENT
          ══════════════════════════════════════════════════ */}
      <section className="py-32 md:py-40 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="flex flex-col lg:flex-row gap-16 lg:items-center">
              <div className="relative flex-1 group">
                <div className="relative aspect-[4/5] md:aspect-[16/10] lg:aspect-[4/5] overflow-hidden rounded-2xl">
                  <Image
                    src={featured.image}
                    alt={featured.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                <div className="absolute -bottom-8 -right-4 md:right-8 flex flex-col gap-3">
                  {featured.stats.map((stat, i) => (
                    <AnimatedSection key={stat.label} delay={0.2 + i * 0.05}>
                      <div className="bg-neutral-900/90 backdrop-blur-xl border border-gold/10 p-4 rounded-xl shadow-2xl min-w-[160px]">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gold/5 flex items-center justify-center">
                            <stat.icon className="h-4 w-4 text-gold/50" />
                          </div>
                          <div>
                            <p className="text-[10px] uppercase tracking-widest text-white/30">{stat.label}</p>
                            <p className="text-sm font-bold text-white font-[family-name:var(--font-poppins)]">{stat.value}</p>
                          </div>
                        </div>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>

              <div className="flex-1 lg:pl-8">
                <AnimatedSection delay={0.2}>
                  <Badge className="bg-gold/10 text-gold/70 border-gold/20 hover:bg-gold/15 transition-colors uppercase tracking-[0.2em] px-4 py-1 mb-6 rounded-full text-[10px]">
                    Featured Session
                  </Badge>
                  <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight leading-tight mb-8">
                    {featured.title}
                  </h2>
                  <p className="text-lg text-white/40 leading-relaxed mb-10 max-w-lg">
                    {featured.tagline}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12 border-t border-white/5 pt-10">
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-widest text-gold/30">Date & Time</p>
                      <div className="flex items-center gap-2 text-white/60">
                        <CalendarDays className="h-4 w-4 text-gold/40" />
                        <span className="text-sm">{featured.date}</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs uppercase tracking-widest text-gold/30">Location</p>
                      <div className="flex items-center gap-2 text-white/60">
                        <MapPin className="h-4 w-4 text-gold/40" />
                        <span className="text-sm">{featured.location}</span>
                      </div>
                    </div>
                  </div>

                  <Button asChild size="lg" className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90 px-10 py-7 group">
                    <Link href="/contact">
                      Enquire Now
                      <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </Button>
                </AnimatedSection>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          UPCOMING EVENTS
          ══════════════════════════════════════════════════ */}
      <section className="py-32 bg-neutral-900">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div className="max-w-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-gold/50 mb-4 font-[family-name:var(--font-poppins)]">
                  Live Schedule
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight leading-none">
                  Upcoming Webinars
                </h2>
              </div>
              <Button variant="link" className="text-gold/40 hover:text-gold p-0 h-auto group text-xs uppercase tracking-widest">
                View All Sessions
                <ArrowRight className="ml-2 h-3 w-3 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {upcoming.map((event, i) => (
              <AnimatedSection key={event.title} delay={i * 0.1}>
                <div className="group relative overflow-hidden rounded-2xl bg-neutral-950/50 border border-white/5 aspect-[4/5] flex flex-col">
                  <div className="relative h-2/3 overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-black/50 backdrop-blur-md text-gold/60 border-gold/10 text-[9px] uppercase tracking-widest px-3 py-1">
                        {event.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="relative flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight mb-3 group-hover:text-white/80 transition-colors">
                        {event.title}
                      </h3>
                      <p className="text-sm text-white/30 line-clamp-2 leading-relaxed">
                        {event.tagline}
                      </p>
                    </div>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-[10px] text-gold/30 uppercase tracking-widest">
                          <MapPin className="h-3 w-3" />
                          {event.location}
                        </div>
                        <div className="text-[11px] text-white/50">{event.date}</div>
                      </div>
                      <div className="w-10 h-10 rounded-full border border-gold/10 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-all duration-300">
                        <ArrowRight className="h-4 w-4 text-white group-hover:text-gold-foreground transition-colors" />
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          CTA
          ══════════════════════════════════════════════════ */}
      <section className="py-32 bg-neutral-950 overflow-hidden relative">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05),transparent_40%)]" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="bg-neutral-900 p-12 md:p-24 rounded-3xl border border-gold/5 text-center relative overflow-hidden">
            <Sparkles className="absolute -top-10 -left-10 h-40 w-40 text-gold/[0.04] rotate-12" />

            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tighter mb-8 bg-gradient-to-b from-white to-white/40 bg-clip-text text-transparent">
                Structured
                <br />
                Trading Path
              </h2>
              <p className="text-white/40 text-lg max-w-lg mx-auto mb-10 leading-relaxed font-light">
                Ready to learn options trading and price action? Join Prime Strike webinars to build consistency and discipline.
              </p>
              <Button asChild size="lg" className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90 px-12 py-7 group">
                <Link href="/contact">
                  Enroll Now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
