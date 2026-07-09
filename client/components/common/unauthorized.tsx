"use client";

import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Unauthorized() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-950 p-6 text-white">
      <div className="w-full max-w-md text-center animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
          <ShieldAlert className="h-8 w-8" />
        </div>

        <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
          Access Denied
        </h1>
        
        <p className="mt-4 text-base text-slate-400">
          You do not have the required permissions to access this page. Please
          contact your system administrator if you believe this is an error.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            variant="outline"
            className="w-full sm:w-auto border-slate-800 bg-slate-900 text-white hover:bg-slate-800 hover:text-white"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
          </Button>
          <Button
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white"
            onClick={() => router.push("/dashboard")}
          >
            <Home className="mr-2 h-4 w-4" /> Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}
