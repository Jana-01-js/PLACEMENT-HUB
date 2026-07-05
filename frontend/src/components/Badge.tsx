import { ReactNode } from "react";

type Tone = "neutral" | "success" | "danger" | "brass";

const TONE_CLASSES: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-muted",
  success: "bg-success/10 text-success",
  danger: "bg-danger/10 text-danger",
  brass: "bg-brass/15 text-brass-deep",
};

export const Badge = ({
  children,
  tone = "neutral",
}: {
  children: ReactNode;
  tone?: Tone;
}) => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${TONE_CLASSES[tone]}`}
  >
    {children}
  </span>
);
