import { useEffect, useMemo, useState } from "react";
import { ArrowLeftRight, Baby, Camera, Globe, Shuffle } from "lucide-react";
import { AppShell } from "./components/AppShell";
import { CategoryTabs } from "./components/CategoryTabs";
import { CompareSignals } from "./components/CompareSignals";
import { FeaturedStatCard } from "./components/FeaturedStatCard";
import { Header } from "./components/Header";
import { LastHourNarrative } from "./components/LastHourNarrative";
import { MyWorldPanel } from "./components/MyWorldPanel";
import { ShareSnapshot } from "./components/ShareSnapshot";
import { SinceBornModal } from "./components/SinceBornModal";
import { SinceOpenedExplorer } from "./components/SinceOpenedExplorer";
import { StatDetailDrawer } from "./components/StatDetailDrawer";
import { StatGrid } from "./components/StatGrid";
import { TimeScaleToggle } from "./components/TimeScaleToggle";
import { TrendingSection } from "./components/TrendingSection";
import { statisticsByCountry } from "./data/statistics";
import {
  getTrendingStats,
  pickRandomStatistic,
  type SinceOpenedMode,
} from "./lib/discovery";
import { filterStatistics } from "./lib/filtering";
import { getFeaturedStatistic } from "./lib/grouping";
import {
  loadPreferences,
  savePreferences,
  toggleFavorite,
  toggleMyWorld,
} from "./lib/preferences";
import type {
  CountryCode,
  DashboardTab,
  Statistic,
  TimeScale,
  UserPreferences,
} from "./types/statistic";

