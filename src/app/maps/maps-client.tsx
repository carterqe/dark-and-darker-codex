"use client";

import { useState, useRef, useCallback } from "react";
import { TransformWrapper, TransformComponent, useControls } from "react-zoom-pan-pinch";
import { motion, AnimatePresence } from "framer-motion";
import {
  DoorOpen,
  Zap,
  Heart,
  Shield,
  Swords,
  Wind,
  Plus,
  Skull,
  Flame,
  Gem,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Layers,
  ChevronLeft,
  Info,
} from "lucide-react";
import {
  MAPS,
  FEATURE_META,
  FEATURE_TYPES,
  type DungeonMap,
  type MapFeature,
  type FeatureType,
} from "@/lib/map-data";
import ShimmerText from "@/components/ui/ShimmerText";

// ─── Feature icon map ────────────────────────────────────────────────────────

const FEATURE_ICONS: Record<FeatureType, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  extract:           DoorOpen,
  portal_red:        Zap,
  shrine_health:     Heart,
  shrine_protection: Shield,
  shrine_power:      Swords,
  fountain_speed:    Wind,
  altar:             Plus,
  boss:              Skull,
  campfire:          Flame,
  treasure:          Gem,
};

// ─── Theme styles per dungeon ────────────────────────────────────────────────

function getThemeAccent(theme: DungeonMap["theme"]): string {
  switch (theme) {
    case "cave":      return "from-amber-950/60 to-transparent";
    case "ruins":     return "from-stone-950/60 to-transparent";
    case "crypt":     return "from-indigo-950/60 to-transparent";
    case "inferno":   return "from-red-950/60 to-transparent";
    case "ice":       return "from-sky-950/60 to-transparent";
    case "abyss":     return "from-blue-950/60 to-transparent";
    case "sea":       return "from-teal-950/60 to-transparent";
    case "firedeep":  return "from-orange-950/60 to-transparent";
  }
}

// ─── Marker tooltip ──────────────────────────────────────────────────────────

interface MarkerProps {
  feature: MapFeature;
  isHovered: boolean;
  onHover: (id: string | null) => void;
}

