import type { BrandName } from "@/components/ui/brand-icon";

/**
 * The four marks, in the order they are read: the two we broadcast on first,
 * then the two we talk on.
 *
 * LinkedIn is not among them and cannot be — Simple Icons removed that mark at
 * the trademark holder's request, so there is no honest source for it here.
 *
 * Shared rather than owned by the footer, because the header's menu card ends
 * on the same row. Two copies of four URLs is two places to update the day one
 * of them moves.
 */
export const socials: { name: BrandName; label: string; href: string }[] = [
  {
    name: "youtube",
    label: "YouTube",
    href: "https://www.youtube.com/@kombafc",
  },
  {
    name: "instagram",
    label: "Instagram",
    href: "https://www.instagram.com/komba.fc/",
  },
  {
    name: "facebook",
    label: "Facebook",
    href: "https://www.facebook.com/kombafightclub",
  },
  { name: "x", label: "X", href: "https://x.com/kombafc" },
];
