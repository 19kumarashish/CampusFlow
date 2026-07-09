"use client";

import { Edit, Trash2, Calendar, Mail, Phone, ShieldAlert, Award } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDeleteUserMutation } from "../hooks/user.hooks";
import type { User } from "@/features/auth/types/auth.types";

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

export default function UsersTable({ users, onEdit }: UsersTableProps) {
  const { mutate: deactivateUser, isPending } = useDeleteUserMutation();

  const handleDeactivate = (user: User) => {
    if (user.status === "INACTIVE") {
      return;
    }
    const confirmDelete = window.confirm(
      `Are you sure you want to deactivate the user account for ${user.firstName} ${user.lastName}? This will perform a soft-delete (mark them INACTIVE).`
    );
    if (confirmDelete) {
      deactivateUser(user._id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "INACTIVE":
        return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      case "PENDING":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      case "SUSPENDED":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-slate-500/10 text-slate-450 border-slate-800";
    }
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case "ADMIN":
        return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "TEACHER":
        return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "STUDENT":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "PARENT":
        return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default:
        return "bg-slate-500/10 text-slate-350 border-slate-850";
    }
  };

  return (
    <div className="overflow-hidden rounded-xl border border-slate-900 bg-slate-950/40 backdrop-blur-xl">
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-900 bg-slate-900/30 text-slate-450 font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4">User</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Role</th>
              <th className="p-4">Status</th>
              <th className="p-4">Last Login</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-900/60 text-slate-300">
            {users.length ? (
              users.map((user) => {
                const roleName =
                  typeof user.role === "object" ? user.role.name : "User";
                const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-slate-900/10 transition-colors"
                  >
                    {/* User Profile */}
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border border-slate-850">
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.firstName} />
                          ) : null}
                          <AvatarFallback className="bg-indigo-600/80 text-white font-semibold text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-bold text-white text-sm">
                            {user.firstName} {user.lastName}
                          </p>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            ID: {user._id}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Contact Info */}
                    <td className="p-4 space-y-1">
                      <p className="text-slate-300 flex items-center gap-1.5">
                        <Mail className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                        {user.email}
                      </p>
                      <p className="text-slate-450 flex items-center gap-1.5">
                        <Phone className="h-3.5 w-3.5 text-slate-600 shrink-0" />
                        {user.phone || "No phone"}
                      </p>
                    </td>

                    {/* Role */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getRoleBadge(
                          roleName
                        )}`}
                      >
                        <Award className="h-3 w-3 shrink-0" />
                        {roleName}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full font-bold border text-[10px] ${getStatusBadge(
                          user.status
                        )}`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Last Login */}
                    <td className="p-4 text-slate-400">
                      {user.lastLogin ? (
                        <div className="flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5 text-slate-500 shrink-0" />
                          <span>{new Date(user.lastLogin).toLocaleDateString()}</span>
                        </div>
                      ) : (
                        <span className="text-slate-650 italic">Never logged in</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="p-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-slate-800 hover:text-indigo-400 transition-colors"
                          onClick={() => onEdit(user)}
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 border-slate-850 bg-slate-900/40 text-slate-400 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 transition-colors"
                          disabled={user.status === "INACTIVE" || isPending}
                          onClick={() => handleDeactivate(user)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-500">
                  No user accounts found matching selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
