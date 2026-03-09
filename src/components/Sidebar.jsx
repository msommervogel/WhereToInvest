import { useState } from "react";
import { ChevronDown, ChevronUp, Home, TrendingUp, Wrench, Info } from "lucide-react";
import Slider from "./ui/Slider.jsx";

const fmt = {
  eur:  (v) => v.toLocaleString("fr-FR") + " €",
  pct:  (v) => v.toFixed(v < 1 ? 2 : 1) + " %",
  m2:   (v) => v + " m²",
  ans:  (v) => v + " ans",
  mois: (v) => v + " €/mois",
};

function Section({ icon: Icon, title, color, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-card transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <Icon size={13} style={{ color }} />
          <span className="text-[10px] font-mono uppercase tracking-widest" style={{ color }}>
            {title}
          </span>
        </div>
        {open ? <ChevronUp size={12} className="text-dim" /> : <ChevronDown size={12} className="text-dim" />}
      </button>
      {open && (
        <div className="flex flex-col gap-5 px-4 pb-4 pt-1 bg-surface/50">
          {children}
        </div>
      )}
    </div>
  );
}

export default function Sidebar({ params, set }) {
  return (
    <aside className="flex flex-col h-full w-[285px] min-w-[285px] bg-bg border-r border-border overflow-y-auto">

      {/* Logo / header */}
      <div className="px-5 pt-6 pb-5 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-7 h-7 rounded-lg bg-accent/20 border border-accent/30 flex items-center justify-center">
            <Home size={13} className="text-accent" />
          </div>
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-dim">WhereToInvest</span>
        </div>
        <h1 className="font-display text-[22px] font-bold leading-tight text-text">
          Acheter<br />ou Louer ?
        </h1>
        <p className="font-mono text-[10px] text-dim mt-2 leading-relaxed">
          Simulation patrimoniale complète<br />sur la durée du crédit.
        </p>
      </div>

      {/* Params */}
      <div className="flex flex-col gap-3 p-4">

        {/* Bien */}
        <Section icon={Home} title="Bien immobilier" color="#7b68ee">
          <Slider label="Surface" value={params.surface} onChange={set("surface")} min={20} max={200} step={5} format={fmt.m2} accentColor="#7b68ee" />
          <div className="flex items-center gap-2">
            <button
              onClick={() => set("neuf")(!params.neuf)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all border ${
                !params.neuf
                  ? "bg-accent/20 border-accent/50 text-accent"
                  : "border-border text-dim hover:border-muted"
              }`}
            >
              Ancien (7.5%)
            </button>
            <button
              onClick={() => set("neuf")(!params.neuf)}
              className={`flex-1 py-2 rounded-lg text-[10px] font-mono uppercase tracking-widest transition-all border ${
                params.neuf
                  ? "bg-accent/20 border-accent/50 text-accent"
                  : "border-border text-dim hover:border-muted"
              }`}
            >
              Neuf (2.5%)
            </button>
          </div>
        </Section>

        {/* Crédit */}
        <Section icon={TrendingUp} title="Crédit immobilier" color="#00e5a0">
          <Slider label="Apport" value={params.apport} onChange={set("apport")} min={0} max={200000} step={5000} format={fmt.eur} accentColor="#00e5a0" />
          <Slider label="Taux d'emprunt" value={params.tauxEmprunt} onChange={set("tauxEmprunt")} min={1} max={6} step={0.05} format={fmt.pct} accentColor="#00e5a0" />
          <Slider label="Durée" value={params.duree} onChange={set("duree")} min={10} max={30} step={1} format={fmt.ans} accentColor="#00e5a0" />
          <Slider label="Assurance emprunteur" value={params.assuranceEmprunteur} onChange={set("assuranceEmprunteur")} min={0.1} max={0.8} step={0.05} format={fmt.pct} accentColor="#00e5a0" />
        </Section>

        {/* Charges */}
        <Section icon={Wrench} title="Charges & travaux" color="#ff9f43" defaultOpen={false}>
          <Slider label="Travaux / entretien" value={params.tauxTravaux} onChange={set("tauxTravaux")} min={0} max={3} step={0.1} format={fmt.pct} accentColor="#ff9f43" />
          <div className="flex items-center gap-1.5">
            <Info size={10} className="text-dim shrink-0" />
            <span className="text-[9px] font-mono text-dim leading-relaxed">
              % du prix du bien par an pour l'entretien courant
            </span>
          </div>
          <Slider label="Charges copropriété" value={params.chargesCopro} onChange={set("chargesCopro")} min={0} max={500} step={25} format={fmt.mois} accentColor="#ff9f43" />
          <Slider label="Taxe foncière" value={params.tauxFoncier} onChange={set("tauxFoncier")} min={5} max={30} step={0.5} format={(v) => `${v} €/m²/an`} accentColor="#ff9f43" />
        </Section>

        {/* Placement */}
        <Section icon={TrendingUp} title="Placement & marché" color="#ff6040" defaultOpen={false}>
          <Slider label="Rendement placement" value={params.tauxPlacement} onChange={set("tauxPlacement")} min={1} max={12} step={0.5} format={fmt.pct} accentColor="#ff6040" />
          <div className="flex items-center gap-1.5">
            <Info size={10} className="text-dim shrink-0" />
            <span className="text-[9px] font-mono text-dim leading-relaxed">
              Rendement annuel net de l'épargne placée (ETF, AV…)
            </span>
          </div>
          <Slider label="Hausse immo / an" value={params.hausseImmo} onChange={set("hausseImmo")} min={0} max={5} step={0.25} format={fmt.pct} accentColor="#ff6040" />
          <Slider label="Hausse des loyers / an" value={params.augmentationLoyer} onChange={set("augmentationLoyer")} min={0} max={4} step={0.25} format={fmt.pct} accentColor="#ff6040" />
        </Section>

      </div>

      {/* Légende */}
      <div className="mt-auto px-4 pb-5 pt-2 border-t border-border">
        <p className="font-mono text-[9px] tracking-widest uppercase text-muted mb-2.5">Légende carte</p>
        <div className="flex flex-col gap-1.5">
          {[
            { color: "#00e5a0", label: "Achat avantageux" },
            { color: "#ff6040", label: "Location avantageuse" },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: `0 0 8px ${color}80` }} />
              <span className="font-mono text-[10px] text-dim">{label}</span>
            </div>
          ))}
          <p className="font-mono text-[9px] text-muted mt-1">Taille = prix au m²  ·  Cliquez pour le détail</p>
        </div>
      </div>
    </aside>
  );
}