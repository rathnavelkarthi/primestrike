"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { AlertCircle, Lock, Mail, User, Loader2, ArrowRight, Shield } from "lucide-react";
import { motion } from "framer-motion";

export default function SignupPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      if (profile?.role === "admin") {
        router.push("/admin");
      } else if (profile?.role === "student") {
        router.push("/dashboard");
      }
    }
  }, [user, profile, authLoading, router]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingState(true);

    if (!name || !email || !password) {
      setError("Please fill in all fields.");
      setLoadingState(false);
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoadingState(false);
      return;
    }

    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: "student",
          },
        },
      });

      if (signupError) {
        setError(signupError.message);
        setLoadingState(false);
        return;
      }

      if (data.user) {
        setSuccess(true);
        setLoadingState(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err: any) {
      setError("An unexpected error occurred. Please try again.");
      console.error(err);
      setLoadingState(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 pt-24 pb-12 relative overflow-hidden">
      {/* Premium ambient light backgrounds */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-neutral-900/50 rounded-full blur-[80px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <Card className="border border-white/10 bg-neutral-950/80 backdrop-blur-md shadow-2xl relative overflow-hidden">
          {/* Top subtle golden edge highlight */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

          <CardHeader className="space-y-2 text-center pt-8">
            <div className="mx-auto w-12 h-12 rounded-full border border-gold/30 bg-gold/5 flex items-center justify-center mb-2">
              <Shield className="h-5 w-5 text-gold" />
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold tracking-tight text-white font-[family-name:var(--font-poppins)]">
              Create Student Account
            </CardTitle>
            <CardDescription className="text-white/60 text-sm">
              Start your stock trading and option hedging journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 px-6 pb-6">
            {success ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-6 space-y-3"
              >
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-lg font-semibold text-white">Registration Successful!</h3>
                <p className="text-white/60 text-sm">
                  Your student portal account has been created. Redirecting to login...
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSignup} className="space-y-4">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="p-3.5 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-sm flex items-start gap-2.5"
                  >
                    <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Full Name</label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:ring-gold/20 rounded-lg transition-all"
                      disabled={loadingState}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      type="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:ring-gold/20 rounded-lg transition-all"
                      disabled={loadingState}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white/70 tracking-wide uppercase">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-white/40" />
                    <Input
                      type="password"
                      placeholder="•••••••• (Min. 6 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-11 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-gold/50 focus:ring-gold/20 rounded-lg transition-all"
                      disabled={loadingState}
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loadingState}
                  className="w-full h-11 rounded-lg bg-gold text-gold-foreground hover:bg-gold/90 hover:shadow-lg hover:shadow-gold/10 font-semibold transition-all mt-6 flex items-center justify-center gap-2 group"
                >
                  {loadingState ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    <>
                      Sign Up
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </Button>
              </form>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 border-t border-white/5 bg-white/[0.01] px-6 py-5 text-center">
            <p className="text-xs text-white/50">
              Already have an account?{" "}
              <Link href="/login" className="text-gold hover:underline font-medium">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
