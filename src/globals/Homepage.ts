import type { Field, GlobalConfig } from 'payload'

const head = (eyebrow: string, title: string, text: string): Field[] => [
  { type: 'row', fields: [{ name: 'eyebrow', type: 'text', defaultValue: eyebrow }, { name: 'title', type: 'text', defaultValue: title }] },
  { name: 'text', type: 'textarea', defaultValue: text },
]
const section = (name: string, label: string, fields: Field[], show = true): Field => ({
  type: 'collapsible', label, admin: { initCollapsed: true },
  fields: [{ name, type: 'group', label: false, fields: [{ name: 'show', type: 'checkbox', defaultValue: show, label: 'Show this section' }, ...fields] }],
})

/** Every text block on the homepage. Defaults are the launch copy; editing here changes the site. */
export const Homepage: GlobalConfig = {
  slug: 'homepage',
  label: 'Homepage',
  admin: { group: 'Website', description: 'All homepage text, section by section. Untick “Show this section” to hide one.' },
  access: { read: () => true },
  fields: [
    section('hero', 'Hero & scroll film', [
      { name: 'title', type: 'text', defaultValue: 'Good morning, Richmond.' },
      { name: 'text', type: 'textarea', defaultValue: 'British and Turkish breakfasts, proper lunches and Alchemy coffee — cooked fresh in East Twickenham, by Richmond Bridge.' },
      {
        name: 'captions', type: 'array', labels: { singular: 'Caption', plural: 'Film captions' },
        admin: { description: 'Text over the scroll film. Times are seconds in the film (0–34).' },
        defaultValue: [
          { from: 2.6, to: 8, title: 'Sourdough, smashed avocado and two poached eggs.', body: 'Cooked to order in our kitchen, every morning.' },
          { from: 8.4, to: 14.8, title: 'Coffee from Alchemy.', body: 'Speciality beans, roasted by hand in London.', center: true },
          { from: 15.4, to: 19.8, title: 'Pulled for you, not before.' },
          { from: 20.6, to: 24.6, title: 'A little milk. A little patience.', body: 'Organic milk from Waitrose, steamed for every cup.' },
          { from: 26, to: 30.6, title: 'Breakfast first. Then the river.' },
          { from: 31, to: 34.6, title: 'A short walk from Richmond Bridge.', cta: true },
        ],
        fields: [
          { type: 'row', fields: [{ name: 'from', type: 'number', required: true }, { name: 'to', type: 'number', required: true }, { name: 'center', type: 'checkbox', label: 'Big & centred' }, { name: 'cta', type: 'checkbox', label: 'Show buttons' }] },
          { name: 'title', type: 'text', required: true },
          { name: 'body', type: 'text' },
        ],
      },
    ]),
    section('plates', 'Popular plates carousel', head('From the kitchen', 'Popular plates', 'Breakfast all day, lunch from noon. Two kitchens, British and Turkish, one table.')),
    section('shop', 'Order online (shop)', head('Order online', 'Order your favourites', 'Freshly cooked for your time — pick it up in the café or get it delivered.')),
    section('newOnMenu', 'New on the menu', [
      ...head('New this season', 'New on the menu', 'Fresh from our kitchen this season — come and try it first.'),
      { name: 'dish', type: 'relationship', relationTo: 'menu-items', admin: { description: 'The one plate to feature' } },
      { name: 'linkLabel', type: 'text', defaultValue: 'See the menu' },
    ]),
    section('book', 'Book an event', [
      ...head('Book an event', 'Your party, our café.', 'Birthdays, team parties, meze nights, quizzes and match nights — after 5pm the café is yours.'),
      { name: 'kit', type: 'array', defaultValue: ['Sound system', 'Microphone', 'Projector', 'Big-screen TV'].map((text) => ({ text })), fields: [{ name: 'text', type: 'text', required: true }] },
    ]),
    section('events', 'Festive & events', [
      { name: 'title', type: 'text', defaultValue: 'Festive & events' },
      { name: 'nearbyTitle', type: 'text', defaultValue: 'Around Richmond' },
    ]),
    section('products', 'Products & coffee to take home', [
      ...head('Products & suppliers', 'Quality you can taste', 'Speciality coffee, organic milk and produce bought fresh — the good stuff, every day.'),
      { type: 'row', fields: [{ name: 'takeHomeTitle', type: 'text', defaultValue: 'Take Alchemy home' }, { name: 'takeHomeImagePath', type: 'text', defaultValue: '/img/coffee-pack.svg' }] },
      { name: 'takeHomeText', type: 'textarea', defaultValue: 'The same speciality beans we pour, in bags to take home. Ask us to grind them for you.' },
      { name: 'takeHomeImage', type: 'upload', relationTo: 'media' },
    ]),
    section('values', 'Our values', [
      ...head('Our neighbourhood café', 'A local hub, made with love.', 'Fresh, home-made, friendly and welcoming. Come as a guest, leave as a friend.'),
      { name: 'items', type: 'array', defaultValue: [
        { title: 'Delicious', text: 'British classics and Turkish favourites, cooked to order.' },
        { title: 'Fresh', text: 'Real ingredients, home-made in our own kitchen every day.' },
        { title: 'Happy', text: 'Good mornings, good coffee and a good feeling to take with you.' },
        { title: 'Peaceful', text: 'A calm corner by the river to slow down, catch up or work a little.' },
      ], fields: [{ type: 'row', fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'text' }] }] },
    ]),
    section('google', 'Google reviews', head('Google reviews', 'Loved by our neighbours', 'What guests say on Google.')),
    section('tripadvisor', 'Tripadvisor', head('Tripadvisor', '', '')),
    section('welcome', 'Everyone’s welcome', head('Everyone’s welcome', 'Dogs, bikes, buggies and big groups', 'A neighbourhood meeting spot between Richmond Bridge and the park.')),
    section('findUs', 'Find us around Richmond', [{ name: 'title', type: 'text', defaultValue: 'Find us around Richmond' }]),
  ],
}
