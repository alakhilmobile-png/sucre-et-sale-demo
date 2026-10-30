/*
 * Sucré & Salé — menu catalogue (single source of truth).
 * Used by the website (browser) AND by the payment server (api/), so the
 * server always recalculates prices itself and never trusts the browser.
 *
 * To change a price or a dish, edit it here only.
 */
(function (root) {
  const DRINK_PRICE = 1.2;

  const categories = [
    { id: 'signatures', fr: 'Crêpes salées · Signatures', en: 'Savoury crêpes · Signatures',
      noteFr: 'Base crêpe + emmental, sel, poivre · Boisson 33cl +1,20 €',
      noteEn: 'Crêpe base + emmental, salt, pepper · 33cl drink +€1.20' },
    { id: 'classiques', fr: 'Crêpes salées · Classiques', en: 'Savoury crêpes · Classics',
      noteFr: 'Prix unique 8,30 €', noteEn: 'One price: €8.30' },
    { id: 'crousty', fr: 'Tasty Crousty', en: 'Tasty Crousty',
      noteFr: 'Riz & poulet crispy · Seul 6,90 € | Menu 7,90 €', noteEn: 'Rice & crispy chicken · Solo €6.90 | Meal €7.90' },
    { id: 'snacks', fr: 'Snacks & Frites', en: 'Snacks & Fries', noteFr: '', noteEn: '' },
    { id: 'salades', fr: 'Salades gourmandes', en: 'Gourmet salads', noteFr: '', noteEn: '' },
    { id: 'sucrees', fr: 'Crêpes sucrées & desserts', en: 'Sweet crêpes & desserts',
      noteFr: 'Composez la vôtre ci-dessous', noteEn: 'Build your own below' }
  ];

  const items = [
    // ---- Signatures (drink upgrade available)
    { id: 'burger', cat: 'signatures', name: 'Burger', price: 8.9, drink: true,
      fr: 'Cheddar, pickles, salade, viande hachée, sauce Biggy',
      en: 'Cheddar, pickles, lettuce, minced beef, Biggy sauce' },
    { id: 'snow', cat: 'signatures', name: 'Snow', price: 9.2, drink: true,
      fr: 'Crème fraîche, pommes de terre, saumon fumé',
      en: 'Crème fraîche, potatoes, smoked salmon' },
    { id: 'sharingan', cat: 'signatures', name: 'Sharingan', price: 10.9, drink: true, tag: 'hot',
      fr: 'Cheddar, pickles, poivrons, bacon de dinde, cordon bleu, viande hachée, sauce Biggy',
      en: 'Cheddar, pickles, peppers, turkey bacon, cordon bleu, minced beef, Biggy sauce' },
    { id: 'frenchy', cat: 'signatures', name: 'Frenchy', price: 10.9, drink: true,
      fr: 'Raclette, champignons, pommes de terre, salade, lardons de volaille, poulet fumé, crème fraîche',
      en: 'Raclette, mushrooms, potatoes, lettuce, chicken lardons, smoked chicken, crème fraîche' },
    { id: 'veggie', cat: 'signatures', name: 'Veggie', price: 8.5, drink: true, tag: 'veg',
      fr: 'Champignons, maïs, oignons rouges, olives noires, poivrons, salade, tomates, crème fraîche',
      en: 'Mushrooms, sweetcorn, red onions, black olives, peppers, lettuce, tomatoes, crème fraîche' },
    { id: 'dolce', cat: 'signatures', name: 'Dolce', price: 11.5, drink: true,
      fr: 'Mozzarella, champignons, œuf, bacon, jambon de dinde, lardons de volaille, poulet fumé, sauce BBQ',
      en: 'Mozzarella, mushrooms, egg, bacon, turkey ham, chicken lardons, smoked chicken, BBQ sauce' },
    { id: 'speciale', cat: 'signatures', name: 'Spéciale', price: 8.9, drink: true,
      fr: 'Vache qui rit, pommes de terre, chorizo, poulet émincé, crème fraîche, sauce algérienne',
      en: 'Laughing Cow cheese, potatoes, chorizo, sliced chicken, crème fraîche, Algerian sauce' },
    { id: 'chickentwin', cat: 'signatures', name: 'Chickentwin', price: 10.9, drink: true, tag: 'star',
      fr: 'Boursin, mozzarella, oignons frits, chorizo, poulet émincé, tenders, sauce algérienne',
      en: 'Boursin, mozzarella, fried onions, chorizo, sliced chicken, tenders, Algerian sauce' },
    { id: 'spicy', cat: 'signatures', name: 'Spicy', price: 10.7, drink: true, tag: 'hot',
      fr: 'Mozzarella, jalapeños, poivrons, oignons rouges, chorizo, poulet émincé, sauce BBQ & salsa',
      en: 'Mozzarella, jalapeños, peppers, red onions, chorizo, sliced chicken, BBQ sauce & salsa' },
    { id: 'fullmeat', cat: 'signatures', name: 'Full Meat', price: 11.5, drink: true, tag: 'star',
      fr: 'Saint-Môret, raclette, oignons frits, merguez, pommes de terre, œuf, jambon de dinde, sauce samouraï',
      en: 'Saint-Môret, raclette, fried onions, merguez, potatoes, egg, turkey ham, samurai sauce' },

    // ---- Classiques (8.30)
    { id: 'hotspicy', cat: 'classiques', name: 'Hot Spicy', price: 8.3, tag: 'hot',
      fr: 'Jalapeños, oignons rouges, poulet émincé, sauce chili thaï',
      en: 'Jalapeños, red onions, sliced chicken, Thai chili sauce' },
    { id: 'cordonbleu', cat: 'classiques', name: 'Cordon Bleu', price: 8.3,
      fr: 'Pommes de terre, œuf, cordon bleu, sauce Biggy',
      en: 'Potatoes, egg, cordon bleu, Biggy sauce' },
    { id: 'poulet', cat: 'classiques', name: 'Poulet', price: 8.3,
      fr: 'Cheddar, pommes de terre, poulet émincé, sauce algérienne',
      en: 'Cheddar, potatoes, sliced chicken, Algerian sauce' },
    { id: 'francaise', cat: 'classiques', name: 'Française', price: 8.3,
      fr: 'Œuf, champignons, jambon de dinde, crème fraîche',
      en: 'Egg, mushrooms, turkey ham, crème fraîche' },
    { id: 'kfc', cat: 'classiques', name: 'KFC', price: 8.3,
      fr: 'Pommes de terre, oignons frits, tenders, sauce Biggy et BBQ',
      en: 'Potatoes, fried onions, tenders, Biggy & BBQ sauce' },
    { id: 'africain', cat: 'classiques', name: 'Africain', price: 8.3,
      fr: 'Raclette, œuf, pommes de terre, merguez, sauce samouraï',
      en: 'Raclette, egg, potatoes, merguez, samurai sauce' },
    { id: 'fermiere', cat: 'classiques', name: 'Fermière', price: 8.3,
      fr: 'Lardons de volaille, poulet fumé, crème fraîche',
      en: 'Chicken lardons, smoked chicken, crème fraîche' },

    // ---- Tasty Crousty (solo / meal)
    { id: 'crousty-original', cat: 'crousty', name: 'Crousty Original', price: 6.9, menuPrice: 7.9, tag: 'star', img: 'crousty-bowl',
      fr: 'Riz, sauce crousty, tenders, sauce sriracha, BBQ, sweet chili, oignons crispy',
      en: 'Rice, crousty sauce, tenders, sriracha, BBQ, sweet chili, crispy onions' },
    { id: 'crousty-indien', cat: 'crousty', name: 'Crousty Indien', price: 6.9, menuPrice: 7.9,
      fr: 'Riz, sauce crousty, poulet curry, sauce sweet chili, sriracha, BBQ, oignons crispy',
      en: 'Rice, crousty sauce, curry chicken, sweet chili, sriracha, BBQ, crispy onions' },
    { id: 'crousty-kebab', cat: 'crousty', name: 'Crousty Kebab', price: 6.9, menuPrice: 7.9,
      fr: 'Riz, sauce crousty, kebab, sweet chili, BBQ, sriracha, oignons crispy',
      en: 'Rice, crousty sauce, kebab, sweet chili, BBQ, sriracha, crispy onions' },
    { id: 'crousty-boeuf', cat: 'crousty', name: 'Crousty Bœuf', price: 6.9, menuPrice: 7.9,
      fr: 'Riz, sauce crousty, viande hachée, BBQ, sweet chili, sriracha, oignons caramélisés',
      en: 'Rice, crousty sauce, minced beef, BBQ, sweet chili, sriracha, caramelised onions' },
    { id: 'crousty-poulet', cat: 'crousty', name: 'Crousty Poulet', price: 6.9, menuPrice: 7.9,
      fr: 'Riz, sauce crousty, poulet rôti, BBQ, sweet chili, sriracha, oignons crispy',
      en: 'Rice, crousty sauce, roast chicken, BBQ, sweet chili, sriracha, crispy onions' },

    // ---- Snacks
    { id: 'frites', cat: 'snacks', name: 'Frites', price: 3.9,
      fr: 'Portion de frites croustillantes', en: 'Portion of crispy fries' },
    { id: 'menu-nuggets', cat: 'snacks', name: 'Menu Nuggets (5 pcs)', price: 8.5,
      fr: '5 nuggets de poulet en menu', en: '5 chicken nuggets, as a meal' },
    { id: 'menu-crispy', cat: 'snacks', name: 'Menu Poulet Crispy (5 pcs)', price: 11.9,
      fr: '5 pièces de poulet crispy en menu', en: '5 pieces of crispy chicken, as a meal' },

    // ---- Salades
    { id: 'norvegienne', cat: 'salades', name: 'Salade Norvégienne', price: 10.9,
      fr: 'Saumon fumé, légumes mixés, tomates cerises, sauce basilic frais',
      en: 'Smoked salmon, mixed vegetables, cherry tomatoes, fresh basil dressing' },
    { id: 'cesar', cat: 'salades', name: 'Salade César', price: 10.7, img: 'salad',
      fr: 'Poulet grillé, croûtons de pain, œuf, sauce César, parmesan, tomates cerises',
      en: 'Grilled chicken, croutons, egg, Caesar dressing, parmesan, cherry tomatoes' }
  ];

  // ---- "Composez votre crêpe salée"
  const saleeBuilder = {
    sizes: [
      { id: 'classic', fr: 'Classic', en: 'Classic', price: 7.9 },
      { id: 'grand', fr: 'Grand', en: 'Large', price: 10.9 }
    ],
    groups: [
      { id: 'viandes', fr: 'Viandes', en: 'Meats', options: [
        ['poulet-emince', 'Poulet émincé', 'Sliced chicken', 1.5], ['jambon-dinde', 'Jambon dinde', 'Turkey ham', 1.5],
        ['cordon-bleu', 'Cordon bleu', 'Cordon bleu', 1.5], ['poulet-fume', 'Poulet fumé', 'Smoked chicken', 1.5],
        ['merguez', 'Merguez', 'Merguez', 1.5], ['bacon-dinde', 'Bacon dinde', 'Turkey bacon', 1.5],
        ['chorizo', 'Chorizo', 'Chorizo', 1.5], ['tenders', 'Tenders', 'Tenders', 1.5],
        ['viande-hachee', 'Viande hachée', 'Minced beef', 1.5], ['thon', 'Thon', 'Tuna', 1.5],
        ['saumon', 'Saumon', 'Salmon', 1.7]
      ] },
      { id: 'legumes', fr: 'Légumes', en: 'Vegetables', options: [
        ['salade', 'Salade', 'Lettuce', 0.8], ['tomates', 'Tomates', 'Tomatoes', 0.8],
        ['champignons', 'Champignons', 'Mushrooms', 0.8], ['mais', 'Maïs', 'Sweetcorn', 0.8],
        ['pommes-terre', 'Pommes de terre', 'Potatoes', 0.8], ['avocat', 'Avocat', 'Avocado', 1.0],
        ['olives', 'Olives noires', 'Black olives', 0.8], ['jalapenos', 'Jalapeños', 'Jalapeños', 0.8],
        ['oignons-frits', 'Oignons frits', 'Fried onions', 0.8]
      ] },
      { id: 'fromages', fr: 'Fromages', en: 'Cheeses', options: [
        ['chevre', 'Chèvre', 'Goat cheese', 1.2], ['mozzarella', 'Mozzarella', 'Mozzarella', 1.2],
        ['bleu', 'Bleu', 'Blue cheese', 1.2], ['reblochon', 'Reblochon', 'Reblochon', 1.2],
        ['cheddar', 'Cheddar', 'Cheddar', 1.2], ['raclette', 'Raclette', 'Raclette', 1.2],
        ['boursin', 'Boursin', 'Boursin', 1.2], ['vache-qui-rit', 'Vache qui rit', 'Laughing Cow', 1.2]
      ] },
      { id: 'sauces', fr: 'Sauces', en: 'Sauces', max: 2, options: [
        ['algerienne', 'Algérienne', 'Algerian', 0], ['fish', 'Fish', 'Fish', 0],
        ['barbecue', 'Barbecue', 'Barbecue', 0], ['ketchup', 'Ketchup', 'Ketchup', 0],
        ['biggy', 'Biggy', 'Biggy', 0], ['mayo', 'Mayo blanche', 'White mayo', 0],
        ['moutarde-honey', 'Moutarde honey', 'Honey mustard', 0], ['chili-thai', 'Chili thaï', 'Thai chili', 0],
        ['samourai', 'Samouraï', 'Samurai', 0]
      ] }
    ]
  };

  // ---- "Crêpe sucrée"
  const sucreeBuilder = {
    base: 3.5,
    toppings: [
      ['nutella', 'Nutella', 'Nutella', 1.3], ['kinder-bueno', 'Kinder Bueno', 'Kinder Bueno', 1.5],
      ['kitkat', 'KitKat', 'KitKat', 1.5], ['oreo', 'Oreo', 'Oreo', 0.7],
      ['speculoos', 'Speculoos', 'Speculoos', 0.7], ['banane', 'Banane', 'Banana', 1.0],
      ['fraise', 'Fraise', 'Strawberry', 1.0]
    ]
  };

  const round = (n) => Math.round(n * 100) / 100;
  const byId = Object.fromEntries(items.map((i) => [i.id, i]));
  const optionIndex = {};
  saleeBuilder.groups.forEach((g) => g.options.forEach((o) => { optionIndex[o[0]] = { group: g.id, fr: o[1], en: o[2], price: o[3] }; }));
  const toppingIndex = Object.fromEntries(sucreeBuilder.toppings.map((t) => [t[0], { fr: t[1], en: t[2], price: t[3] }]));

  /**
   * Validate a cart line and return { name, details, unit } (unit price in €),
   * or throw if the line is invalid. Shared by the browser and the server.
   * line = { id, qty, opts }
   */
  function priceLine(line, lang) {
    const L = lang === 'en' ? 'en' : 'fr';
    const opts = line.opts || {};
    if (line.id === 'build-salee') {
      const size = saleeBuilder.sizes.find((s) => s.id === opts.size);
      if (!size) throw new Error('Invalid size');
      const extras = Array.isArray(opts.extras) ? [...new Set(opts.extras)] : [];
      let unit = size.price;
      const names = [];
      let sauceCount = 0;
      extras.forEach((id) => {
        const o = optionIndex[id];
        if (!o) throw new Error('Invalid option ' + id);
        if (o.group === 'sauces') sauceCount++;
        unit += o.price;
        names.push(o[L]);
      });
      if (sauceCount > 2) throw new Error('Too many sauces');
      return { name: (L === 'fr' ? 'Crêpe salée composée · ' : 'Custom savoury crêpe · ') + size[L],
        details: names.join(', '), unit: round(unit) };
    }
    if (line.id === 'build-sucree') {
      const tops = Array.isArray(opts.toppings) ? [...new Set(opts.toppings)] : [];
      let unit = sucreeBuilder.base;
      const names = tops.map((id) => {
        const t = toppingIndex[id];
        if (!t) throw new Error('Invalid topping ' + id);
        unit += t.price;
        return t[L];
      });
      return { name: L === 'fr' ? 'Crêpe sucrée' : 'Sweet crêpe', details: names.join(', '), unit: round(unit) };
    }
    const item = byId[line.id];
    if (!item) throw new Error('Unknown item ' + line.id);
    let unit = item.price;
    const details = [];
    if (item.menuPrice && opts.variant === 'menu') {
      unit = item.menuPrice;
      details.push(L === 'fr' ? 'Menu' : 'Meal');
    } else if (item.menuPrice) {
      details.push(L === 'fr' ? 'Seul' : 'Solo');
    }
    if (item.drink && opts.drink) {
      unit += DRINK_PRICE;
      details.push(L === 'fr' ? 'Boisson 33cl' : '33cl drink');
    }
    return { name: item.name, details: details.join(' · '), unit: round(unit) };
  }

  const MENU = { DRINK_PRICE, categories, items, byId, saleeBuilder, sucreeBuilder, priceLine };
  if (typeof module !== 'undefined' && module.exports) module.exports = MENU;
  else root.MENU = MENU;
})(typeof window !== 'undefined' ? window : globalThis);
