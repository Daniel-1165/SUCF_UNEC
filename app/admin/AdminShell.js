import Link from "next/link";
import Image from "next/image";

// Shared chrome for every admin screen: the logo lockup, a single white card
// and a way back to the site. `wide` gives the dashboard and tables more room
// than the narrow sign-in state needs.
export default function AdminShell({ children, wide = false }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-12">
      <div className={`w-full animate-fade-up ${wide ? "max-w-2xl" : "max-w-sm"}`}>
        <div className="mb-8 flex justify-center">
          <Link href="/" className="flex flex-col items-center leading-none">
            <Image
              src="/assets/logo.png"
              alt="SUCF UNEC"
              width={40}
              height={40}
              className="h-9 w-auto"
            />
            <span className="-mt-0.5 -rotate-3 rounded-[3px] bg-emerald-700 px-1.5 py-[2px] text-[9px] font-semibold uppercase tracking-[0.22em] text-white">
              UNEC
            </span>
          </Link>
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-6 sm:p-8">{children}</div>

        <p className="mt-6 text-center text-xs text-neutral-500">
          <Link href="/" className="transition-colors hover:text-neutral-900">
            ← Back to site
          </Link>
        </p>
      </div>
    </div>
  );
}
