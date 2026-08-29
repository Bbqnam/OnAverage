import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell";
import { CategoryTabs } from "./components/CategoryTabs";
import { CompareSignals } from "./components/CompareSignals";
import { DashboardHero } from "./components/DashboardHero";
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
} from "./lib/preferences";
import { getCumulativeValue } from "./lib/timeline";
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

  const trimmedSearchTerm = searchTerm.trim();

  const searchResults = useMemo(() => {
    if (dataset.status !== "available") return [];
    return filterStatistics(dataset.statistics, {
      searchTerm,
      selectedTab: "All",
      confidence: "all",
      dataMode: "all",
    });
  }, [dataset, searchTerm]);

  const isSearchMode = trimmedSearchTerm.length > 0;

  const filteredStatistics = useMemo(() => {
    if (dataset.status !== "available") return [];
    return filterStatistics(dataset.statistics, {
      searchTerm: isSearchMode ? searchTerm : "",
      selectedTab,
      confidence: "all",
      dataMode: "all",
    });
  }, [dataset, isSearchMode, searchTerm, selectedTab]);

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
    const selectedStartDate = new Date(openedAt);
    const currentDate = new Date(now);
    const pool = (filteredStatistics.length > 0 ? filteredStatistics : dataset.statistics).filter(
      (statistic) =>
        !getCumulativeValue(statistic, selectedStartDate, currentDate).isUnavailable,
    );
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

      {isSearchMode ? (
        <>
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground shadow-subtle">
            <span aria-live="polite">
              {searchResults.length} result{searchResults.length === 1 ? "" : "s"} for “{trimmedSearchTerm}”
            </span>
          </div>

          <StatGrid
            dataset={dataset}
            statistics={searchResults}
            openedAt={openedAt}
            now={now}
            timeScale={selectedScale}
            highlightedStatisticId={highlightedStatisticId}
            onOpenStatistic={openStatistic}
            favorites={prefs.favorites}
            onToggleFavorite={handleToggleFavorite}
          />
        </>
      ) : (
        <>
          <DashboardHero
            countryName={dataset.name}
            signalCount={dataset.statistics.length}
            categoryCount={new Set(dataset.statistics.map((statistic) => statistic.category)).size}
            favoritesCount={prefs.favorites.length}
            activePanel={activePanel}
            onSurprise={showRandomStatistic}
            onOpenSinceBorn={() => setShowSinceBorn(true)}
            onTogglePanel={togglePanel}
          />

          <section className="toolbar-surface grid min-w-0 gap-2 rounded-2xl border border-border/80 bg-card/80 p-1.5 shadow-subtle backdrop-blur-sm xl:grid-cols-[minmax(0,1fr)_auto] xl:items-center">
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

          {/* My World Panel */}
          {activePanel === "myworld" && (
            <MyWorldPanel
              statistics={dataset.statistics}
              favorites={prefs.favorites}
              openedAt={openedAt}
              now={now}
              timeScale={selectedScale}
              onOpen={openStatistic}
              onToggleFavorite={handleToggleFavorite}
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

          <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-5 text-sm text-muted-foreground">
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
            onToggleFavorite={handleToggleFavorite}
          />
        </>
      )}

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