function FeatureMarker({ feature, isHovered, onHover }: MarkerProps) {
  const meta = FEATURE_META[feature.type];
  const Icon = FEATURE_ICONS[feature.type];

  return (
    <div
      style={{
        position: "absolute",
        left: `${feature.x}%`,
        top: `${feature.y}%`,
        transform: "translate(-50%, -50%)",
        zIndex: isHovered ? 20 : 5,
        pointerEvents: "all",
      }}
      onMouseEnter={() => onHover(feature.id)}
      onMouseLeave={() => onHover(null)}
    >
      {/* Pulse ring on boss markers */}
      {feature.type === "boss" && (
        <div
          style={{
            position: "absolute",
            inset: -8,
            borderRadius: 8,
            border: `2px solid ${meta.borderColor}`,
            animation: "ping 2s cubic-bezier(0,0,0.2,1) infinite",
            opacity: 0.5,
          }}
        />
      )}

      {/* Marker body */}
      <div
        style={{
          width: 38,
          height: 38,
          backgroundColor: meta.bgColor,
          border: `2px solid ${meta.borderColor}`,
          borderRadius: 7,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          transition: "transform 0.12s ease, box-shadow 0.12s ease, filter 0.12s ease",
          transform: isHovered ? "scale(1.25)" : "scale(1)",
          filter: isHovered ? "brightness(1.25)" : "brightness(1)",
          boxShadow: isHovered
            ? `0 0 14px ${meta.color}99, 0 3px 10px rgba(0,0,0,0.9), 0 0 0 1px rgba(0,0,0,0.6)`
            : `0 3px 8px rgba(0,0,0,0.85), 0 0 0 1px rgba(0,0,0,0.5)`,
        }}
      >
        <Icon className="w-5 h-5" style={{ color: meta.color, flexShrink: 0 }} />
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.1 }}
            style={{
              position: "absolute",
              bottom: "calc(100% + 8px)",
              left: "50%",
              transform: "translateX(-50%)",
              backgroundColor: "#12121a",
              border: `1px solid ${meta.borderColor}`,
              borderRadius: 4,
              padding: "6px 10px",
              whiteSpace: "nowrap",
              pointerEvents: "none",
              minWidth: 140,
              boxShadow: `0 4px 16px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,0,0,0.3)`,
            }}
          >
            <p style={{ color: meta.color, fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 2 }}>
              {meta.label}
            </p>
            <p style={{ color: "#e8e6e1", fontSize: 12, fontWeight: 600, marginBottom: feature.description ? 3 : 0 }}>
              {feature.label}
            </p>
            {feature.description && (
              <p style={{ color: "#8a8693", fontSize: 11, maxWidth: 220, whiteSpace: "normal", lineHeight: 1.4 }}>
                {feature.description}
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Zoom controls ───────────────────────────────────────────────────────────

function ZoomControls() {
  const { zoomIn, zoomOut, resetTransform } = useControls();
  const btnCls = "w-8 h-8 flex items-center justify-center bg-bg-secondary border border-border-subtle rounded-sm text-text-secondary hover:text-gold-primary hover:border-gold-primary/40 transition-all";
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-1 z-30">
      <button onClick={() => zoomIn(0.3, 200, "easeOut")} className={btnCls} title="Zoom in">
        <ZoomIn className="w-4 h-4" />
      </button>
      <button onClick={() => resetTransform(300, "easeOut")} className={btnCls} title="Reset view">
        <RotateCcw className="w-3.5 h-3.5" />
      </button>
      <button onClick={() => zoomOut(0.3, 200, "easeOut")} className={btnCls} title="Zoom out">
        <ZoomOut className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── Map canvas ──────────────────────────────────────────────────────────────

interface MapCanvasProps {
  map: DungeonMap;
  enabledTypes: Set<FeatureType>;
  hoveredId: string | null;
  onHover: (id: string | null) => void;
}

function MapCanvas({ map, enabledTypes, hoveredId, onHover }: MapCanvasProps) {
  const themeGradient = getThemeAccent(map.theme);

  const bgImage = map.imageUrl
    ? `url("${map.imageUrl}")`
    : [
        `repeating-linear-gradient(0deg, ${map.gridColor} 0px, transparent 1px, transparent 80px, ${map.gridColor} 80px)`,
        `repeating-linear-gradient(90deg, ${map.gridColor} 0px, transparent 1px, transparent 80px, ${map.gridColor} 80px)`,
        `repeating-linear-gradient(0deg, ${map.gridColor.replace("0.11", "0.06")} 0px, transparent 1px, transparent 320px, ${map.gridColor.replace("0.11", "0.06")} 320px)`,
        `repeating-linear-gradient(90deg, ${map.gridColor.replace("0.11", "0.06")} 0px, transparent 1px, transparent 320px, ${map.gridColor.replace("0.11", "0.06")} 320px)`,
      ].join(", ");

  return (
    <div
      style={{
        position: "relative",
        width: map.width,
        height: map.height,
        backgroundColor: map.bgColor,
        backgroundImage: bgImage,
        backgroundSize: map.imageUrl ? "100% 100%" : "auto",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Edge vignette — darkens edges so markers are readable */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, boxShadow: "inset 0 0 100px rgba(0,0,0,0.55)" }}
      />

      {/* Subtle theme tint on corners */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${themeGradient} pointer-events-none`}
        style={{ zIndex: 1, opacity: 0.35 }}
      />

      {/* Feature markers */}
      <div style={{ position: "absolute", inset: 0, zIndex: 3 }}>
        {map.features.map((f) =>
          enabledTypes.has(f.type) ? (
            <FeatureMarker
              key={f.id}
              feature={f}
              isHovered={hoveredId === f.id}
              onHover={onHover}
            />
          ) : null
        )}
      </div>
    </div>
  );
}

// ─── Main component ──────────────────────────────────────────────────────────

export default function MapsClient() {
  const [selectedMap, setSelectedMap] = useState<DungeonMap>(MAPS[0]);
  const [enabledTypes, setEnabledTypes] = useState<Set<FeatureType>>(new Set(FEATURE_TYPES));
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showInfo, setShowInfo] = useState(false);

  const toggleType = useCallback((type: FeatureType) => {
    setEnabledTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  }, []);

  const toggleAll = useCallback(() => {
    setEnabledTypes((prev) =>
      prev.size === FEATURE_TYPES.length ? new Set() : new Set(FEATURE_TYPES)
    );
  }, []);

  // Count visible features
  const visibleCount = selectedMap.features.filter((f) => enabledTypes.has(f.type)).length;

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 56px)" }}>
      {/* ── Page header ── */}
      <div className="shrink-0 px-4 sm:px-6 pt-5 pb-3 flex items-center justify-between gap-4 border-b border-border-subtle">
        <div>
          <ShimmerText as="h1" className="text-2xl sm:text-3xl leading-tight">
            Dungeon Maps
          </ShimmerText>
          <p className="text-xs text-text-secondary mt-0.5">
            Interactive reference maps — feature positions are representative
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-text-secondary border border-border-subtle rounded-sm hover:text-gold-primary hover:border-gold-primary/30 transition-all"
          >
            <Info className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs text-text-secondary border border-border-subtle rounded-sm hover:text-gold-primary hover:border-gold-primary/30 transition-all"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{sidebarOpen ? "Hide Panel" : "Show Panel"}</span>
          </button>
        </div>
      </div>

      {/* ── Info banner ── */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="shrink-0 overflow-hidden"
          >
            <div className="px-4 sm:px-6 py-2.5 bg-gold-primary/5 border-b border-gold-primary/15 text-xs text-text-secondary">
              <strong className="text-gold-dark">Note:</strong> Dark &amp; Darker dungeons are procedurally generated —
              feature positions vary each run. Markers show <em>representative</em> locations based on common module
              layouts. Scroll or pinch to zoom. Click and drag to pan.
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Body ── */}
      <div className="flex flex-1 min-h-0">

        {/* ── Sidebar ── */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              key="sidebar"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 220, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeInOut" }}
              className="shrink-0 overflow-hidden border-r border-border-subtle bg-bg-primary flex flex-col"
              style={{ minWidth: 0 }}
            >
              <div className="flex flex-col gap-4 p-3 overflow-y-auto flex-1" style={{ width: 220 }}>

                {/* Map selector */}
                <div>
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gold-dark mb-1.5 px-1">
                    Dungeons
                  </p>
                  <div className="space-y-1">
                    {MAPS.map((m) => {
                      const active = m.id === selectedMap.id;
                      return (
                        <button
                          key={m.id}
                          onClick={() => { setSelectedMap(m); setHoveredId(null); }}
                          className={`w-full text-left px-2.5 py-2 rounded-sm border transition-all ${
                            active
                              ? "border-gold-primary/40 bg-gold-primary/10"
                              : "border-border-subtle hover:border-gold-primary/25 hover:bg-bg-secondary"
                          }`}
                        >
                          <span className={`text-xs font-cinzel font-bold block ${active ? "text-gold-primary" : "text-text-primary"}`}>
                            {m.name}
                          </span>
                          <span className="text-[10px] text-text-secondary/60">{m.subtitle}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Feature toggles */}
                <div>
                  <div className="flex items-center justify-between mb-1.5 px-1">
                    <p className="text-[10px] uppercase tracking-widest font-bold text-gold-dark">
                      Features
                    </p>
                    <button
                      onClick={toggleAll}
                      className="text-[10px] text-text-secondary hover:text-gold-primary transition-colors"
                    >
                      {enabledTypes.size === FEATURE_TYPES.length ? "Hide all" : "Show all"}
                    </button>
                  </div>
                  <div className="space-y-0.5">
                    {FEATURE_TYPES.map((type) => {
                      const meta = FEATURE_META[type];
                      const Icon = FEATURE_ICONS[type];
                      const enabled = enabledTypes.has(type);
                      const count = selectedMap.features.filter((f) => f.type === type).length;
                      if (count === 0) return null;
                      return (
                        <button
                          key={type}
                          onClick={() => toggleType(type)}
                          className={`w-full flex items-center gap-2 px-2 py-1.5 rounded-sm border transition-all ${
                            enabled
                              ? "border-transparent bg-bg-secondary hover:bg-bg-tertiary"
                              : "border-transparent opacity-40 hover:opacity-60"
                          }`}
                        >
                          <div
                            className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
                            style={{
                              backgroundColor: enabled ? meta.bgColor : "transparent",
                              border: `1px solid ${enabled ? meta.borderColor : "rgba(255,255,255,0.1)"}`,
                            }}
                          >
                            <Icon className="w-2.5 h-2.5" style={{ color: enabled ? meta.color : "#8a8693" }} />
                          </div>
                          <span className="text-[11px] text-text-secondary flex-1 text-left leading-tight">{meta.label}</span>
                          <span className="text-[10px] text-text-secondary/40 shrink-0">×{count}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Map description */}
                <div className="px-1 pt-1 border-t border-border-subtle">
                  <p className="text-[10px] uppercase tracking-widest font-bold text-gold-dark mb-1">
                    About
                  </p>
                  <p className="text-[11px] text-text-secondary leading-relaxed">
                    {selectedMap.description}
                  </p>
                  <p className="text-[10px] text-text-secondary/40 mt-2">
                    {visibleCount} of {selectedMap.features.length} features visible
                  </p>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* ── Map viewport ── */}
        <div className="flex-1 min-w-0 relative bg-bg-primary overflow-hidden">
          <TransformWrapper
            key={selectedMap.id}
            initialScale={0.85}
            minScale={0.15}
            maxScale={6}
            centerOnInit
            limitToBounds={false}
            smooth
            doubleClick={{ disabled: false, step: 0.5 }}
            wheel={{ step: 0.0006 }}
            zoomAnimation={{ animationTime: 120, animationType: "easeOut" }}
            panning={{ velocityDisabled: false }}
          >
            {() => (
              <>
                <TransformComponent
                  wrapperStyle={{ width: "100%", height: "100%", cursor: "grab" }}
                  contentStyle={{ userSelect: "none" }}
                >
                  <MapCanvas
                    map={selectedMap}
                    enabledTypes={enabledTypes}
                    hoveredId={hoveredId}
                    onHover={setHoveredId}
                  />
                </TransformComponent>

                {/* Floating zoom controls */}
                <ZoomControls />
              </>
            )}
          </TransformWrapper>

          {/* Map name badge (floating over viewport) */}
          <div className="absolute top-3 left-3 z-20 pointer-events-none">
            <div
              className="px-2.5 py-1 border border-border-subtle rounded-sm"
              style={{ backgroundColor: "rgba(10,9,15,0.85)", backdropFilter: "blur(6px)" }}
            >
              <p className="font-cinzel font-bold text-xs" style={{ color: selectedMap.accentColor }}>
                {selectedMap.name}
              </p>
              <p className="text-[10px] text-text-secondary/60">{selectedMap.subtitle}</p>
            </div>
          </div>

          {/* Legend chips (floating bottom-left) */}
          <div className="absolute bottom-4 left-3 z-20 flex flex-wrap gap-1 max-w-xs pointer-events-none">
            {FEATURE_TYPES.filter((t) => enabledTypes.has(t) && selectedMap.features.some((f) => f.type === t)).map((type) => {
              const meta = FEATURE_META[type];
              const Icon = FEATURE_ICONS[type];
              return (
                <div
                  key={type}
                  className="flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-medium"
                  style={{
                    backgroundColor: "rgba(10,9,15,0.8)",
                    border: `1px solid ${meta.borderColor}`,
                    backdropFilter: "blur(4px)",
                    color: meta.color,
                  }}
                >
                  <Icon className="w-2.5 h-2.5" />
                  {meta.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
