import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine, Legend,
} from "recharts";

const C_A = "#00e5a0";
const C_L = "#ff6040";

const fmt  = (v) => Math.round(v).toLocaleString("fr-FR");
const fmtK = (v) => `${fmt(Math.round(v / 1000))} k€`;
const fmtM = (v) => `${fmt(Math.round(v))} €/mois`;
const fmtE = (v) => `${fmt(Math.round(v))} €`;
const fmtD = (v) => `${v >= 0 ? "+" : ""}${fmt(Math.round(v))} €`;

function StatCell({ label, value, color, sub }) {
  return (
    <div className="flex flex-col gap-0.5 min-w-[110px] bg-bg rounded-xl border border-border px-3.5 py-2.5">
      <span className="text-[8.5px] font-mono uppercase tracking-widest text-dim">{label}</span>
      <span className="text-[13px] font-mono font-semibold" style={{ color: color ?? "#e2e6f3" }}>{value}</span>
      {sub && <span className="text-[9px] font-mono text-muted">{sub}</span>}
    </div>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 shadow-xl font-mono text-[11px]">
      <div className="text-dim mb-1.5">{label} ans</div>
      {payload.map((p) => (
        <div key={p.name} style={{ color: p.color }} className="flex justify-between gap-4">
          <span>{p.name}</span>
          <span className="font-semibold">{fmtK(p.value * 1000)}</span>
        </div>
      ))}
    </div>
  );
}

const TABS = ["Résumé", "Mensualités", "Graphique"];

