/**
 * BRAND CONFIG — edit this file for each new client.
 * All store-specific values live here; nothing else should need changing.
 */

const brand = {
  // Store identity
  storeName: "My Store",
  tagline: "Your store tagline here",
  domain: "mystore.co.za",
  country: "South Africa",

  // Logo — place your logo at /public/images/logo.png and update the path
  logo: "/images/logo.png",

  // Contact details (shown in footer)
  contact: {
    phone: "+27 00 000 0000",
    email: "info@mystore.co.za",
  },

  // Social links — icon keys map to SocialIcons.js (instagram, tiktok, facebook, twitter)
  social: [
    { href: "https://www.instagram.com/yourhandle/", label: "Instagram", icon: "instagram" },
    // { href: "https://www.tiktok.com/@yourhandle", label: "TikTok", icon: "tiktok" },
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
    accountName: "Store Name",
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
