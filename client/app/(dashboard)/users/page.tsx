"use client";

import { useState, useEffect } from "react";
import { Plus, Loader2, ChevronLeft, ChevronRight, User } from "lucide-react";

import { RoleGuard } from "@/features/auth";
import {
  UsersTable,
  UserDialog,
  UsersFilter,
  useUsersQuery,
  type GetUsersParams
} from "@/features/users";
import { Button } from "@/components/ui/button";
import type { Role, UserStatus } from "@/features/auth/types/auth.types";

export default function UsersPage() {
  // Query Filters & Pagination State
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [roleFilter, setRoleFilter] = useState("ALL");
  const [page, setPage] = useState(1);
  const limit = 8;

  // Modal Dialog State
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  // Discovered Roles State (Accumulated dynamically from populated user results)
  const [discoveredRoles, setDiscoveredRoles] = useState<Role[]>([]);

  // Fetch parameters
  const queryParams: GetUsersParams = {
    page,
    limit,
    search: search.trim() || undefined,
    status: status !== "ALL" ? (status as UserStatus) : undefined,
    role: roleFilter !== "ALL" ? roleFilter : undefined,
  };

  const { data, isLoading, isError, refetch } = useUsersQuery(queryParams);

  // Accumulate discovered roles from query responses to build robust filters/dropdowns
  useEffect(() => {
    if (data?.users) {
      setDiscoveredRoles((prev) => {
        const rolesMap = new Map<string, Role>();
        prev.forEach((r) => rolesMap.set(r._id, r));
        data.users.forEach((u) => {
          if (u.role && typeof u.role === "object" && u.role._id) {
            rolesMap.set(u.role._id, u.role);
          }
        });
        return Array.from(rolesMap.values());
      });
    }
  }, [data]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [search, status, roleFilter]);

  const handleResetFilters = () => {
    setSearch("");
    setStatus("ALL");
    setRoleFilter("ALL");
    setPage(1);
  };

  const handleEditClick = (user: any) => {
    setSelectedUser(user);
    setIsDialogOpen(true);
  };

  const handleAddClick = () => {
    setSelectedUser(null);
    setIsDialogOpen(true);
  };

  return (
    <RoleGuard allowedRoles={["ADMIN"]}>
      <div className="space-y-6 animate-in fade-in duration-500 pb-12">
        {/* Title bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-border/40 pb-5">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
              <User className="h-6 w-6 text-indigo-400" /> User Accounts
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Add new student/faculty accounts, update permissions, or deactivate access.
            </p>
          </div>
          <Button
            onClick={handleAddClick}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-lg shadow-indigo-600/15"
          >
            <Plus className="mr-1 h-4 w-4" /> Add User
          </Button>
        </div>

        {/* Filter Widget */}
        <UsersFilter
          search={search}
          onSearchChange={setSearch}
          status={status}
          onStatusChange={setStatus}
          role={roleFilter}
          onRoleChange={setRoleFilter}
          discoveredRoles={discoveredRoles}
          onReset={handleResetFilters}
        />

        {/* Loading / Error / Grid View */}
        {isLoading && !data ? (
          <div className="flex flex-col items-center justify-center p-20">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
            <p className="text-xs text-slate-400 mt-3 font-medium">Fetching active workspace directory...</p>
          </div>
        ) : isError ? (
          <div className="text-center p-12 bg-slate-900/10 border border-border/40 rounded-xl my-6">
            <p className="text-red-400 text-xs font-semibold">Failed to fetch users list.</p>
            <Button
              size="sm"
              variant="outline"
              className="mt-3 border-border/50 text-white text-xs"
              onClick={() => refetch()}
            >
              Retry Connection
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <UsersTable users={data?.users || []} onEdit={handleEditClick} />

            {/* Pagination Controls */}
            {data?.pagination && data.pagination.totalPages > 1 && (
              <div className="flex justify-between items-center bg-slate-950/20 px-4 py-3 border border-border/40 rounded-lg">
                <span className="text-[11px] text-slate-500 font-medium">
                  Showing page <strong className="text-slate-300">{data.pagination.page}</strong> of{" "}
                  <strong className="text-slate-300">{data.pagination.totalPages}</strong> (
                  {data.pagination.total} total accounts)
                </span>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-border/50 bg-slate-950 text-slate-300 text-xs hover:bg-slate-900"
                    disabled={!data.pagination.hasPreviousPage}
                    onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  >
                    <ChevronLeft className="h-4 w-4 mr-0.5" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-border/50 bg-slate-950 text-slate-300 text-xs hover:bg-slate-900"
                    disabled={!data.pagination.hasNextPage}
                    onClick={() => setPage((prev) => Math.min(prev + 1, data.pagination.totalPages))}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-0.5" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Create/Edit Modal Dialog */}
        <UserDialog
          isOpen={isDialogOpen}
          onClose={() => {
            setIsDialogOpen(false);
            setSelectedUser(null);
          }}
          user={selectedUser}
          discoveredRoles={discoveredRoles}
        />
      </div>
    </RoleGuard>
  );
}