type ActivePanel = "none" | "myworld" | "compare" | "snapshot";

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
  const [activePanel, setActivePanel] = useState<ActivePanel>("none");
  const [showSinceBorn, setShowSinceBorn] = useState(false);
  const [prefs, setPrefs] = useState<UserPreferences>(() => loadPreferences());

  // Tick the clock
  useEffect(() => {
    const intervalId = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(intervalId);
  }, []);

  // Rotate trending
  useEffect(() => {
    const intervalId = window.setInterval(
      () => setTrendingSeed((current) => current + 1),
      12_000,
    );
    return () => window.clearInterval(intervalId);
  }, []);

  // Persist prefs on change
  useEffect(() => {
    savePreferences(prefs);
  }, [prefs]);

  const dataset = statisticsByCountry[selectedCountry];

  const filteredStatistics = useMemo(() => {
    if (dataset.status !== "available") return [];
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

  function openStatistic(statistic: Statistic) {
    setSelectedStatistic(statistic);
    setHighlightedStatisticId(statistic.id);
  }

  function showRandomStatistic() {
    const pool = filteredStatistics.length > 0 ? filteredStatistics : dataset.statistics;
    // Prefer stats with a surpriseFact
    const surprising = pool.filter((s) => s.surpriseFact);
    const target = surprising.length > 2
      ? pickRandomStatistic(surprising)
      : pickRandomStatistic(pool);
    if (target) openStatistic(target);
  }

  function handleToggleFavorite(id: string) {
    setPrefs((p) => toggleFavorite(p, id));
  }

  function handleToggleMyWorld(id: string) {
    setPrefs((p) => toggleMyWorld(p, id));
  }

  function togglePanel(panel: ActivePanel) {
    setActivePanel((cur) => (cur === panel ? "none" : panel));
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

      {/* Control bar */}
      <section className="rounded-lg border border-border bg-card px-3 py-2.5 text-card-foreground shadow-subtle">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-sm font-semibold tracking-normal">World overview</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Live-feeling counters from average yearly estimates.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {/* Shuffle / surprise */}
            <button
              type="button"
              onClick={showRandomStatistic}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-md bg-primary px-3 text-xs font-medium text-primary-foreground transition hover:opacity-90"
            >
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              Surprise me
            </button>

            {/* Since I was born */}
            <button
              type="button"
              onClick={() => setShowSinceBorn(true)}
              className="inline-flex h-8 items-center justify-center gap-2 rounded-md border border-border bg-background px-3 text-xs font-medium text-foreground transition hover:bg-accent"
            >
              <Baby className="h-3.5 w-3.5" aria-hidden="true" />
              Since I was born
            </button>

            {/* My World */}
            <button
              type="button"
              onClick={() => togglePanel("myworld")}
              className={`inline-flex h-8 items-center justify-center gap-2 rounded-md border px-3 text-xs font-medium transition ${
                activePanel === "myworld"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              <Globe className="h-3.5 w-3.5" aria-hidden="true" />
              My World{prefs.myWorldIds.length > 0 && ` (${prefs.myWorldIds.length})`}
            </button>

            {/* Compare */}
            <button
              type="button"
              onClick={() => togglePanel("compare")}
              className={`inline-flex h-8 items-center justify-center gap-2 rounded-md border px-3 text-xs font-medium transition ${
                activePanel === "compare"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              <ArrowLeftRight className="h-3.5 w-3.5" aria-hidden="true" />
              Compare
            </button>

            {/* Share snapshot */}
            <button
              type="button"
              onClick={() => togglePanel("snapshot")}
              className={`inline-flex h-8 items-center justify-center gap-2 rounded-md border px-3 text-xs font-medium transition ${
                activePanel === "snapshot"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-border bg-background text-foreground hover:bg-accent"
              }`}
            >
              <Camera className="h-3.5 w-3.5" aria-hidden="true" />
              Share
            </button>
          </div>
        </div>
      </section>

      {/* My World Panel */}
      {activePanel === "myworld" && (
        <MyWorldPanel
          statistics={dataset.statistics}
          myWorldIds={prefs.myWorldIds}
          favorites={prefs.favorites}
          openedAt={openedAt}
          now={now}
          timeScale={selectedScale}
          onOpen={openStatistic}
          onToggleFavorite={handleToggleFavorite}
          onToggleMyWorld={handleToggleMyWorld}
          onClose={() => setActivePanel("none")}
        />
      )}

      {/* Compare Panel */}
      {activePanel === "compare" && (
        <CompareSignals
          statistics={dataset.statistics}
          timeScale={selectedScale}
          onClose={() => setActivePanel("none")}
        />
      )}

      {/* Share Snapshot Panel */}
      {activePanel === "snapshot" && (
        <ShareSnapshot
          statistics={dataset.statistics}
          timeScale={selectedScale}
          openedAt={openedAt}
          now={now}
        />
      )}

      {/* Last Hour Narrative */}
      <LastHourNarrative statistics={dataset.statistics} />

      {featuredStatistic && (
        <FeaturedStatCard
          statistic={featuredStatistic}
          openedAt={openedAt}
          now={now}
          timeScale={selectedScale}
          rotationStatistics={dataset.statistics}
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
          Showing {filteredStatistics.length} of {dataset.statistics.length} signals for{" "}
          {dataset.name}.
        </span>
        <span className="hidden sm:inline">
          ⭐ Star a card to favourite it · ☰ Click for methodology &amp; sources
        </span>
      </div>

      <StatGrid
        dataset={dataset}
        statistics={filteredStatistics}
        openedAt={openedAt}
        now={now}
        timeScale={selectedScale}
        highlightedStatisticId={highlightedStatisticId}
        onOpenStatistic={openStatistic}
        favorites={prefs.favorites}
        myWorldIds={prefs.myWorldIds}
        onToggleFavorite={handleToggleFavorite}
        onToggleMyWorld={handleToggleMyWorld}
      />

      <StatDetailDrawer
        statistic={selectedStatistic}
        onClose={() => setSelectedStatistic(null)}
      />

      {/* Since I Was Born Modal */}
      {showSinceBorn && (
        <SinceBornModal
          statistics={dataset.statistics}
          birthYear={prefs.birthYear}
          onClose={() => setShowSinceBorn(false)}
          onSaveBirthYear={(year) => {
            setPrefs((p) => ({ ...p, birthYear: year }));
            setShowSinceBorn(false);
          }}
        />
      )}
    </AppShell>
  );
}

export default App;
