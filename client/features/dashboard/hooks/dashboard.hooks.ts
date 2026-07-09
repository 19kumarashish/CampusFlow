import { useQuery } from "@tanstack/react-query";
import { getDashboard } from "../api/dashboard.api";
import type { DashboardResponseData } from "../types/dashboard.types";

export const useDashboardQuery = () => {
  return useQuery<DashboardResponseData, Error>({
    queryKey: ["dashboard"],
    queryFn: getDashboard,
    staleTime: 2 * 60 * 1000, // 2 minutes stale time
    refetchOnWindowFocus: true,
  });
};
