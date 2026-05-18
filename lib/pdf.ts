"use client";

import type { BreedMatch } from "@/lib/breeds/types";
import type { TraitVector } from "@/lib/traits";
import { TRAITS, TRAIT_KEYS } from "@/lib/traits";

/**
 * Generate a downloadable PDF of the user's quiz result.
 * Uses jsPDF — pure client-side, no server needed.
 * Hebrew is supported because we explicitly add `dir: "rtl"` and
 * use a built-in font that handles Unicode. We render most of the page
 * as a styled HTML offscreen and rasterize it with html2canvas, then
 * embed as a single image for crisp Hebrew typography.
 */
export async function downloadResultPdf(
  topMatch: BreedMatch,
  allMatches: BreedMatch[],
  userVector: TraitVector
) {
  const [{ default: jsPDF }, html2canvasMod] = await Promise.all([
    import("jspdf"),
    import("html2canvas"),
  ]);
  const html2canvas = html2canvasMod.default;

  // Build an offscreen container styled like a clean printable card.
  const container = document.createElement("div");
  container.dir = "rtl";
  container.lang = "he";
  Object.assign(container.style, {
    position: "fixed",
    top: "-10000px",
    left: "0",
    width: "794px", // A4 width @ 96dpi
    padding: "40px",
    background: "#FFF7ED",
    color: "#7C2D12",
    fontFamily:
      'var(--font-rubik), Rubik, "Heebo", "Arial Hebrew", system-ui, sans-serif',
  });

  container.innerHTML = buildHtml(topMatch, allMatches, userVector);
  document.body.appendChild(container);

  // Allow images (Wikimedia) to be CORS-loaded into canvas.
  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      backgroundColor: "#FFF7ED",
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 2, canvas.height / 2],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 2, canvas.height / 2);
    pdf.save(`dogame-${topMatch.breed.slug}.pdf`);
  } finally {
    container.remove();
  }
}

