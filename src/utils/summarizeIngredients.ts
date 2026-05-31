const UNIT_ALIASES: Record<string, string> = {
  g: "g", gram: "g", grams: "g",
  kg: "kg", kilogram: "kg", kilograms: "kg",
  lb: "lb", lbs: "lb", pound: "lb", pounds: "lb",
  oz: "oz", ounce: "oz", ounces: "oz",
  cup: "cup", cups: "cup",
  tbsp: "tbsp", tablespoon: "tbsp", tablespoons: "tbsp",
  tsp: "tsp", teaspoon: "tsp", teaspoons: "tsp",
  clove: "cloves", cloves: "cloves",
  l: "l", liter: "l", liters: "l", litre: "l", litres: "l",
  ml: "ml", milliliter: "ml", milliliters: "ml",
};

const DESCRIPTIVE = new Set(["to taste", "a pinch", "pinch", "as needed", "as required", ""]);

function normalizeUnit(raw: string): string {
  return UNIT_ALIASES[raw.toLowerCase()] ?? raw.toLowerCase();
}

function formatAmount(n: number): string {
  if (Number.isInteger(n)) return String(n);
  const map: Record<number, string> = {
    0.25: "1/4", 0.5: "1/2", 0.75: "3/4",
    0.33: "1/3", 0.67: "2/3",
    1.25: "1 1/4", 1.5: "1 1/2", 1.75: "1 3/4",
    2.5: "2 1/2",
  };
  const rounded = Math.round(n * 100) / 100;
  return map[rounded] ?? String(rounded);
}

function parseMeasure(raw: string): { amount: number | null; unit: string } {
  const s = raw.trim().toLowerCase();

  if (!s || DESCRIPTIVE.has(s)) return { amount: null, unit: s || "to taste" };

  let rest = s;
  let amount: number | null = null;

  // "1 1/2" mixed number
  const mixed = rest.match(/^(\d+)\s+(\d+)\/(\d+)/);
  if (mixed) {
    amount = parseInt(mixed[1]) + parseInt(mixed[2]) / parseInt(mixed[3]);
    rest = rest.slice(mixed[0].length).trim();
  } else {
    // "1/2" fraction
    const frac = rest.match(/^(\d+)\/(\d+)/);
    if (frac) {
      amount = parseInt(frac[1]) / parseInt(frac[2]);
      rest = rest.slice(frac[0].length).trim();
    } else {
      // decimal or integer, optionally with attached unit e.g. "900g"
      const num = rest.match(/^(\d+\.?\d*)/);
      if (num) {
        amount = parseFloat(num[1]);
        rest = rest.slice(num[0].length).trim();
      }
    }
  }

  // take unit as first word before comma or end
  const unitRaw = rest.split(",")[0].trim().split(/\s+/)[0] ?? "";
  const unit = normalizeUnit(unitRaw);

  return { amount, unit };
}

export interface SummarizedIngredient {
  name: string;
  summary: string;
}

export function summarizeIngredients(
  raw: Record<string, string[]>
): SummarizedIngredient[] {
  return Object.entries(raw).map(([name, measures]) => {
    const byUnit: Record<string, number[]> = {};
    const descriptive = new Set<string>();

    for (const m of measures) {
      const { amount, unit } = parseMeasure(m);
      if (amount !== null) {
        (byUnit[unit] ??= []).push(amount);
      } else {
        descriptive.add(unit);
      }
    }

    const parts: string[] = Object.entries(byUnit).map(([unit, amounts]) => {
      const total = amounts.reduce((a, b) => a + b, 0);
      return unit ? `${formatAmount(total)} ${unit}` : formatAmount(total);
    });

    descriptive.forEach((d) => parts.push(d));

    return { name, summary: parts.join(" + ") };
  });
}
