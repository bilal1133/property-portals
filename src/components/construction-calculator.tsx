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
    <div className="grid gap-10 xl:grid-cols-[minmax(0,0.84fr)_minmax(360px,1.16fr)] xl:items-start">
      <div className="max-w-2xl">
        <p className="mono-label text-accent">Planning Tool</p>
        <h2 className="mt-4 font-display text-[clamp(2.8rem,5vw,4.8rem)] font-semibold leading-[0.9] tracking-[-0.06em] text-foreground">
          Budget The Build Before You Commit
        </h2>
        <p className="mt-5 text-lg leading-8 text-muted">
          Estimate grey structure, finishing, and contingency costs so rate decisions can be viewed in a more practical way.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          <BenefitCard
            title="Estimate quickly"
            body="Turn a rate conversation into a build budget in a few inputs."
          />
          <BenefitCard
            title="Use practical assumptions"
            body="Adjust the structure and finishing rates before you commit to a direction."
          />
          <BenefitCard
            title="Read the board better"
            body="Pair board rates with construction context before buying, holding, or selling."
          />
        </div>

        <div className="mt-8">
          <p className="mono-label text-muted">Quick area presets</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                className={`min-h-11 border px-4 py-3 text-sm font-semibold transition ${
                  state.area === preset.area
                    ? "border-accent bg-accent text-white shadow-[0_16px_32px_rgba(7,85,233,0.18)]"
                    : "border-line bg-white text-foreground hover:border-accent hover:text-accent"
                }`}
                onClick={() => updateField("area", preset.area)}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="overflow-hidden border border-line bg-white shadow-[0_24px_64px_rgba(16,24,40,0.08)]">
        <div className="grid gap-px bg-line lg:grid-cols-[minmax(0,1fr)_minmax(300px,0.9fr)]">
          <div className="bg-white p-6 sm:p-8">
            <p className="mono-label text-accent">Calculator</p>
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

            <p className="mt-6 text-sm leading-7 text-muted">
              Keep the homepage version short and useful. When a visitor needs a fast planning read, this is enough to frame the conversation before the full estimate.
            </p>
          </div>

          <div className="bg-brand-gradient px-6 py-6 text-white sm:px-8 sm:py-8">
            <p className="mono-label text-white/84">Estimated total</p>
            <p className="mt-4 font-display text-[clamp(2.6rem,5vw,4.6rem)] font-semibold leading-none tracking-[-0.065em] text-white">
              {formatCurrency(totalCost)}
            </p>
            <p className="mt-3 text-sm leading-7 text-white/88">{formatLac(totalCost)}</p>

            <div className="mt-8 grid gap-px overflow-hidden border border-white/20 bg-white/16">
              <Metric label="Grey structure" value={formatCurrency(structureCost)} />
              <Metric label="Finishing" value={formatCurrency(finishingCost)} />
              <Metric label="Contingency" value={formatCurrency(contingencyCost)} />
              <Metric label="Subtotal" value={formatCurrency(subtotal)} />
            </div>

            <div className="mt-6 border border-white/20 bg-white/12 px-4 py-4">
              <p className="mono-label text-white/84">Planning note</p>
              <p className="mt-3 text-sm leading-7 text-white/88">
                Use this as a practical estimate, not a contractor quote. The goal is to read the build cost alongside the live board before the next decision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BenefitCard({ title, body }: { title: string; body: string }) {
  return (
    <div className="border border-line bg-panel-strong px-4 py-4">
      <p className="mono-label text-accent">{title}</p>
      <p className="mt-3 text-sm leading-7 text-muted">{body}</p>
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
      <span className="input-label">{label}</span>
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
    <div className="bg-white/10 px-4 py-4">
      <p className="mono-label text-white/82">{label}</p>
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
