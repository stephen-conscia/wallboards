import { ReactNode } from "react";

interface Props {
  title: string;
  timestamp: number;
  children: ReactNode;
}
export default function WallboardLayout({ title, timestamp, children }: Props) {

  return (
    <>
      <h1 className="mx-auto font-bold tracking-tight text-heading text-3xl md:text-4xl lg:text-5xl xl:text-6xl text-center">
        {title}
      </h1>
      {children}
      {timestamp && <div className="pb-1 text-sm opacity-60">
        Last updated: {new Date(timestamp).toLocaleTimeString()}
      </div>}
    </>
  )
}
