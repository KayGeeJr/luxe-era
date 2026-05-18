/**
 * BRAND CONFIG — Luxe Era
 */

const brand = {
  storeName: "Luxe Era",
  tagline: "Handcrafted. Minimal. Timeless.",
  domain: "luxeera.co.za",
  country: "South Africa",
  foundedYear: 2023,

  logo: "/images/logo.jpg",

  contact: {
    phone: "+27 81 774 5524",
    phoneDisplay: "081 774 5524",
    email: "hello@luxeera.co.za",
    whatsapp: "27817745524",
  },

  social: [
    { href: "https://www.instagram.com/luxeera.homecollections/", label: "Instagram", icon: "instagram" },
    { href: "https://www.tiktok.com/@luxeera.homecollections?lang=en", label: "TikTok", icon: "tiktok" },
  ],

  chatUrl: "https://wa.me/27817745524",

  currency: "ZAR",
  currencySymbol: "R",

  freeShippingAboveZar: 80000,
  shippingFeeZar: 12000,

  orderLeadTime: "3–5 working days",

  eft: {
    bank: "Standard Bank",
    accountName: "Miss Mmina Mr Motshegwana",
    accountNumber: "10138475340",
    branchCode: "8305",
    accountType: "Current",
    reference: "Your order number",
  },

  nav: [
    { href: "/about", label: "About" },
    { href: "/shop", label: "Shop" },
    { href: "/custom-orders", label: "Custom Orders" },
    { href: "/contact", label: "Contact" },
  ],
};

module.exports = brand;
