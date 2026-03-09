import { MapContainer, TileLayer, CircleMarker, Popup } from "react-leaflet";

function lerpColor(a, b, t) {
  const ah = parseInt(a.slice(1), 16), bh = parseInt(b.slice(1), 16);
  const ar = (ah >> 16) & 0xff, ag = (ah >> 8) & 0xff, ab = ah & 0xff;
  const br = (bh >> 16) & 0xff, bg = (bh >> 8) & 0xff, bb = bh & 0xff;
  const r = Math.round(ar + (br - ar) * t);
  const g = Math.round(ag + (bg - ag) * t);
  const bv = Math.round(ab + (bb - ab) * t);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${bv.toString(16).padStart(2, "0")}`;
}

function scoreToColor(s) {
  if (s >= 0) return lerpColor("#4a5568", "#00e5a0", s);
  return lerpColor("#4a5568", "#ff6040", -s);
}

const fmt  = (v) => v.toLocaleString("fr-FR", { maximumFractionDigits: 0 });
const fmtK = (v) => `${fmt(Math.round(v / 1000))} k€`;
const fmtM = (v) => `${fmt(Math.round(v))} €/mois`;

export default function Map({ villes, onSelect }) {
  const minP = Math.min(...villes.map((v) => v.prix_m2));
  const maxP = Math.max(...villes.map((v) => v.prix_m2));

  return (
    <MapContainer center={[46.5, 2.5]} zoom={6} style={{ width: "100%", height: "100%" }} scrollWheelZoom zoomControl>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {villes.map((v) => {
        const color  = scoreToColor(v.score);
        const radius = 8 + ((v.prix_m2 - minP) / (maxP - minP)) * 18;
        const { res } = v;

        return (
          <CircleMarker
            key={v.nom}
            center={[v.lat, v.lon]}
            radius={radius}
            pathOptions={{ color, fillColor: color, fillOpacity: 0.85, weight: 1.5 }}
            eventHandlers={{ click: () => onSelect(v) }}
          >
            <Popup>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", padding: "14px 16px", minWidth: 210 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#e2e6f3", marginBottom: 10 }}>
                  {v.nom}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px 12px" }}>
                  {[
                    ["Prix m²",     `${fmt(v.prix_m2)} €`],
                    ["Loyer m²",    `${v.loyer_m2} €`],
                    ["Mensualité",  fmtM(res.mensCredit)],
                    ["Loyer/mois",  fmtM(res.loyer)],
                    ["Pat. achat",  fmtK(res.patAchat)],
                    ["Pat. locat.", fmtK(res.patLoc)],
                  ].map(([k, val]) => (
                    <div key={k}>
                      <div style={{ fontSize: 9, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.08em" }}>{k}</div>
                      <div style={{ fontSize: 12, color: "#e2e6f3", marginTop: 1 }}>{val}</div>
                    </div>
                  ))}
                </div>
                <div style={{
                  marginTop: 12, padding: "6px 10px", borderRadius: 8,
                  background: `${color}18`, border: `1px solid ${color}40`,
                  fontSize: 11, color, fontWeight: 600,
                }}>
                  → {res.meilleure} avantageux
                </div>
                <button
                  onClick={() => onSelect(v)}
                  style={{
                    marginTop: 8, width: "100%", padding: "7px", borderRadius: 8,
                    background: "#1e2235", border: "1px solid #3d4460",
                    color: "#e2e6f3", fontSize: 10, cursor: "pointer",
                    fontFamily: "'JetBrains Mono', monospace",
                  }}
                >
                  Voir la simulation détaillée →
                </button>
              </div>
            </Popup>
          </CircleMarker>
        );
      })}
    </MapContainer>
  );
}