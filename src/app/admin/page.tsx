"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabaseClient";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Trash2, 
  Users, 
  Plus, 
  Loader2, 
  Check, 
  AlertCircle,
  Video,
  Mail,
  Phone,
  Search,
  ExternalLink,
  MessageSquare,
  TrendingUp,
  Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  link: string;
  location: string;
  category: string;
}

interface StudentProfile {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  experience?: string;
  joined_course?: string;
  first_class_date?: string;
  paid_amount?: string;
  goal?: string;
  capital?: string;
  notes?: string;
  status: "new" | "contacted" | "joined" | "ignored";
  created_at: string;
}

export default function AdminDashboard() {
  const { user, profile, loading: authLoading } = useAuth();
  const router = useRouter();

  // Tab State
  const [activeTab, setActiveTab] = useState<"events" | "leads" | "students">("events");

  // Data States
  const [events, setEvents] = useState<EventItem[]>([]);
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [fetchingData, setFetchingData] = useState(true);

  // Form States for creating events
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [link, setLink] = useState("");
  const [location, setLocation] = useState("Online Webinar");
  const [category, setCategory] = useState("Options Course");
  
  const [formSuccess, setFormSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  // Calendar Navigation State
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedDayEvents, setSelectedDayEvents] = useState<EventItem[]>([]);

  // Redirect unauthorized users
  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push("/login");
      } else if (!profile) {
        router.push("/login");
      } else if (profile.role !== "admin") {
        router.push("/dashboard");
      }
    }
  }, [user, profile, authLoading, router]);

  // Fetch Database Data (Events, Students, & Leads)
  const fetchData = async () => {
    try {
      setFetchingData(true);
      
      // 1. Fetch events
      const { data: eventsData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (eventsError) console.error("Error events:", eventsError);
      if (eventsData) setEvents(eventsData as EventItem[]);

      // 2. Fetch student profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "student")
        .order("created_at", { ascending: false });

      if (profilesError) console.error("Error profiles:", profilesError);
      if (profilesData) setStudents(profilesData as StudentProfile[]);

      // 3. Fetch leads
      const { data: leadsData, error: leadsError } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });

      if (leadsError) console.error("Error fetching leads:", leadsError);
      if (leadsData) setLeads(leadsData as Lead[]);

    } catch (err) {
      console.error("Error fetching data:", err);
    } finally {
      setFetchingData(false);
    }
  };

  useEffect(() => {
    if (user && profile?.role === "admin") {
      fetchData();
    }
  }, [user, profile]);

  // Filter events for the selected date
  useEffect(() => {
    const formattedSelected = selectedDate.toISOString().split("T")[0];
    const filtered = events.filter((e) => e.date === formattedSelected);
    setSelectedDayEvents(filtered);
  }, [selectedDate, events]);

  // Handle Event Creation
  const handleAddEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(false);
    setFormSubmitting(true);

    if (!title || !eventDate || !eventTime) {
      setFormError("Title, Date, and Time are required fields.");
      setFormSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("events")
        .insert([
          {
            title,
            description,
            date: eventDate,
            time: eventTime,
            link,
            location,
            category,
            created_by: user?.id
          }
        ])
        .select();

      if (error) {
        setFormError(error.message);
        setFormSubmitting(false);
        return;
      }

      setFormSuccess(true);
      // Reset Form fields
      setTitle("");
      setDescription("");
      setEventDate("");
      setEventTime("");
      setLink("");
      
      // Refresh events list
      await fetchData();
    } catch (err: any) {
      setFormError("Could not submit. Try again.");
    } finally {
      setFormSubmitting(false);
      setTimeout(() => setFormSuccess(false), 3000);
    }
  };

  // Handle Event Deletion
  const handleDeleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this webinar event?")) return;

    try {
      const { error } = await supabase
        .from("events")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Error deleting event: " + error.message);
        return;
      }

      await fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  // Handle Lead Status Update
  const handleUpdateLeadStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("leads")
        .update({ status: newStatus })
        .eq("id", id);

      if (error) {
        alert("Error updating lead status: " + error.message);
        return;
      }

      await fetchData();
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Handle Lead Deletion
  const handleDeleteLead = async (id: string) => {
    if (!confirm("Are you sure you want to permanently delete this lead?")) return;

    try {
      const { error } = await supabase
        .from("leads")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Error deleting lead: " + error.message);
        return;
      }

      await fetchData();
    } catch (err) {
      console.error("Error deleting lead:", err);
    }
  };

  if (authLoading || !user || !profile || profile.role !== "admin") {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const blankCells = Array(firstDayIndex).fill(null);
  const monthCells = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));
  const totalCells = [...blankCells, ...monthCells];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const hasEventOnDate = (date: Date) => {
    const formattedDate = date.toISOString().split("T")[0];
    return events.some((e) => e.date === formattedDate);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 md:px-8 relative overflow-hidden">
      {/* Background gradients */}
      <div className="absolute top-10 left-10 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-neutral-900/50 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Welcome Header */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 md:p-8 rounded-2xl border border-white/10 bg-gradient-to-r from-neutral-950 via-neutral-900/50 to-neutral-950 flex flex-wrap items-center justify-between gap-4"
        >
          <div className="space-y-2">
            <span className="text-gold text-xs font-semibold uppercase tracking-widest bg-gold/10 px-3 py-1 rounded-full">
              Admin Control Center
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white font-[family-name:var(--font-poppins)]">
              Welcome, {profile.name || "Administrator"}
            </h1>
            <p className="text-white/60 text-sm max-w-xl">
              Manage webinar events, review survey assessment leads, and browse registered students in your portal directory.
            </p>
          </div>
        </motion.div>

        {/* Tab Subnavigation */}
        <div className="flex gap-4 border-b border-white/10 pb-1 pt-2">
          <button
            onClick={() => setActiveTab("events")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all px-2 flex items-center gap-2 ${
              activeTab === "events"
                ? "border-gold text-gold"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <CalendarIcon className="h-4 w-4" />
            Webinars & Calendar
          </button>
          <button
            onClick={() => setActiveTab("leads")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all px-2 flex items-center gap-2 ${
              activeTab === "leads"
                ? "border-gold text-gold"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            Joined Course & Enquiries
            {leads.filter(l => l.status === "new").length > 0 && (
              <span className="text-[10px] bg-gold text-gold-foreground font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {leads.filter(l => l.status === "new").length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("students")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-all px-2 flex items-center gap-2 ${
              activeTab === "students"
                ? "border-gold text-gold"
                : "border-transparent text-white/50 hover:text-white"
            }`}
          >
            <Users className="h-4 w-4" />
            Registered Students
          </button>
        </div>

        {/* TAB 1: EVENTS MANAGER */}
        {activeTab === "events" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Calendar grid & selected day listing (Span 2) */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border border-white/10 bg-neutral-950/80 backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 border-b border-white/5">
                  <div>
                    <CardTitle className="text-lg font-bold flex items-center gap-2 text-white font-[family-name:var(--font-poppins)]">
                      <CalendarIcon className="h-5 w-5 text-gold" />
                      Webinar Schedule Manager
                    </CardTitle>
                    <CardDescription className="text-white/50 text-xs">
                      View and select days to manage scheduled webinars
                    </CardDescription>
                  </div>
                  
                  {/* Month switcher */}
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handlePrevMonth}
                      className="p-2 border border-white/10 hover:border-white/20 rounded-lg bg-white/5 text-white/70 hover:text-white transition-all"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <span className="text-sm font-semibold text-white min-w-[120px] text-center">
                      {monthNames[month]} {year}
                    </span>
                    <button 
                      onClick={handleNextMonth}
                      className="p-2 border border-white/10 hover:border-white/20 rounded-lg bg-white/5 text-white/70 hover:text-white transition-all"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-6">
                  {fetchingData ? (
                    <div className="h-80 flex flex-col items-center justify-center text-white/40">
                      <Loader2 className="h-6 w-6 animate-spin text-gold mb-2" />
                      Syncing calendar details...
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Days Header */}
                      <div className="grid grid-cols-7 text-center text-xs font-semibold text-white/40 uppercase tracking-wider pb-2">
                        <div>Sun</div>
                        <div>Mon</div>
                        <div>Tue</div>
                        <div>Wed</div>
                        <div>Thu</div>
                        <div>Fri</div>
                        <div>Sat</div>
                      </div>
                      
                      {/* Grid cells */}
                      <div className="grid grid-cols-7 gap-2">
                        {totalCells.map((cellDate, idx) => {
                          if (!cellDate) {
                            return <div key={`empty-${idx}`} className="aspect-square" />;
                          }

                          const dayNum = cellDate.getDate();
                          const isSelected = selectedDate.toDateString() === cellDate.toDateString();
                          const hasEvents = hasEventOnDate(cellDate);
                          const isToday = new Date().toDateString() === cellDate.toDateString();

                          return (
                            <button
                              key={`day-${dayNum}`}
                              onClick={() => setSelectedDate(cellDate)}
                              className={`aspect-square relative rounded-xl border flex flex-col items-center justify-center transition-all ${
                                isSelected
                                  ? "bg-gold border-gold text-gold-foreground font-bold shadow-lg shadow-gold/20"
                                  : isToday
                                  ? "border-gold/50 bg-gold/5 text-white font-semibold"
                                  : "border-white/5 hover:border-white/20 bg-neutral-900/30 text-white/80 hover:text-white"
                              }`}
                            >
                              <span className="text-sm">{dayNum}</span>
                              {hasEvents && (
                                <span className={`absolute bottom-1.5 w-1.5 h-1.5 rounded-full ${
                                  isSelected ? "bg-black" : "bg-gold"
                                }`} />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Event details drawer / card list */}
              <Card className="border border-white/10 bg-neutral-950/80 backdrop-blur-md">
                <CardHeader className="border-b border-white/5 py-4">
                  <CardTitle className="text-md font-bold text-white font-[family-name:var(--font-poppins)]">
                    Scheduled webinars on {selectedDate.toLocaleDateString("en-IN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric"
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-6">
                  <AnimatePresence mode="wait">
                    {selectedDayEvents.length > 0 ? (
                      <motion.div 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        className="space-y-4"
                      >
                        {selectedDayEvents.map((event) => (
                          <div key={event.id} className="p-4 rounded-xl border border-white/10 bg-white/[0.02] flex items-start justify-between gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-semibold tracking-wider text-gold-foreground bg-gold/80 px-2 py-0.5 rounded uppercase">
                                  {event.category}
                                </span>
                                <h3 className="text-base font-semibold text-white">{event.title}</h3>
                              </div>
                              <p className="text-xs text-white/60 line-clamp-2">{event.description}</p>
                              
                              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-white/40">
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3.5 w-3.5 text-gold shrink-0" />
                                  <span>{event.time}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-3.5 w-3.5 text-gold shrink-0" />
                                  <span>{event.location}</span>
                                </div>
                              </div>
                              
                              {event.link && (
                                <div className="flex items-center gap-1 text-xs text-gold">
                                  <Video className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate max-w-[250px]">{event.link}</span>
                                </div>
                              )}
                            </div>

                            <Button
                              onClick={() => handleDeleteEvent(event.id)}
                              variant="ghost"
                              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 h-9 w-9 rounded-lg transition-all shrink-0"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </Button>
                          </div>
                        ))}
                      </motion.div>
                    ) : (
                      <motion.p 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-6 text-sm text-white/40"
                      >
                        No webinars scheduled for this date.
                      </motion.p>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </div>

            {/* Creation event form (Right side column) */}
            <div className="space-y-6">
              <Card className="border border-white/10 bg-neutral-950/80 backdrop-blur-md">
                <CardHeader className="border-b border-white/5 py-4">
                  <CardTitle className="text-md font-bold flex items-center gap-2 text-white font-[family-name:var(--font-poppins)]">
                    <Plus className="h-5 w-5 text-gold" />
                    Add New Event
                  </CardTitle>
                  <CardDescription className="text-white/50 text-xs">
                    Fill details below to broadcast upcoming webinar
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <form onSubmit={handleAddEvent} className="space-y-4">
                    
                    {formSuccess && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center gap-2"
                      >
                        <Check className="h-4 w-4 shrink-0" />
                        <span>Webinar scheduled successfully!</span>
                      </motion.div>
                    )}

                    {formError && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="p-3 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-xs flex items-start gap-2"
                      >
                        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                        <span>{formError}</span>
                      </motion.div>
                    )}

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Webinar Title</label>
                      <Input
                        type="text"
                        placeholder="e.g. Option Chain & Hedging Setup"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10 text-sm"
                        disabled={formSubmitting}
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Date</label>
                        <Input
                          type="date"
                          value={eventDate}
                          onChange={(e) => setEventDate(e.target.value)}
                          className="bg-white/5 border-white/10 text-white h-10 text-sm cursor-pointer"
                          disabled={formSubmitting}
                          required
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Time</label>
                        <Input
                          type="text"
                          placeholder="e.g. 10:00 AM - 12:00 PM"
                          value={eventTime}
                          onChange={(e) => setEventTime(e.target.value)}
                          className="bg-white/5 border-white/10 text-white h-10 text-sm"
                          disabled={formSubmitting}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Category</label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-neutral-900 border border-white/10 rounded-lg text-white h-10 px-3 text-xs outline-none focus:border-gold/50"
                          disabled={formSubmitting}
                        >
                          <option value="Options Course">Options Course</option>
                          <option value="Stock Trading">Stock Trading</option>
                          <option value="Technical Analysis">Technical Analysis</option>
                          <option value="Algo Webinars">Algo Webinars</option>
                          <option value="Psychology">Psychology</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Venue Location</label>
                        <Input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="bg-white/5 border-white/10 text-white h-10 text-sm"
                          disabled={formSubmitting}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Zoom / Webinar Link</label>
                      <Input
                        type="url"
                        placeholder="https://zoom.us/j/..."
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 h-10 text-sm"
                        disabled={formSubmitting}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-semibold text-white/60 uppercase tracking-wider">Brief Description</label>
                      <Textarea
                        placeholder="Specify topics covered, prerequisites, etc."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="bg-white/5 border-white/10 text-white placeholder:text-white/30 min-h-[70px] text-xs resize-none"
                        disabled={formSubmitting}
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={formSubmitting}
                      className="w-full h-10 bg-gold text-gold-foreground hover:bg-gold/90 font-semibold text-sm rounded-lg flex items-center justify-center gap-1.5 transition-all mt-4"
                    >
                      {formSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Scheduling...
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Broadcast Event
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* TAB 2: TRADING ASSESSMENT LEADS */}
        {activeTab === "leads" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border border-white/10 bg-neutral-950/80 backdrop-blur-md">
              <CardHeader className="border-b border-white/5 py-4">
                <CardTitle className="text-md font-bold flex items-center gap-2 text-white font-[family-name:var(--font-poppins)]">
                  <TrendingUp className="h-4.5 w-4.5 text-gold" />
                  Joined Course Submissions & Enquiries ({leads.length})
                </CardTitle>
                <CardDescription className="text-white/50 text-xs">
                  Review student course registrations, check first class dates, and verify fees paid.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 px-0">
                {fetchingData ? (
                  <div className="py-8 text-center text-white/40 flex items-center justify-center gap-2">
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-gold" />
                    Retrieving course submissions...
                  </div>
                ) : leads.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-white/55 text-xs font-semibold uppercase tracking-wider bg-white/[0.01]">
                          <th className="py-3 px-6">Date & Student Name</th>
                          <th className="py-3 px-6">Contact Details</th>
                          <th className="py-3 px-6">Joined Course</th>
                          <th className="py-3 px-6">Class Date & Fees</th>
                          <th className="py-3 px-6">Notes / Remarks</th>
                          <th className="py-3 px-6">Status Badge</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {leads.map((lead) => {
                          const courseName = lead.joined_course || lead.experience || "Basic to Advance";
                          const isAdvance = courseName.toLowerCase().includes("advance level");
                          const formattedFee = lead.paid_amount 
                            ? (lead.paid_amount.startsWith("₹") ? lead.paid_amount : `₹${lead.paid_amount}`)
                            : "—";

                          return (
                            <tr key={lead.id} className="hover:bg-white/[0.01] transition-all">
                              <td className="py-3.5 px-6 font-medium text-white">
                                <div className="font-semibold text-white">{lead.name}</div>
                                <div className="text-[10px] text-white/40">
                                  {new Date(lead.created_at).toLocaleDateString("en-IN", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                  })}
                                </div>
                              </td>
                              <td className="py-3.5 px-6 space-y-1">
                                <div className="flex items-center gap-1.5 text-xs text-white/70">
                                  <Mail className="h-3.5 w-3.5 text-gold shrink-0" />
                                  <a href={`mailto:${lead.email}`} className="hover:underline hover:text-gold truncate max-w-[160px]">
                                    {lead.email}
                                  </a>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-white/70">
                                  <Phone className="h-3.5 w-3.5 text-gold shrink-0" />
                                  <a href={`tel:${lead.phone}`} className="hover:underline hover:text-gold">
                                    {lead.phone}
                                  </a>
                                </div>
                              </td>
                              <td className="py-3.5 px-6">
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-wider inline-block ${
                                  isAdvance
                                    ? "bg-purple-500/10 text-purple-300 border-purple-500/30"
                                    : "bg-gold/10 text-gold border-gold/30"
                                }`}>
                                  {courseName}
                                </span>
                              </td>
                              <td className="py-3.5 px-6 space-y-1">
                                <div className="text-xs flex items-center gap-1 text-white/80">
                                  <span className="text-white/40">1st Class:</span>
                                  <span className="text-gold font-medium">{lead.first_class_date || "Not set"}</span>
                                </div>
                                <div className="text-xs flex items-center gap-1 text-white/80">
                                  <span className="text-white/40">Paid Fees:</span>
                                  <span className="text-emerald-400 font-semibold">{formattedFee}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-6 max-w-[180px]">
                                <p className="text-xs text-white/60 line-clamp-2" title={lead.notes}>
                                  {lead.notes || "—"}
                                </p>
                              </td>
                              <td className="py-3.5 px-6">
                                <span className={`text-[9px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider ${
                                  lead.status === "new"
                                    ? "bg-red-500/10 text-red-400 border border-red-500/20 animate-pulse"
                                    : lead.status === "contacted"
                                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                                    : lead.status === "joined"
                                    ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                                    : "bg-neutral-500/10 text-neutral-400 border border-neutral-500/20"
                                }`}>
                                  {lead.status}
                                </span>
                              </td>
                              <td className="py-3.5 px-6 text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <select
                                    value={lead.status}
                                    onChange={(e) => handleUpdateLeadStatus(lead.id, e.target.value)}
                                    className="bg-neutral-900 border border-white/10 rounded-lg text-white text-[11px] h-8 px-2 outline-none focus:border-gold/50 cursor-pointer"
                                  >
                                    <option value="new">New Lead</option>
                                    <option value="contacted">Contacted</option>
                                    <option value="joined">Joined Academy</option>
                                    <option value="ignored">Ignored</option>
                                  </select>
                                  <Button
                                    onClick={() => handleDeleteLead(lead.id)}
                                    variant="ghost"
                                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-1.5 h-8 w-8 rounded-lg transition-all shrink-0"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-sm text-white/40">No course registrations or enquiries submitted yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* TAB 3: REGISTERED STUDENTS */}
        {activeTab === "students" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border border-white/10 bg-neutral-950/80 backdrop-blur-md">
              <CardHeader className="border-b border-white/5 py-4">
                <CardTitle className="text-md font-bold flex items-center gap-2 text-white font-[family-name:var(--font-poppins)]">
                  <Users className="h-4.5 w-4.5 text-gold" />
                  Registered Student Directory ({students.length})
                </CardTitle>
                <CardDescription className="text-white/50 text-xs">
                  View and audit students enrolled in the Prime Strike portal
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4 px-0">
                {fetchingData ? (
                  <div className="py-8 text-center text-white/40 flex items-center justify-center gap-2">
                    <Loader2 className="h-4.5 w-4.5 animate-spin text-gold" />
                    Retrieving active profiles...
                  </div>
                ) : students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm border-collapse">
                      <thead>
                        <tr className="border-b border-white/5 text-white/55 text-xs font-semibold uppercase tracking-wider bg-white/[0.01]">
                          <th className="py-3 px-6">Name</th>
                          <th className="py-3 px-6">Email Address</th>
                          <th className="py-3 px-6">Date Registered</th>
                          <th className="py-3 px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {students.map((student) => (
                          <tr key={student.id} className="hover:bg-white/[0.01] transition-all">
                            <td className="py-3.5 px-6 font-medium text-white">{student.name || "N/A"}</td>
                            <td className="py-3.5 px-6 text-white/70">{student.email}</td>
                            <td className="py-3.5 px-6 text-white/55">
                              {new Date(student.created_at).toLocaleDateString("en-IN", {
                                year: "numeric",
                                month: "short",
                                day: "numeric"
                              })}
                            </td>
                            <td className="py-3.5 px-6 text-right">
                              <Button 
                                variant="ghost" 
                                className="text-xs text-gold border border-gold/15 bg-gold/5 hover:bg-gold/15 hover:border-gold/30 px-3 h-8 rounded-lg font-medium transition-all"
                                onClick={() => alert(`Reviewing journal for ${student.name || student.email} (Feature Roadmap Concept)`)}
                              >
                                Audit Journal
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-center py-8 text-sm text-white/40">No student profiles registered in the system yet.</p>
                )}
              </CardContent>
            </Card>
          </motion.div>
        )}

      </div>
    </div>
  );
}
