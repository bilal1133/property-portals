"use client";

import { useState } from "react";

import { buildWhatsAppUrl } from "@/lib/whatsapp";

type ConsultationFormProps = {
  phoneE164: string;
  expertName: string;
  intents: string[];
  fileTypes: string[];
};

type FormState = {
  name: string;
  whatsapp: string;
  intent: string;
  fileType: string;
  message: string;
};

const initialState: FormState = {
  name: "",
  whatsapp: "",
  intent: "",
  fileType: "",
  message: "",
};

export function ConsultationForm({
  phoneE164,
  expertName,
  intents,
  fileTypes,
}: ConsultationFormProps) {
  const [form, setForm] = useState<FormState>(initialState);
  const [error, setError] = useState<string | null>(null);

  function updateField<K extends keyof FormState>(field: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.whatsapp.trim() || !form.intent) {
      setError("Name, WhatsApp number, and intent are required.");
      return;
    }

    setError(null);

    const messageLines = [
      `Assalam o Alaikum ${expertName},`,
      `My name is ${form.name.trim()}.`,
      `WhatsApp: ${form.whatsapp.trim()}`,
      `Intent: ${form.intent}`,
      `Product or collection: ${form.fileType || "Not sure yet"}`,
      form.message.trim() ? `Message: ${form.message.trim()}` : "",
      "Please share current guidance on the relevant collection or product.",
    ].filter(Boolean);

    window.open(buildWhatsAppUrl(phoneE164, messageLines.join("\n")), "_blank", "noopener,noreferrer");
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit} noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-foreground/80">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
            Your Name
          </span>
          <input
            className="w-full border border-line bg-white px-4 py-3 text-base outline-none ring-0 placeholder:text-muted focus:border-accent"
            name="name"
            placeholder="e.g. Ali Raza"
            value={form.name}
            onChange={(event) => updateField("name", event.target.value)}
          />
        </label>

        <label className="space-y-2 text-sm text-foreground/80">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
            WhatsApp Number
          </span>
          <input
            className="w-full border border-line bg-white px-4 py-3 text-base outline-none ring-0 placeholder:text-muted focus:border-accent"
            name="whatsapp"
            placeholder="03XX XXXXXXX"
            type="tel"
            value={form.whatsapp}
            onChange={(event) => updateField("whatsapp", event.target.value)}
          />
        </label>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="space-y-2 text-sm text-foreground/80">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
            I want to
          </span>
          <select
            className="w-full border border-line bg-white px-4 py-3 text-base outline-none ring-0 focus:border-accent"
            name="intent"
            value={form.intent}
            onChange={(event) => updateField("intent", event.target.value)}
          >
            <option value="">Select your intent...</option>
            {intents.map((intent) => (
              <option key={intent} value={intent}>
                {intent}
              </option>
            ))}
          </select>
        </label>

        <label className="space-y-2 text-sm text-foreground/80">
          <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
            Product or Collection
          </span>
          <select
            className="w-full border border-line bg-white px-4 py-3 text-base outline-none ring-0 focus:border-accent"
            name="fileType"
            value={form.fileType}
            onChange={(event) => updateField("fileType", event.target.value)}
          >
            <option value="">Select product or collection...</option>
            {fileTypes.map((fileType) => (
              <option key={fileType} value={fileType}>
                {fileType}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-2 text-sm text-foreground/80">
        <span className="font-mono text-[0.72rem] uppercase tracking-[0.16em] text-muted">
          Message
        </span>
        <textarea
          className="min-h-32 w-full border border-line bg-white px-4 py-3 text-base outline-none ring-0 placeholder:text-muted focus:border-accent"
          name="message"
          placeholder="Tell Kamran what you want to compare, buy, sell, or verify."
          value={form.message}
          onChange={(event) => updateField("message", event.target.value)}
        />
      </label>

      {error ? <p className="text-sm text-danger">{error}</p> : null}

      <button
        type="submit"
        className="pressable sheen flex w-full min-h-11 items-center justify-center gap-3 border border-accent bg-accent px-6 py-4 text-sm font-semibold text-white hover:border-brand-deep hover:bg-brand-deep sm:w-auto"
      >
        Send to Kamran on WhatsApp
        <ArrowUpRightIcon />
      </button>

      <p className="text-sm text-muted">
        Your information stays in this browser session and is only used to prefill a WhatsApp message.
      </p>
    </form>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[1.8]">
      <path d="M7 17 17 7" />
      <path d="M8 7h9v9" />
    </svg>
  );
}
