import { ThresholdStatus } from "@/lib/wallboard-thresholds";
import { JSX } from "react";

interface Props {
  title: string;
  value?: string | React.ReactNode | number | JSX.Element;
  threshold?: ThresholdStatus
  borderColor?: string;
}

export default function Card({ title, value: content, threshold = "default", borderColor = "border-slate-500 dark:border-slate-700" }: Props) {
  const isTitleOnly = content === undefined || content === null;
  const status = {
    default: "text-slate-900 dark:text-slate-100",
    success: "text-green-600 dark:text-green-400",
    warning: "text-orange-500 dark:text-orange-400",
    danger: "text-red-600 dark:text-red-400",
  }[threshold];

  return (
    <div
      className={`
        flex flex-col items-center
        ${isTitleOnly ? "justify-center" : "justify-around"}
        gap-3 md:gap-4 lg:gap-6
        border-2 rounded-2xl ${borderColor}
        p-6 md:p-8 lg:p-10
      `}
    >
      {/* Title */}
      <h3
        className="
          tracking-tight text-heading
          text-3xl md:text-4xl lg:text-5xl xl:text-6xl
          text-center
        "
      >
        {title}
      </h3>

      {/* Content */}
      {!isTitleOnly && (
        <p
          className={`
            font-bold tracking-tight text-heading
            text-4xl md:text-5xl lg:text-6xl xl:text-7xl
            text-center ${status}
          `}
        >
          {content}
        </p>
      )}
    </div>
  );
}


