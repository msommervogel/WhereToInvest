/**
 * calculs.js — Moteur de simulation patrimoniale réaliste
 *
 * Coûts pris en compte côté ACHAT :
 *   - Frais de notaire (7.5% ancien / 2.5% neuf)
 *   - Travaux d'entretien annuels (% du prix, configurable)
 *   - Taxe foncière (~12.5 €/m²/an en moyenne nationale)
 *   - Assurance emprunteur (~0.35% du capital)
 *   - Charges de copropriété (configurable)
 *
 * Scénario LOCATION :
 *   - L'apport + frais notaire + travaux économisés sont placés dès J+1
 *   - Chaque mois : différence (mensualité+charges achat) − (loyer+charges loc) placée
 *
 * Patrimoine ACHAT  = valeur_bien_revalorié − capital_restant_dû
 * Patrimoine LOCATION = capital financier cumulé
 */

export function fraisNotaire(prix, neuf = false) {
  // Ancien ~7.5%, neuf ~2.5%
  return prix * (neuf ? 0.025 : 0.075);
}

function mensualiteCredit(capital, tauxAnnuel, dureeAns) {
  if (capital <= 0) return 0;
  const tm = tauxAnnuel / 12 / 100;
  const n  = dureeAns * 12;
  if (tm === 0) return capital / n;
  return (capital * tm * Math.pow(1 + tm, n)) / (Math.pow(1 + tm, n) - 1);
}

export function simulation(p) {
  const {
    prix_m2, loyer_m2, surface,
    apport, tauxEmprunt, duree,
    tauxPlacement, hausseImmo,
    tauxTravaux,        // % du prix par an
    chargesCopro,       // € par mois
    neuf,               // bool
    assuranceEmprunteur, // % du capital initial par an
    tauxFoncier,        // € par m² par an (défaut 12.5)
    augmentationLoyer,  // % par an
  } = p;

  const prix      = prix_m2 * surface;
  const loyer0    = loyer_m2 * surface;
  const fraisNot  = fraisNotaire(prix, neuf ?? false);

  // Capital emprunté = prix + frais notaire - apport
  const capitalEmprunte = prix + fraisNot - apport;

  const mensCredit = mensualiteCredit(capitalEmprunte, tauxEmprunt, duree);

  // Charges mensuelles propriétaire
  const assurMens  = (capitalEmprunte * (assuranceEmprunteur ?? 0.35) / 100) / 12;
  const foncierMens = ((tauxFoncier ?? 12.5) * surface) / 12;
  const travauxMens = (prix * (tauxTravaux ?? 1) / 100) / 12;
  const copro       = chargesCopro ?? 150;

  // Mensualité tout compris côté achat
  const mensTotaleAchat = mensCredit + assurMens + foncierMens + travauxMens + copro;

  const n           = duree * 12;
  const tmPlace     = Math.pow(1 + tauxPlacement / 100,   1 / 12) - 1;
  const tmImmo      = Math.pow(1 + hausseImmo / 100,      1 / 12) - 1;
  const tmEmpr      = tauxEmprunt / 12 / 100;
  const tmLoyerMens = Math.pow(1 + (augmentationLoyer ?? 1) / 100, 1 / 12) - 1;

  // Locataire place son apport + frais de notaire économisés dès le départ
  let capLoc   = apport + fraisNot;
  let crd      = capitalEmprunte;
  let valBien  = prix;
  let loyerCur = loyer0;

  const historique = [];

  for (let i = 1; i <= n; i++) {
    // Charges location : loyer + charges locataire (estimation ~30% des charges copro)
    const chargesLoc = copro * 0.3;
    const depLoc     = loyerCur + chargesLoc;

    // Épargne mensuelle du locataire = ce qu'il aurait dépensé en achat − loyer
    const epargne = mensTotaleAchat - depLoc;
    capLoc = capLoc * (1 + tmPlace) + epargne;

    // Achat : bien se valorise, remboursement du crédit
    valBien = valBien * (1 + tmImmo);
    const interets = crd * tmEmpr;
    crd = Math.max(0, crd - (mensCredit - interets));

    // Loyer augmente
    loyerCur = loyerCur * (1 + tmLoyerMens);

    if (i % 3 === 0 || i === n) {
      historique.push({
        annee:    +(i / 12).toFixed(2),
        achat:    Math.round(valBien - crd),
        location: Math.round(capLoc),
      });
    }
  }

  const patA = historique.at(-1).achat;
  const patL = historique.at(-1).location;
  const croisement = historique.find((h) => h.achat >= h.location);

  return {
    // Entrée
    prix, fraisNot, capitalEmprunte, surface,

    // Mensualités détaillées
    mensCredit,
    assurMens,
    foncierMens,
    travauxMens,
    copro,
    mensTotaleAchat,
    loyer: loyer0,

    // Bilan final
    patAchat:    patA,
    patLoc:      patL,
    avantage:    patA - patL,
    meilleure:   patA > patL ? "Achat" : "Location",
    croisement:  croisement?.annee ?? null,

    historique,
  };
}

export function score(res) {
  const base = Math.max(Math.abs(res.patAchat), Math.abs(res.patLoc));
  return base > 0 ? Math.max(-1, Math.min(1, res.avantage / base)) : 0;
}