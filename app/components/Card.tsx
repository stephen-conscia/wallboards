export default function Card() {
  return (
    <div
      className="
        mx-auto
        w-64 sm:w-full
        p-8 
        border border-slate-500 dark:border-slate-700 
        text-center 
        rounded-lg 
        shadow-xl
      "
    >
      <h3 className="uppercase text-lg font-semibold mb-2">title</h3>
      <p className="text-4xl font-bold">14</p>
    </div>
  );
}

