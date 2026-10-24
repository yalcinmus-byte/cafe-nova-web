import type { GlobalConfig } from 'payload'

const list = (name: string, label: string, defaults: string[]) => ({ name, type: 'array' as const, label, defaultValue: defaults.map((text) => ({ text })), fields: [{ name: 'text', type: 'textarea' as const, required: true }] })

/** Text for About, Private hire and Careers pages. */
export const Pages: GlobalConfig = {
  slug: 'pages',
  label: 'Page text',
  admin: { group: 'Website', description: 'Text on the About, Book an event and Careers pages.' },
  access: { read: () => true },
  fields: [
    { type: 'tabs', tabs: [
      { label: 'About', name: 'about', fields: [
        { type: 'row', fields: [{ name: 'eyebrow', type: 'text', defaultValue: 'Our story' }, { name: 'title', type: 'text', defaultValue: 'Two cultures. One table.' }] },
        { name: 'lede', type: 'textarea', defaultValue: '60 years of family heritage, 20 years in Richmond, and one simple belief: every guest deserves to feel at home.' },
        list('story', 'Story paragraphs', [
          'My name is Süleyman Demir, and hospitality has always been more than a profession to me. It’s a way of life.',
          'I grew up in my family’s café and restaurant tradition, which goes back more than 60 years. Early on I learned that the secret of a good café isn’t only what’s on the plate. It’s how you make people feel.',
          'Richmond has been my home for 20 years. In that time I’ve worked in five local cafés, as a chef in three and as a manager in two. Each one taught me the same thing: great food matters, good service makes a difference, but it’s the warmth that brings people back.',
          'Cafe Nova Bistro brings it all together: classic British café favourites and authentic Turkish breakfasts, fresh lunches and excellent coffee, on the corner of Richmond Road.',
        ]),
        { type: 'row', fields: [{ name: 'signature', type: 'text', defaultValue: 'Come as a guest, leave as a friend.' }, { name: 'signedBy', type: 'text', defaultValue: 'Süleyman Demir, Founder & Owner' }] },
        { name: 'missionTitle', type: 'text', defaultValue: 'To be the neighbourhood’s favourite place to start the day.' },
        { name: 'missionText', type: 'textarea', defaultValue: 'Delicious food, happy faces, a peaceful corner and fresh ingredients — a local hub where everyone feels at home.' },
        { name: 'values', type: 'array', defaultValue: [
          { title: 'Wholesome', text: 'Fresh, real ingredients made with love — pure, positive food that leaves you feeling good.' },
          { title: 'Grateful', text: 'Kindness and positive energy, with the community first. Every returning face matters to us.' },
          { title: 'Radiant', text: 'Shining with happiness: bright mornings, warm welcomes, good coffee.' },
          { title: 'Neighbourly', text: 'A local hub for East Twickenham and Richmond — home-made, friendly and welcoming.' },
        ], fields: [{ type: 'row', fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'textarea' }] }] },
      ] },
      { label: 'Book an event', name: 'hire', fields: [
        { name: 'title', type: 'text', defaultValue: 'After five, the café is yours.' },
        { name: 'text', type: 'textarea', defaultValue: 'Birthdays, team parties, meze nights and match nights in our corner café by Richmond Bridge — cooked by our kitchen, hosted by our team.' },
        { name: 'kit', type: 'array', defaultValue: [
          { title: 'Sound system', text: 'Your playlist, speeches or a live acoustic set.' },
          { title: 'Microphone', text: 'For toasts, quizzes, talks and announcements.' },
          { title: 'Projector', text: 'Slides, photos, a film night or a presentation.' },
          { title: 'Big-screen TV', text: 'Match nights, Eurovision or the big game at Twickenham.' },
        ], fields: [{ type: 'row', fields: [{ name: 'title', type: 'text', required: true }, { name: 'text', type: 'text' }] }] },
        list('ideas', 'Ideas', ['Birthday brunches & parties', 'Team breakfasts and Christmas parties', 'Turkish meze evenings', 'Quiz, film and match nights', 'Baby showers & family gatherings', 'Talks, workshops & book clubs']),
        { name: 'foodNote', type: 'textarea', defaultValue: 'Food: breakfast-for-dinner, Turkish meze sharing plates, wraps and sandwich platters or something of your own — tell us what you have in mind and we’ll put together a menu and a price.' },
        { name: 'when', type: 'textarea', defaultValue: 'Evenings after we close at 5pm — tell us your date and we’ll confirm. Bigger daytime groups: just let us know you’re coming.' },
      ] },
      { label: 'Careers', name: 'careers', fields: [
        { name: 'title', type: 'text', defaultValue: 'Work with us' },
        { name: 'text', type: 'textarea', defaultValue: 'We’re a family-run café that cares about good food and warm service. If that sounds like you, we’d like to hear from you.' },
        list('why', 'Why work at Nova', ['A friendly, family-run team', 'Daytime hours — the café closes at 5pm', 'Learn the craft: coffee, kitchen and hospitality', 'Be part of a neighbourhood favourite, rated 4.9 on Google']),
      ] },
    ] },
  ],
}