function buildHtml(
  top: BreedMatch,
  matches: BreedMatch[],
  user: TraitVector
): string {
  const date = new Date().toLocaleDateString("he-IL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <div style="text-align:right">
      <!-- Header -->
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:24px;padding-bottom:16px;border-bottom:3px solid #FED7AA">
        <div>
          <div style="font-size:28px;font-weight:900;color:#7C2D12">🐾 DoGame</div>
          <div style="font-size:14px;color:#9A3412;margin-top:4px">תאריך: ${date}</div>
        </div>
        <div style="font-size:12px;color:#9A3412">dogame.pages.dev</div>
      </div>

      <!-- Top match hero -->
      <div style="background:#FFFFFF;border:3px solid #C2410C;border-radius:24px;padding:24px;margin-bottom:24px">
        <div style="display:flex;align-items:center;gap:20px">
          ${
            top.breed.imageUrl
              ? `<img src="${top.breed.imageUrl}" alt="" crossorigin="anonymous" style="width:120px;height:120px;border-radius:18px;border:3px solid #FB923C;object-fit:cover" />`
              : ""
          }
          <div style="flex:1">
            <div style="display:inline-block;background:#F97316;color:#FFFFFF;font-size:11px;font-weight:800;padding:4px 12px;border-radius:999px;margin-bottom:8px">
              🏆 ההתאמה המובילה
            </div>
            <div style="font-size:32px;font-weight:900;color:#7C2D12;line-height:1.1">${top.breed.name}</div>
            <div style="font-size:14px;color:#9A3412;margin-top:4px">${top.breed.nameEn}</div>
            <div style="font-size:14px;color:#7C2D12;margin-top:8px;font-weight:500">${top.breed.tagline}</div>
          </div>
          <div style="text-align:center">
            <div style="font-size:48px;font-weight:900;color:#C2410C;line-height:1">${top.score}<span style="font-size:20px">%</span></div>
            <div style="font-size:12px;color:#9A3412;font-weight:700">התאמה</div>
          </div>
        </div>
      </div>

      <!-- Reasons -->
      ${
        top.reasons.length > 0
          ? `<div style="background:#DBEAFE;border:2px solid #60A5FA;border-radius:18px;padding:18px;margin-bottom:18px">
              <div style="font-size:16px;font-weight:800;color:#1D4ED8;margin-bottom:10px">💡 למה התאמנו אותך לגזע הזה?</div>
              <ul style="margin:0;padding:0;list-style:none">
                ${top.reasons
                  .map(
                    (r) =>
                      `<li style="font-size:14px;color:#7C2D12;margin-bottom:6px;line-height:1.5"><span style="color:#1D4ED8;font-weight:bold">✓</span> ${escapeHtml(r)}</li>`
                  )
                  .join("")}
              </ul>
            </div>`
          : ""
      }

      <!-- Stats grid -->
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:18px">
        <div style="background:#FEF3C7;border:2px solid #F59E0B;border-radius:14px;padding:14px;text-align:center">
          <div style="font-size:11px;color:#9A3412;font-weight:700">משקל</div>
          <div style="font-size:18px;font-weight:800;color:#7C2D12;margin-top:4px">${top.breed.weightKg[0]}–${top.breed.weightKg[1]} ק"ג</div>
        </div>
        <div style="background:#FEF3C7;border:2px solid #F59E0B;border-radius:14px;padding:14px;text-align:center">
          <div style="font-size:11px;color:#9A3412;font-weight:700">תוחלת חיים</div>
          <div style="font-size:18px;font-weight:800;color:#7C2D12;margin-top:4px">${top.breed.lifeExpectancy[0]}–${top.breed.lifeExpectancy[1]} שנים</div>
        </div>
        <div style="background:#FEF3C7;border:2px solid #F59E0B;border-radius:14px;padding:14px;text-align:center">
          <div style="font-size:11px;color:#9A3412;font-weight:700">פעילות יומית</div>
          <div style="font-size:18px;font-weight:800;color:#7C2D12;margin-top:4px">${top.breed.exerciseMinPerDay} דק'</div>
        </div>
      </div>

      <!-- Trait profile -->
      <div style="background:#FFFFFF;border:3px solid #FED7AA;border-radius:18px;padding:18px;margin-bottom:18px">
        <div style="font-size:18px;font-weight:800;color:#7C2D12;margin-bottom:14px">פרופיל תכונות</div>
        ${TRAIT_KEYS.map((k) => {
          const v = top.breed.traits[k];
          const pct = (v / 10) * 100;
          return `<div style="margin-bottom:10px">
            <div style="display:flex;justify-content:space-between;font-size:12px;font-weight:700;color:#7C2D12;margin-bottom:4px">
              <span>${TRAITS[k].label}</span>
              <span style="color:#9A3412">${v}/10</span>
            </div>
            <div style="height:8px;background:#FFEDD5;border:2px solid #FB923C;border-radius:999px;overflow:hidden;position:relative">
              <div style="position:absolute;top:0;right:0;bottom:0;width:${pct}%;background:linear-gradient(to left,#F97316,#FDBA74,#FB923C);border-radius:999px"></div>
            </div>
          </div>`;
        }).join("")}
      </div>

      <!-- Other top matches -->
      <div style="background:#FFFFFF;border:3px solid #FED7AA;border-radius:18px;padding:18px;margin-bottom:18px">
        <div style="font-size:16px;font-weight:800;color:#7C2D12;margin-bottom:10px">עוד גזעים מתאימים</div>
        ${matches
          .slice(1, 5)
          .map(
            (m, i) =>
              `<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;${i < 3 ? "border-bottom:1px dashed #FED7AA" : ""}">
                <div>
                  <span style="font-size:11px;font-weight:700;color:#9A3412">מקום ${i + 2}</span>
                  <div style="font-size:14px;font-weight:800;color:#7C2D12">${m.breed.name}</div>
                </div>
                <div style="font-size:20px;font-weight:900;color:#C2410C">${m.score}<span style="font-size:11px">%</span></div>
              </div>`
          )
          .join("")}
      </div>

      <!-- Footer -->
      <div style="padding-top:14px;border-top:2px solid #FED7AA;font-size:11px;color:#9A3412;text-align:center;font-weight:500;line-height:1.6">
        ההמלצה היא נקודת התחלה — לא תחליף לייעוץ מקצועי.<br/>
        לקבלת תוצאות מעודכנות או לחיפוש כלב לאימוץ: <strong>dogame.pages.dev</strong>
      </div>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
