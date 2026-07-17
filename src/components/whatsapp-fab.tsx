"use client";

import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { SITE_WHATSAPP } from "@/lib/constants";

const whatsappUrl = `https://wa.me/${SITE_WHATSAPP.replace(/[^0-9]/g, "")}?text=${encodeURIComponent("Hi, I'd like to enquire about the trading classes.")}`;

export function WhatsAppFAB() {
  return (
    <motion.a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 flex items-center justify-center hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40 transition-all"
      initial={{ opacity: 0, scale: 0, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: 1.5, type: "spring", stiffness: 260, damping: 20 }}
    >
      <MessageCircle className="h-6 w-6" />
    </motion.a>
  );
}
