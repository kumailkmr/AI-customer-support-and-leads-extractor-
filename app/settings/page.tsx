"use client";

import React, { useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { IntegrationCard } from "@/components/ui/IntegrationCard";
import { Card, CardHeader } from "@/components/ui/Card";
import { TextInput } from "@/components/ui/TextInput";
import { Switch } from "@/components/ui/Switch";
import { Button } from "@/components/ui/Button";
import { mockCurrentUser } from "@/lib/mock-data/user";
import { LogoIcon } from "@/components/brand/Logo";
import {
  RiSaveLine,
  RiBuilding4Line,
  RiUserLine,
  RiPaletteLine,
  RiNotification3Line,
  RiSparkling2Fill,
  RiLinksLine,
} from "react-icons/ri";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<
    "workspace" | "profile" | "appearance" | "notifications" | "ai" | "integrations"
  >("workspace");

  const [savedToast, setSavedToast] = useState(false);

  // Form State
  const [workspaceName, setWorkspaceName] = useState("Nexus Workspace");
  const [businessName, setBusinessName] = useState("Acme Growth Labs");
  const [name, setName] = useState("Kumail Kmr");
  const [email, setEmail] = useState("kumail@nexusai.io");

  // Notification Toggles
  const [emailNotif, setEmailNotif] = useState(true);
  const [waNotif, setWaNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(false);

  // AI Preferences
  const [aiEnabled, setAiEnabled] = useState(true);
  const [autoQualification, setAutoQualification] = useState(true);
  const [aiFollowUp, setAiFollowUp] = useState(true);
  const [humanEscalation, setHumanEscalation] = useState(true);

  // Integrations state
  const [channels, setChannels] = useState({
    Instagram: true,
    WhatsApp: true,
    Facebook: true,
    Website: true,
    Email: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 2500);
  };

  const tabs = [
    { id: "workspace", label: "Workspace", icon: RiBuilding4Line },
    { id: "profile", label: "Profile", icon: RiUserLine },
    { id: "appearance", label: "Appearance", icon: RiPaletteLine },
    { id: "notifications", label: "Notifications", icon: RiNotification3Line },
    { id: "ai", label: "AI Preferences", icon: RiSparkling2Fill },
    { id: "integrations", label: "Integrations", icon: RiLinksLine },
  ] as const;

  return (
    <AppLayout>
      <PageHeader
        title="Settings & Workspace"
        subtitle="Manage acquisition OS configuration, AI autonomous rules, and omnichannel connections."
        badge={
          <span className="text-xs font-semibold text-[#0F172A] bg-[#F1F5F9] border border-[#E2E8F0] px-2.5 py-0.5 rounded-full">
            {workspaceName}
          </span>
        }
        actions={
          <Button
            size="sm"
            variant="primary"
            leftIcon={<RiSaveLine className="h-3.5 w-3.5" />}
            onClick={handleSave}
          >
            {savedToast ? "Saved Configuration!" : "Save Changes"}
          </Button>
        }
      />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Settings Navigation Sidebar (3 cols) */}
        <div className="md:col-span-3 space-y-1">
          <Card padding="none" className="border-[#E2E8F0] p-1.5 space-y-0.5">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? "bg-[#EFF6FF] text-[#2563EB] font-bold"
                      : "text-[#64748B] hover:bg-[#F8FAFC] hover:text-[#0F172A]"
                  }`}
                >
                  <Icon className={`h-4 w-4 ${isActive ? "text-[#2563EB]" : "text-[#64748B]"}`} />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </Card>
        </div>

        {/* Settings Content Canvas (9 cols) */}
        <div className="md:col-span-9 space-y-6">
          {/* Section: Workspace */}
          {activeTab === "workspace" && (
            <Card padding="md" className="border-[#E2E8F0] space-y-5">
              <CardHeader
                title="Workspace Settings"
                subtitle="Primary business identification and branding metadata"
              />

              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-[#F1F5F9]">
                  <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-[#2563EB] to-[#8B5CF6] flex items-center justify-center text-white shadow-sm">
                    <LogoIcon size={32} />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">Workspace Brand Logo</h4>
                    <p className="text-[11px] text-[#64748B] mt-0.5">
                      NEXUS AI Brand Mark vector loaded.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Workspace Name"
                    value={workspaceName}
                    onChange={(e) => setWorkspaceName(e.target.value)}
                  />
                  <TextInput
                    label="Business / Agency Name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Section: Profile */}
          {activeTab === "profile" && (
            <Card padding="md" className="border-[#E2E8F0] space-y-5">
              <CardHeader
                title="Personal Profile"
                subtitle="Administrator details and account credentials"
              />

              <div className="space-y-4">
                <div className="flex items-center gap-4 pb-4 border-b border-[#F1F5F9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mockCurrentUser.avatarUrl}
                    alt={mockCurrentUser.name}
                    className="h-14 w-14 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-[#0F172A]">{name}</h4>
                    <p className="text-[11px] text-[#64748B]">Administrator Access</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <TextInput
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                  <TextInput
                    label="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </Card>
          )}

          {/* Section: Appearance */}
          {activeTab === "appearance" && (
            <Card padding="md" className="border-[#E2E8F0] space-y-5">
              <CardHeader
                title="Theme & Visual Identity"
                subtitle="NEXUS AI Enterprise Design System Specifications"
              />

              <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2 text-xs">
                <span className="font-bold text-[#0F172A] block">
                  Light / White Canvas System (Strict Requirement)
                </span>
                <p className="text-[#64748B] leading-relaxed">
                  NEXUS AI utilizes an intentional pure white surface (`#FFFFFF`) on subtle off-white canvas (`#F8FAFC`) with high-contrast Dark Navy typography (`#0F172A`), Primary Blue (`#2563EB`), Emerald Green (`#10B981`), and AI Violet (`#8B5CF6`). Dark mode is omitted by design for maximum readability and enterprise SaaS clarity.
                </p>
              </div>
            </Card>
          )}

          {/* Section: Notifications */}
          {activeTab === "notifications" && (
            <Card padding="md" className="border-[#E2E8F0] space-y-5">
              <CardHeader
                title="Notification Preferences"
                subtitle="Alert rules for inbound leads, escalations, and proposals"
              />

              <div className="space-y-4">
                <Switch
                  checked={emailNotif}
                  onChange={setEmailNotif}
                  label="Email Digest for High-Intent Leads"
                  description="Receive instant alerts when a lead scores >90% on qualification."
                />
                <Switch
                  checked={waNotif}
                  onChange={setWaNotif}
                  label="WhatsApp Escalation Alerts"
                  description="Receive instant founder notifications when human handoff is required."
                />
                <Switch
                  checked={pushNotif}
                  onChange={setPushNotif}
                  label="Browser Push Notifications"
                  description="Real-time notifications for incoming omnichannel conversations."
                />
              </div>
            </Card>
          )}

          {/* Section: AI Preferences */}
          {activeTab === "ai" && (
            <Card padding="md" className="border-[#E2E8F0] space-y-5">
              <CardHeader
                title="AI Preferences & Autonomous Rules"
                subtitle="Configure autopilot response thresholds and objection handling"
              />

              <div className="space-y-4">
                <Switch
                  checked={aiEnabled}
                  onChange={setAiEnabled}
                  label="AI Copilot Autonomous Engine"
                  description="Master toggle enabling AI response drafting and automated triage."
                />
                <Switch
                  checked={autoQualification}
                  onChange={setAutoQualification}
                  label="Autonomous Inbound Lead Qualification"
                  description="Dispatches smart diagnostic questionnaires on WhatsApp and Instagram."
                />
                <Switch
                  checked={aiFollowUp}
                  onChange={setAiFollowUp}
                  label="Automated Smart Follow-up Sequences"
                  description="Automatically drafts and cues re-engagement messages after 24h idle time."
                />
                <Switch
                  checked={humanEscalation}
                  onChange={setHumanEscalation}
                  label="Human Escalation Guardrails"
                  description="Instantly flags enterprise SLA questions and custom pricing queries for Kumail."
                />
              </div>
            </Card>
          )}

          {/* Section: Integrations */}
          {activeTab === "integrations" && (
            <div className="space-y-4">
              <div className="border-b border-[#E2E8F0] pb-2">
                <h3 className="text-sm font-bold text-[#0F172A]">Omnichannel Channel Status</h3>
                <p className="text-xs text-[#64748B]">
                  Simulated connection states for Instagram, WhatsApp, Facebook, Website, and Email.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <IntegrationCard
                  channel="WhatsApp"
                  accountHandle="+1 (555) 382-9912 (Cloud API)"
                  isConnected={channels.WhatsApp}
                  activeAutomations={8}
                  onToggle={(v) => setChannels((prev) => ({ ...prev, WhatsApp: v }))}
                />
                <IntegrationCard
                  channel="Instagram"
                  accountHandle="@acmegrowth_official"
                  isConnected={channels.Instagram}
                  activeAutomations={6}
                  onToggle={(v) => setChannels((prev) => ({ ...prev, Instagram: v }))}
                />
                <IntegrationCard
                  channel="Website"
                  accountHandle="https://acmegrowth.io (Live Widget)"
                  isConnected={channels.Website}
                  activeAutomations={4}
                  onToggle={(v) => setChannels((prev) => ({ ...prev, Website: v }))}
                />
                <IntegrationCard
                  channel="Email"
                  accountHandle="inbound@acmegrowth.io"
                  isConnected={channels.Email}
                  activeAutomations={5}
                  onToggle={(v) => setChannels((prev) => ({ ...prev, Email: v }))}
                />
                <IntegrationCard
                  channel="Facebook"
                  accountHandle="AcmeGrowthSystems"
                  isConnected={channels.Facebook}
                  activeAutomations={3}
                  onToggle={(v) => setChannels((prev) => ({ ...prev, Facebook: v }))}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </AppLayout>
  );
}
