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
        flex flex-col justify-between 
        w-full 
        p-[3vw] sm:p-[2vw] lg:p-[1.5vw] xl:p-[1vw] xl:py-[2vw]
        border ${borderColor} 
        text-center 
        rounded-xl 
        shadow-2xl
        transition-all
      `}
    >
      <h3 className="uppercase text-[clamp(16px,2vw,36px)] font-semibold mb-2">
        {title}
      </h3>
      <p className={`text-[clamp(32px,7vw,100px)] font-bold ${valueColor}`}>
        {value}
      </p>
    </div>
  );
}

