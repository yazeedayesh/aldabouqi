import { IBM_Plex_Sans_Arabic, Tajawal } from "next/font/google";

// Matches the current site's font stack (main.css: --it-ff-body /
// --it-ff-heading) so the redesign keeps the same typographic identity,
// now self-hosted via next/font for zero layout shift.
export const bodyFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const headingFont = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});
