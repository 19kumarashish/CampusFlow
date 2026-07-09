import { useQuery } from "@tanstack/react-query";
import { getSemesters } from "../api/semester.api";
import type { GetSemestersParams, GetSemestersResponse } from "../types/semester.types";

export const useSemestersQuery = (params?: GetSemestersParams) => {
  return useQuery<GetSemestersResponse, Error>({
    queryKey: ["semesters", params],
    queryFn: () => getSemesters(params),
    placeholderData: (prev) => prev,
    staleTime: 5 * 60 * 1000, // 5 minutes stale time
  });
};
