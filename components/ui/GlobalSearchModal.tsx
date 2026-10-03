"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { mockRecentLeads } from "@/lib/mock-data/leads";
import { mockProspects } from "@/lib/mock-data/prospects";
import { mockRecentConversations } from "@/lib/mock-data/conversations";
import { mockClients } from "@/lib/mock-data/clients";
import {
  HiOutlineMagnifyingGlass,
  HiXMark,
  HiOutlineUser,
  HiOutlineBuildingOffice2,
  HiOutlineChatBubbleLeftRight,
  HiOutlineBriefcase,
  HiOutlinePlusCircle,
  HiOutlineSparkles,
} from "react-icons/hi2";

export interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface SearchResultItem {
  id: string;
  title: string;
  subtitle: string;
  category: "Recent" | "Leads" | "Prospects" | "Conversations" | "Clients" | "Actions";
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => inputRef.current?.focus(), 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (isOpen) {
          onClose();
        }
      } else if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickActions: SearchResultItem[] = [
    {
      id: "act_add_prospect",
      title: "Add New Prospect",
      subtitle: "Discover or manually register a business to acquire",
      category: "Actions",
      href: "/prospects",
      icon: HiOutlinePlusCircle,
    },
    {
      id: "act_create_proposal",
      title: "Create Proposal",
      subtitle: "Generate a custom client agreement with AI pricing",
      category: "Actions",
      href: "/proposals",
      icon: HiOutlineBriefcase,
    },
    {
      id: "act_create_followup",
      title: "Create Follow-up",
      subtitle: "Schedule smart re-engagement sequence",
      category: "Actions",
      href: "/follow-ups",
      icon: HiOutlineSparkles,
    },
  ];

  const leadResults: SearchResultItem[] = mockRecentLeads.map((l) => ({
    id: l.id,
    title: l.fullName,
    subtitle: `${l.channel} Lead · ${l.company}`,
    category: "Leads",
    href: `/leads`,
    icon: HiOutlineUser,
  }));

  const prospectResults: SearchResultItem[] = mockProspects.map((p) => ({
    id: p.id,
    title: p.businessName,
    subtitle: `${p.industry} · ${p.location}`,
    category: "Prospects",
    href: `/prospects`,
    icon: HiOutlineBuildingOffice2,
  }));

  const conversationResults: SearchResultItem[] = mockRecentConversations.map((c) => ({
    id: c.id,
    title: c.contactName,
    subtitle: `${c.channel} Conversation · "${c.lastMessageSnippet}"`,
    category: "Conversations",
    href: `/inbox`,
    icon: HiOutlineChatBubbleLeftRight,
  }));

  const clientResults: SearchResultItem[] = mockClients.map((cl) => ({
    id: cl.id,
    title: cl.companyName,
    subtitle: `Active Client · ${cl.plan}`,
    category: "Clients",
    href: `/clients`,
    icon: HiOutlineBriefcase,
  }));

  const allItems: SearchResultItem[] = [
    ...quickActions,
    ...leadResults,
    ...prospectResults,
    ...conversationResults,
    ...clientResults,
  ];

  const filteredItems = query.trim()
    ? allItems.filter(
        (item) =>
          item.title.toLowerCase().includes(query.toLowerCase()) ||
          item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          item.category.toLowerCase().includes(query.toLowerCase())
      )
    : allItems.slice(0, 10);

  const categories = ["Actions", "Leads", "Prospects", "Conversations", "Clients"] as const;

  const handleSelect = (item: SearchResultItem) => {
    router.push(item.href);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0F172A]/40 backdrop-blur-xs transition-opacity duration-150"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-2xl border border-[#E2E8F0] overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Field */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#E2E8F0] bg-white">
          <HiOutlineMagnifyingGlass className="h-5 w-5 text-[#64748B] flex-shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search leads, prospects, conversations..."
            className="w-full text-sm text-[#0F172A] placeholder:text-[#94A3B8] outline-none bg-transparent"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="p-1 rounded text-[#94A3B8] hover:text-[#0F172A] mr-2"
            >
              <HiXMark className="h-4 w-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded border border-[#E2E8F0] bg-[#F8FAFC] px-1.5 py-0.5 text-[10px] font-medium text-[#64748B]">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-3 space-y-4">
          {filteredItems.length === 0 ? (
            <div className="py-10 text-center text-xs text-[#64748B]">
              No results found for &ldquo;<span className="font-semibold text-[#0F172A]">{query}</span>&rdquo;
            </div>
          ) : (
            categories.map((cat) => {
              const catItems = filteredItems.filter((i) => i.category === cat);
              if (catItems.length === 0) return null;

              return (
                <div key={cat} className="space-y-1">
                  <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                    {cat}
                  </div>
                  {catItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs transition-colors hover:bg-[#EFF6FF] group cursor-pointer"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="p-1.5 rounded-md bg-[#F8FAFC] border border-[#E2E8F0] text-[#2563EB] group-hover:bg-white group-hover:border-[#BFDBFE]">
                            <Icon className="h-4 w-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-semibold text-[#0F172A] group-hover:text-[#2563EB] truncate block">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-[#64748B] truncate block">
                              {item.subtitle}
                            </span>
                          </div>
                        </div>

                        <span className="text-[10px] text-[#94A3B8] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Jump to →
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between text-[11px] text-[#64748B]">
          <span>
            Navigate with <kbd className="px-1 py-0.5 bg-white border rounded text-[10px]">↑</kbd> <kbd className="px-1 py-0.5 bg-white border rounded text-[10px]">↓</kbd>
          </span>
          <span>NEXUS AI Global Index</span>
        </div>
      </div>
    </div>
  );
}
