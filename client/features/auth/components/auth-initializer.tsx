"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";

import { refreshToken } from "../api/auth.api";
import { setCredentials, logout } from "@/store/slices/authSlice";
import { RootState } from "@/store";

export default function AuthInitializer({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const { isInitialized } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        const data = await refreshToken();
        dispatch(
          setCredentials({
            accessToken: data.accessToken,
            user: data.user,
          })
        );
      } catch (error) {
        // No valid session/refresh cookie, clear credentials safely
        dispatch(logout());
      }
    };

    if (!isInitialized) {
      restoreSession();
    }
  }, [dispatch, isInitialized]);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center space-y-4 animate-in fade-in zoom-in duration-500">
          <div className="relative flex h-16 w-16 items-center justify-center">
            <Loader2 className="h-10 w-10 animate-spin text-indigo-500" />
            <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20"></div>
          </div>
          <div className="text-center">
            <h1 className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-2xl font-bold tracking-wider text-transparent">
              CampusFlow
            </h1>
            <p className="mt-1 text-xs text-slate-400">Loading your workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
