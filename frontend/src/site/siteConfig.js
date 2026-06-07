import rawConfig from "./site.config.json";

const FALLBACK_CONFIG = {
  practice: {
    name: "Bayside Animal Medical Center",
    shortName: "Bayside Animal",
    displayLines: ["Bayside Animal", "Medical Center"],
    tagline: "Full-service veterinary care in Severna Park since 1996.",
    description: "Bayside Animal Medical Center is a full-service veterinary hospital in Severna Park, Maryland.",
    serviceArea: "Severna Park, Arnold, Millersville, Annapolis, Pasadena, and Glen Burnie, MD",
  },
  brand: {
    logo: "/brand/bayside-logo.png",
    logoAlt: "Bayside Animal Medical Center logo",
    colors: {
      light: "#F3F7FB",
      dark: "#001B67",
      accent: "#43D4FF",
      accentLight: "#DDEFFA",
    },
  },
  contact: {
    phone: "(410) 544-4423",
    phoneHref: "tel:+14105444423",
    email: "info@baysideanimal.com",
    address: {
      street: "848 Ritchie Hwy",
      line2: "",
      city: "Severna Park",
      state: "MD",
      zip: "21146",
      country: "US",
    },
  },
  hours: [
    ["Monday", "8:30 AM – 7:00 PM"],
    ["Tuesday", "8:30 AM – 7:00 PM"],
    ["Wednesday", "8:30 AM – 7:00 PM"],
    ["Thursday", "8:30 AM – 7:00 PM"],
    ["Friday", "8:30 AM – 6:00 PM"],
    ["Saturday", "8:30 AM – 1:00 PM"],
    ["Sunday", "Closed"],
  ],
  links: {},
  team: [],
  features: {},
};

function mergeConfig(base, override) {
  const output = { ...base, ...override };
  output.practice = { ...base.practice, ...(override.practice || {}) };
  output.brand = { ...base.brand, ...(override.brand || {}) };
  output.brand.colors = { ...base.brand.colors, ...((override.brand && override.brand.colors) || {}) };
  output.contact = { ...base.contact, ...(override.contact || {}) };
  output.contact.address = { ...base.contact.address, ...((override.contact && override.contact.address) || {}) };
  output.links = { ...base.links, ...(override.links || {}) };
  output.features = { ...base.features, ...(override.features || {}) };
  output.hours = override.hours && override.hours.length ? override.hours : base.hours;
  output.team = override.team || base.team;
  return output;
}

export const siteConfig = mergeConfig(FALLBACK_CONFIG, rawConfig || {});

export const practice = siteConfig.practice;
export const brand = siteConfig.brand;
export const contact = siteConfig.contact;
export const links = siteConfig.links;
export const features = siteConfig.features;
export const hours = siteConfig.hours;
export const team = siteConfig.team;

export function formatAddress(address = contact.address, { multiline = false } = {}) {
  const line1 = [address.street, address.line2].filter(Boolean).join(", ");
  const line2 = [address.city, address.state, address.zip].filter(Boolean).join(" ");
  if (multiline) return [line1, line2].filter(Boolean);
  return [line1, line2].filter(Boolean).join(", ");
}

export function getExternalLinks() {
  return [
    features.storeLink && links.store ? { label: "Online Store", href: links.store } : null,
    features.pharmacyLink && links.pharmacy ? { label: "Pharmacy", href: links.pharmacy } : null,
    features.onlineFormsLink && links.onlineForms ? { label: "Forms", href: links.onlineForms } : null,
  ].filter(Boolean);
}
