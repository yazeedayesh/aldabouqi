import { Armchair, Bed, Briefcase, Package, Zap, type LucideIcon } from "lucide-react";

// Icon shown per category on the store's "shop by category" chips. Falls
// back to a generic box icon for any slug an admin adds that isn't one of
// the launch categories — the chip still works, just with a neutral icon.
const categoryIcons: Record<string, LucideIcon> = {
  bedrooms: Bed,
  salons: Armchair,
  offices: Briefcase,
  appliances: Zap,
  other: Package,
};

export function getCategoryIcon(slug: string): LucideIcon {
  return categoryIcons[slug] ?? Package;
}
