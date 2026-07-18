"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { 
  TrendingUp, 
  Mail, 
  Phone, 
  User, 
  HelpCircle, 
  Coins, 
  Briefcase, 
  Loader2, 
  CheckCircle, 
  Instagram, 
  Send,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

export default function SurveyPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [experience, setExperience] = useState("beginner");
  const [goal, setGoal] = useState("options");
  const [capital, setCapital] = useState("50k-2L");
  const [notes, setNotes] = useState("");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!name || !email || !phone || !experience) {
      setError("Please fill in all required fields.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          experience,
          goal,
          capital,
          notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Something went wrong. Please try again.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      console.error(err);
      setError("Failed to connect to the server. Please check your network.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 md:px-8 relative overflow-hidden flex items-center justify-center">
      {/* Background glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-neutral-900/50 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-2xl relative z-10"
      >
        <Card className="border border-white/10 bg-neutral-950/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Subtle top gold gradient line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          {success ? (
            <CardContent className="pt-10 pb-8 px-6 md:px-10 text-center space-y-6">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 text-gold flex items-center justify-center mx-auto"
              >
                <CheckCircle className="h-8 w-8" />
              </motion.div>

              <div className="space-y-2">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-poppins)]">
                  Assessment Submitted!
                </h2>
                <p className="text-white/60 text-sm max-w-md mx-auto">
                  Thank you, <span className="text-white font-medium">{name}</span>. We have received your profile. A confirmation email has been sent to <span className="text-gold">{email}</span>.
                </p>
                <p className="text-white/40 text-xs max-w-md mx-auto pt-1">
                  Our team will review your objectives and contact you shortly at <span className="text-white font-medium">{phone}</span> to help guide your trading path.
                </p>
              </div>

              <div className="border-t border-white/5 pt-6 space-y-4">
                <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase">
                  Step 1: Connect and Follow Us
                </h3>
                <p className="text-xs text-white/50">
                  Follow our channels to see daily chart markups, option alerts, and trade reviews:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto">
                  <Button
                    asChild
                    variant="outline"
                    className="border-white/10 hover:bg-pink-500/10 hover:border-pink-500/30 text-white flex items-center justify-center gap-2 h-11 transition-all rounded-xl"
                  >
                    <a
                      href="https://www.instagram.com/prime__strike?igsh=MTBvZTkzdzFjNXA2cw%3D%3D&utm_source=qr"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Instagram className="h-4.5 w-4.5 text-pink-500" />
                      Follow on Instagram
                    </a>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="border-white/10 hover:bg-blue-500/10 hover:border-blue-500/30 text-white flex items-center justify-center gap-2 h-11 transition-all rounded-xl"
                  >
                    <a
                      href="https://t.me/prime_strik"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Send className="h-4.5 w-4.5 text-blue-400" />
                      Join Telegram Channel
                    </a>
                  </Button>
                </div>
              </div>

              <div className="border-t border-white/5 pt-6">
                <h3 className="text-sm font-semibold text-white/80 tracking-wider uppercase mb-3">
                  Step 2: Create Portal Account
                </h3>
                <Card className="border border-white/5 bg-white/[0.01] p-4 max-w-md mx-auto text-left space-y-3">
                  <p className="text-xs text-white/60 leading-relaxed">
                    Set up your login details on our Student Portal to access the webinars calendar, join online sessions, and download study guides.
                  </p>
                  <Button
                    asChild
                    className="w-full bg-gold text-gold-foreground hover:bg-gold/90 font-semibold text-xs h-10 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Link href="/signup">
                      Create Student Account
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </Card>
              </div>
            </CardContent>
          ) : (
            <form onSubmit={handleSubmit}>
              <CardHeader className="space-y-2 text-center pt-8">
                <div className="mx-auto w-12 h-12 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mb-2">
                  <TrendingUp className="h-5 w-5 text-gold" />
                </div>
                <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-poppins)]">
                  Trading Assessment
                </CardTitle>
                <CardDescription className="text-white/60 text-sm max-w-md mx-auto">
                  Submit details to help us understand your experience level and personalize your trading journey.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-5 px-6 md:px-10 pb-6">
                {error && (
                  <div className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs flex items-center gap-2">
                    <span className="font-semibold">⚠️ {error}</span>
                  </div>
                )}

                {/* Section 1: Contact Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-wider border-b border-white/5 pb-1">
                    1. Contact Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/70">Full Name *</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="pl-9 h-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm focus:border-gold/50 focus:ring-gold/20"
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/70">Email Address *</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="pl-9 h-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm focus:border-gold/50 focus:ring-gold/20"
                          disabled={loading}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">Phone Number (WhatsApp Preferred) *</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                      <Input
                        type="tel"
                        placeholder="e.g. +91 95002 98631"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="pl-9 h-10 bg-white/5 border-white/10 text-white placeholder:text-white/30 text-sm focus:border-gold/50 focus:ring-gold/20"
                        disabled={loading}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Section 2: Trading Profile */}
                <div className="space-y-4 pt-2">
                  <h3 className="text-xs font-bold text-gold uppercase tracking-wider border-b border-white/5 pb-1">
                    2. Trading Experience & Goals
                  </h3>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                      <Briefcase className="h-4 w-4 text-white/40" />
                      Trading Experience Level *
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setExperience("beginner")}
                        className={`p-3 border rounded-xl text-left transition-all flex flex-col gap-1 ${
                          experience === "beginner"
                            ? "bg-gold/10 border-gold text-white"
                            : "border-white/5 bg-white/[0.01] hover:border-white/15 text-white/70"
                        }`}
                        disabled={loading}
                      >
                        <span className="text-xs font-bold">Beginner</span>
                        <span className="text-[10px] text-white/40">New to trading, no past transactions</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExperience("intermediate")}
                        className={`p-3 border rounded-xl text-left transition-all flex flex-col gap-1 ${
                          experience === "intermediate"
                            ? "bg-gold/10 border-gold text-white"
                            : "border-white/5 bg-white/[0.01] hover:border-white/15 text-white/70"
                        }`}
                        disabled={loading}
                      >
                        <span className="text-xs font-bold">Intermediate</span>
                        <span className="text-[10px] text-white/40">Trades occasionally, knows chart patterns</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setExperience("experienced")}
                        className={`p-3 border rounded-xl text-left transition-all flex flex-col gap-1 ${
                          experience === "experienced"
                            ? "bg-gold/10 border-gold text-white"
                            : "border-white/5 bg-white/[0.01] hover:border-white/15 text-white/70"
                        }`}
                        disabled={loading}
                      >
                        <span className="text-xs font-bold">Experienced</span>
                        <span className="text-[10px] text-white/40">Trades options/derivatives, has active setups</span>
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                        <HelpCircle className="h-4 w-4 text-white/40" />
                        Main Focus Area
                      </label>
                      <select
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl text-white h-10 px-3 text-xs outline-none focus:border-gold/50"
                        disabled={loading}
                      >
                        <option value="options">Options buying & hedging strategies</option>
                        <option value="technical">Price action & technical analysis</option>
                        <option value="algo">Algorithmic trading setups</option>
                        <option value="wealth">General wealth & basics</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-white/70 flex items-center gap-1.5">
                        <Coins className="h-4 w-4 text-white/40" />
                        Approx. Trading Capital
                      </label>
                      <select
                        value={capital}
                        onChange={(e) => setCapital(e.target.value)}
                        className="w-full bg-neutral-900 border border-white/10 rounded-xl text-white h-10 px-3 text-xs outline-none focus:border-gold/50"
                        disabled={loading}
                      >
                        <option value="<50k">Under ₹50,000</option>
                        <option value="50k-2L">₹50,000 - ₹2 Lakhs</option>
                        <option value="2L-5L">₹2 Lakhs - ₹5 Lakhs</option>
                        <option value=">5L">Over ₹5 Lakhs</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white/70">What are you hoping to learn? (Optional)</label>
                    <Textarea
                      placeholder="e.g. I want to learn option hedging to protect my portfolio, or how to read charts..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-white/5 border-white/10 text-white placeholder:text-white/30 text-xs min-h-[60px] resize-none rounded-xl"
                      disabled={loading}
                    />
                  </div>
                </div>
              </CardContent>

              <CardFooter className="px-6 md:px-10 pb-8 flex flex-col space-y-4 border-t border-white/5 bg-white/[0.01] pt-5">
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full h-11 bg-gold text-gold-foreground hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/10 font-bold transition-all flex items-center justify-center gap-2 rounded-xl group text-sm"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting Assessment...
                    </>
                  ) : (
                    <>
                      Submit Profile Details
                      <ChevronRight className="h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </Button>
                <p className="text-[10px] text-white/30 text-center">
                  By submitting, you agree to receive a confirmation email and follow-up contact regarding your trading study.
                </p>
              </CardFooter>
            </form>
          )}
        </Card>
      </motion.div>
    </div>
  );
}
