import type { NextConfig } from "next";

type RedirectRule = { source: string; destination: string; permanent: true };

/** Legacy WordPress paths (no trailing slash) → Next.js pathname */
const LEGACY_REDIRECTS: Array<{ source: string; destination: string }> = [
  // State directories
  { source: "/pennsylvania-metabolic-health-directory", destination: "/directory/pennsylvania" },
  { source: "/texas-metabolic-health-directory", destination: "/directory/texas" },
  { source: "/alabama-metabolic-health-directory", destination: "/directory/alabama" },
  { source: "/arizona-metabolic-health-directory", destination: "/directory/arizona" },
  { source: "/arkansas-metabolic-health-directory", destination: "/directory/arkansas" },
  { source: "/alaska-metabolic-health-directory", destination: "/directory/alaska" },
  { source: "/colorado-metabolic-health-directory", destination: "/directory/colorado" },
  { source: "/connecticut-metabolic-health-directory", destination: "/directory/connecticut" },
  { source: "/delaware-metabolic-health-directory", destination: "/directory/delaware" },
  { source: "/florida-metabolic-health-directory", destination: "/directory/florida" },
  { source: "/georgia-metabolic-health-directory", destination: "/directory/georgia" },
  { source: "/hawaii-metabolic-health-directory", destination: "/directory/hawaii" },
  { source: "/idaho-metabolic-health-directory", destination: "/directory/idaho" },
  { source: "/indiana-metabolic-health-directory", destination: "/directory/indiana" },
  { source: "/illinois-metabolic-health-directory", destination: "/directory/illinois" },
  { source: "/kentucky-metabolic-health-directory", destination: "/directory/kentucky" },
  { source: "/maine-metabolic-health-directory", destination: "/directory/maine" },
  { source: "/maryland-metabolic-health-directory", destination: "/directory/maryland" },
  { source: "/michigan-metabolic-health-directory", destination: "/directory/michigan" },
  { source: "/louisiana-metabolic-health-directory", destination: "/directory/louisiana" },
  { source: "/mississippi-metabolic-health-directory", destination: "/directory/mississippi" },
  { source: "/missouri-metabolic-health-directory", destination: "/directory/missouri" },
  { source: "/montana-metabolic-health-directory", destination: "/directory/montana" },
  { source: "/nebraska-metabolic-health-directory", destination: "/directory/nebraska" },
  { source: "/nevada-metabolic-health-directory", destination: "/directory/nevada" },
  { source: "/new-hampshire-metabolic-health-directory", destination: "/directory/new-hampshire" },
  { source: "/new-jersey-metabolic-health-directory", destination: "/directory/new-jersey" },
  { source: "/new-mexico-metabolic-health-directory", destination: "/directory/new-mexico" },
  { source: "/new-york-metabolic-health-directory", destination: "/directory/new-york" },
  { source: "/north-carolina-metabolic-health-directory", destination: "/directory/north-carolina" },
  { source: "/north-dakota-metabolic-health-directory", destination: "/directory/north-dakota" },
  { source: "/ohio-metabolic-health-directory", destination: "/directory/ohio" },
  { source: "/oklahoma-metabolic-health-directory", destination: "/directory/oklahoma" },
  { source: "/oregon-metabolic-health-directory", destination: "/directory/oregon" },
  { source: "/rhode-island-metabolic-health-directory", destination: "/directory/rhode-island" },
  { source: "/south-carolina-metabolic-health-directory", destination: "/directory/south-carolina" },
  { source: "/south-dakota-metabolic-health-directory", destination: "/directory/south-dakota" },
  { source: "/tennessee-metabolic-health-directory", destination: "/directory/tennessee" },
  { source: "/utah-metabolic-health-directory", destination: "/directory/utah" },
  { source: "/vermont-metabolic-health-directory", destination: "/directory/vermont" },
  { source: "/virginia-metabolic-health-directory", destination: "/directory/virginia" },
  { source: "/west-virginia-metabolic-health-directory", destination: "/directory/west-virginia" },
  { source: "/wisconsin-metabolic-health-directory", destination: "/directory/wisconsin" },
  { source: "/wyoming-metabolic-health-directory", destination: "/directory/wyoming" },
  // Special / alternate slugs
  { source: "/washington-metabolic-health-directory", destination: "/directory/washington-dc" },
  { source: "/washington-metabolic-health-directory-2", destination: "/directory/washington" },
  { source: "/californias-metabolic-health-directory", destination: "/directory/california" },
  { source: "/minnesota-functional-medicine-practitioners", destination: "/directory/minnesota" },
  // Tools & articles
  { source: "/fat-ratio-calculator", destination: "/tools/fat-ratio-calculator" },
  {
    source:
      "/near-zero-carb-vegetarian-diet-design-a-comprehensive-scientific-analysis",
    destination: "/articles/vegetarian-carnivore-design",
  },
  { source: "/very-low-carb-vegetarian-diet", destination: "/articles/very-low-carb-vegetarian" },
  {
    source:
      "/what-humans-actually-need-the-complete-nutritional-science-behind-carnivore",
    destination: "/articles/human-nutritional-science",
  },
  { source: "/the-great-green-delusion", destination: "/articles/great-green-delusion" },
  { source: "/privacy-policy", destination: "/privacy-policy" },
];

