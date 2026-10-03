"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { AIActionButton } from "@/components/ui/AIActionButton";
import { StatusBadge } from "@/components/ui/Badge";
import { AIBadge } from "@/components/ui/AIBadge";
import { TextInput } from "@/components/ui/TextInput";
import { SearchInput } from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Switch } from "@/components/ui/Switch";
import { FilterPill } from "@/components/ui/FilterPill";
import { MetricCard } from "@/components/ui/MetricCard";
import { LeadCard } from "@/components/ui/LeadCard";
import { ConversationCard } from "@/components/ui/ConversationCard";
import { AIInsightCard } from "@/components/ui/AIInsightCard";
import { ActivityCard } from "@/components/ui/ActivityCard";
import { EmptyStateCard } from "@/components/ui/EmptyStateCard";
import { ErrorState } from "@/components/ui/ErrorState";
import { MetricCardSkeleton, TableSkeleton, ChatSkeleton } from "@/components/ui/Skeleton";
import { Logo, LogoIcon } from "@/components/brand/Logo";
import { mockRecentLeads } from "@/lib/mock-data/leads";
import { mockRecentConversations } from "@/lib/mock-data/conversations";
import { mockAiActivities, mockAiInsights } from "@/lib/mock-data/ai-activity";
import {
  HiOutlineSparkles,
  HiOutlineEnvelope,
  HiOutlinePhone,
} from "react-icons/hi2";

