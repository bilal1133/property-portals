"use client";

import { siteMeta } from "@/data/landing-content";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type ShareDirection = "up" | "down" | "flat" | null;

type ShareProduct = {
  name: string;
  price: number | null;
  delta: number | null;
  direction: ShareDirection;
};

type RatesSharePanelProps = {
  collectionName: string;
  headline: string;
  updatedLabel: string;
  description: string;
  imageSrc?: string | null;
  products: ShareProduct[];
};

const SHARE_ADVISOR_IMAGE_SRC =
  "/brand/property-portals-advisor-share-card-trimmed.png";

type ShareContactRow = {
  label: string;
  value: string;
  tint: string;
  textColor: string;
};

export function RatesSharePanel({
  collectionName,
  headline,
  updatedLabel,
  description,
  imageSrc,
  products,
}: RatesSharePanelProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const shareText = useMemo(() => {
    const topProducts = products.slice(0, 6).map((product) => {
      const value = product.price === null ? "Pending" : `${formatPriceLac(product.price)} Lac`;
      const delta =
        product.delta === null || product.direction === null || product.direction === "flat"
          ? "no change"
          : `${product.direction === "up" ? "+" : "-"}${formatPriceLac(Math.abs(product.delta))}`;

      return `${product.name}: ${value} (${delta})`;
    });

    return [
      `${collectionName} | ${headline}`,
      `Updated ${updatedLabel}`,
      ...topProducts,
      typeof window !== "undefined" ? window.location.href : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [collectionName, headline, products, updatedLabel]);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    setPreviewUrl((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return null;
    });
    setHasGenerated(false);
  }, [collectionName, description, headline, imageSrc, products, updatedLabel]);

  async function handleGenerate() {
    setIsGenerating(true);

    try {
      const url = await generatePreview({
        collectionName,
        headline,
        updatedLabel,
        description,
        imageSrc,
        products,
      });

      if (!url) {
        return;
      }

      setPreviewUrl((current) => {
        if (current) {
          URL.revokeObjectURL(current);
        }

        return url;
      });
      setHasGenerated(true);
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownload() {
    if (!previewUrl) {
      return;
    }

    const anchor = document.createElement("a");
    anchor.href = previewUrl;
    anchor.download = `property-portals-${toSlug(collectionName)}-live-rates.png`;
    anchor.click();
  }

  function handleWhatsAppShare() {
    window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, "_blank", "noopener,noreferrer");
  }

  function handleFacebookShare() {
    const pageUrl = window.location.href;
    const href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(shareText)}`;
    window.open(href, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-4">
      {!hasGenerated ? (
        <button
          type="button"
          className="pressable inline-flex min-h-11 items-center gap-3 text-sm font-semibold text-white/92 underline decoration-white/28 underline-offset-[0.32rem] transition hover:text-white hover:decoration-white"
          onClick={() => {
            void handleGenerate();
          }}
        >
          <DownloadIcon />
          {isGenerating ? "Generating image..." : "Generate image"}
        </button>
      ) : (
        <>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="pressable inline-flex min-h-11 items-center justify-center gap-3 rounded-[14px] border border-accent/22 bg-accent-soft px-5 py-3 text-sm font-semibold text-brand-deep hover:border-accent hover:bg-white hover:text-accent"
              onClick={() => {
                void handleDownload();
              }}
            >
              <DownloadIcon />
              Download PNG
            </button>
            <button
              type="button"
              className="pressable inline-flex min-h-11 items-center justify-center gap-3 rounded-[14px] border border-[#4dbf66]/26 bg-[#edf9f0] px-5 py-3 text-sm font-semibold text-[#22883a] hover:border-[#37a854] hover:bg-white"
              onClick={handleWhatsAppShare}
            >
              <WhatsAppIcon />
              WhatsApp
            </button>
            <button
              type="button"
              className="pressable inline-flex min-h-11 items-center justify-center gap-3 rounded-[14px] border border-[#8db4ff]/28 bg-[#eef4ff] px-5 py-3 text-sm font-semibold text-[#2f66d0] hover:border-[#6f9dff] hover:bg-white"
              onClick={handleFacebookShare}
            >
              <FacebookIcon />
              Facebook
            </button>
            <button
              type="button"
              className="pressable inline-flex min-h-11 items-center justify-center gap-3 rounded-[14px] border border-white/18 bg-white/10 px-5 py-3 text-sm font-semibold text-white hover:border-white/28 hover:bg-white/14"
              onClick={() => {
                void handleGenerate();
              }}
            >
              Regenerate
            </button>
          </div>

          <div className="overflow-hidden rounded-[24px] border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[18px] border border-white/18 bg-[#07152d]">
              {previewUrl ? (
                <Image
                  src={previewUrl}
                  alt={`${collectionName} share preview`}
                  fill
                  unoptimized
                  sizes="(min-width: 1280px) 24rem, 100vw"
                  className="object-cover"
                />
              ) : (
                <div className="flex aspect-[4/5] items-center justify-center text-sm text-white/84">
                  Preparing preview...
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

async function generatePreview({
  collectionName,
  headline,
  imageSrc,
  products,
}: RatesSharePanelProps) {
  if (typeof document !== "undefined" && "fonts" in document) {
    try {
      await document.fonts.ready;
    } catch {
      // Ignore font readiness failures; fallback fonts are acceptable.
    }
  }

  const width = 1200;
  const height = 1500;
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");

  if (!context) {
    return null;
  }

  context.fillStyle = "#07152d";
  context.fillRect(0, 0, width, height);

  drawGrid(context, width, height);

  const advisorImage = await loadImage(SHARE_ADVISOR_IMAGE_SRC);

  if (imageSrc) {
    const image = await loadImage(imageSrc);

    if (image) {
      context.save();
      context.globalAlpha = 0.08;
      context.drawImage(image, 0, 0, width, height);
      context.restore();
    }
  }

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, "rgba(7,85,233,0.18)");
  gradient.addColorStop(0.52, "rgba(3,28,75,0.52)");
  gradient.addColorStop(1, "rgba(2,8,22,0.74)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const boardX = 84;
  const boardWidth = 716;
  const boardCenterX = boardX + boardWidth / 2;
  const boardInset = 38;
  const rightRailX = boardX + boardWidth + 36;
  const rightRailWidth = 312;
  const rightRailY = 624;
  const rightRailHeight = 604;
  const railInset = 24;
  const advisorWidth = 188;
  const advisorHeight = advisorImage ? (advisorWidth * advisorImage.height) / advisorImage.width : 0;
  const contactCardX = rightRailX + railInset;
  const contactCardY = rightRailY + 28;
  const contactCardWidth = rightRailWidth - railInset * 2;
  const contactRows = getShareContactRows();
  const [phoneRow, ...socialRows] = contactRows;
  const phoneCardY = contactCardY + 88;
  const phoneCardHeight = 58;
  const socialCardY = phoneCardY + phoneCardHeight + 18;
  const socialCardHeight = 34;
  const portraitFrameX = rightRailX + 18;
  const portraitFrameY = socialCardY + socialRows.length * (socialCardHeight + 8) + 24;
  const portraitFrameWidth = rightRailWidth - 36;
  const portraitFrameHeight = rightRailY + rightRailHeight - portraitFrameY - 22;
  const advisorX = portraitFrameX + Math.round((portraitFrameWidth - advisorWidth) / 2);
  const advisorY = portraitFrameY + portraitFrameHeight - advisorHeight - 6;
  const phoneFontSize =
    phoneRow === undefined
      ? 18
      : fitFontSize(context, phoneRow.value, {
          maxWidth: contactCardWidth - 56,
          maxSize: 24,
          minSize: 18,
          fontWeight: 700,
          fontFamily: "'IBM Plex Mono', monospace",
        });
  const titleLayout = fitWrappedText(context, collectionName, {
    maxWidth: boardWidth - 56,
    maxSize: 76,
    minSize: 52,
    maxLines: 2,
    fontWeight: 700,
    fontFamily: "'Plus Jakarta Sans', sans-serif",
  });
  const titleStartY = titleLayout.lines.length === 1 ? 238 : 206;
  const titleLineHeight = titleLayout.lines.length === 1 ? 76 : Math.round(titleLayout.fontSize * 1.08);
  const headerOffset = titleLayout.lines.length === 1 ? 0 : 22;
  const shareDateLabel = formatShareCurrentDate();

  roundedRect(context, boardCenterX - 188, 86, 376, 58, 29);
  context.fillStyle = "rgba(255,255,255,0.14)";
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.28)";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = "#88e592";
  context.beginPath();
  context.arc(boardCenterX - 148, 115, 8, 0, Math.PI * 2);
  context.fill();

  context.fillStyle = "#f8fbff";
  context.font = "600 22px 'IBM Plex Mono', monospace";
  context.fillText("LIVE MARKET DATA", boardCenterX - 126, 123);

  context.fillStyle = "#ffffff";
  context.font = `700 ${titleLayout.fontSize}px 'Plus Jakarta Sans', sans-serif`;
  context.textAlign = "center";
  drawCenteredLines(context, titleLayout.lines, boardCenterX, titleStartY, titleLineHeight);

  context.fillStyle = "#dce9ff";
  context.font = "700 56px 'Plus Jakarta Sans', sans-serif";
  context.fillText(headline, boardCenterX, 314 + headerOffset);

  context.strokeStyle = "rgba(255,255,255,0.22)";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(boardX + boardInset, 426 + headerOffset);
  context.lineTo(boardX + boardWidth - boardInset, 426 + headerOffset);
  context.stroke();

  context.fillStyle = "rgba(255,255,255,0.88)";
  context.font = "600 22px 'Plus Jakarta Sans', sans-serif";
  context.fillText(shareDateLabel, boardCenterX, 390 + headerOffset);

  let y = 500 + headerOffset;
  const rows = products.slice(0, 7);
  rows.forEach((product, index) => {
    const isEven = index % 2 === 0;
    const priceLabel =
      product.price === null ? "Pending" : `${formatPriceLac(product.price)} Lac`;
    const deltaLabel = getDeltaText(product.direction, product.delta);

    context.font = "700 40px 'IBM Plex Mono', monospace";
    const priceWidth = context.measureText(priceLabel).width;
    context.font = "600 22px 'IBM Plex Mono', monospace";
    const deltaWidth = context.measureText(deltaLabel).width;
    const valueColumnWidth = Math.max(priceWidth, deltaWidth);
    const nameMaxWidth = Math.max(220, boardWidth - 96 - valueColumnWidth);
    const nameFontSize = fitFontSize(context, product.name, {
      maxWidth: nameMaxWidth,
      maxSize: 30,
      minSize: 24,
      fontWeight: 700,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    });

    roundedRect(context, boardX, y - 42, boardWidth, 92, 18);
    context.fillStyle = isEven ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.045)";
    context.fill();
    context.strokeStyle = "rgba(255,255,255,0.06)";
    context.lineWidth = 1;
    context.stroke();

    context.fillStyle = "#ffffff";
    context.textAlign = "left";
    context.font = `700 ${nameFontSize}px 'Plus Jakarta Sans', sans-serif`;
    context.fillText(truncateTextToWidth(context, product.name, nameMaxWidth), boardX + 34, y + 10);

    context.textAlign = "right";
    context.font = "700 40px 'IBM Plex Mono', monospace";
    context.fillStyle = "#eef4ff";
    context.fillText(priceLabel, boardX + boardWidth - 34, y + 8);

    context.font = "600 22px 'IBM Plex Mono', monospace";
    context.fillStyle = getDeltaColor(product.direction);
    context.fillText(deltaLabel, boardX + boardWidth - 34, y + 40);

    y += 104;
  });

  roundedRect(context, rightRailX, rightRailY, rightRailWidth, rightRailHeight, 26);
  context.fillStyle = "rgba(9,22,48,0.54)";
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.12)";
  context.lineWidth = 1.5;
  context.stroke();

  const railGradient = context.createLinearGradient(rightRailX, rightRailY, rightRailX, rightRailY + rightRailHeight);
  railGradient.addColorStop(0, "rgba(255,255,255,0.05)");
  railGradient.addColorStop(1, "rgba(255,255,255,0)");
  roundedRect(context, rightRailX + 1, rightRailY + 1, rightRailWidth - 2, rightRailHeight - 2, 25);
  context.fillStyle = railGradient;
  context.fill();

  context.fillStyle = "rgba(220,233,255,0.8)";
  context.textAlign = "left";
  context.font = "600 16px 'IBM Plex Mono', monospace";
  context.fillText("ADVISORY DESK", contactCardX + 28, contactCardY + 36);

  context.fillStyle = "#ffffff";
  context.font = "700 28px 'Plus Jakarta Sans', sans-serif";
  context.fillText("Reach The Desk", contactCardX + 28, contactCardY + 72);

  if (phoneRow) {
    roundedRect(context, contactCardX, phoneCardY, contactCardWidth, phoneCardHeight, 18);
    context.fillStyle = "rgba(255,255,255,0.085)";
    context.fill();
    context.strokeStyle = "rgba(136,229,146,0.18)";
    context.lineWidth = 1.2;
    context.stroke();

    roundedRect(context, contactCardX + 18, phoneCardY + 14, 84, 22, 11);
    context.fillStyle = phoneRow.tint;
    context.fill();

    context.fillStyle = phoneRow.textColor;
    context.textAlign = "center";
    context.font = "700 12px 'IBM Plex Mono', monospace";
    context.fillText(phoneRow.label, contactCardX + 60, phoneCardY + 28);

    context.fillStyle = "#f8fbff";
    context.textAlign = "left";
    context.font = `700 ${phoneFontSize}px 'IBM Plex Mono', monospace`;
    context.fillText(phoneRow.value, contactCardX + 18, phoneCardY + 51);
  }

  socialRows.forEach((row, index) => {
    const rowY = socialCardY + index * (socialCardHeight + 10);
    const valueFontSize = fitFontSize(context, row.value, {
      maxWidth: contactCardWidth - 118,
      maxSize: 16,
      minSize: 12,
      fontWeight: 600,
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    });

    roundedRect(context, contactCardX, rowY, contactCardWidth, socialCardHeight, 14);
    context.fillStyle = "rgba(255,255,255,0.05)";
    context.fill();

    roundedRect(context, contactCardX + 12, rowY + 8, 50, 18, 9);
    context.fillStyle = row.tint;
    context.fill();

    context.fillStyle = row.textColor;
    context.textAlign = "center";
    context.font = "700 10px 'IBM Plex Mono', monospace";
    context.fillText(row.label, contactCardX + 37, rowY + 21);

    context.fillStyle = "#f8fbff";
    context.textAlign = "left";
    context.font = `600 ${valueFontSize}px 'Plus Jakarta Sans', sans-serif`;
    context.fillText(row.value, contactCardX + 76, rowY + 22);
  });

  roundedRect(context, portraitFrameX, portraitFrameY, portraitFrameWidth, portraitFrameHeight, 22);
  const portraitGradient = context.createLinearGradient(
    portraitFrameX,
    portraitFrameY,
    portraitFrameX,
    portraitFrameY + portraitFrameHeight
  );
  portraitGradient.addColorStop(0, "rgba(255,255,255,0.05)");
  portraitGradient.addColorStop(1, "rgba(255,255,255,0.02)");
  context.fillStyle = portraitGradient;
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.1)";
  context.lineWidth = 1.2;
  context.stroke();

  if (advisorImage) {
    const advisorGlow = context.createRadialGradient(
      advisorX + advisorWidth * 0.45,
      advisorY + advisorHeight * 0.34,
      28,
      advisorX + advisorWidth * 0.45,
      advisorY + advisorHeight * 0.34,
      220
    );
    advisorGlow.addColorStop(0, "rgba(126,169,255,0.20)");
    advisorGlow.addColorStop(0.5, "rgba(18,47,112,0.16)");
    advisorGlow.addColorStop(1, "rgba(7,21,45,0)");
    context.fillStyle = advisorGlow;
    context.beginPath();
    context.arc(advisorX + advisorWidth * 0.45, advisorY + advisorHeight * 0.38, 220, 0, Math.PI * 2);
    context.fill();

    const advisorShadow = context.createRadialGradient(
      advisorX + advisorWidth * 0.54,
      advisorY + advisorHeight * 0.98,
      18,
      advisorX + advisorWidth * 0.54,
      advisorY + advisorHeight * 0.98,
      120
    );
    advisorShadow.addColorStop(0, "rgba(2,8,22,0.42)");
    advisorShadow.addColorStop(1, "rgba(2,8,22,0)");
    context.fillStyle = advisorShadow;
    context.beginPath();
    context.ellipse(advisorX + advisorWidth * 0.54, advisorY + advisorHeight * 0.98, 114, 26, 0, 0, Math.PI * 2);
    context.fill();

    context.save();
    context.shadowColor = "rgba(4,12,28,0.48)";
    context.shadowBlur = 28;
    context.shadowOffsetY = 18;
    context.drawImage(advisorImage, advisorX, advisorY, advisorWidth, advisorHeight);
    context.restore();
  }

  roundedRect(context, boardX, height - 224, boardWidth, 138, 18);
  context.fillStyle = "rgba(255,255,255,0.08)";
  context.fill();
  context.strokeStyle = "rgba(255,255,255,0.18)";
  context.stroke();

  context.fillStyle = "#ffffff";
  context.textAlign = "center";
  context.font = "700 30px 'Plus Jakarta Sans', sans-serif";
  context.fillText("Property Portals", boardCenterX, height - 164);
  context.fillStyle = "rgba(255,255,255,0.88)";
  context.font = "600 20px 'Plus Jakarta Sans', sans-serif";
  context.fillText("Trusted DHA file provider for overseas Pakistanis", boardCenterX, height - 126);
  context.fillStyle = "#dce9ff";
  context.font = "600 20px 'IBM Plex Mono', monospace";
  context.fillText("10+ deals completed · Verified files only · Direct from land provider", boardCenterX, height - 88);

  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/png"));

  return blob ? URL.createObjectURL(blob) : null;
}

function getShareContactRows(): ShareContactRow[] {
  const socialRows = siteMeta.socialLinks.slice(0, 2).map((social) => ({
    label: social.shortLabel.toUpperCase(),
    value: getShareSocialValue(social.label, social.href),
    tint:
      social.label === "Instagram"
        ? "rgba(255,255,255,0.14)"
        : "rgba(132,171,255,0.2)",
    textColor:
      social.label === "Instagram"
        ? "#dce9ff"
        : "#b7d1ff",
  }));

  return [
    {
      label: "PHONE",
      value: siteMeta.phoneDisplay,
      tint: "rgba(136,229,146,0.18)",
      textColor: "#88e592",
    },
    ...socialRows,
  ];
}

function getShareSocialValue(label: string, href: string) {
  try {
    const url = new URL(href);
    const segments = url.pathname.split("/").filter(Boolean);

    if (label === "Instagram" && segments[0]) {
      return `@${segments[0]}`;
    }

    if (label === "Facebook" && segments[0] && segments[0] !== "share") {
      return `/${segments[0]}`;
    }
  } catch {
    // Fallback to brand naming when the source URL is not a clean profile path.
  }

  return label === "Facebook" ? siteMeta.brandName : label;
}

function fitFontSize(
  context: CanvasRenderingContext2D,
  text: string,
  options: {
    maxWidth: number;
    maxSize: number;
    minSize: number;
    fontWeight: number;
    fontFamily: string;
  }
) {
  for (let size = options.maxSize; size >= options.minSize; size -= 1) {
    context.font = `${options.fontWeight} ${size}px ${options.fontFamily}`;
    if (context.measureText(text).width <= options.maxWidth) {
      return size;
    }
  }

  return options.minSize;
}

function formatShareCurrentDate() {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

function fitWrappedText(
  context: CanvasRenderingContext2D,
  text: string,
  options: {
    maxWidth: number;
    maxSize: number;
    minSize: number;
    maxLines: number;
    fontWeight: number;
    fontFamily: string;
  }
) {
  for (let size = options.maxSize; size >= options.minSize; size -= 2) {
    context.font = `${options.fontWeight} ${size}px ${options.fontFamily}`;
    const lines = getWrappedLines(context, text, options.maxWidth);
    if (lines.length <= options.maxLines) {
      return { fontSize: size, lines };
    }
  }

  context.font = `${options.fontWeight} ${options.minSize}px ${options.fontFamily}`;
  const fallbackLines = getWrappedLines(context, text, options.maxWidth);

  if (fallbackLines.length <= options.maxLines) {
    return { fontSize: options.minSize, lines: fallbackLines };
  }

  const visibleLines = fallbackLines.slice(0, options.maxLines);
  visibleLines[options.maxLines - 1] = truncateTextToWidth(
    context,
    fallbackLines.slice(options.maxLines - 1).join(" "),
    options.maxWidth
  );

  return { fontSize: options.minSize, lines: visibleLines };
}

function getWrappedLines(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  const words = text.split(" ");
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (context.measureText(candidate).width > maxWidth && line) {
      lines.push(line);
      line = word;
      continue;
    }

    line = candidate;
  }

  if (line) {
    lines.push(line);
  }

  return lines;
}

function truncateTextToWidth(
  context: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
) {
  if (context.measureText(text).width <= maxWidth) {
    return text;
  }

  let value = text;

  while (value.length > 0 && context.measureText(`${value}…`).width > maxWidth) {
    value = value.slice(0, -1).trimEnd();
  }

  return `${value}…`;
}

function drawCenteredLines(
  context: CanvasRenderingContext2D,
  lines: string[],
  x: number,
  startY: number,
  lineHeight: number
) {
  lines.forEach((line, index) => {
    context.fillText(line, x, startY + index * lineHeight);
  });
}

function drawGrid(context: CanvasRenderingContext2D, width: number, height: number) {
  context.save();
  context.strokeStyle = "rgba(255,255,255,0.05)";
  context.lineWidth = 1;

  for (let x = 0; x <= width; x += 40) {
    context.beginPath();
    context.moveTo(x, 0);
    context.lineTo(x, height);
    context.stroke();
  }

  for (let y = 0; y <= height; y += 40) {
    context.beginPath();
    context.moveTo(0, y);
    context.lineTo(width, y);
    context.stroke();
  }

  context.restore();
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.arcTo(x + width, y, x + width, y + height, radius);
  context.arcTo(x + width, y + height, x, y + height, radius);
  context.arcTo(x, y + height, x, y, radius);
  context.arcTo(x, y, x + width, y, radius);
  context.closePath();
}

function getDeltaColor(direction: ShareDirection) {
  if (direction === "up") {
    return "#88e592";
  }

  if (direction === "down") {
    return "#ff8b8b";
  }

  return "rgba(255,255,255,0.78)";
}

function getDeltaText(direction: ShareDirection, delta: number | null) {
  if (direction === null || delta === null || direction === "flat") {
    return "No change";
  }

  return `${direction === "up" ? "▲" : "▼"} ${formatPriceLac(Math.abs(delta))}`;
}

function formatPriceLac(value: number) {
  return new Intl.NumberFormat("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value / 100000);
}

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function loadImage(src: string) {
  return await new Promise<HTMLImageElement | null>((resolve) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => resolve(null);
    image.src = src;
  });
}

function DownloadIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4 w-4 fill-none stroke-current stroke-[2]">
      <path d="M12 4v10" />
      <path d="m7 10 5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5 fill-current">
      <path d="M12.04 2C6.59 2 2.17 6.4 2.17 11.83c0 1.9.54 3.66 1.48 5.15L2 22l5.18-1.6a9.9 9.9 0 0 0 4.86 1.24h.01c5.45 0 9.88-4.4 9.88-9.83C21.92 6.4 17.5 2 12.04 2Zm5.74 13.97c-.24.67-1.4 1.28-1.95 1.36-.5.07-1.12.11-1.81-.1-.42-.13-.95-.3-1.63-.59-2.86-1.23-4.73-4.1-4.87-4.29-.14-.19-1.16-1.54-1.16-2.95s.74-2.1 1-2.39c.26-.3.57-.37.76-.37.19 0 .38 0 .55.01.17 0 .41-.06.64.48.24.57.8 1.95.88 2.09.07.14.12.31.02.5-.1.19-.14.31-.29.48-.14.17-.3.39-.43.52-.14.14-.28.29-.12.57.17.29.74 1.2 1.58 1.95 1.09.97 2 1.27 2.29 1.42.29.14.45.12.62-.07.17-.19.72-.83.91-1.12.19-.29.38-.24.64-.14.26.1 1.64.77 1.92.91.29.14.48.21.55.33.07.12.07.69-.17 1.36Z" />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-4.5 w-4.5 fill-current">
      <path d="M13.37 20v-7.29h2.45l.37-2.84h-2.82V8.05c0-.82.23-1.38 1.4-1.38H16V4.12c-.55-.08-1.35-.12-2.27-.12-2.24 0-3.77 1.37-3.77 3.89v1.98H7.43v2.84h2.53V20h3.41Z" />
    </svg>
  );
}
