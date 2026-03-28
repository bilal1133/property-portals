import { ImageResponse } from "next/og";

import { siteMeta } from "@/data/landing-content";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          height: "100%",
          width: "100%",
          background:
            "linear-gradient(135deg, #f7f9fc 0%, #dde8f7 40%, #0f4ab8 40%, #0f4ab8 100%)",
          color: "#07111f",
          fontFamily: "sans-serif",
          padding: "56px",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "62%",
            background: "rgba(255,255,255,0.92)",
            borderRadius: "28px",
            padding: "44px",
            boxShadow: "0 24px 60px rgba(7, 17, 31, 0.14)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "12px",
                color: "#0f4ab8",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
              }}
            >
              Live Property Market
            </div>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "12px",
                fontSize: 64,
                fontWeight: 800,
                lineHeight: 1.05,
                letterSpacing: "-0.05em",
              }}
            >
              <span>{siteMeta.heroHeadline}</span>
            </div>
            <div
              style={{
                fontSize: 28,
                lineHeight: 1.4,
                color: "#425466",
                maxWidth: "88%",
              }}
            >
              {siteMeta.heroDescription}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
              }}
            >
              <span
                style={{
                  fontSize: 30,
                  fontWeight: 700,
                  letterSpacing: "-0.03em",
                }}
              >
                {siteMeta.brandName}
              </span>
              <span
                style={{
                  fontSize: 20,
                  color: "#556579",
                }}
              >
                Collections, market pulse, calculator, and advisory desk
              </span>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minWidth: 176,
                padding: "18px 24px",
                borderRadius: "999px",
                background: "#0f4ab8",
                color: "#ffffff",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              property-portals.com
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            marginLeft: "24px",
            borderRadius: "28px",
            overflow: "hidden",
            position: "relative",
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.22) 0%, rgba(255,255,255,0.08) 100%)",
            border: "1px solid rgba(255,255,255,0.16)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(180deg, rgba(6,16,34,0.1) 0%, rgba(6,16,34,0.46) 100%)",
            }}
          />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              padding: "34px",
              color: "#ffffff",
              position: "relative",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <span
                style={{
                  fontSize: 18,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                Curated boards
              </span>
              <span
                style={{
                  fontSize: 18,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.72)",
                }}
              >
                WhatsApp advisory
              </span>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "14px",
              }}
            >
              {["Live rates", "Market pulse", "Featured boards", "Build estimator"].map(
                (label) => (
                  <div
                    key={label}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "8px",
                      width: "48%",
                      padding: "18px 20px",
                      borderRadius: "20px",
                      background: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.14)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        letterSpacing: "0.12em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.68)",
                      }}
                    >
                      Section
                    </span>
                    <span
                      style={{
                        fontSize: 28,
                        fontWeight: 700,
                        lineHeight: 1.15,
                      }}
                    >
                      {label}
                    </span>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    ),
    size
  );
}
