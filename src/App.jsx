import { useState } from "react";
import Sidebar     from "./components/Sidebar.jsx";
import Map         from "./components/Map.jsx";
import DetailPanel from "./components/DetailPanel.jsx";
import { useSimulations } from "./hooks/useSimulations.js";

const DEFAULTS = {
  surface:              60,
  apport:               30000,
  tauxEmprunt:          3.5,
  duree:                20,
  tauxPlacement:        5,
  hausseImmo:           2,
  tauxTravaux:          1,
  chargesCopro:         150,
  neuf:                 false,
  assuranceEmprunteur:  0.35,
  tauxFoncier:          12.5,
  augmentationLoyer:    1,
};

export default function App() {
  const [params, setParams]   = useState(DEFAULTS);
  const [selected, setSelected] = useState(null);

  const set = (key) => (val) => setParams((p) => ({ ...p, [key]: val }));

  const villes = useSimulations(params);
  const selectedFresh = selected
    ? villes.find((v) => v.nom === selected.nom) ?? null
    : null;

  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      <Sidebar params={params} set={set} />
      <main className="relative flex-1 overflow-hidden">
        <Map villes={villes} onSelect={setSelected} />
        <DetailPanel ville={selectedFresh} onClose={() => setSelected(null)} />
      </main>
    </div>
  );
}