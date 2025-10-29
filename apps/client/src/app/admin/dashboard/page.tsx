"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { listProductsBuilder } from "@repo/api-client";
import { useRequireAuth } from "../../../hooks/useRequireAuth";
import StatsCards from "../components/StatsCards";
import RecentActivity from "../components/RecentActivity";
import QuickActions from "../components/QuickActions";
import InventoryAlerts from "../components/InventoryAlerts";

export default function DashboardPage() {
  const { user, isLoading: authLoading } = useRequireAuth(true); // Require admin role
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        return await (listProductsBuilder.resolver as any)();
      } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
      }
    },
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 h-fit">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          Welcome back! Here's what's happening with your store today.
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards products={products} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <RecentActivity />
          <InventoryAlerts products={products} />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
