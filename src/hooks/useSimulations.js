import { useMemo } from "react";
import { VILLES } from "../data/villes.js";
import { simulation, score } from "../calculs.js";

export function useSimulations(params) {
  return useMemo(
    () => VILLES.map((v) => {
      const res = simulation({ ...v, ...params });
      return { ...v, res, score: score(res) };
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    Object.values(params)
  );
}