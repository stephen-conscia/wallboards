// In your home page component, e.g., pages/index.tsx
import Link from "next/link";
import Image from "next/image"; // <--- Added missing Image import

// Define the structure for your link groups
const linkGroups = [
  {
    title: "Direct",
    links: [
      { href: "/wallboards/direct/dual-overview", label: "Overview" },
    ],
  },
  {
    title: "LNP",
    links: [
      { href: "/wallboards/lnp/broker-agent", label: "Agent Activity Broker" },
      { href: "/wallboards/lnp/csc-agent", label: "Agent Activity CSC" },
      { href: "/wallboards/lnp/broker-queue", label: "Queue Summary Broker" },
      { href: "/wallboards/lnp/csc-queue", label: "Queue Summary CSC" },
    ],
  },
  {
    title: "Global",
    links: [
      { href: "/wallboards/global-status", label: "Global Status" },
    ],
  },
];

export default function HomePage() {
  const title = "Wallboard Dashboard Links"; // Assuming a title is needed for the header

  return (
    <div className="w-full h-screen flex flex-col items-center gap-5 px-6 bg-slate-50 dark:bg-gray-900 text-slate-900 dark:text-white">

      <h1 className="text-[clamp(1.5rem,3vw,3rem)] font-extrabold text-center mt-4">
        {title}
      </h1>

      {/* Main Link Content */}
      {/* 2. Center the link grid vertically on the page */}
      <div className="grow flex items-start justify-center w-full">
        {/* 3. Grid for Link Groups: 2 columns on small screens, 4 on large screens */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 lg:gap-12 w-full max-w-7xl">

          {linkGroups.map((group) => (
            // Individual Group Container
            <div key={group.title} className="flex flex-col items-center p-4 border border-slate-300 dark:border-slate-700 rounded-lg shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white dark:bg-gray-800/50">

              {/* Group Title */}
              <h2 className="text-[clamp(1.25rem,2.5vw,2rem)] font-bold mb-4 text-center border-b border-current pb-2 w-full">
                {group.title}
              </h2>

              {/* Link List */}
              <ul className="flex flex-col gap-3 w-full">
                {group.links.map((link) => (
                  <li key={link.href} className="w-full">
                    <Link
                      href={link.href}
                      className={`
                        block w-full text-center py-3 px-4 rounded-lg 
                        bg-blue-600 hover:bg-blue-700 active:bg-blue-800 
                        text-white 
                        font-semibold 
                        // Scalable text size for links
                        text-[clamp(1rem,1.8vw,1.5rem)]
                        transition-all duration-200 ease-in-out
                        shadow-md
                      `}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>
      </div>

      {/* Footer / Spacer (optional, but good for symmetry) */}
      <div className="h-10"></div>
    </div>
  );
}