export default function DetailPanel({ ville, onClose }) {
  const [tab, setTab] = useState("Résumé");

  return (
    <AnimatePresence>
      {ville && (
        <motion.div
          key="panel"
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", stiffness: 380, damping: 38 }}
          className="absolute bottom-0 left-0 right-0 z-[1000] bg-[#0c0e18] border-t border-border"
          style={{ height: 245 }}
        >
          {(() => {
            const { res } = ville;
            const isAchat = res.meilleure === "Achat";
            const clr = isAchat ? C_A : C_L;
            const Icon = isAchat ? TrendingUp : TrendingDown;

            const chartData = res.historique.map((h) => ({
              annee:    h.annee,
              Achat:    +(h.achat / 1000).toFixed(1),
              Location: +(h.location / 1000).toFixed(1),
            }));

            return (
              <>
                {/* ── Header ── */}
                <div className="flex items-center justify-between px-5 py-2.5 border-b border-border">
                  <div className="flex items-center gap-3">
                    <span className="font-display text-[17px] font-bold text-text">{ville.nom}</span>
                    <div
                      className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-mono font-semibold"
                      style={{ background: `${clr}15`, borderColor: `${clr}40`, color: clr }}
                    >
                      <Icon size={10} />
                      {res.meilleure} avantageux
                    </div>
                    <span className="font-mono text-[10px] text-dim hidden sm:block">
                      {fmt(ville.prix_m2)} €/m²  ·  {ville.loyer_m2} €/m² loyer
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    {/* Tabs */}
                    <div className="flex bg-card rounded-lg border border-border p-0.5 gap-0.5">
                      {TABS.map((t) => (
                        <button
                          key={t}
                          onClick={() => setTab(t)}
                          className={`px-3 py-1 rounded-md text-[10px] font-mono transition-all ${
                            tab === t
                              ? "bg-accent/20 text-accent border border-accent/30"
                              : "text-dim hover:text-text"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={onClose}
                      className="w-7 h-7 flex items-center justify-center rounded-lg border border-border text-dim hover:text-text hover:bg-card transition-all"
                    >
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* ── Body ── */}
                <div className="h-[calc(100%-49px)]">

                  {/* RÉSUMÉ */}
                  {tab === "Résumé" && (
                    <div className="flex items-start gap-2 px-4 py-3 overflow-x-auto h-full">
                      <StatCell label="Prix du bien"      value={fmtE(res.prix)} />
                      <StatCell label="Frais notaire"     value={fmtE(res.fraisNot)}         sub={`${((res.fraisNot/res.prix)*100).toFixed(1)}%`} />
                      <StatCell label="Capital emprunté"  value={fmtE(res.capitalEmprunte)} />
                      <StatCell label="Mensualité crédit" value={fmtM(res.mensCredit)}       color={C_A} />
                      <StatCell label="Loyer"             value={fmtM(res.loyer)}            color={C_L} />
                      <StatCell label="Δ mensuel brut"    value={fmtD(res.mensCredit - res.loyer)}  color={res.mensCredit > res.loyer ? C_L : C_A} />
                      <StatCell label="Pat. achat final"  value={fmtK(res.patAchat)}         color={C_A} />
                      <StatCell label="Pat. loc. final"   value={fmtK(res.patLoc)}           color={C_L} />
                      <StatCell label="Avantage achat"    value={`${res.avantage >= 0 ? "+" : ""}${fmtK(res.avantage)}`} color={clr} />
                      <StatCell label="Croisement"        value={res.croisement ? `${res.croisement} ans` : "Jamais"} />
                    </div>
                  )}

                  {/* MENSUALITÉS */}
                  {tab === "Mensualités" && (
                    <div className="flex items-start gap-2 px-4 py-3 overflow-x-auto h-full">
                      <div className="flex flex-col gap-1.5 min-w-[180px]">
                        <p className="font-mono text-[9px] uppercase tracking-widest text-dim mb-1" style={{ color: C_A }}>Coût mensuel achat</p>
                        {[
                          ["Remboursement crédit", res.mensCredit],
                          ["Assurance emprunteur", res.assurMens],
                          ["Taxe foncière",        res.foncierMens],
                          ["Travaux / entretien",  res.travauxMens],
                          ["Charges copropriété",  res.copro],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center bg-bg border border-border rounded-lg px-3 py-2 gap-8">
                            <span className="font-mono text-[10px] text-dim whitespace-nowrap">{k}</span>
                            <span className="font-mono text-[11px] text-text">{fmtM(v)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center bg-card border rounded-lg px-3 py-2 gap-8" style={{ borderColor: `${C_A}40` }}>
                          <span className="font-mono text-[10px]" style={{ color: C_A }}>TOTAL ACHAT</span>
                          <span className="font-mono text-[12px] font-bold" style={{ color: C_A }}>{fmtM(res.mensTotaleAchat)}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-1.5 min-w-[180px]">
                        <p className="font-mono text-[9px] uppercase tracking-widest mb-1" style={{ color: C_L }}>Coût mensuel location</p>
                        {[
                          ["Loyer",                  res.loyer],
                          ["Charges locataire ~30%", res.copro * 0.3],
                        ].map(([k, v]) => (
                          <div key={k} className="flex justify-between items-center bg-bg border border-border rounded-lg px-3 py-2 gap-8">
                            <span className="font-mono text-[10px] text-dim whitespace-nowrap">{k}</span>
                            <span className="font-mono text-[11px] text-text">{fmtM(v)}</span>
                          </div>
                        ))}
                        <div className="flex justify-between items-center bg-card border rounded-lg px-3 py-2 gap-8" style={{ borderColor: `${C_L}40` }}>
                          <span className="font-mono text-[10px]" style={{ color: C_L }}>TOTAL LOCATION</span>
                          <span className="font-mono text-[12px] font-bold" style={{ color: C_L }}>{fmtM(res.loyer + res.copro * 0.3)}</span>
                        </div>
                        <div className="bg-card border border-border rounded-lg px-3 py-2">
                          <p className="font-mono text-[9px] text-dim">Épargne mensuelle placée</p>
                          <p className="font-mono text-[12px] font-semibold text-text mt-0.5">
                            {fmtM(res.mensTotaleAchat - (res.loyer + res.copro * 0.3))}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* GRAPHIQUE */}
                  {tab === "Graphique" && (
                    <div className="h-full px-3 py-2">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="gA" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor={C_A} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={C_A} stopOpacity={0} />
                            </linearGradient>
                            <linearGradient id="gL" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%"  stopColor={C_L} stopOpacity={0.3} />
                              <stop offset="95%" stopColor={C_L} stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <XAxis dataKey="annee" tick={{ fontSize: 9, fill: "#6b7494", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false}
                            label={{ value: "années", position: "insideBottomRight", fill: "#3d4460", fontSize: 9, dy: 6 }} />
                          <YAxis tick={{ fontSize: 9, fill: "#6b7494", fontFamily: "JetBrains Mono" }} tickLine={false} axisLine={false}
                            tickFormatter={(v) => `${v}k`} width={42} />
                          <Tooltip content={<ChartTooltip />} />
                          <Legend wrapperStyle={{ fontSize: 9, fontFamily: "JetBrains Mono", paddingTop: 0 }} iconType="circle" iconSize={7} />
                          {res.croisement && (
                            <ReferenceLine x={res.croisement} stroke="#3d4460" strokeDasharray="3 3"
                              label={{ value: `⚡ ${res.croisement}a`, fill: "#6b7494", fontSize: 9, fontFamily: "JetBrains Mono" }} />
                          )}
                          <Area type="monotone" dataKey="Achat"    stroke={C_A} strokeWidth={2} fill="url(#gA)" dot={false} />
                          <Area type="monotone" dataKey="Location" stroke={C_L} strokeWidth={2} fill="url(#gL)" dot={false} />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  )}

                </div>
              </>
            );
          })()}
        </motion.div>
      )}
    </AnimatePresence>
  );
}