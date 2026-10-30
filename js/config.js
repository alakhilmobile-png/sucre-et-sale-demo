/*
 * Sucré & Salé — restaurant settings.
 * The owner can change everything here without touching the rest of the site.
 */
window.SITE_CONFIG = {
  name: 'Sucré & Salé',
  phone: '09 63 25 77 47',
  phoneIntl: '+33963257747',
  address: '2 Av. Albert Sarraut, 91260 Juvisy-sur-Orge',
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Cr%C3%AAperie+Sucr%C3%A9e+%26+Sal%C3%A9+2+Av.+Albert+Sarraut+91260+Juvisy-sur-Orge',
  // Replace with the restaurant's exact Uber Eats store link once it is known.
  uberEatsUrl: 'https://www.ubereats.com/fr/search?q=Sucr%C3%A9%20et%20Sal%C3%A9%20Juvisy-sur-Orge',
  instagramUrl: '',
  googleRating: 4.9,
  googleReviews: 12,

  // Opening hours (every day). "24:00" means midnight.
  hours: { open: '11:00', close: '24:00', days: '7/7' },

  // Banner at the top of the page. Set enabled:false to hide it.
  promo: {
    enabled: true,
    fr: 'Nouveau à Juvisy ! Commandez en ligne et récupérez votre commande sans attendre.',
    en: 'New in Juvisy! Order online and pick up your food without waiting.'
  },

  // Online payment.
  //  'demo'   → the whole order flow works but no money is taken (for presentations).
  //  'stripe' → real card / Apple Pay / Google Pay payments via Stripe Checkout
  //             (needs the small server in /api deployed, see README).
  paymentMode: 'demo',
  checkoutEndpoint: '/api/create-checkout-session'
};
