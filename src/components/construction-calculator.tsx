"use client";

import { useState } from "react";

const presets = [
  { label: "5 Marla", area: 1250 },
  { label: "10 Marla", area: 2250 },
  { label: "1 Kanal", area: 4500 },
] as const;

type CalculatorState = {
  area: number;
  greyRate: number;
  finishingRate: number;
  contingency: number;
};

const initialState: CalculatorState = {
  area: 2250,
  greyRate: 3200,
  finishingRate: 2600,
  contingency: 8,
};

const monoClass = "font-mono text-[0.72rem] uppercase tracking-[0.18em]";

export function ConstructionCalculator() {
  const [state, setState] = useState<CalculatorState>(initialState);

  const structureCost = state.area * state.greyRate;
  const finishingCost = state.area * state.finishingRate;
  const subtotal = structureCost + finishingCost;
  const contingencyCost = subtotal * (state.contingency / 100);
  const totalCost = subtotal + contingencyCost;

  function updateField<K extends keyof CalculatorState>(key: K, value: number) {
    setState((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? value : 0,
    }));
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)]">
      <div className="border border-line bg-white p-6 sm:p-8">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-line pb-5">
          <div>
            <p className={`${monoClass} text-accent`}>Construction Calculator</p>
            <h3 className="mt-3 font-display text-[clamp(2rem,4vw,3.4rem)] font-semibold leading-[0.96] tracking-[-0.05em] text-foreground">
              Budget the build before you move from rates to execution.
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className="pressable min-h-10 border border-line bg-panel-strong px-4 py-2 text-sm font-semibold text-foreground hover:border-accent hover:text-accent"
                onClick={() => updateField("area", preset.area)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <Field
            label="Covered area"
            suffix="sq ft"
            value={state.area}
            onChange={(value) => updateField("area", value)}
          />
          <Field
            label="Grey structure rate"
            suffix="PKR / sq ft"
            value={state.greyRate}
            onChange={(value) => updateField("greyRate", value)}
          />
          <Field
            label="Finishing rate"
            suffix="PKR / sq ft"
            value={state.finishingRate}
            onChange={(value) => updateField("finishingRate", value)}
          />
          <Field
            label="Contingency"
            suffix="%"
            value={state.contingency}
            onChange={(value) => updateField("contingency", value)}
          />
        </div>

        <p className="mt-5 text-sm leading-7 text-muted">
          Use this as a fast planning tool for structure plus finishing. It is not a contractor quote, but it gives buyers and sellers a cleaner budget range before the next conversation.
        </p>
      </div>

      <div className="bg-brand-gradient border border-white/22 p-6 text-white sm:p-8">
        <p className={`${monoClass} text-white/86`}>Estimated cost</p>
        <p className="mt-4 font-display text-[clamp(2.4rem,5vw,4.4rem)] font-semibold leading-none tracking-[-0.06em] text-white">
          {formatCurrency(totalCost)}
        </p>
        <p className="mt-3 text-sm leading-7 text-white/92">{formatLac(totalCost)}</p>

        <div className="mt-6 grid gap-px overflow-hidden border border-white/22 bg-white/16">
          <Metric label="Grey structure" value={formatCurrency(structureCost)} />
          <Metric label="Finishing" value={formatCurrency(finishingCost)} />
          <Metric label="Contingency" value={formatCurrency(contingencyCost)} />
          <Metric label="Subtotal" value={formatCurrency(subtotal)} />
        </div>

        <div className="mt-6 border border-white/28 bg-white/22 p-5">
          <p className={`${monoClass} text-white/86`}>Planning note</p>
          <p className="mt-3 text-sm leading-7 text-white/92">
            Pair this estimate with the live board rates before you move into a buy, hold, or sell decision. Budget pressure changes the meaning of the same quoted market price.
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  suffix,
  value,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="space-y-2 text-sm text-foreground/80">
      <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
        {label}
      </span>
      <div className="border border-line bg-panel-strong px-4 py-3">
        <div className="flex items-center gap-3">
          <input
            className="w-full bg-transparent text-base text-foreground outline-none"
            type="number"
            min="0"
            value={value}
            onChange={(event) => onChange(Number(event.target.value))}
          />
          <span className="shrink-0 text-xs font-medium uppercase tracking-[0.12em] text-muted">
            {suffix}
          </span>
        </div>
      </div>
    </label>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white/14 px-4 py-4">
      <p className={`${monoClass} text-white/86`}>{label}</p>
      <p className="mt-3 text-sm font-semibold text-white">{value}</p>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatLac(value: number) {
  const lac = value / 100000;

  return `${new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(lac)} Lac`;
}
