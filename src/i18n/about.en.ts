const about = {
  hero: {
    label: 'About Aster', title: 'Meet the People Behind Aster', subtitle: 'Driven by Curiosity. Inspired by Space.',
    intro: 'We are Aster. Five students connecting robotics, software and product design around one shared purpose: supporting the people who live and work beyond Earth. Through Cora, we explore how intelligent robotics can help.',
    observation: 'A quiet observation cabin overlooking Earth',
  },
  crew: {
    title: 'Meet Our Crew', subtitle: 'Behind every mission is a team of curious minds.', intro: "Get to know the people bringing Aster's ideas to life.",
    member: 'Crew member', pixel: 'Pixel portrait', reveal: 'Tap to reveal', showPixel: 'Back to pixel portrait',
    showProfile: 'Reveal profile', portrait: 'Real portrait', profilePending: 'Photo and profile pending',
    photoPending: 'Portrait pending', pixelPending: 'Pixel Portrait Coming Soon', roster: 'Crew roles and contributions',
  },
  members: [
    { id: 'austin', name: 'Austin Huang', chineseName: '黄子傲', role: 'Project & systems', text: 'Project coordination, software development and Raspberry Pi integration.' },
    { id: 'alexis', name: 'Alexis Liu', chineseName: '柳灏宸', role: 'AI & computer vision', text: 'Artificial intelligence, computer vision and related software systems.' },
    { id: 'daniel', name: 'Daniel Wang', chineseName: '王大猷', role: 'Software & algorithms', text: 'Software implementation, algorithm development and functional workflows.' },
    { id: 'angelina', name: 'Angelina Chen', chineseName: '陈奕帆', role: 'Hardware & integration', text: 'Hardware, embedded electronics and hardware–software integration.' },
    { id: 'lucas', name: 'Lucas Liu', chineseName: '刘昊朗', role: 'Product & interaction', text: 'Product structure, models and human-centered interaction design.' },
  ],
  hatch: {
    title: 'Meet the Whole Crew', prompt: 'Ready to meet the whole crew?', open: 'Open the Crew Hatch', close: 'Close the hatch',
    team: 'The Aster Team', intro: 'Together, we turn curiosity into ideas and ideas into possibilities.', members: 'View Team Members',
  },
  journey: {
    title: 'Our Journey', subtitle: 'From an idea to the next frontier.',
    milestones: [
      { title: 'Concept', subtitle: 'From a question to an idea.', detail: 'Exploring the challenges astronauts face and identifying opportunities for intelligent robotic assistance.', image: 'Cora design views' },
      { title: 'Prototype', subtitle: 'Turning ideas into a working design.', detail: "Developing Cora's physical design, exploring its core capabilities, and testing early interaction concepts.", image: 'Cora’s official prototype model' },
      { title: "What's Next", subtitle: 'Building toward future space missions.', detail: 'Improving the platform, expanding potential modules, and exploring future applications for space robotics.', image: 'Robotic arm module concept' },
    ],
  },
  purpose: {
    title: 'Our Mission & Vision',
    principles: [
      { title: 'Our Mission', text: 'Help astronauts spend less time on routine work. Aster is building Cora to help crews find supplies, update records, and document tasks, so they can focus on mission-critical work.', image: 'Earth and its cloud-covered Pacific Ocean seen from space, photographed by NASA’s Galileo spacecraft' },
      { title: 'Our Vision', text: 'Make robotic assistance part of everyday life in space. We envision robots supporting both the work astronauts do and their daily lives, from space stations to future habitats on the Moon and Mars.', image: 'The International Space Station above Earth' },
    ],
  },
  valuePage: {
    back: 'Back to About Us', title: 'Our Value',
    intro: 'Cora reflects our belief that supporting everyday work in space can contribute to a larger human journey of discovery.',
    items: [
      { title: 'More Time for Discovery', text: 'We aim to support routine work so crews can spend more time on research and discovery.', image: 'Equipment and storage areas inside a space-station cabin' },
      { title: 'Care for the People Who Explore', text: 'We design around the people who explore, supporting their work, interaction and everyday life onboard.', image: 'An astronaut working outside the station above Earth' },
      { title: 'Adapt for Future Missions', text: 'We plan to develop Cora step by step for future station, Moon and Mars missions.', image: 'A future Mars habitat concept with astronauts and an orange Martian landscape' },
      { title: 'Inspire Future Explorers', text: 'By sharing what we build and learn, we hope to inspire young people to explore space robotics.', image: 'A rocket rising above its launch site and clouds of exhaust' },
    ],
  },
  closing: {
    label: "What's Next", title: 'The Next Chapter Starts Here.', intro: 'Together, we explore what intelligent robotics can make possible in space.',
    contact: 'Contact Us',
  },
};
export default about;