function buildLegacyRedirectRules(
  pairs: Array<{ source: string; destination: string }>,
): RedirectRule[] {
  return pairs.flatMap(({ source, destination }) => {
    const base = source.replace(/\/+$/, "");
    const dest = destination.replace(/\/+$/, "");
    const rules: RedirectRule[] = [];

    if (base !== dest) {
      rules.push({ source: base, destination: dest, permanent: true });
    }
    rules.push({ source: `${base}/`, destination: dest, permanent: true });
    return rules;
  });
}

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // 4 non-standard URLs
      { source: '/californias-metabolic-health-directory', destination: '/directory/california', permanent: true },
      { source: '/californias-metabolic-health-directory/', destination: '/directory/california', permanent: true },
      { source: '/minnesota-functional-medicine-practitioners', destination: '/directory/minnesota', permanent: true },
      { source: '/minnesota-functional-medicine-practitioners/', destination: '/directory/minnesota', permanent: true },
      { source: '/washington-metabolic-health-directory', destination: '/directory/washington-dc', permanent: true },
      { source: '/washington-metabolic-health-directory/', destination: '/directory/washington-dc', permanent: true },
      { source: '/washington-metabolic-health-directory-2', destination: '/directory/washington', permanent: true },
      { source: '/washington-metabolic-health-directory-2/', destination: '/directory/washington', permanent: true },
      // 44 standard pattern redirects (with and without trailing slash)
      { source: '/alabama-metabolic-health-directory', destination: '/directory/alabama', permanent: true },
      { source: '/alabama-metabolic-health-directory/', destination: '/directory/alabama', permanent: true },
      { source: '/alaska-metabolic-health-directory', destination: '/directory/alaska', permanent: true },
      { source: '/alaska-metabolic-health-directory/', destination: '/directory/alaska', permanent: true },
      { source: '/arizona-metabolic-health-directory', destination: '/directory/arizona', permanent: true },
      { source: '/arizona-metabolic-health-directory/', destination: '/directory/arizona', permanent: true },
      { source: '/arkansas-metabolic-health-directory', destination: '/directory/arkansas', permanent: true },
      { source: '/arkansas-metabolic-health-directory/', destination: '/directory/arkansas', permanent: true },
      { source: '/colorado-metabolic-health-directory', destination: '/directory/colorado', permanent: true },
      { source: '/colorado-metabolic-health-directory/', destination: '/directory/colorado', permanent: true },
      { source: '/connecticut-metabolic-health-directory', destination: '/directory/connecticut', permanent: true },
      { source: '/connecticut-metabolic-health-directory/', destination: '/directory/connecticut', permanent: true },
      { source: '/delaware-metabolic-health-directory', destination: '/directory/delaware', permanent: true },
      { source: '/delaware-metabolic-health-directory/', destination: '/directory/delaware', permanent: true },
      { source: '/florida-metabolic-health-directory', destination: '/directory/florida', permanent: true },
      { source: '/florida-metabolic-health-directory/', destination: '/directory/florida', permanent: true },
      { source: '/georgia-metabolic-health-directory', destination: '/directory/georgia', permanent: true },
      { source: '/georgia-metabolic-health-directory/', destination: '/directory/georgia', permanent: true },
      { source: '/hawaii-metabolic-health-directory', destination: '/directory/hawaii', permanent: true },
      { source: '/hawaii-metabolic-health-directory/', destination: '/directory/hawaii', permanent: true },
      { source: '/idaho-metabolic-health-directory', destination: '/directory/idaho', permanent: true },
      { source: '/idaho-metabolic-health-directory/', destination: '/directory/idaho', permanent: true },
      { source: '/illinois-metabolic-health-directory', destination: '/directory/illinois', permanent: true },
      { source: '/illinois-metabolic-health-directory/', destination: '/directory/illinois', permanent: true },
      { source: '/indiana-metabolic-health-directory', destination: '/directory/indiana', permanent: true },
      { source: '/indiana-metabolic-health-directory/', destination: '/directory/indiana', permanent: true },
      { source: '/kentucky-metabolic-health-directory', destination: '/directory/kentucky', permanent: true },
      { source: '/kentucky-metabolic-health-directory/', destination: '/directory/kentucky', permanent: true },
      { source: '/louisiana-metabolic-health-directory', destination: '/directory/louisiana', permanent: true },
      { source: '/louisiana-metabolic-health-directory/', destination: '/directory/louisiana', permanent: true },
      { source: '/maine-metabolic-health-directory', destination: '/directory/maine', permanent: true },
      { source: '/maine-metabolic-health-directory/', destination: '/directory/maine', permanent: true },
      { source: '/maryland-metabolic-health-directory', destination: '/directory/maryland', permanent: true },
      { source: '/maryland-metabolic-health-directory/', destination: '/directory/maryland', permanent: true },
      { source: '/michigan-metabolic-health-directory', destination: '/directory/michigan', permanent: true },
      { source: '/michigan-metabolic-health-directory/', destination: '/directory/michigan', permanent: true },
      { source: '/mississippi-metabolic-health-directory', destination: '/directory/mississippi', permanent: true },
      { source: '/mississippi-metabolic-health-directory/', destination: '/directory/mississippi', permanent: true },
      { source: '/missouri-metabolic-health-directory', destination: '/directory/missouri', permanent: true },
      { source: '/missouri-metabolic-health-directory/', destination: '/directory/missouri', permanent: true },
      { source: '/montana-metabolic-health-directory', destination: '/directory/montana', permanent: true },
      { source: '/montana-metabolic-health-directory/', destination: '/directory/montana', permanent: true },
      { source: '/nebraska-metabolic-health-directory', destination: '/directory/nebraska', permanent: true },
      { source: '/nebraska-metabolic-health-directory/', destination: '/directory/nebraska', permanent: true },
      { source: '/nevada-metabolic-health-directory', destination: '/directory/nevada', permanent: true },
      { source: '/nevada-metabolic-health-directory/', destination: '/directory/nevada', permanent: true },
      { source: '/new-hampshire-metabolic-health-directory', destination: '/directory/new-hampshire', permanent: true },
      { source: '/new-hampshire-metabolic-health-directory/', destination: '/directory/new-hampshire', permanent: true },
      { source: '/new-jersey-metabolic-health-directory', destination: '/directory/new-jersey', permanent: true },
      { source: '/new-jersey-metabolic-health-directory/', destination: '/directory/new-jersey', permanent: true },
      { source: '/new-mexico-metabolic-health-directory', destination: '/directory/new-mexico', permanent: true },
      { source: '/new-mexico-metabolic-health-directory/', destination: '/directory/new-mexico', permanent: true },
      { source: '/new-york-metabolic-health-directory', destination: '/directory/new-york', permanent: true },
      { source: '/new-york-metabolic-health-directory/', destination: '/directory/new-york', permanent: true },
      { source: '/north-carolina-metabolic-health-directory', destination: '/directory/north-carolina', permanent: true },
      { source: '/north-carolina-metabolic-health-directory/', destination: '/directory/north-carolina', permanent: true },
      { source: '/north-dakota-metabolic-health-directory', destination: '/directory/north-dakota', permanent: true },
      { source: '/north-dakota-metabolic-health-directory/', destination: '/directory/north-dakota', permanent: true },
      { source: '/ohio-metabolic-health-directory', destination: '/directory/ohio', permanent: true },
      { source: '/ohio-metabolic-health-directory/', destination: '/directory/ohio', permanent: true },
      { source: '/oklahoma-metabolic-health-directory', destination: '/directory/oklahoma', permanent: true },
      { source: '/oklahoma-metabolic-health-directory/', destination: '/directory/oklahoma', permanent: true },
      { source: '/oregon-metabolic-health-directory', destination: '/directory/oregon', permanent: true },
      { source: '/oregon-metabolic-health-directory/', destination: '/directory/oregon', permanent: true },
      { source: '/pennsylvania-metabolic-health-directory', destination: '/directory/pennsylvania', permanent: true },
      { source: '/pennsylvania-metabolic-health-directory/', destination: '/directory/pennsylvania', permanent: true },
      { source: '/rhode-island-metabolic-health-directory', destination: '/directory/rhode-island', permanent: true },
      { source: '/rhode-island-metabolic-health-directory/', destination: '/directory/rhode-island', permanent: true },
      { source: '/south-carolina-metabolic-health-directory', destination: '/directory/south-carolina', permanent: true },
      { source: '/south-carolina-metabolic-health-directory/', destination: '/directory/south-carolina', permanent: true },
      { source: '/south-dakota-metabolic-health-directory', destination: '/directory/south-dakota', permanent: true },
      { source: '/south-dakota-metabolic-health-directory/', destination: '/directory/south-dakota', permanent: true },
      { source: '/tennessee-metabolic-health-directory', destination: '/directory/tennessee', permanent: true },
      { source: '/tennessee-metabolic-health-directory/', destination: '/directory/tennessee', permanent: true },
      { source: '/texas-metabolic-health-directory', destination: '/directory/texas', permanent: true },
      { source: '/texas-metabolic-health-directory/', destination: '/directory/texas', permanent: true },
      { source: '/utah-metabolic-health-directory', destination: '/directory/utah', permanent: true },
      { source: '/utah-metabolic-health-directory/', destination: '/directory/utah', permanent: true },
      { source: '/vermont-metabolic-health-directory', destination: '/directory/vermont', permanent: true },
      { source: '/vermont-metabolic-health-directory/', destination: '/directory/vermont', permanent: true },
      { source: '/virginia-metabolic-health-directory', destination: '/directory/virginia', permanent: true },
      { source: '/virginia-metabolic-health-directory/', destination: '/directory/virginia', permanent: true },
      { source: '/west-virginia-metabolic-health-directory', destination: '/directory/west-virginia', permanent: true },
      { source: '/west-virginia-metabolic-health-directory/', destination: '/directory/west-virginia', permanent: true },
      { source: '/wisconsin-metabolic-health-directory', destination: '/directory/wisconsin', permanent: true },
      { source: '/wisconsin-metabolic-health-directory/', destination: '/directory/wisconsin', permanent: true },
      { source: '/wyoming-metabolic-health-directory', destination: '/directory/wyoming', permanent: true },
      { source: '/wyoming-metabolic-health-directory/', destination: '/directory/wyoming', permanent: true },
    ];
  },
};

export default nextConfig;
