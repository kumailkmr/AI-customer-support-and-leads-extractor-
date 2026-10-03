"use client";

import React from "react";
import { MetricCard } from "@/components/ui/MetricCard";
import { mockTimeframeMetrics } from "@/lib/mock-data/metrics";

export interface MetricsRowProps {
  timeframe?: "today" | "7days" | "30days";
}

export function MetricsRow({ timeframe = "today" }: MetricsRowProps) {
  const metrics = mockTimeframeMetrics[timeframe] || mockTimeframeMetrics.today;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          changePercentage={metric.changePercentage}
          isPositiveChange={metric.isPositiveChange}
          timeframe={metric.timeframe}
          subtitle={metric.subtitle}
          iconName={metric.iconName}
          accentColor={metric.accentColor}
        />
      ))}
    </div>
  );
}
