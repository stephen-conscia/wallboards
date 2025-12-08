import Image from "next/image";
import Card from "./Card";

interface Props {
  title: string;
}

export default function Wallboard({ title }: Props) {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between items-center p-6">
      {/* Header with logo */}
      <div className="flex flex-col items-center gap-4 mb-10">
        <Image
          src="/aviva.svg"
          alt="Company logo"
          width={200}
          height={200}
          className="w-40 sm:w-48 md:w-56 lg:w-64 h-auto"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-center">
          {title}
        </h1>
      </div>

      {/* Grid of cards */}
      <div
        className="
          grid
          grid-cols-1 
          sm:grid-cols-2 
          md:grid-cols-3 
          lg:grid-cols-4
          gap-6
          w-full
          max-w-screen-2xl
        "
      >
        {Array.from(Array(6).keys()).map(key => (
          <Card key={key} />
        ))}
      </div>

      {/* Last updated */}
      <div className="mt-10 text-sm opacity-60">
        Last updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
}

