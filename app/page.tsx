// In your home page component, e.g., pages/index.tsx
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex flex-col w-full justify-start items-center gap-3">
      <h1 className="text-3xl font-bold mb-4 text-center">Home Page</h1>

      <Link href="/conscia/overview" className="text-blue-500 underline text-xl">Conscia - Overview</Link>
      <Link href="/conscia/agent-activity" className="text-blue-500 underline text-xl">Conscia - Agent Activity</Link>
      <Link href="/direct/overview" className="text-blue-500 underline text-xl">Direct - Overview</Link>
      <Link href="/lnp/agent-activity" className="text-blue-500 underline text-xl">LNP - Agent Activity</Link>
    </div>
  );
}

