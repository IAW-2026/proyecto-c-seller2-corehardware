"use client";

import { Show, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import RoleBasedRedirectButton from "@ui/buttons/roleBasedRedirectButton";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/80 bg-white/90 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link
          href="/"
          className="text-sm font-semibold uppercase tracking-[0.25em] text-sky-600"
        >
          CoreHardware
        </Link>

        <Show when="signed-in">
          <div className="flex items-center gap-3">
            <RoleBasedRedirectButton />
            <UserButton />
          </div>
        </Show>
      </div>
    </header>
  );
}