"use client";

import { useState } from "react";

import { phase10KnowledgeTopics } from "@/data/landing-content";

const monoClass = "font-mono text-[0.72rem] uppercase tracking-[0.18em]";

export function Phase10KnowledgeBaseSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(1);

  return (
    <section
      id="knowledge"
      className="relative overflow-hidden border border-line bg-white px-6 py-10 text-foreground shadow-[0_24px_72px_rgba(16,24,40,0.08)] sm:px-8 lg:px-10 lg:py-12"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(7,85,233,0.08)_0%,rgba(7,85,233,0)_30%),radial-gradient(circle_at_bottom_right,rgba(16,52,126,0.08)_0%,rgba(16,52,126,0)_34%)]" />
      <div className="pointer-events-none absolute -right-24 top-0 h-56 w-56 rounded-full bg-[radial-gradient(circle,rgba(7,85,233,0.12)_0%,rgba(7,85,233,0)_72%)] blur-3xl" />

      <div className="relative z-10">
        <hr className="mb-10 border-line" />

        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-accent/18 bg-accent-soft px-3 py-1.5 text-accent">
              <span aria-hidden="true">📚</span>
              <span className="text-[0.64rem] font-semibold uppercase tracking-[0.18em]">
                Investor Guide
              </span>
            </div>

            <h2 className="font-display text-[clamp(2rem,4vw,3rem)] font-semibold tracking-[-0.05em] text-foreground">
              Investor Knowledge Base
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-muted sm:text-[0.95rem]">
              Everything you need to know before buying or selling a DHA Phase 10
              file.
            </p>
          </div>

          <a
            className="pt-2 text-sm font-medium text-accent transition hover:text-brand-deep"
            href="#phase10-knowledge-items"
          >
            Full guide →
          </a>
        </div>

        <div id="phase10-knowledge-items" className="flex flex-col gap-3">
          {phase10KnowledgeTopics.map((topic, index) => {
            const isOpen = openIndex === index;

            return (
              <article
                key={topic.title}
                className={`overflow-hidden rounded-[14px] border transition ${
                  isOpen
                    ? "border-accent/24 bg-panel-strong shadow-[0_18px_42px_rgba(16,24,40,0.08)]"
                    : "border-line bg-white"
                }`}
              >
                <button
                  type="button"
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpenIndex((current) => (current === index ? null : index))}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-accent/18 bg-accent-soft text-xl text-accent">
                    <span aria-hidden="true">{topic.icon}</span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="font-display text-[1.2rem] font-semibold leading-tight text-foreground">
                      {topic.title}
                    </h3>
                    <p className="mt-1 text-sm leading-6 text-muted">
                      {topic.description}
                    </p>
                  </div>

                  <ChevronIcon
                    className={`h-4 w-4 shrink-0 text-muted transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-accent" : ""
                    }`}
                  />
                </button>

                {isOpen ? (
                  <div className="border-t border-line px-5 pb-5 pt-4">
                    <p className="max-w-3xl text-sm leading-7 text-muted">
                      {topic.summary}
                    </p>

                    {topic.details?.length ? (
                      <div className="mt-4 space-y-2.5">
                        {topic.details.map((detail) => (
                          <p
                            key={detail}
                            className="text-sm leading-7 text-muted"
                          >
                            {detail}
                          </p>
                        ))}
                      </div>
                    ) : null}

                    {topic.points.length ? (
                      <div className="mt-4 grid gap-3">
                        {topic.points.map((point) => (
                          <div
                            key={point}
                            className="flex items-start gap-3 rounded-[12px] border border-line bg-white px-4 py-3"
                          >
                            <span className={`${monoClass} mt-1 text-accent`}>
                              —
                            </span>
                            <p className="text-sm leading-7 text-muted">{point}</p>
                          </div>
                        ))}
                      </div>
                    ) : null}

                    {topic.noteLines?.length ? (
                      <div className="mt-4 rounded-[12px] border border-accent/18 bg-accent-soft px-4 py-4">
                        {topic.noteTitle ? (
                          <p className={`${monoClass} text-accent`}>{topic.noteTitle}</p>
                        ) : null}
                        <div className="mt-2 space-y-2">
                          {topic.noteLines.map((line) => (
                            <p key={line} className="text-sm leading-7 text-muted">
                              {line}
                            </p>
                          ))}
                        </div>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
