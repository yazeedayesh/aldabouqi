import { Cairo, IBM_Plex_Sans_Arabic } from "next/font/google";

// v2 brand identity (2026-09-07): headings moved from Tajawal to Cairo;
// IBM Plex Sans Arabic stays as the body font unchanged.
export const bodyFont = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-body",
  display: "swap",
});

export const headingFont = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["600", "700", "800", "900"],
  variable: "--font-heading",
  display: "swap",
});
