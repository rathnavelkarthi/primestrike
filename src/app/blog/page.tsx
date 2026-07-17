"use client";

import { ArrowRight, Sparkles, Calendar, Clock, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AnimatedSection } from "@/components/animated-section";
import {
  FEATURED_ARTICLE,
  BLOG_POSTS,
  BLOG_CATEGORIES,
  EVENT_TIPS,
  FOUNDER_NAME,
} from "@/lib/constants";

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState("All Posts");

  const featured = {
    ...FEATURED_ARTICLE,
    image: "/images/blog-hero.png",
    author: FOUNDER_NAME,
    date: "Mar 15, 2026",
    readTime: "8 min read",
  };

  const blogPosts = BLOG_POSTS.map((post, i) => {
    const images = [
      "/images/blog-image-1.png",
      "/images/blog-image-2.png",
      "/images/blog-image-3.png",
    ];
    return {
      ...post,
      image: images[i % images.length],
      author: FOUNDER_NAME,
      date: "Mar 12, 2026",
      readTime: "5 min read",
    };
  });

  const tips = EVENT_TIPS.map((tip, i) => {
    const images = ["/images/blog-tip-1.png", "/images/blog-tip-2.png"];
    return {
      ...tip,
      image: images[i % images.length],
    };
  });

  const filteredPosts =
    activeCategory === "All Posts"
      ? blogPosts
      : blogPosts.filter((p) => p.category === activeCategory);

  return (
    <>
      {/* ══════════════════════════════════════════════════
          FEATURED ARTICLE
          ══════════════════════════════════════════════════ */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <Image
          src={featured.image}
          alt={featured.title}
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

        <div className="relative z-10 mx-auto max-w-7xl px-6 w-full py-20">
          <div className="max-w-3xl">
            <AnimatedSection>
              <Badge className="bg-gold/15 text-gold border-gold/20 px-4 py-1 mb-6 rounded-full text-xs uppercase tracking-widest backdrop-blur-md">
                Featured Editorial
              </Badge>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight leading-[1.05] mb-8">
                {featured.title}
              </h1>
              <p className="text-xl text-white/50 mb-10 leading-relaxed font-light">
                {featured.excerpt}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-12 text-white/40 text-sm">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-gold/40" />
                  {featured.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold/40" />
                  {featured.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gold/40" />
                  {featured.readTime}
                </div>
              </div>

              <Button
                asChild
                size="lg"
                className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90 px-10 py-7 group"
              >
                <Link href={`/blog/${featured.slug}`}>
                  Read Full Story
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          EDITORIAL GRID
          ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-gold/50 mb-4 font-[family-name:var(--font-poppins)]">
                  The Archive
                </p>
                <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight leading-none">
                  Insights & Guides
                </h2>
              </div>

              <div className="flex flex-wrap gap-3">
                {BLOG_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-6 py-2 rounded-full text-xs uppercase tracking-widest transition-all duration-300 border ${
                      activeCategory === cat
                        ? "bg-gold text-gold-foreground border-gold"
                        : "bg-transparent text-white/40 border-white/10 hover:border-gold/30"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {filteredPosts.map((post, i) => (
              <AnimatedSection key={post.slug} delay={i * 0.1}>
                <div className="group relative flex flex-col h-full">
                  <div className="relative aspect-[4/5] overflow-hidden rounded-2xl mb-6">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-black/50 backdrop-blur-md text-gold/60 border-gold/10 text-[9px] uppercase tracking-[0.2em] px-3 py-1">
                        {post.category}
                      </Badge>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-4 text-[10px] text-gold/30 uppercase tracking-widest mb-3">
                      <span>{post.date}</span>
                      <span className="w-1 h-1 rounded-full bg-gold/10" />
                      <span>{post.readTime}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight mb-3 transition-colors group-hover:text-white/80 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-white/30 leading-relaxed mb-6 flex-1 line-clamp-3">
                      {post.excerpt}
                    </p>
                    <Link
                      href={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-gold/50 group-hover:text-gold transition-colors"
                    >
                      Read Story
                      <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          EXPERT TIPS
          ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-neutral-900 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection>
            <div className="text-center mb-20">
              <p className="text-xs uppercase tracking-[0.4em] text-gold/50 mb-4 font-[family-name:var(--font-poppins)] text-center">
                Mentor's Insights
              </p>
              <h2 className="text-4xl md:text-5xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight text-center">
                Trading Strategy Tips
              </h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {tips.map((tip, i) => (
              <AnimatedSection key={tip.title} delay={i * 0.07}>
                <div className="relative group rounded-3xl overflow-hidden aspect-[16/10]">
                  <Image
                    src={tip.image}
                    alt={tip.title}
                    fill
                    className="object-cover transition-transform duration-1000 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/60 group-hover:bg-black/40 transition-colors duration-500" />

                  <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end">
                    <div className="h-12 w-12 rounded-full bg-gold/10 backdrop-blur-md flex items-center justify-center mb-6">
                      <Sparkles className="h-5 w-5 text-gold/60" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tight mb-4">
                      {tip.title}
                    </h3>
                    <p className="text-white/50 text-base max-w-md leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════
          NEWSLETTER
          ══════════════════════════════════════════════════ */}
      <section className="py-24 bg-neutral-950 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)] opacity-50" />
        <div className="relative z-10 mx-auto max-w-4xl px-6">
          <div className="bg-neutral-900 border border-gold/5 p-12 md:p-20 rounded-[3rem] text-center">
            <AnimatedSection>
              <h2 className="text-4xl md:text-6xl font-bold text-white font-[family-name:var(--font-poppins)] tracking-tighter mb-6">
                Stay ahead of
                <br />
                the market.
              </h2>
              <p className="text-white/40 text-lg mb-10 max-w-md mx-auto leading-relaxed">
                Get weekly options analysis and price action guides delivered to your inbox.
              </p>

              <form
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
                onSubmit={(e) => e.preventDefault()}
              >
                <Input
                  type="email"
                  placeholder="Your email address..."
                  className="rounded-full bg-white/5 border-gold/10 text-white placeholder:text-white/20 h-14 px-8 focus:border-gold/30 transition-all"
                />
                <Button className="rounded-full bg-gold text-gold-foreground hover:bg-gold/90 h-14 px-10 font-bold shrink-0">
                  Subscribe
                </Button>
              </form>
            </AnimatedSection>
          </div>
        </div>
      </section>
    </>
  );
}
