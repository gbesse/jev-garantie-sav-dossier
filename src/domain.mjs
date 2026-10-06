import {
  str,
  obj,
  arrays,
  rows,
  integer,
  finite,
  safe,
  money,
  sum,
  boolean,
  one,
  refs,
  semantic,
  check,
  date,
  addYears,
} from "./helpers.mjs";
export const LIMIT =
  "Les deux ans sont une fenêtre de repérage pour les achats consommateurs auprès de professionnels, pas une décision d’indemnisation. Exceptions et preuve du défaut demandent une revue.";
export function validateInput(x) {}
export function prepare(x) {
  obj(x.purchase);
  obj(x.failure);
  obj(x.refusal);
  date(x.purchase.date);
  date(x.failure.date);
  boolean(x.purchase.professionalSeller);
  boolean(x.purchase.consumerBuyer);
  str(x.purchase.productId);
  str(x.failure.productId);
  const r = refs(x.purchase, x.failure, x.refusal);
  const end = addYears(x.purchase.date, 2);
  const checks = [
    check(
      "identite",
      "Produit concerné par la panne",
      x.purchase.productId === x.failure.productId,
      r,
    ),
    check(
      "chronologie",
      "Panne après l’achat",
      x.failure.date >= x.purchase.date,
      r,
    ),
    check(
      "fenetre",
      "Signalement dans la fenêtre de deux ans",
      x.failure.date <= end,
      r,
      "Vérifier les délais et exceptions applicables au cas réel.",
    ),
    check(
      "qualite",
      "Achat consommateur auprès d’un professionnel",
      x.purchase.professionalSeller && x.purchase.consumerBuyer ? true : null,
      r,
    ),
  ];
  const pairs = [
    semantic(
      "motif",
      "Motif du refus et pièce invoquée",
      x.refusal.reason,
      x.refusal.proof?.description,
      refs(x.refusal, ...(x.refusal.proof ? [obj(x.refusal.proof)] : [])),
      "La pièce établit-elle le motif factuel invoqué pour refuser la prise en charge ? Ne tranchez pas la validité juridique du refus.",
      true,
    ),
  ];
  return {
    checks,
    pairs,
    outputs: {
      finFenetreIndicative: end,
      chronologie: [
        { date: x.purchase.date, evenement: "achat" },
        { date: x.failure.date, evenement: "signalement de panne" },
      ],
      piecesManquantes: x.refusal.proof
        ? []
        : ["Pièce justifiant le motif du refus"],
      regimes: [
        "Garantie légale à examiner",
        "Garantie commerciale à examiner séparément",
      ],
    },
  };
}
