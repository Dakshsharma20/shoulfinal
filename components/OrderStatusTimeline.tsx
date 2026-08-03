import { CheckCircle2, Circle, XCircle, RotateCcw } from "lucide-react";
import {
  ORDER_STATUS_FLOW,
  ORDER_STATUS_LABELS,
  orderStatusStepIndex,
  isTerminalStatus,
  type OrderStatus,
} from "@/lib/order-status";
import { cn } from "@/lib/utils";

export interface StatusHistoryEntry {
  status: OrderStatus;
  note?: string;
  changedAt: string;
}

export default function OrderStatusTimeline({
  currentStatus,
  statusHistory,
}: {
  currentStatus: OrderStatus;
  statusHistory: StatusHistoryEntry[];
}) {
  if (isTerminalStatus(currentStatus)) {
    const isCancelled = currentStatus === "cancelled";
    const entry = [...statusHistory].reverse().find((h) => h.status === currentStatus);
    return (
      <div
        className={cn(
          "flex items-start gap-3 rounded-2xl p-5",
          isCancelled ? "bg-red-50" : "bg-sage/10"
        )}
      >
        {isCancelled ? (
          <XCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" aria-hidden="true" />
        ) : (
          <RotateCcw className="mt-0.5 h-5 w-5 flex-shrink-0 text-sage-dark" aria-hidden="true" />
        )}
        <div>
          <p className={cn("font-sans text-sm font-medium", isCancelled ? "text-red-700" : "text-sage-dark")}>
            Order {ORDER_STATUS_LABELS[currentStatus]}
          </p>
          {entry && (
            <p className="mt-1 text-xs text-ink-light">
              {new Date(entry.changedAt).toLocaleString("en-IN", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          )}
          {entry?.note && <p className="mt-1 text-xs text-ink-light">{entry.note}</p>}
        </div>
      </div>
    );
  }

  const currentIndex = orderStatusStepIndex(currentStatus);
  const historyByStatus = new Map(statusHistory.map((h) => [h.status, h]));

  return (
    <ol className="space-y-0">
      {ORDER_STATUS_FLOW.map((status, i) => {
        const isComplete = i <= currentIndex;
        const isCurrent = i === currentIndex;
        const entry = historyByStatus.get(status);
        const isLast = i === ORDER_STATUS_FLOW.length - 1;

        return (
          <li key={status} className="relative flex gap-4 pb-8 last:pb-0">
            {!isLast && (
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-[9px] top-6 h-full w-px",
                  isComplete ? "bg-sage-dark" : "bg-line"
                )}
              />
            )}
            <span className="relative z-10 flex-shrink-0">
              {isComplete ? (
                <CheckCircle2
                  className={cn("h-5 w-5", isCurrent ? "text-sage-dark" : "text-sage-dark/70")}
                  aria-hidden="true"
                />
              ) : (
                <Circle className="h-5 w-5 text-line" aria-hidden="true" />
              )}
            </span>
            <div>
              <p
                className={cn(
                  "font-sans text-sm",
                  isComplete ? "font-medium text-ink" : "text-ink-light"
                )}
              >
                {ORDER_STATUS_LABELS[status]}
              </p>
              {entry && (
                <p className="mt-0.5 text-xs text-ink-light">
                  {new Date(entry.changedAt).toLocaleString("en-IN", {
                    dateStyle: "medium",
                    timeStyle: "short",
                  })}
                </p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
