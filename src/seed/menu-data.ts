// Source: owner's October 2026 menu (docs/nova 2026 oct menu.docx). Spelling tidied; prices as printed.
// Prices from the owner's menus (Oct 2026 + earlier printed menu). Gaps filled with sensible prices for the owner to confirm in the CMS.
type D = [name: string, local: string | null, desc: string, price: number | null, diet?: string[], extras?: string, signature?: boolean, photo?: string]
type C = { name: string; slug: string; group: string; note?: string; items: D[] }

export const MENU: C[] = [
  { name: 'Set breakfasts', slug: 'set-breakfasts', group: 'breakfast', note: 'Served with sourdough toast. Swap one item — meat for meat or veg for veg.', items: [
    ['The English Feast', null, 'One Cumberland sausage, two rashers of bacon, two fried eggs, mushrooms, black pudding, grilled tomatoes, a hash brown and baked beans.', 18.75],
    ['Full English Breakfast', null, 'One Cumberland sausage, two rashers of bacon, two fried eggs, mushrooms, grilled tomatoes, a hash brown and baked beans.', 14.75, [], undefined, true, '/img/dishes/full-english.webp'],
    ['Mini English Breakfast', null, 'One Cumberland sausage, one rasher of bacon, one fried egg, a hash brown and baked beans.', 10.5],
    ['Full Vegetarian Breakfast', null, 'Two fried eggs, spinach, mushrooms, a hash brown, baked beans and grilled tomatoes.', 13.75, ['v']],
    ['Mini Vegetarian Breakfast', null, 'One fried egg, mushrooms, a hash brown, baked beans and grilled tomatoes.', 10.5, ['v']],
  ]},
  { name: 'Eggs & toast', slug: 'eggs-and-toast', group: 'breakfast', note: 'Ask about our vegan and gluten-free bread.', items: [
    ['Smashed Avocado on Toast', null, 'Smashed avocado on toasted sourdough.', 9.9, ['v'], 'Add a poached or fried egg, feta or halloumi £2.50 each', true, '/img/dishes/avocado.webp'],
    ['Poached Eggs & Smoked Salmon', null, 'Two poached eggs and smoked salmon with a touch of hummus and fresh rocket.', 13.5],
    ['Scrambled Eggs on Toast', null, 'Scrambled, poached or fried eggs on toast.', 8.2, ['v']],
    ['Your Choice on Toast', null, 'Baked beans, mushrooms, tomatoes or cheese.', 7.5, ['v']],
    ['Roasted Mixed Vegetables Plate', null, 'Roasted mixed vegetables, hummus, avocado and seasonal salad.', 13.5, ['v'], undefined, true, '/img/dishes/veg-plate.webp'],
  ]},
  { name: 'Eggs Benedict', slug: 'eggs-benedict', group: 'breakfast', note: 'Two poached eggs on a toasted English muffin with hollandaise, a touch of hummus and rocket.', items: [
    ['Vegetarian Benedict', null, 'With sautéed spinach, smashed avocado or grilled halloumi.', 13.5, ['v']],
    ['Classic Eggs Benedict', null, 'With ham or bacon.', 13.5],
    ['Eggs Royale', null, 'With smoked salmon.', 14.5],
    ['Turkish Benedict', null, 'With grilled Turkish sausage and halloumi.', 16.5],
  ]},
  { name: 'Turkish breakfast', slug: 'turkish-breakfast', group: 'turkish', note: 'Highly recommended extras: halloumi, Turkish sausage or meatballs £3.50 each.', items: [
    ['Turkish Eggs', 'Çılbır', 'Poached eggs on savoury garlic yoghurt with warm chilli butter, served with simit.', 13.5, ['v'], undefined, true, '/img/dishes/cilbir.webp'],
    ['Shakshuka with Eggs', 'Şakşuka', 'Poached eggs and feta in our homemade pepper and tomato sauce, with sourdough.', 13.5, ['v'], undefined, true, '/img/dishes/shakshuka.webp'],
    ['Istanbul Special Breakfast', null, 'Feta, honey, two fried eggs, grilled halloumi, olives, tomatoes, cucumber, Turkish beef sausage, sigara böreği, roasted vegetables and a whole simit.', 17.5, [], undefined, true, '/img/dishes/turkish.webp'],
    ['Mediterranean Breakfast', null, 'Feta, honey, one fried egg, olives, tomatoes, cucumber, Turkish beef sausage and sigara böreği.', 13.5],
    ['Simit Platter', null, 'Simit with feta, jam, olives, tomatoes and cucumber.', 9.5, ['v']],
  ]},
  { name: 'Turkish bakes', slug: 'turkish-bakes', group: 'turkish', items: [
    ['Water Börek', 'Su böreği', 'Layered pastry with feta and parsley.', 4.7, ['v']],
    ['Simit', null, 'Traditional sesame bread ring.', 2.8, ['v']],
    ['Spinach & Feta Börek', 'Ispanaklı börek', 'Pastry filled with spinach and feta.', 4.1, ['v']],
    ['Olive & Feta Börek', null, 'Pastry filled with olives and feta.', 4.1, ['v']],
    ['Cigar Börek', 'Sigara böreği', 'Crispy filo rolls filled with cheese.', 5.5, ['v']],
  ]},
  { name: 'Pancakes & French toast', slug: 'pancakes', group: 'sweet', note: 'Extras: Nutella, bacon, fresh fruit, ice cream, pistachios.', items: [
    ['One American Pancake', null, 'With icing sugar and maple syrup.', 7.5, ['v']],
    ['Two American Pancakes', null, 'With icing sugar and maple syrup.', 9.5, ['v']],
    ['Three American Pancakes', null, 'With icing sugar and maple syrup.', 11.5, ['v']],
    ['French Toast', null, 'Golden French toast with icing sugar and maple syrup.', 9.5, ['v']],
    ['Supernova Pancakes or French Toast', null, 'Decorated with an indulgent selection of surprise toppings. A sweet dream on a plate.', 14.5, ['v']],
  ]},
  { name: 'Omelettes', slug: 'omelettes', group: 'breakfast', note: 'Two British Lion eggs and cheese, with toast and salad or beans. Vegetable fillings £2 each, ham/halloumi/sucuk £2.50.', items: [
    ['Build Your Own Cheese Omelette', null, 'Start with cheese, then add the fillings you like.', 9.5, ['v']],
  ]},
  { name: 'Lunch plates', slug: 'lunch-plates', group: 'lunch', note: 'Served with seasonal salad, rice or chips and warm pitta.', items: [
    ['Grilled Chicken', null, 'Grilled chicken with seasonal salad, rice or chips and warm pitta.', 14.5],
    ['Sautéed Chicken', null, 'Chicken sautéed with mixed vegetables in a rich tomato sauce.', 16.5],
    ['Mixed Grill Platter', null, 'Beef meatballs and grilled chicken.', 17.5],
    ['Grilled Beef Meatballs', 'Köfte', 'Seasoned minced beef meatballs, grilled.', 14.5],
    ['Turkish Ravioli', 'Mantı', 'Beef-filled dumplings with yoghurt, melted butter and Turkish chilli flakes.', 13.5],
    ['Cold Mezze Platter', null, 'Tzatziki, hummus, roasted aubergine and olives with warm pitta.', 13.5, ['v']],
    ['Hot Mezze Platter', null, 'Falafel, grilled halloumi, sucuk and sigara böreği with warm pitta.', 13.5],
    ['Vegetarian Moussaka', null, 'Aubergine, courgette and potato in tomato sauce, topped with Parmesan, with seasonal salad.', 13.5, ['v']],
  ]},
  { name: 'Sandwiches & paninis', slug: 'sandwiches', group: 'lunch', note: 'Toasted or cold, served with crisps. Add chips £2.50.', items: [
    ['Ham & Cheddar', null, 'Ham and cheddar cheese.', 7.5],
    ['Egg Mayonnaise', null, 'Hard-boiled eggs, mayonnaise and rocket.', 7.5, ['v']],
    ['Tuna Mayo & Cucumber or Tuna Melt', null, 'Tuna mayo with cucumber, or a toasted tuna melt.', 7.5],
    ['Classic BLT', null, 'Bacon, lettuce and tomato on sourdough.', 8],
    ['Club Sandwich', null, 'Grilled chicken, bacon, lettuce, red onion and tomato on sourdough.', 10.5],
    ['CBA Sandwich', null, 'Grilled chicken, bacon and avocado.', 9.9],
    ['Sucuk & Cheese', null, 'Grilled spicy Turkish beef sausage and cheddar.', 8.5],
    ['Vegan Sandwich', null, 'Avocado, hummus and roasted vegetables.', 9.5, ['vg']],
    ['Bacon or Sausage Sandwich', null, 'Your choice of bacon or sausage.', 7.2],
  ]},
  { name: 'Wraps', slug: 'wraps', group: 'lunch', note: 'With seasonal salad, a touch of hummus and fresh rocket.', items: [
    ['Chicken Caesar Wrap', null, 'Grilled chicken, lettuce, Parmesan and Caesar dressing.', 10.9],
    ['Meatball Wrap', null, 'Grilled beef meatballs, hummus and salad leaves.', 12.9],
    ['Falafel & Hummus Wrap', null, 'Falafel, hummus and salad leaves.', 9.9, ['v']],
    ["Nova's Wrap", null, 'Beef meatballs, grilled chicken, halloumi, tomatoes and rocket.', 14.5],
    ['Smoked Salmon Wrap', null, 'Smoked salmon, avocado and cream cheese.', 13.5],
    ['Vegan Wrap', null, 'Hummus, spinach and avocado.', 11.5, ['vg']],
    ['Breakfast Wrap', null, 'Fried egg, sausage, hash brown, cheddar and tomato.', 10.5],
  ]},
  { name: 'Burgers', slug: 'burgers', group: 'lunch', note: 'All with chips. Vegetable toppings £1, premium toppings £2.', items: [
    ['Beef Burger', null, '6oz steak burger.', 12.5],
    ['Grilled Chicken Burger', null, 'Grilled chicken breast.', 11.5],
    ['Vegetarian Burger', null, 'Plant-based patty.', 10.5, ['v']],
  ]},
  { name: 'Salads', slug: 'salads', group: 'lunch', note: 'Freshly prepared to order — please allow a little extra time.', items: [
    ['Smoked Salmon & Avocado Salad', null, 'Smoked salmon, avocado and mixed seeds on seasonal leaves.', 13.4, ['gf']],
    ['Chicken Caesar Salad', null, 'Grilled chicken, seasonal leaves and Caesar dressing.', 12.9],
    ['Greek Salad', null, 'Feta, tomatoes, cucumber, olives, red onion and peppers.', 11.5, ['v', 'gf']],
    ["Chef's Salad", null, 'Hummus, tomatoes, cucumber, red onion, avocado and peppers.', 12.5, ['vg', 'gf'], undefined, true, '/img/dishes/chef-salad.webp'],
    ['Warm Roasted Vegetable & Falafel Salad', null, 'Warm roasted vegetables and crispy falafel with creamy hummus.', 12.9, ['vg']],
  ]},
  { name: 'Coffee & hot drinks', slug: 'hot-drinks', group: 'drinks', note: 'Alchemy coffee. Oat, almond, soya or coconut milk and extra shots 50p.', items: [
    ['Espresso', null, '', 2.6], ['Macchiato', null, '', 2.9], ['Americano', null, '', 3.25],
    ['Latte', null, 'Double shot with steamed milk.', 3.5, [], undefined, false, '/img/dishes/latte.webp'],
    ['Flat White', null, '', 3.5], ['Cappuccino', null, '', 3.6], ['Mocha', null, '', 3.8],
    ['Turkish Coffee', 'Türk kahvesi', 'Served with Turkish delight.', 3.5],
    ['Pistachio Latte', null, '', 4.2], ['Matcha Latte', null, '', 3.75], ['Chai Latte', null, '', 3.75], ['Hot Chocolate', null, '', 3.6],
    ['English Breakfast Tea', null, '', 2.9], ['Decaf Tea', null, '', 2.9],
    ['Speciality Tea', null, 'Earl Grey, green, peppermint, jasmine, super fruits or camomile.', 3.1],
    ['Fresh Mint Tea', null, '', 3.4], ['Lemon & Ginger', null, 'Fresh lemon, ginger and honey.', 3.6],
    ['Turkish Tea', 'Çay', 'Served in a tulip glass.', 2.5], ['Turkish Tea Pot', 'Demlik çay', 'For two to share.', 4.7],
  ]},
  { name: 'Iced coffee & speciality', slug: 'iced', group: 'drinks', note: 'Mix two flavours £2 extra.', items: [
    ['Iced Latte', null, '', 4.1], ['Iced Matcha Latte', null, '', 4.6], ['Iced Cappuccino', null, '', 4.5], ['Iced Chai Latte', null, '', 4.6],
    ['Iced Mocha', null, '', 4.8], ['Iced Pistachio Latte', null, '', 5.2], ['Iced Lotus Biscoff Latte', null, '', 5.2],
  ]},
  { name: 'Juices, smoothies & shakes', slug: 'cold-drinks', group: 'drinks', items: [
    ['Freshly Squeezed Orange Juice', null, '', 4.9], ['Ayran', null, 'Turkish yoghurt drink.', 2.5], ['Turkish Gazoz', null, 'Mixed fruit or orange.', 2.8],
    ['Pash n Shoot Smoothie', null, 'Mango, pineapple and passion fruit.', 5.9], ['Big 5 Smoothie', null, 'Pineapple, mango, strawberry, raspberry and kiwi.', 5.9],
    ['Strawberry Split Smoothie', null, 'Strawberry and banana.', 5.9], ['Coco Loco Smoothie', null, 'Mango, pineapple, coconut, lime and mint.', 5.9],
    ['Kale Kick Smoothie', null, 'Mango, spinach and kale.', 5.9], ['Classic Vanilla Milkshake', null, '', 5.5], ['Premium Milkshake', null, 'Oreo, pistachio, Lotus Biscoff or matcha.', 6.4],
  ]},
  { name: 'Happy kids', slug: 'kids', group: 'kids', items: [
    ['Kids’ English Breakfast', null, 'Egg, bacon and chips.', 5.5], ['Chicken Nuggets & Chips', null, '', 5.5], ['Kids’ Pancake', null, 'Nutella or fruit, with cream and maple syrup.', 6.6, ['v']],
    ['Meatballs with Rice', null, '', 7.5], ['Kids’ Pasta', null, 'Tomato sauce or cheese.', 6.9, ['v']], ['Cheese Toastie', null, '', 5, ['v']], ['Babyccino', null, 'With cream, marshmallow and sprinkles.', 1.5, ['v']],
  ]},
]