export default function DesignSystemPage() {
  const [activeTab, setActiveTab] = useState<string>("all");
  const [switchState1, setSwitchState1] = useState(true);
  const [switchState2, setSwitchState2] = useState(false);
  const [checkboxState, setCheckboxState] = useState(true);
  const [textVal, setTextVal] = useState("Acme Growth Systems");
  const [searchVal, setSearchVal] = useState("");

  const colorTokens = [
    {
      name: "Primary Blue",
      hex: "#2563EB",
      bgClass: "bg-[#2563EB]",
      textClass: "text-white",
      description: "Primary actions, active nav, important links, primary CTAs",
    },
    {
      name: "Primary Blue Light",
      hex: "#EFF6FF",
      bgClass: "bg-[#EFF6FF]",
      textClass: "text-[#1E40AF]",
      borderClass: "border-[#BFDBFE]",
      description: "Active nav backgrounds, selected states, informative badges",
    },
    {
      name: "Dark Navy",
      hex: "#0F172A",
      bgClass: "bg-[#0F172A]",
      textClass: "text-white",
      description: "Major headings, top-level navigation text, high-contrast labels",
    },
    {
      name: "Primary Text",
      hex: "#172033",
      bgClass: "bg-[#172033]",
      textClass: "text-white",
      description: "Default body text, titles, card content",
    },
    {
      name: "Secondary Text",
      hex: "#64748B",
      bgClass: "bg-[#64748B]",
      textClass: "text-white",
      description: "Subtitles, metadata, form labels, timestamps",
    },
    {
      name: "Muted Text",
      hex: "#94A3B8",
      bgClass: "bg-[#94A3B8]",
      textClass: "text-white",
      description: "Placeholders, disabled states, subtle microcopy",
    },
    {
      name: "Emerald Green (Success / Qualified)",
      hex: "#10B981",
      bgClass: "bg-[#10B981]",
      textClass: "text-white",
      description: "Qualified leads, positive metrics, won deals, live indicators",
    },
    {
      name: "AI Violet (AI Accent)",
      hex: "#8B5CF6",
      bgClass: "bg-[#8B5CF6]",
      textClass: "text-white",
      description: "AI badges, AI-generated insight cards, copilot actions",
    },
    {
      name: "Warning Amber",
      hex: "#F59E0B",
      bgClass: "bg-[#F59E0B]",
      textClass: "text-white",
      description: "Follow-up reminders, proposal alerts, pending reviews",
    },
    {
      name: "Error Red",
      hex: "#EF4444",
      bgClass: "bg-[#EF4444]",
      textClass: "text-white",
      description: "Lost leads, escalations, critical warnings, destructive actions",
    },
    {
      name: "Page Background",
      hex: "#F8FAFC",
      bgClass: "bg-[#F8FAFC]",
      textClass: "text-[#0F172A]",
      borderClass: "border-[#E2E8F0]",
      description: "Application page background, neutral canvas",
    },
    {
      name: "Surface White",
      hex: "#FFFFFF",
      bgClass: "bg-white",
      textClass: "text-[#0F172A]",
      borderClass: "border-[#E2E8F0]",
      description: "Card backgrounds, sidebar, topbar, modal surfaces",
    },
  ];

  const statuses = [
    "New",
    "Contacted",
    "Interested",
    "Qualified",
    "Demo",
    "Proposal",
    "Negotiation",
    "Won",
    "Lost",
    "Follow-up",
    "Escalated",
    "Active",
    "Inactive",
  ];

  return (
    <AppLayout>
      <PageHeader
        title="Design System & Component Showcase"
        subtitle="Foundational UI tokens, patterns, skeletons, states, and components for NEXUS AI."
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <HiOutlineSparkles className="h-3.5 w-3.5 text-[#8B5CF6]" />
            Single Source of Truth
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <FilterPill
              label="All Systems"
              isActive={activeTab === "all"}
              onClick={() => setActiveTab("all")}
            />
            <FilterPill
              label="Tokens"
              isActive={activeTab === "tokens"}
              onClick={() => setActiveTab("tokens")}
            />
            <FilterPill
              label="Components"
              isActive={activeTab === "components"}
              onClick={() => setActiveTab("components")}
            />
            <FilterPill
              label="States & Skeletons"
              isActive={activeTab === "states"}
              onClick={() => setActiveTab("states")}
            />
          </div>
        }
      />

      <div className="space-y-12">
        {/* SECTION 1: BRAND IDENTITY */}
        {(activeTab === "all" || activeTab === "tokens") && (
          <section className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h2 className="text-lg font-bold text-[#0F172A]">1. Brand Identity & Marks</h2>
              <p className="text-xs text-[#64748B]">
                Primary logo treatments, compact marks, and typography monograms.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white p-6 rounded-xl border border-[#E2E8F0]">
              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#64748B] block">Full Logo with Descriptor</span>
                <Logo variant="full" size="lg" showDescriptor />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#64748B] block">Compact Mark</span>
                <Logo variant="compact" size="md" />
              </div>

              <div className="space-y-2">
                <span className="text-xs font-semibold text-[#64748B] block">Symbol Mark (CSS / SVG)</span>
                <div className="flex items-center gap-3">
                  <LogoIcon size={36} />
                  <LogoIcon size={28} />
                  <LogoIcon size={22} />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 2: COLOR SYSTEM */}
        {(activeTab === "all" || activeTab === "tokens") && (
          <section className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h2 className="text-lg font-bold text-[#0F172A]">2. Centralized Color Palette</h2>
              <p className="text-xs text-[#64748B]">
                Hierarchy: White → Navy → Blue → Emerald Green → Violet AI.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
              {colorTokens.map((token) => (
                <div
                  key={token.name}
                  className="rounded-xl border border-[#E2E8F0] bg-white overflow-hidden shadow-xs flex flex-col"
                >
                  <div
                    className={`h-20 w-full ${token.bgClass} ${token.borderClass || ""} flex items-end p-3`}
                  >
                    <span
                      className={`font-mono text-xs font-bold ${token.textClass} px-1.5 py-0.5 rounded bg-black/15 backdrop-blur-xs`}
                    >
                      {token.hex}
                    </span>
                  </div>
                  <div className="p-3.5 flex-1 flex flex-col justify-between">
                    <h4 className="text-xs font-bold text-[#0F172A]">{token.name}</h4>
                    <p className="text-[11px] text-[#64748B] mt-1 leading-relaxed">
                      {token.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* SECTION 3: TYPOGRAPHY */}
        {(activeTab === "all" || activeTab === "tokens") && (
          <section className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h2 className="text-lg font-bold text-[#0F172A]">3. Typography Scale (Inter Font)</h2>
              <p className="text-xs text-[#64748B]">
                Compact, highly legible enterprise typography hierarchy.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-6">
              <div className="space-y-1 pb-4 border-b border-[#F1F5F9]">
                <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                  Display (700-800, 36-48px)
                </div>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#0F172A] tracking-tight">
                  Connect every conversation. Capture every lead.
                </div>
              </div>

              <div className="space-y-1 pb-4 border-b border-[#F1F5F9]">
                <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                  H1 Heading (700, 28-36px)
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] tracking-tight">
                  Good morning, Kumail 👋
                </h1>
              </div>

              <div className="space-y-1 pb-4 border-b border-[#F1F5F9]">
                <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                  H2 Heading (700, 22-28px)
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0F172A] tracking-tight">
                  Omnichannel Lead Qualification Engine
                </h2>
              </div>

              <div className="space-y-1 pb-4 border-b border-[#F1F5F9]">
                <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                  H3 Heading (600, 18-20px)
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-[#0F172A] tracking-tight">
                  Autonomous Triage and Objection Handling
                </h3>
              </div>

              <div className="space-y-1 pb-4 border-b border-[#F1F5F9]">
                <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                  Body Text (400-500, 14-16px)
                </div>
                <p className="text-sm font-normal text-[#172033] leading-relaxed max-w-3xl">
                  NEXUS AI monitors customer conversations across Instagram, WhatsApp, Facebook,
                  Website widgets, and Email. The AI identifies high-intent purchase signals, qualifies
                  buyer readiness, and schedules consultations automatically.
                </p>
              </div>

              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">
                  Small / Caption (500, 12-13px)
                </div>
                <p className="text-xs font-medium text-[#64748B]">
                  Last synced: 2 minutes ago · 100% SLA uptime across active webhooks
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 4: BUTTONS & AI ACTIONS */}
        {(activeTab === "all" || activeTab === "components") && (
          <section className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h2 className="text-lg font-bold text-[#0F172A]">4. Button System & AI Triggers</h2>
              <p className="text-xs text-[#64748B]">
                Interactive states: default, hover, active, loading, disabled.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-6">
              <div>
                <span className="text-xs font-bold text-[#64748B] block mb-3">Button Variants</span>
                <div className="flex items-center gap-3 flex-wrap">
                  <Button variant="primary">Primary Action</Button>
                  <Button variant="secondary">Secondary Action</Button>
                  <Button variant="success">Success Action</Button>
                  <Button variant="ghost">Ghost Button</Button>
                  <Button variant="danger">Destructive Action</Button>
                  <Button variant="outline">Outline Button</Button>
                  <Button variant="primary" disabled>Disabled State</Button>
                  <Button variant="primary" isLoading>Loading State</Button>
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9]">
                <span className="text-xs font-bold text-[#8B5CF6] block mb-3">
                  AI Action Buttons (Violet + Blue Identity)
                </span>
                <div className="flex items-center gap-3 flex-wrap">
                  <AIActionButton variant="solid" label="Run AI Lead Scan" />
                  <AIActionButton variant="subtle" label="Draft AI Follow-up" />
                  <AIActionButton variant="outline" label="Analyze Objection" />
                  <AIActionButton variant="solid" isLoading label="Analyzing..." />
                  <AIActionButton variant="solid" disabled label="AI Disabled" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 5: INPUTS & FORM CONTROLS */}
        {(activeTab === "all" || activeTab === "components") && (
          <section className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h2 className="text-lg font-bold text-[#0F172A]">5. Form Inputs & Controls</h2>
              <p className="text-xs text-[#64748B]">
                Accessible form elements with error states, icons, helpers, and shortcuts.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                <TextInput
                  label="Company Name"
                  placeholder="e.g. Acme Corp"
                  value={textVal}
                  onChange={(e) => setTextVal(e.target.value)}
                  helperText="Primary business identification"
                />

                <TextInput
                  label="Inbound Email"
                  placeholder="name@company.com"
                  defaultValue="contact@domain.com"
                  leftIcon={<HiOutlineEnvelope className="h-4 w-4" />}
                />

                <TextInput
                  label="Direct Phone (WhatsApp)"
                  placeholder="+1 (555) 000-0000"
                  defaultValue="+1 (555) 234-5678"
                  leftIcon={<HiOutlinePhone className="h-4 w-4" />}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-4 border-t border-[#F1F5F9]">
                <div>
                  <label className="text-xs font-semibold text-[#0F172A] block mb-1.5">
                    Command Search Input
                  </label>
                  <SearchInput
                    value={searchVal}
                    onChange={(e) => setSearchVal(e.target.value)}
                    onClear={() => setSearchVal("")}
                  />
                </div>

                <Select
                  label="Target Acquisition Channel"
                  defaultValue="WhatsApp"
                  options={[
                    { label: "WhatsApp Cloud API", value: "WhatsApp" },
                    { label: "Instagram Direct Messages", value: "Instagram" },
                    { label: "Facebook Messenger", value: "Facebook" },
                    { label: "Website Chat Widget", value: "Website" },
                    { label: "Email Outbound Sequences", value: "Email" },
                  ]}
                />
              </div>

              <div className="pt-4 border-t border-[#F1F5F9] grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#64748B] block">Switches</span>
                  <div className="space-y-2.5">
                    <Switch
                      checked={switchState1}
                      onChange={setSwitchState1}
                      label="Auto-qualify high intent inbound"
                      description="Dispatches smart questionnaires immediately upon detection"
                    />
                    <Switch
                      checked={switchState2}
                      onChange={setSwitchState2}
                      label="Escalate stalled leads to founder"
                      description="Routes leads idle for 48h with price objections"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#64748B] block">Checkboxes</span>
                  <div className="space-y-2.5">
                    <Checkbox
                      checked={checkboxState}
                      onChange={(e) => setCheckboxState(e.target.checked)}
                      label="Enable WhatsApp Instant 60s Replies"
                      description="Significantly boosts conversion velocity"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 6: BADGES & STATUSES */}
        {(activeTab === "all" || activeTab === "components") && (
          <section className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h2 className="text-lg font-bold text-[#0F172A]">6. Status & Badge System</h2>
              <p className="text-xs text-[#64748B]">
                Consistent semantic colors representing lead lifecycle and AI state.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-[#E2E8F0] p-6 space-y-5">
              <div>
                <span className="text-xs font-bold text-[#64748B] block mb-3">Lifecycle Statuses</span>
                <div className="flex items-center gap-2.5 flex-wrap">
                  {statuses.map((st) => (
                    <StatusBadge key={st} status={st} />
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-[#F1F5F9]">
                <span className="text-xs font-bold text-[#8B5CF6] block mb-3">AI Badges</span>
                <div className="flex items-center gap-3 flex-wrap">
                  <AIBadge label="AI Agent" />
                  <AIBadge label="AI Qualified" confidence={92} />
                  <AIBadge label="Objection Cleared" confidence={88} variant="solid" />
                  <AIBadge label="Autonomous Copilot" variant="ghost" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* SECTION 7: REUSABLE CARDS */}
        {(activeTab === "all" || activeTab === "components") && (
          <section className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h2 className="text-lg font-bold text-[#0F172A]">7. Reusable Card System</h2>
              <p className="text-xs text-[#64748B]">
                Modular cards for metrics, leads, conversations, AI insights, activities, and integrations.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                  title="Total Leads"
                  value="248"
                  changePercentage={12}
                  isPositiveChange={true}
                  iconName="HiOutlineUsers"
                  accentColor="blue"
                />
                <MetricCard
                  title="Qualified Leads"
                  value="71"
                  changePercentage={18}
                  isPositiveChange={true}
                  iconName="HiOutlineCheckBadge"
                  accentColor="emerald"
                />
                <MetricCard
                  title="Conversations"
                  value="231"
                  changePercentage={24}
                  isPositiveChange={true}
                  iconName="HiOutlineChatBubbleLeftRight"
                  accentColor="violet"
                />
                <MetricCard
                  title="Closed Deals"
                  value="8"
                  changePercentage={33}
                  isPositiveChange={true}
                  iconName="HiOutlineBanknotes"
                  accentColor="emerald"
                />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <LeadCard lead={mockRecentLeads[0]} />
                <ConversationCard conversation={mockRecentConversations[0]} isSelected />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AIInsightCard insight={mockAiInsights[0]} />
                <ActivityCard activity={mockAiActivities[0]} />
              </div>
            </div>
          </section>
        )}

        {/* SECTION 8: SKELETONS, EMPTY STATES, & ERROR STATES */}
        {(activeTab === "all" || activeTab === "states") && (
          <section className="space-y-4">
            <div className="border-b border-[#E2E8F0] pb-2">
              <h2 className="text-lg font-bold text-[#0F172A]">8. Loading Skeletons, Empty & Error States</h2>
              <p className="text-xs text-[#64748B]">
                Graceful loading and fallback states designed for seamless future backend integration.
              </p>
            </div>

            <div className="space-y-6">
              {/* Skeleton Loaders */}
              <div>
                <span className="text-xs font-bold text-[#64748B] block mb-3">Skeleton Loaders</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <MetricCardSkeleton />
                  <MetricCardSkeleton />
                  <MetricCardSkeleton />
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-bold text-[#64748B] block mb-3">Table Skeleton</span>
                  <TableSkeleton rows={4} cols={3} />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#64748B] block mb-3">Chat Thread Skeleton</span>
                  <div className="rounded-xl border border-[#E2E8F0] bg-white">
                    <ChatSkeleton />
                  </div>
                </div>
              </div>

              {/* Empty & Error States */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <span className="text-xs font-bold text-[#64748B] block mb-3">Empty State</span>
                  <EmptyStateCard
                    title="No leads found"
                    description="No leads match your current search and channel filters."
                    actionLabel="Clear Filters"
                  />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#64748B] block mb-3">Error State</span>
                  <ErrorState
                    title="Failed to synchronize with Instagram Cloud"
                    description="The webhook connection timed out. Please try again or check API credentials."
                    onRetry={() => alert("Retrying simulated connection...")}
                  />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}
