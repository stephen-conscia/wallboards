import { ThresholdStatus } from "@/lib/wallboard-thresholds";

interface Props {
  title: string;
  value: number | string;
  threshold?: ThresholdStatus
  borderColor?: string;
}

export default function Card({ title, value, threshold = "default", borderColor = "border-slate-500 dark:border-slate-700" }: Props) {
  // Map threshold to Tailwind text color
  const valueColor = {
    default: "text-slate-900 dark:text-slate-100",
    success: "text-green-600 dark:text-green-400",
    warning: "text-orange-500 dark:text-orange-400",
    danger: "text-red-600 dark:text-red-400",
  }[threshold];

  return (
    <div
      className={`
        mx-auto
        w-64 sm:w-72 lg:w-80
        p-6 sm:p-8 lg:p-10
        border ${borderColor}
        text-center 
        rounded-lg 
        shadow-xl
        transition-all
      `}
    >
      <h3 className="uppercase text-lg sm:text-xl lg:text-2xl font-semibold mb-2">
        {title}
      </h3>
      <p className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

