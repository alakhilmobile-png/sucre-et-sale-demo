/*
 * Translations. French text lives directly in index.html; this file holds the
 * English version of each [data-i18n] key, plus strings built by app.js.
 */
window.I18N = {
  en: {
    'skip': 'Skip to menu',
    'nav.menu': 'Menu', 'nav.build': 'Build your own', 'nav.about': 'About', 'nav.gallery': 'Photos', 'nav.info': 'Info & directions',
    'hero.open': 'Open 7 days · from 11:00',
    'hero.tagline': 'Crêperie &amp; Tasty Food in Juvisy-sur-Orge',
    'hero.lead': 'Generous savoury crêpes, indulgent sweet crêpes, Tasty Crousty with crispy chicken, grilled dishes and home-made pastries. Eat in, take away or delivered to your door.',
    'cta.order': 'Order online', 'cta.uber': 'Uber Eats delivery',
    'hero.rating': 'Google rating', 'hero.card': 'from €6.90',
    'hl.1.t': 'Savoury & sweet crêpes', 'hl.1.p': '17 signature and classic recipes, or build your own ingredient by ingredient.',
    'hl.2.t': 'Tasty Crousty', 'hl.2.p': 'Rice, crispy chicken and house sauces: Original, Indian, Kebab, Beef or Chicken.',
    'hl.3.t': 'Eat in, take away, delivered', 'hl.3.p': 'Order online, pay by card and pick up with no wait — or get it delivered with Uber Eats.',
    'menu.kicker': 'The menu', 'menu.title': 'Our menu', 'menu.lead': 'Tap “Add” to order online. Secure payment, pick up at the counter.',
    'build.kicker': 'Your way', 'build.title': 'Build your crêpe', 'build.lead': 'Pick your base, then your ingredients — the price updates live.',
    'build.salee': 'Savoury crêpe', 'build.sucree': 'Sweet crêpe', 'build.base': 'Base', 'build.toppings': 'Toppings & Nutella',
    'build.total': 'Total', 'build.add': 'Add to basket',
    'about.kicker': 'Welcome', 'about.title': 'A tasty new spot in Juvisy',
    'about.p1': 'At Sucré & Salé everything is made to order in front of you: generously filled crêpes, crunchy Tasty Crousty, grilled chicken, fresh salads and a display of cakes and pastries.',
    'about.p2': 'Take a seat in our cosy dining room or on the terrace, take your order away, or get it delivered. Open every day.',
    'about.l1': 'Made to order', 'about.l2': 'Dining room & terrace', 'about.l3': 'Card, Apple Pay & Google Pay', 'about.l4': 'Uber Eats delivery',
    'gal.kicker': 'In pictures', 'gal.title': 'Getting hungry?',
    'rev.based': 'Google reviews', 'rev.title': 'What our customers say', 'rev.p': 'Enjoyed your meal? Your review helps us a lot.', 'rev.cta': 'Leave a Google review',
    'info.kicker': 'Find us', 'info.title': 'Info & directions', 'info.addr': 'Address', 'info.dir': 'Directions →',
    'info.hours': 'Opening hours', 'info.phone': 'Phone', 'info.how': 'How to order',
    'info.how1': 'Eat in & terrace', 'info.how2': 'Online click & collect', 'info.how3': 'Uber Eats delivery',
    'foot.tag': 'Crêperie & Tasty Food · Juvisy-sur-Orge', 'foot.secure': 'Secure payment by Stripe',
    'mbar.call': 'Call', 'mbar.order': 'Order',
    'chip.a': 'Best seller', 'chip.c': 'Made to order',
    'stat.1': 'recipes on the menu', 'stat.2': 'open every day', 'stat.3': 'of service, 11:00 – midnight', 'stat.4': 'Google rating',
    'cart.title': 'Your order', 'cart.empty': 'Your basket is empty.', 'cart.browse': 'See the menu', 'cart.total': 'Total incl. VAT',
    'cart.secure': '100% secure payment · Card, Apple Pay, Google Pay', 'cart.demo': 'Demo mode: no real payment will be taken.',
    'co.title': 'Pick up at the counter', 'co.takeaway': 'Take away', 'co.dinein': 'Eat in', 'co.name': 'First & last name', 'co.phone': 'Phone',
    'co.time': 'Pick-up time', 'co.notes': 'Note (allergies, no onions…)'
  },

  // Strings generated in JavaScript
  ui: {
    fr: {
      add: 'Ajouter', addFor: 'Ajouter · {p}', added: '{n} ajouté au panier', pay: 'Payer {p}', solo: 'Seul', meal: 'Menu (avec boisson)',
      drink: 'Ajouter une boisson 33cl', drinkShort: '+ boisson', asap: 'Dès que possible (~20 min)', remove: 'Supprimer',
      errName: 'Merci d’indiquer votre nom.', errPhone: 'Merci d’indiquer un numéro de téléphone valide.',
      errPay: 'Le paiement n’a pas pu démarrer. Réessayez ou appelez-nous.', paying: 'Redirection vers le paiement…',
      okTitle: 'Commande confirmée !', okText: 'Merci {n} ! Votre commande est en préparation. Présentez-vous au comptoir à l’heure choisie.',
      okDemo: 'Mode démonstration : en production, le client paie ici par carte / Apple Pay / Google Pay et le restaurant reçoit la commande instantanément.',
      cancelTitle: 'Paiement annulé', cancelText: 'Aucun montant n’a été débité. Votre panier est toujours là.',
      hours: 'Ouvert 7j/7 · dès {o}', midnight: 'minuit', openNow: 'Ouvert maintenant · jusqu’à {c}', closedNow: 'Fermé · ouvre à {o}',
      marquee: ['Crêpes salées', 'Crêpes sucrées', 'Tasty Crousty', 'Salades', 'Pâtisseries', 'Ouvert 7j/7 jusqu’à minuit', 'Livraison Uber Eats'], hoursRange: 'Ouvert 7j/7 · {o} – {c}', sauces: 'max. 2, offertes', free: 'offert',
      tagHot: 'Épicé', tagStar: 'Best-seller', tagVeg: 'Végétarien', pickupAt: 'Retrait', mode: 'Mode', total: 'Total',
      'emporter': 'À emporter', 'sur-place': 'Sur place', chooseOne: 'Choisissez au moins un ingrédient.'
    },
    en: {
      add: 'Add', addFor: 'Add · {p}', added: '{n} added to basket', pay: 'Pay {p}', solo: 'Solo', meal: 'Meal (with drink)',
      drink: 'Add a 33cl drink', drinkShort: '+ drink', asap: 'As soon as possible (~20 min)', remove: 'Remove',
      errName: 'Please enter your name.', errPhone: 'Please enter a valid phone number.',
      errPay: 'Payment could not start. Please try again or call us.', paying: 'Redirecting to payment…',
      okTitle: 'Order confirmed!', okText: 'Thank you {n}! Your order is being prepared. Come to the counter at your chosen time.',
      okDemo: 'Demo mode: in production the customer pays here by card / Apple Pay / Google Pay and the restaurant receives the order instantly.',
      cancelTitle: 'Payment cancelled', cancelText: 'You have not been charged. Your basket is still saved.',
      hours: 'Open 7 days · from {o}', midnight: 'midnight', openNow: 'Open now · until {c}', closedNow: 'Closed · opens at {o}',
      marquee: ['Savoury crêpes', 'Sweet crêpes', 'Tasty Crousty', 'Salads', 'Pastries', 'Open 7 days until midnight', 'Uber Eats delivery'], hoursRange: 'Open 7 days · {o} – {c}', sauces: 'max. 2, free', free: 'free',
      tagHot: 'Spicy', tagStar: 'Best seller', tagVeg: 'Vegetarian', pickupAt: 'Pick-up', mode: 'Mode', total: 'Total',
      'emporter': 'Take away', 'sur-place': 'Eat in', chooseOne: 'Pick at least one ingredient.'
    }
  }
};
