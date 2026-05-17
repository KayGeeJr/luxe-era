/**
 * BRAND CONFIG — Luxe Era
 */

const brand = {
  // Store identity
  storeName: "Luxe Era",
  tagline: "Sculpted by hand. Cast in concrete. Made to be lived with.",
  domain: "luxeera.co.za",
  country: "South Africa",

  // Logo — place logo at /public/images/logo.png
  logo: "/images/logo.jpg",

  // Contact details
  contact: {
    phone: "+27 00 000 0000",
    email: "hello@luxeera.co.za",
  },

  // Social links
  social: [
    { href: "https://www.instagram.com/luxeera.homecollections/", label: "Instagram", icon: "instagram" },
    { href: "https://www.tiktok.com/@luxeera.homecollections?lang=en", label: "TikTok", icon: "tiktok" },
  ],

  // Currency
  currency: "ZAR",
  currencySymbol: "R",

  // Shipping (in cents — 80000 = R800, 12000 = R120)
  freeShippingAboveZar: 80000,
  shippingFeeZar: 12000,

  // EFT banking details — fill in before going live
  eft: {
    bank: "Bank Name",
    accountName: "Luxe Era",
    accountNumber: "000000000",
    branchCode: "000000",
    reference: "Your order number",
  },

  // Navigation links shown in Header and Footer
  nav: [
    { href: "/about", label: "About" },
    { href: "/shop", label: "Shop" },
    { href: "/custom-orders", label: "Custom Orders" },
    { href: "/contact", label: "Contact" },
  ],
};

module.exports = brand;
