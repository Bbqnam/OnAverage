import { Camera, Check, Copy } from "lucide-react";
import { useState } from "react";
import { getRateForScale } from "../lib/calculations";
import { formatLargeNumber } from "../lib/formatting";
import type { Statistic, TimeScale } from "../types/statistic";

interface ShareSnapshotProps {
  statistics: Statistic[];
  timeScale: TimeScale;
  openedAt: number;
  now: number;
}

const snapshotIds = [
  "people-born",
  "flights-taking-off",
  "internet-searches",
  "co2-emitted",
  "messages-sent",
  "ai-prompts-asked",
];

export function ShareSnapshot({ statistics, timeScale, openedAt, now }: ShareSnapshotProps) {
  const [copied, setCopied] = useState(false);

  const featured = snapshotIds
    .map((id) => statistics.find((s) => s.id === id))
    .filter((s): s is Statistic => Boolean(s));

  const timestamp = new Date(now).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  function buildSnapshotText(): string {
    const lines = [
      `📊 OnAverage Snapshot, ${timestamp}`,
      `Scale: per ${timeScale === "year" ? "year" : timeScale}`,
      "",
      ...featured.map((s) => {
        const rate = getRateForScale(s.yearlyEstimate, timeScale);
        return `• ${s.title}: ${formatLargeNumber(rate, rate >= 10_000)} ${s.unit} / ${timeScale === "year" ? "year" : timeScale}`;
      }),
      "",
      "See the live counters at: onaverage.io",
    ];
    return lines.join("\n");
  }

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(buildSnapshotText());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card shadow-subtle">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Camera className="h-4 w-4 text-primary" />
          <h2 className="text-sm font-semibold">Share this moment</h2>
        </div>
      </div>

      <div className="p-4">
        {/* Preview */}
        <div className="rounded-lg bg-muted/40 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
          <p className="font-semibold text-foreground">📊 OnAverage Snapshot, {timestamp}</p>
          <p className="mt-0.5 text-[11px]">Scale: per {timeScale === "year" ? "year" : timeScale}</p>
          <div className="mt-2 space-y-1">
            {featured.map((s) => {
              const rate = getRateForScale(s.yearlyEstimate, timeScale);
              return (
                <p key={s.id}>
                  • {s.title}:{" "}
                  <span className="font-semibold text-foreground">
                    {formatLargeNumber(rate, rate >= 10_000)}
                  </span>{" "}
                  {s.unit} / {timeScale === "year" ? "year" : timeScale}
                </p>
              );
            })}
          </div>
        </div>

        <button
          type="button"
          onClick={copyToClipboard}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              Copied to clipboard!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copy snapshot text
            </>
          )}
        </button>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">
          Paste and share anywhere: Twitter, Slack, notes.
        </p>
      </div>
    </div>
  );
}
