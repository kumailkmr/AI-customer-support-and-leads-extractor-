"use client";

import React, { useState } from "react";
import Link from "next/link";
import { AppLayout } from "@/components/layout/AppLayout";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { FilterPill } from "@/components/ui/FilterPill";
import { useFollowUps } from "@/lib/store/follow-up-store";
import { useToast } from "@/components/ui/Toast";
import { AutomationRule } from "@/lib/follow-ups/types";
import { RuleSimulationModal } from "@/components/follow-ups/RuleSimulationModal";
import {
  RiSettings4Line,
  RiAddLine,
  RiHistoryLine,
  RiBookletLine,
  RiFlaskLine,
  RiArrowRightLine,
  RiShieldCheckLine,
  RiSparkling2Fill,
  RiDeleteBinLine,
  RiTimeLine,
  RiThunderstormsLine,
} from "react-icons/ri";

export default function AutomationSettingsPage() {
  const { rules, toggleRule, deleteRule } = useFollowUps();
  const { addToast } = useToast();

  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [activeRuleForSimulation, setActiveRuleForSimulation] = useState<AutomationRule | null>(null);

  const categories = [
    "all",
    "Client Lead Capture",
    "Prospect Acquisition",
    "Omnichannel Handoff",
    "Re-engagement",
  ];

  const filteredRules = rules.filter((r) =>
    selectedCategory === "all" ? true : r.category === selectedCategory
  );

  const handleToggle = (rule: AutomationRule) => {
    toggleRule(rule.id);
    addToast({
      title: rule.enabled ? "Rule Disabled" : "Rule Activated",
      description: `Automation "${rule.name}" is now ${rule.enabled ? "paused" : "active"}.`,
      variant: rule.enabled ? "info" : "success",
    });
  };

  const handleDelete = (id: string, name: string) => {
    if (confirm(`Are you sure you want to remove rule "${name}"?`)) {
      deleteRule(id);
      addToast({
        title: "Rule Removed",
        description: `Deleted automation "${name}".`,
        variant: "info",
      });
    }
  };

  return (
    <AppLayout>
      <PageHeader
        title="Automation Rules Engine"
        subtitle="Configure event triggers, conditional logic, and autonomous follow-up dispatch for Client Leads and Prospects."
        breadcrumbs={[
          { label: "Follow-Ups", href: "/follow-ups" },
          { label: "Automation Rules" },
        ]}
        badge={
          <span className="text-xs font-semibold text-[#8B5CF6] bg-[#F5F3FF] border border-[#DDD6FE] px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
            <RiSparkling2Fill className="h-3.5 w-3.5 text-[#8B5CF6]" />
            Simulation Mode
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link href="/settings/automation/runs">
              <Button variant="outline" size="sm" className="text-xs">
                <RiHistoryLine className="h-3.5 w-3.5 mr-1 text-[#64748B]" />
                Audit Run Logs
              </Button>
            </Link>
            <Link href="/settings/templates">
              <Button variant="outline" size="sm" className="text-xs">
                <RiBookletLine className="h-3.5 w-3.5 mr-1 text-[#64748B]" />
                Templates
              </Button>
            </Link>
            <Link href="/settings/automation/new">
              <Button
                variant="primary"
                size="sm"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs flex items-center gap-1 shadow-xs"
              >
                <RiAddLine className="h-4 w-4" /> Create Rule
              </Button>
            </Link>
          </div>
        }
      />

      <div className="space-y-6">
        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 flex-wrap border-b border-[#E2E8F0] pb-3">
          {categories.map((cat) => (
            <FilterPill
              key={cat}
              label={cat === "all" ? "All Rules" : cat}
              count={
                cat === "all"
                  ? rules.length
                  : rules.filter((r) => r.category === cat).length
              }
              isActive={selectedCategory === cat}
              onClick={() => setSelectedCategory(cat)}
            />
          ))}
        </div>

        {/* Rules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRules.map((rule) => {
            const isLead = rule.targetType === "LEAD";

            return (
              <Card
                key={rule.id}
                padding="md"
                className={`border transition-all flex flex-col justify-between bg-white shadow-xs ${
                  rule.enabled ? "border-[#E2E8F0]" : "border-[#E2E8F0] opacity-75 bg-[#F8FAFC]/50"
                }`}
              >
                <div>
                  {/* Card Header */}
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider ${
                          isLead
                            ? "bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]"
                            : "bg-[#FAF5FF] text-[#7C3AED] border border-[#E9D5FF]"
                        }`}
                      >
                        {isLead ? "Client Lead" : "Nexus Prospect"}
                      </span>
                      <span className="text-[11px] font-semibold text-[#64748B]">
                        {rule.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-[#64748B]">
                        {rule.enabled ? "Active" : "Disabled"}
                      </span>
                      <Switch
                        checked={rule.enabled}
                        onChange={() => handleToggle(rule)}
                      />
                    </div>
                  </div>

                  {/* Rule Name & Description */}
                  <h3 className="font-bold text-sm text-[#0F172A] mb-1">
                    {rule.name}
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-3">
                    {rule.description}
                  </p>

                  {/* Workflow Pipeline Logic Pill */}
                  <div className="p-3 bg-[#F8FAFC] rounded-xl border border-[#F1F5F9] space-y-2 text-xs mb-3">
                    <div className="flex items-center gap-2 text-[#334155]">
                      <RiThunderstormsLine className="h-4 w-4 text-[#2563EB] shrink-0" />
                      <span className="text-[#64748B]">Trigger:</span>
                      <strong className="font-mono text-[11px] bg-white px-1.5 py-0.5 rounded border border-[#E2E8F0]">
                        {rule.trigger.type}
                      </strong>
                    </div>

                    <div className="flex items-center gap-2 text-[#334155]">
                      <RiShieldCheckLine className="h-4 w-4 text-[#059669] shrink-0" />
                      <span className="text-[#64748B]">Conditions:</span>
                      <span className="text-[11px] text-[#0F172A]">
                        {rule.conditions.length > 0
                          ? `${rule.conditions.length} condition criteria applied`
                          : "Unconditional execution"}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-[#334155]">
                      <RiArrowRightLine className="h-4 w-4 text-[#7C3AED] shrink-0" />
                      <span className="text-[#64748B]">Action:</span>
                      <span className="text-[11px] text-[#0F172A] font-medium">
                        {rule.action.type.replace(/_/g, " ")} ({rule.action.automationMode})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="pt-3 border-t border-[#F1F5F9] flex items-center justify-between text-xs">
                  <div className="text-[11px] text-[#64748B] flex items-center gap-2">
                    <span><strong>{rule.runsCount}</strong> total runs</span>
                    <span>•</span>
                    <span className="text-[#059669] font-medium">
                      {rule.successCount} successes
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setActiveRuleForSimulation(rule)}
                      className="text-xs px-2.5 py-1 rounded-lg border border-[#CBD5E1] hover:bg-[#F1F5F9] text-[#334155] font-medium flex items-center gap-1 transition-colors"
                    >
                      <RiFlaskLine className="h-3.5 w-3.5 text-[#2563EB]" />
                      Test Simulation
                    </button>
                    <button
                      onClick={() => handleDelete(rule.id, rule.name)}
                      className="p-1.5 text-[#94A3B8] hover:text-[#EF4444] rounded-lg transition-colors"
                      title="Delete rule"
                    >
                      <RiDeleteBinLine className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Simulation Modal */}
      <RuleSimulationModal
        rule={activeRuleForSimulation}
        isOpen={Boolean(activeRuleForSimulation)}
        onClose={() => setActiveRuleForSimulation(null)}
      />
    </AppLayout>
  );
}
