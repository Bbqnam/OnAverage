import { useEffect, useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { AppShell } from "./components/AppShell";
import { CategoryTabs } from "./components/CategoryTabs";
import { FeaturedStatCard } from "./components/FeaturedStatCard";
import { Header } from "./components/Header";
import { MetricSummaryCards } from "./components/MetricSummaryCards";
import { SinceOpenedExplorer } from "./components/SinceOpenedExplorer";
import { StatDetailDrawer } from "./components/StatDetailDrawer";
import { StatGrid } from "./components/StatGrid";
import { TimeScaleToggle } from "./components/TimeScaleToggle";
import { TrendingSection } from "./components/TrendingSection";
import { statisticsByCountry } from "./data/statistics";
import {
  getFeaturedCompanionStats,
  getTrendingStats,
  pickRandomStatistic,
  type SinceOpenedMode,
} from "./lib/discovery";
import { filterStatistics } from "./lib/filtering";
import { getFeaturedStatistic } from "./lib/grouping";
import type {
  CountryCode,
  DashboardTab,
  Statistic,
  TimeScale,
} from "./types/statistic";

function App() {
  const [openedAt] = useState(() => Date.now());
  const [now, setNow] = useState(() => Date.now());
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>("global");
  const [selectedTab, setSelectedTab] = useState<DashboardTab>("All");
  const [selectedScale, setSelectedScale] = useState<TimeScale>("second");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatistic, setSelectedStatistic] = useState<Statistic | null>(null);
  const [highlightedStatisticId, setHighlightedStatisticId] = useState<string | null>(null);
  const [sinceOpenedMode, setSinceOpenedMode] = useState<SinceOpenedMode>("mixed");
  const [trendingSeed, setTrendingSeed] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 500);

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const intervalId = window.setInterval(
      () => setTrendingSeed((current) => current + 1),
      12_000,
    );

    return () => window.clearInterval(intervalId);
  }, []);

  const dataset = statisticsByCountry[selectedCountry];

  const filteredStatistics = useMemo(() => {
    if (dataset.status !== "available") {
      return [];
    }

    return filterStatistics(dataset.statistics, {
      searchTerm,
      selectedTab,
      confidence: "all",
      dataMode: "all",
    });
  }, [dataset, searchTerm, selectedTab]);

  const trendingStatistics = useMemo(
    () => getTrendingStats(dataset.statistics, trendingSeed),
    [dataset.statistics, trendingSeed],
  );

  const featuredStatistic = useMemo(
    () => getFeaturedStatistic(dataset.statistics),
    [dataset.statistics],
  );

  const featuredCompanionStatistics = useMemo(() => {
    if (!featuredStatistic) {
      return [];
    }

    return getFeaturedCompanionStats(dataset.statistics, featuredStatistic);
  }, [dataset.statistics, featuredStatistic]);

  const sectionStatistics = useMemo(
    () =>
      featuredStatistic
        ? filteredStatistics.filter((statistic) => statistic.id !== featuredStatistic.id)
        : filteredStatistics,
    [featuredStatistic, filteredStatistics],
  );

  function openStatistic(statistic: Statistic) {
    setSelectedStatistic(statistic);
    setHighlightedStatisticId(statistic.id);
  }

  function showRandomStatistic() {
    const randomStatistic = pickRandomStatistic(
      filteredStatistics.length > 0 ? filteredStatistics : dataset.statistics,
    );

    if (randomStatistic) {
      openStatistic(randomStatistic);
    }
  }

  return (
    <AppShell>
      <Header
        selectedCountry={selectedCountry}
        onCountryChange={setSelectedCountry}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      <section className="flex flex-col gap-2 lg:flex-row lg:items-center">
        <div className="min-w-0 flex-1">
          <CategoryTabs
            selectedTab={selectedTab}
            statistics={dataset.statistics}
            onTabChange={setSelectedTab}
          />
        </div>
        <div className="min-w-0 lg:shrink-0">
          <TimeScaleToggle selectedScale={selectedScale} onScaleChange={setSelectedScale} />
        </div>
      </section>

      <section className="rounded-lg border border-border bg-card px-3 py-2.5 text-card-foreground shadow-subtle">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-normal">World overview</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Live-feeling counters from average yearly estimates.
            </p>
          </div>
          <button
            type="button"
            onClick={showRandomStatistic}
            className="inline-flex h-8 items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:opacity-90"
          >
            <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
            Show me something interesting
          </button>
        </div>
      </section>

      <MetricSummaryCards
        dataset={dataset}
        filteredCount={filteredStatistics.length}
        openedAt={openedAt}
        now={now}
      />

      {featuredStatistic && (
        <FeaturedStatCard
          statistic={featuredStatistic}
          openedAt={openedAt}
          now={now}
          timeScale={selectedScale}
          supportingStatistics={featuredCompanionStatistics}
          onOpen={openStatistic}
        />
      )}

      <SinceOpenedExplorer
        statistics={dataset.statistics}
        openedAt={openedAt}
        now={now}
        mode={sinceOpenedMode}
        onModeChange={setSinceOpenedMode}
        onOpenStatistic={openStatistic}
      />

      <TrendingSection
        statistics={trendingStatistics}
        onOpenStatistic={openStatistic}
      />

      <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
        <span>
          Showing {filteredStatistics.length} of {dataset.statistics.length} questions for{" "}
          {dataset.name}.
        </span>
        <span className="hidden sm:inline">Click a card for methodology and sources.</span>
      </div>

      <StatGrid
        dataset={dataset}
        statistics={sectionStatistics}
        openedAt={openedAt}
        now={now}
        timeScale={selectedScale}
        highlightedStatisticId={highlightedStatisticId}
        onOpenStatistic={openStatistic}
      />

      <StatDetailDrawer
        statistic={selectedStatistic}
        onClose={() => setSelectedStatistic(null)}
      />
    </AppShell>
  );
}

export default App;
