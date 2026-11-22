const product3d = {
  overview: {
    title: 'Meet Cora', subtitle: 'Discover Every Detail',
  },
  viewer: {
    label: 'Interactive Cora 3D viewer', description: 'The official Cora model. Drag to rotate, use the view buttons, or focus this area and use the arrow keys. Plus and minus change the zoom.',
    official: 'Official Cora model', fullscreen: 'Enter fullscreen', exitFullscreen: 'Exit fullscreen', hotspotPrefix: 'Explore', loading: "Preparing Cora's 3D Model...",
    error: "Cora's 3D model couldn't be displayed. Retry or explore the static view below.", retry: 'Retry 3D model',
    zoomOut: 'Zoom out', zoomIn: 'Zoom in', zoom: 'Model zoom', reset: 'Reset view', viewsLabel: 'Model camera views', views: ['Front', 'Left', 'Right', 'Back', 'Top', 'Bottom'],
    dragHint: 'Drag to rotate · Scroll to zoom · Arrow keys when focused', touchHint: 'Scroll the page, or enable touch rotation to inspect Cora.', touchActive: 'Drag to rotate · Pinch to zoom',
    rotate: 'Enable rotation', scroll: 'Enable page scrolling', static: 'Static view', return3d: 'Return to 3D',
  },
  structure: {
    title: "Explore Cora's Design", intro: 'Take a closer look at the components that shape Cora’s capabilities.', select: 'Select a component', prompt: 'Choose a marker on Cora to explore its design.', selected: 'Selected component',
    items: [
      { title: 'Vision & Sensing', text: "Cora's front-facing sensing area supports visual interaction and equipment-recognition concepts.", alt: 'Close-up of the front sensor assembly on the white Cora body.' },
      { title: 'Interactive Display', text: 'The front display provides a visual interface for information, feedback, and astronaut interaction.', alt: 'Close-up of Cora’s front display with an illustrated information interface.' },
      { title: 'Modular Interfaces', text: "Cora's side interfaces are designed to support task-specific modules and future capability expansion.", alt: 'Close-up of the circular module interface on Cora’s white side panel.' },
      { title: 'Mechanical Structure', text: 'Cora integrates mechanical components into a compact platform designed for space-station operation.', alt: 'Angled view of the supplied matte-white Cora body, showing its enclosure, ventilation and corner units.' },
      { title: 'Control & Internal Design', text: "Cora's structural design brings together its mechanical and control-related components within a compact body.", alt: 'Rear view of white Cora showing the external control switches and access panel.' },
    ],
  },
  display: {
    title: 'Switch Display Mode', label: 'Display mode', working: 'WORKING', modes: ['Standby', 'Working', 'Companion'], original: 'Original model appearance.', awake: 'The display is on. Choose a mode to see its expression.',
    descriptions: ['A quiet resting expression.', 'A focused expression with task status.', 'A friendly face with a gentle blink.'],
  },
  capabilities: {
    title: "Cora's Core Design",
    gallery: "Cora's five core design components",
    carousel: 'carousel',
    hint: 'Drag or swipe to explore · Use the arrow keys when focused',
    navigation: 'Explore core design', previous: 'Previous design', next: 'Next design',
    qr: {
      text: 'Identify labeled items and support accurate inventory tracking.',
      alt: 'Concept scene of Cora scanning an equipment label inside a space-station cabin.',
      identified: 'Item Identified', location: 'Storage Location', record: 'Inventory Record',
    },
    voice: { text: 'Interact with Cora through natural voice commands.', alt: 'A matte-white Cora with a blue voice waveform icon beside the product.' },
    motion: { text: 'Navigate and perform tasks within the station.', alt: 'Cora moves along a marked path through a station cabin.' },
    photo: { text: 'Capture photos to document experiments and daily activities.', alt: 'A camera view of gloved hands working with experimental equipment in a station laboratory.' },
    companion: { text: 'Offer friendly interactions and everyday emotional support.', alt: 'The matte-white Cora model shows a friendly smile inside the station.' },
  },
  possibilities: {
    title: 'More Possibilities', status: 'Future capability concepts',
    modular: {
      title: 'Modular Expansion',
      text: 'With module interfaces on both sides, Cora is designed to carry task-specific tools and expand its capabilities inside the station.',
      imageAlt: 'A matte-white Cora with white cargo, robotic-arm and temperature-sensor modules beside its side interface, against a softly blurred station cabin.',
      artworkAlt: 'Concept image of matte-white Cora beside white cargo, robotic-arm and temperature-sensor modules, with a softly blurred cabin background.',
    },
    collaboration: {
      title: 'Multi-Robot Collaboration',
      text: 'Multiple Cora units are envisioned to share information, coordinate tasks, and work together on complex operations inside the station.',
      imageAlt: 'Concept illustration of one Cora scanning a cargo label while a second follows a path to another storage area. A dotted line indicates data sharing.',
      artworkAlt: 'Concept image of two white Cora robots collaborating with task modules to handle a cargo container in a softly blurred technical workspace.',
    },
  },
  modules: {
    items: [
      { title: 'Robotic Arm', short: 'Handling & equipment assistance', text: 'A potential task-specific module for object handling and selected equipment operations.', use: 'Equipment manipulation and maintenance assistance.' },
      { title: 'Cargo Container', short: 'Small-item transport', text: 'An expandable cargo module intended to support small-item transportation and delivery tasks inside the station.', use: 'Cargo handling and material transport.' },
      { title: 'Temperature Sensor', short: 'Environmental monitoring', text: 'A monitoring module concept intended to collect temperature-related environmental or equipment information.', use: 'Environmental and equipment monitoring.' },
      { title: 'Pump & Valve Module', short: 'Fluid-control concepts', text: 'A specialized module concept for future fluid-handling and valve-related operations.', use: 'Fluid-control assistance and experimental operations.' },
    ],
  },
  value: {
    title: "Designed for What's Next", items: [
      { title: 'Built for Station Operations', text: 'Designed to assist with routine tasks, information access, and operational workflows inside space stations.' },
      { title: 'Modular by Design', text: 'Side interfaces enable the exploration of task-specific tools and expandable robotic capabilities.' },
      { title: 'Human-Centered Interaction', text: 'Interactive features are designed to support astronauts through information, communication, and everyday assistance.' },
    ],
  },
  closing: { title: 'Discover What Cora Can Do', text: "Explore the technologies and interactive capabilities behind Cora's approach to space-station assistance.", cta: "Explore Cora's Technology" },
};
export default product3d;
